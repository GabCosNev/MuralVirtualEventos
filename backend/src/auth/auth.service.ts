import * as crypto from 'crypto';

import {
  Injectable,
  ConflictException,
  UnauthorizedException,
  BadRequestException,
} from '@nestjs/common';

import { PrismaService } from '../prisma/prisma.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwt: JwtService,
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

    await this.prisma.user.create({
      data: {
        name: nomeAtualizado,
        email: dto.email,
        password: hashed,
      },
    });
  }
  async login(dto: LoginDto) {
    const user = await this.prisma.user.findUnique({
      where: { email: dto.email },
    });
    if (!user) throw new UnauthorizedException('Credenciais inválidas');

    const valid = await bcrypt.compare(dto.password, user.password);
    if (!valid) throw new UnauthorizedException('Credenciais inválidas');

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
  private generateRefreshToken(): string {
    return crypto.randomBytes(64).toString('hex');
  }

  private hashToken(token: string): string {
    return crypto.createHash('sha256').update(token).digest('hex');
  }

  private async createRefreshToken(userId: number): Promise<string> {
    const token = this.generateRefreshToken();
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
}
