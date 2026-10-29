import {
  ForbiddenException,
  Injectable,
  NotFoundException,
  BadRequestException,
  BadGatewayException,
  Logger,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { UpdateUserDto } from './dto/update-user.dto';
import bcrypt from 'bcrypt';
import { CloudinaryService } from '../cloudinary/cloudinary.service';

@Injectable()
export class UsersService {
  private readonly logger = new Logger(UsersService.name);

  constructor(
    private prisma: PrismaService,
    private cloudinary: CloudinaryService,
  ) {}

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
    if (user.avatarPublicId) {
      await this.deleteImageSafely(user.avatarPublicId);
    }
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

  async updateAvatar(userId: number, file: Express.Multer.File): Promise<{ avatar: string }> {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      select: { role: true, avatarPublicId: true },
    });

    if (!user) throw new NotFoundException('Usuário não encontrado');

    if (user.role === 'ADMIN') {
      throw new ForbiddenException('Conta de demonstração não pode ser editada');
    }

    let uploaded: { url: string; publicId: string };
    try {
      uploaded = await this.cloudinary.uploadAvatar(file.buffer);
    } catch (error) {
      this.logger.error('Falha no upload do avatar', error);
      throw new BadGatewayException('Não foi possível enviar a imagem. Tente novamente.');
    }

    try {
      await this.prisma.user.update({
        where: { id: userId },
        data: { avatar: uploaded.url, avatarPublicId: uploaded.publicId },
      });
    } catch (error) {
      await this.deleteImageSafely(uploaded.publicId);
      throw error;
    }

    if (user.avatarPublicId) {
      await this.deleteImageSafely(user.avatarPublicId);
    }

    return { avatar: uploaded.url };
  }

  private async deleteImageSafely(publicId: string): Promise<void> {
    try {
      await this.cloudinary.deleteImage(publicId);
    } catch (error) {
      this.logger.warn(`Não foi possível apagar a imagem ${publicId} no Cloudinary`, error);
    }
  }
}
