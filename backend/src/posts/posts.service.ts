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
    return this.prisma.post.create({
      data: {
        title: dto.title,
        content: dto.content,
        eventType: dto.eventType,
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

    return this.prisma.post.update({
      where: { id: postId },
      data: {
        ...dto,
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

    if (!post) {
      throw new NotFoundException('Post não encontrado');
    }

    if (post.status !== PostStatus.PENDING) {
      throw new BadRequestException('Apenas posts pendentes podem ser revisados');
    }

    return this.prisma.post.update({
      where: { id: postId },
      data: {
        status: dto.status,
        rejectedReason: dto.status === PostStatus.REJECTED ? dto.rejectedReason : null,
      },
    });
  }
  private async findPostAndVerifyOwner(postId: number, userId: number) {
    const post = await this.prisma.post.findUnique({
      where: { id: postId },
    });

    if (!post) {
      throw new NotFoundException('Post não encontrado');
    }

    if (post.authorId !== userId) {
      throw new ForbiddenException('Você não tem permissão para realizar essa ação');
    }

    return post;
  }
}
