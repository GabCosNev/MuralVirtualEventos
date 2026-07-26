import { IsEmail, IsNotEmpty, IsString, MinLength } from 'class-validator';

export class RegisterDto {
  @IsNotEmpty({ message: 'Nome em branco.' })
  @IsString({})
  name!: string;

  @IsEmail({}, { message: ' E-mail Inválido.' })
  email!: string;

  @MinLength(8, { message: ' Senha deve ter no mínimo 8 caracteres.' })
  password!: string;

  @MinLength(8, { message: ' ConfirmarSenha deve ter no mínimo 8 caracteres.' })
  confirmPassword!: string;
}
