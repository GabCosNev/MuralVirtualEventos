import { IsEnum, IsString, ValidateIf, IsNotEmpty } from 'class-validator';
import { PostStatus } from '../../../generated/prisma';

export class ReviewPostDto {
  @IsEnum(PostStatus)
  status!: PostStatus;

  @ValidateIf((o: ReviewPostDto) => o.status === PostStatus.REJECTED)
  @IsString()
  @IsNotEmpty()
  rejectedReason!: string;
}
