// LoginDto completo, com o campo novo
import { IsEmail, IsNotEmpty, IsString, IsStrongPassword } from 'class-validator';

export class LoginDto {
  @IsEmail({}, { message: ' E-mail inválido.' })
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
      message: ' Senha Inválida',
    },
  )
  password!: string;

  @IsNotEmpty({ message: 'Token de verificação ausente.' })
  @IsString()
  turnstileToken!: string;
}
