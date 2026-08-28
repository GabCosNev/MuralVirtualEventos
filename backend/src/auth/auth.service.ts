import * as crypto from 'crypto';

import {
  Injectable,
  ConflictException,
  UnauthorizedException,
  BadRequestException,
} from '@nestjs/common';

import { PrismaService } from '../prisma/prisma.service';
import { EmailService } from '../email/email.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwt: JwtService,
    private emailService: EmailService,
  ) {}

  async register(dto: RegisterDto) {
    if (dto.password !== dto.confirmPassword) {
      throw new BadRequestException('As senhas não coincidem');
    }
    const exists = await this.prisma.user.findUnique({
      where: { email: dto.email },
    });

    if (exists) throw new ConflictException('Email já cadastrado');

    const hashed = await bcrypt.hash(dto.password, 10);

    const nomeAtualizado = this.formatarNome(dto.name);

    const user = await this.prisma.user.create({
      data: {
        name: nomeAtualizado,
        email: dto.email,
        password: hashed,
      },
    });
    await this.sendVerificationEmail(user.id);
  }
  async login(dto: LoginDto) {
    const user = await this.prisma.user.findUnique({
      where: { email: dto.email },
    });
    if (!user) throw new UnauthorizedException('Credenciais inválidas');

    const valid = await bcrypt.compare(dto.password, user.password);

    if (!valid) throw new UnauthorizedException('Credenciais inválidas');

    if (!user.emailVerified) {
      throw new UnauthorizedException({
        message: 'E-mail não verificado',
        errorCode: 'EMAIL_NOT_VERIFIED',
      });
    }

    const accessToken = this.signAccessToken(user.id, user.email, user.role);
    const refreshToken = await this.createRefreshToken(user.id);

    const safeUser = await this.prisma.user.findUnique({
      where: { id: user.id },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        avatar: true,
      },
    });

    if (!safeUser) throw new UnauthorizedException('Credenciais inválidas');

    return { accessToken, refreshToken, user: safeUser };
  }

  private signAccessToken(userId: number, email: string, role: string) {
    return this.jwt.sign({ sub: userId, email, role }, { expiresIn: '15m' });
  }
  private formatarNome(nome: string) {
    const preposicoes = ['da', 'de', 'do', 'das', 'dos', 'e'];

    return nome
      .toLocaleLowerCase('pt-BR')
      .split(' ')
      .map((palavra) =>
        preposicoes.includes(palavra)
          ? palavra
          : palavra.charAt(0).toLocaleUpperCase('pt-BR') + palavra.slice(1),
      )
      .join(' ');
  }
  private generateOpaqueToken(): string {
    return crypto.randomBytes(64).toString('hex');
  }

  private hashToken(token: string): string {
    return crypto.createHash('sha256').update(token).digest('hex');
  }

  private async createRefreshToken(userId: number): Promise<string> {
    const token = this.generateOpaqueToken();
    const tokenHash = this.hashToken(token);

    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 7);

    await this.prisma.refreshToken.create({
      data: {
        tokenHash,
        userId,
        expiresAt,
      },
    });

    return token;
  }
  async refresh(refreshTokenValue: string) {
    const tokenHash = this.hashToken(refreshTokenValue);

    const stored = await this.prisma.refreshToken.findUnique({
      where: { tokenHash },
    });

    if (!stored || stored.expiresAt < new Date()) {
      throw new UnauthorizedException('Sessão inválida');
    }

    if (stored.revoked) {
      await this.revokeAllUserTokens(stored.userId);
      throw new UnauthorizedException('Sessão inválida');
    }

    await this.prisma.refreshToken.update({
      where: { id: stored.id },
      data: { revoked: true },
    });

    const user = await this.prisma.user.findUnique({
      where: { id: stored.userId },
    });
    if (!user) throw new UnauthorizedException('Sessão inválida');

    const accessToken = this.signAccessToken(user.id, user.email, user.role);
    const newRefreshToken = await this.createRefreshToken(user.id);

    return { accessToken, refreshToken: newRefreshToken };
  }

  private async revokeAllUserTokens(userId: number) {
    await this.prisma.refreshToken.updateMany({
      where: { userId, revoked: false },
      data: { revoked: true },
    });
  }
  async logout(refreshTokenValue: string) {
    const tokenHash = this.hashToken(refreshTokenValue);

    await this.prisma.refreshToken.updateMany({
      where: { tokenHash, revoked: false },
      data: { revoked: true },
    });
  }
  async sendVerificationEmail(userId: number): Promise<boolean> {
    const user = await this.prisma.user.findUnique({ where: { id: userId } });
    if (!user) return false;

    if (user.emailVerified) return false;

    if (user.verificationTokenExpiresAt) {
      const lastSentAt = new Date(user.verificationTokenExpiresAt);
      lastSentAt.setDate(lastSentAt.getDate() - 1);

      const cooldownMs = 60 * 1000;
      if (Date.now() - lastSentAt.getTime() < cooldownMs) return false;
    }

    const token = this.generateOpaqueToken();
    const tokenHash = this.hashToken(token);
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 1);

    await this.prisma.user.update({
      where: { id: userId },
      data: {
        verificationToken: tokenHash,
        verificationTokenExpiresAt: expiresAt,
      },
    });

    try {
      await this.emailService.sendVerificationEmail(user.email, token);
      return true;
    } catch {
      return false;
    }
  }
  async resendVerificationEmail(email: string): Promise<void> {
    const user = await this.prisma.user.findUnique({ where: { email } });
    if (!user) return;

    await this.sendVerificationEmail(user.id);
  }

  async verifyEmail(token: string): Promise<void> {
    const tokenHash = this.hashToken(token);

    const user = await this.prisma.user.findUnique({
      where: { verificationToken: tokenHash },
    });

    if (!user || !user.verificationTokenExpiresAt) {
      throw new BadRequestException({
        message: 'Link inválido',
        errorCode: 'INVALID_TOKEN',
      });
    }

    if (user.verificationTokenExpiresAt < new Date()) {
      throw new BadRequestException({
        message: 'Link expirado, solicite um novo',
        errorCode: 'TOKEN_EXPIRED',
      });
    }

    await this.prisma.user.update({
      where: { id: user.id },
      data: {
        emailVerified: true,
        verificationToken: null,
        verificationTokenExpiresAt: null,
      },
    });
  }
}
