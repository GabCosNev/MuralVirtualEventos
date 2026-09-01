import { IsString, IsNotEmpty, IsStrongPassword } from 'class-validator';

export class ResetPasswordDto {
  @IsString()
  @IsNotEmpty()
  token!: string;

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
  newPassword!: string;

  @IsNotEmpty({ message: ' Confirmação de senha em branco.' })
  @IsString()
  confirmPassword!: string;
}
