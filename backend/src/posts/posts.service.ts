import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { PostStatus } from '../../generated/prisma';
import { ReviewPostDto } from './dto/review-post.dto';
import { JwtPayload } from '../auth/types/jwt-payload.type';

@Injectable()
export class PostsService {
  constructor(private prisma: PrismaService) {}

  async create(userId: number, dto: CreatePostDto) {
    const dates = this.validData(dto.startDate, dto.endDate);

    if (!dates) throw new BadRequestException('Erro ao processar as datas do evento.');

    return this.prisma.post.create({
      data: {
        title: dto.title,
        content: dto.content,
        eventType: dto.eventType,
        startDate: dates.startDate,
        endDate: dates.endDate,
        authorId: userId,
      },
    });
  }
  async findAllApproved() {
    return this.prisma.post.findMany({
      where: {
        status: PostStatus.APPROVED,
        endDate: { gte: new Date() },
      },
      include: {
        author: {
          select: {
            id: true,
            name: true,
            avatar: true,
          },
        },
      },
      orderBy: { startDate: 'asc' },
    });
  }
  async findMyPosts(userId: number) {
    return this.prisma.post.findMany({
      where: { authorId: userId },
      orderBy: { createdAt: 'desc' },
    });
  }
  async findPending() {
    return this.prisma.post.findMany({
      where: { status: PostStatus.PENDING },
      include: {
        author: {
          select: {
            id: true,
            name: true,
            avatar: true,
          },
        },
      },
      orderBy: { createdAt: 'asc' },
    });
  }

  async update(userId: number, postId: number, dto: UpdatePostDto) {
    await this.findPostAndVerifyOwner(postId, userId);

    const dates = this.validData(dto.startDate, dto.endDate);

    return this.prisma.post.update({
      where: { id: postId },
      data: {
        title: dto.title,
        content: dto.content,
        eventType: dto.eventType,
        ...(dates ? { startDate: dates.startDate, endDate: dates.endDate } : {}),
        status: PostStatus.PENDING,
      },
    });
  }

  async remove(userId: number, postId: number) {
    await this.findPostAndVerifyOwner(postId, userId);

    return this.prisma.post.delete({
      where: { id: postId },
    });
  }
  async review(postId: number, dto: ReviewPostDto) {
    const post = await this.prisma.post.findUnique({
      where: { id: postId },
    });

    if (!post) throw new NotFoundException('Post não encontrado');

    if (post.status !== PostStatus.PENDING)
      throw new BadRequestException('Apenas posts pendentes podem ser revisados');

    return this.prisma.post.update({
      where: { id: postId },
      data: {
        status: dto.status,
        rejectedReason: dto.status === PostStatus.REJECTED ? dto.rejectedReason : null,
      },
    });
  }

  private async findPostOrThrow(postId: number) {
    const post = await this.prisma.post.findUnique({
      where: { id: postId },
    });

    if (!post) throw new NotFoundException('Post não encontrado');

    return post;
  }

  private async findPostAndVerifyOwner(postId: number, userId: number) {
    const post = await this.prisma.post.findUnique({
      where: { id: postId },
    });

    if (!post) throw new NotFoundException('Post não encontrado');

    if (post.authorId !== userId)
      throw new ForbiddenException('Você não tem permissão para realizar essa ação');

    return post;
  }

  private validData(
    startDate?: string,
    endDate?: string,
  ): { startDate: Date; endDate: Date } | undefined {
    if (!startDate && !endDate) return undefined;

    if ((!startDate && endDate) || (startDate && !endDate)) {
      throw new BadRequestException(
        'Para alterar a data do evento, é necessário informar data início e fim juntos.',
      );
    }

    const startDateCombinada = new Date(startDate!);
    const endDateCombinada = new Date(endDate!);

    if (isNaN(startDateCombinada.getTime()) || isNaN(endDateCombinada.getTime())) {
      throw new BadRequestException('Data ou horário do evento inválido.');
    }

    if (endDateCombinada <= startDateCombinada) {
      throw new BadRequestException(
        'A data do término do evento deve ser posterior à data de início.',
      );
    }
    if (endDateCombinada < new Date()) {
      throw new BadRequestException('A data de término não pode ser no passado');
    }

    return { startDate: startDateCombinada, endDate: endDateCombinada };
  }

  async findOneForUser(user: JwtPayload, postId: number) {
    const post = await this.findPostOrThrow(postId);

    const isOwner = post.authorId === user.id;
    const isAdmin = user.role === 'ADMIN';
    const isApproved = post.status === 'APPROVED';

    if (!isApproved && !isOwner && !isAdmin) {
      throw new NotFoundException('Post não encontrado');
    }

    return post;
  }
}
