import { IsEnum, IsNotEmpty, IsString } from 'class-validator';
import { EventType } from '../../../generated/prisma';

export class CreatePostDto {
  @IsString()
  @IsNotEmpty()
  title!: string;

  @IsString()
  @IsNotEmpty()
  content!: string;

  @IsEnum(EventType)
  eventType!: EventType;
}
