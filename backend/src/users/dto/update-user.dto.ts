import { IsOptional, IsString, MinLength } from 'class-validator';

export class UpdateUserDto {
  @IsOptional()
  @IsString({ message: 'Deve ser um texto' })
  name?: string;

  @IsOptional()
  @IsString({ message: 'Deve ser um texto' })
  avatar?: string;

  @IsOptional()
  @IsString({ message: 'Deve ser um texto' })
  @MinLength(8, { message: 'A senha deve ter no mínimo 8 caracteres' })
  actualPassword?: string;

  @IsOptional()
  @IsString({ message: 'Deve ser um texto' })
  @MinLength(8, { message: 'A senha deve ter no mínimo 8 caracteres' })
  password?: string;

  @IsOptional()
  @IsString({ message: 'Deve ser um texto' })
  @MinLength(8, { message: 'A senha deve ter no mínimo 8 caracteres' })
  confirmPassword?: string;
}
