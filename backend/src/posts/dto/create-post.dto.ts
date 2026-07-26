import { IsEnum, IsNotEmpty, IsString, IsDateString } from 'class-validator';
import { EventType } from '../../../generated/prisma';

export class CreatePostDto {
  @IsString({})
  @IsNotEmpty({ message: 'Digite o título' })
  title!: string;

  @IsString({})
  @IsNotEmpty({ message: 'Digite o conteúdo' })
  content!: string;

  @IsEnum(EventType, { message: 'Tipo de evento inválido' })
  eventType!: EventType;

  @IsDateString({}, { message: 'Data inválida' })
  startDate!: string;

  @IsDateString({}, { message: 'Data inválida' })
  endDate!: string;
}
