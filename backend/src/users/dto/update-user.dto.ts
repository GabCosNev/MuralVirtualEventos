import { IsOptional, IsString, MinLength, IsStrongPassword } from 'class-validator';

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
  @IsStrongPassword(
    {
      minLength: 12,
      minLowercase: 1,
      minUppercase: 1,
      minNumbers: 1,
      minSymbols: 1,
    },
    {
      message:
        ' Mínimo 12 caracteres; caracteres especiais como # $ @ ...; pelo menos uma letra maiúscula e minúscula; e pelo menos um número',
    },
  )
  password!: string;

  @IsOptional()
  @IsString()
  confirmPassword!: string;
}
