import { IsEnum, IsNotEmpty, IsString, IsDateString, Matches } from 'class-validator';
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

  @IsDateString(
    { strict: true },
    { message: 'Deve ser uma data válida no formato ISO 8601 (ex: 2026-07-15)' },
  )
  dateStart!: string;

  @IsDateString(
    { strict: true },
    { message: 'Deve ser uma data válida no formato ISO 8601 (ex: 2026-07-15)' },
  )
  dateEnd!: string;

  @Matches(/^([01]\d|2[0-3]):([0-5]\d)$/, { message: 'Deve estar no formato HH:mm' })
  timeStart!: string;

  @Matches(/^([01]\d|2[0-3]):([0-5]\d)$/, { message: 'Deve estar no formato HH:mm' })
  timeEnd!: string;
}
