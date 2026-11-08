import { IsNotEmpty, IsString, Matches, MaxLength } from 'class-validator';

export class SearchQuestionDto {
  @IsString()
  @Matches(/\S/, { message: 'Digite sua pergunta' })
  @MaxLength(300, { message: 'A pergunta pode ter no máximo 300 caracteres' })
  question!: string;
}
