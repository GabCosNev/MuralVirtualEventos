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

  async update(currentUserId: number, targetUserId: number, dto: UpdateUserDto) {
    await this.findUserOrThrow(targetUserId);

    if (currentUserId !== targetUserId) {
      throw new ForbiddenException('Você não tem permissão para editar esse usuário');
    }

    if (dto.password) {
      if (dto.password !== dto.confirmPassword) {
        throw new BadRequestException('As senhas não coincidem');
      }
      dto.password = await bcrypt.hash(dto.password, 10);
    }
    return this.prisma.user.update({
      where: { id: targetUserId },
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
  async remove(currentUserId: number, targetUserId: number, isAdmin: boolean) {
    await this.findUserOrThrow(targetUserId);

    if (!isAdmin && currentUserId !== targetUserId) {
      throw new ForbiddenException('Você não tem permissão para deletar esse usuário');
    }

    return this.prisma.user.delete({
      where: { id: targetUserId },
    });
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
}
