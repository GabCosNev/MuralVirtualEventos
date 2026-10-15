import {
  ForbiddenException,
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { UpdateUserDto } from './dto/update-user.dto';
import bcrypt from 'bcrypt';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  async update(userId: number, dto: UpdateUserDto) {
    const user = await this.findUserOrThrow(userId);

    if (user.role === 'ADMIN') {
      throw new ForbiddenException('Conta de demonstração não pode ser editada');
    }

    if (dto.password) {
      if (!dto.actualPassword) throw new BadRequestException('Senha atual não enviada');
      if (!(await bcrypt.compare(dto.actualPassword, user.password)))
        throw new BadRequestException('Senha inválida');
      if (dto.password !== dto.confirmPassword) {
        throw new BadRequestException('As senhas não coincidem');
      }
      dto.password = await bcrypt.hash(dto.password, 10);
    }
    return this.prisma.user.update({
      where: { id: userId },
      data: {
        name: dto.name,
        avatar: dto.avatar,
        password: dto.password,
      },
      select: {
        id: true,
        name: true,
        email: true,
        avatar: true,
        role: true,
      },
    });
  }
  async removeMe(userId: number, password: string): Promise<void> {
    const user = await this.findUserOrThrow(userId);

    if (user.role === 'ADMIN') {
      throw new ForbiddenException('Conta de demonstração não pode ser removida');
    }

    if (!(await bcrypt.compare(password, user.password))) {
      throw new BadRequestException('Senha inválida');
    }

    await this.prisma.user.delete({ where: { id: userId } });
  }
  private async findUserOrThrow(userId: number) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      throw new NotFoundException('Usuário não encontrado');
    }

    return user;
  }
  async getMe(userId: number) {
    return this.prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        name: true,
        email: true,
        avatar: true,
        role: true,
      },
    });
  }
}
