import { IsEnum, IsNotEmpty, IsString, IsDateString } from 'class-validator';
import { EventType } from '../../../generated/prisma';

export class CreatePostDto {
  @IsString({ message: 'Deve ser um texto' })
  @IsNotEmpty({ message: 'Este campo é obrigatório' })
  title!: string;

  @IsString({ message: 'Deve ser um texto' })
  @IsNotEmpty({ message: 'Este campo é obrigatório' })
  content!: string;

  @IsEnum(EventType, { message: 'Tipo de evento inválido' })
  eventType!: EventType;

  @IsDateString({}, { message: 'Data inválida' })
  startDate!: string;

  @IsDateString({}, { message: 'Data inválida' })
  endDate!: string;
}
