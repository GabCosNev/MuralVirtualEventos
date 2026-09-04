import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Body,
  Param,
  ParseIntPipe,
  UseGuards,
} from '@nestjs/common';
import { PostsService } from './posts.service';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { ReviewPostDto } from './dto/review-post.dto';
import { JwtGuard } from '../auth/guards/jwt.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { JwtPayload } from '../auth/types/jwt-payload.type';

@UseGuards(JwtGuard, RolesGuard)
@Controller('posts')
export class PostsController {
  constructor(private postsService: PostsService) {}

  @Post()
  create(@CurrentUser() user: JwtPayload, @Body() dto: CreatePostDto) {
    return this.postsService.create(user.id, dto);
  }
  @Get('mine')
  findMyPosts(@CurrentUser() user: JwtPayload) {
    return this.postsService.findMyPosts(user.id);
  }
  @Get('pending')
  @Roles('ADMIN')
  findPending() {
    return this.postsService.findPending();
  }
  @Patch(':id')
  update(
    @CurrentUser() user: JwtPayload,
    @Param('id', ParseIntPipe) postId: number,
    @Body() dto: UpdatePostDto,
  ) {
    return this.postsService.update(user.id, postId, dto);
  }
  @Delete(':id')
  remove(@CurrentUser() user: JwtPayload, @Param('id', ParseIntPipe) postId: number) {
    return this.postsService.remove(user.id, postId);
  }
  @Patch(':id/review')
  @Roles('ADMIN')
  review(@Param('id', ParseIntPipe) postId: number, @Body() dto: ReviewPostDto) {
    return this.postsService.review(postId, dto);
  }
  @Get()
  findAllApproved() {
    return this.postsService.findAllApproved();
  }
  @Get(':id')
  findOne(@CurrentUser() user: JwtPayload, @Param('id', ParseIntPipe) postId: number) {
    return this.postsService.findOneForUser(user, postId);
  }
}
