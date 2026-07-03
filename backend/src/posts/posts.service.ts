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

@Injectable()
export class PostsService {
  constructor(private prisma: PrismaService) {}

  async create(userId: number, dto: CreatePostDto) {
    const intervalo = this.intervaloData(dto.dateStart, dto.dateEnd, dto.timeStart, dto.timeEnd);

    if (!intervalo) throw new BadRequestException('Erro ao processar as datas do evento.');

    return this.prisma.post.create({
      data: {
        title: dto.title,
        content: dto.content,
        eventType: dto.eventType,
        startDate: intervalo.startDate,
        endDate: intervalo.endDate,
        authorId: userId,
      },
    });
  }
  async findAllApproved() {
    return this.prisma.post.findMany({
      where: { status: PostStatus.APPROVED },
      include: {
        author: {
          select: {
            id: true,
            name: true,
            avatar: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
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

    const intervalo = this.intervaloData(dto.dateStart, dto.dateEnd, dto.timeStart, dto.timeEnd);

    return this.prisma.post.update({
      where: { id: postId },
      data: {
        title: dto.title,
        content: dto.content,
        eventType: dto.eventType,
        ...(intervalo ? { startDate: intervalo.startDate, endDate: intervalo.endDate } : {}),
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

  async findPostOrThrow(postId: number) {
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

  private intervaloData(
    dateStart?: string,
    dateEnd?: string,
    timeStart?: string,
    timeEnd?: string,
  ): { startDate: Date; endDate: Date } | undefined {
    const nenhumCampoPreenchido = !dateStart && !dateEnd && !timeStart && !timeEnd;

    if (nenhumCampoPreenchido) return undefined;

    const todosCamposPreenchidos = dateStart && dateEnd && timeStart && timeEnd;

    if (!todosCamposPreenchidos) {
      throw new BadRequestException(
        'Para alterar a data do evento, é necessário informar data inicio e fim juntos.',
      );
    }
    const startDateCombinada = new Date(`${dateStart}T${timeStart}`);
    const endDateCombinada = new Date(`${dateEnd}T${timeEnd}`);

    const algumaDataInvalida =
      isNaN(startDateCombinada.getTime()) || isNaN(endDateCombinada.getTime());

    if (algumaDataInvalida) throw new BadRequestException('Data ou horário do evento inválido.');

    if (endDateCombinada <= startDateCombinada) {
      throw new BadRequestException(
        'A data/hora de término do evento deve ser posterior à data/hora de início.',
      );
    }

    return { startDate: startDateCombinada, endDate: endDateCombinada };
  }
}
