import { IsEmail, IsNotEmpty, IsString, IsStrongPassword } from 'class-validator';

export class RegisterDto {
  @IsNotEmpty({ message: 'Nome em branco.' })
  @IsString({})
  name!: string;

  @IsEmail({}, { message: ' E-mail Inválido.' })
  email!: string;

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

  @IsNotEmpty({ message: 'Confirmação de senha em branco.' })
  @IsString()
  confirmPassword!: string;

  @IsNotEmpty({ message: 'Token de verificação ausente.' })
  @IsString()
  turnstileToken!: string;
}
