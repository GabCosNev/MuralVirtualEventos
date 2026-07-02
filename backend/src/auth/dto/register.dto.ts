import { IsEmail, IsNotEmpty, IsString, MinLength } from 'class-validator';

export class RegisterDto {
  @IsNotEmpty({ message: 'Este campo é obrigatório' })
  @IsString({ message: 'Deve ser um texto' })
  name!: string;

  @IsNotEmpty({ message: 'Este campo é obrigatório' })
  @IsEmail({}, { message: 'Deve ser um e-mail válido' })
  email!: string;

  @IsNotEmpty({ message: 'Este campo é obrigatório' })
  @MinLength(8, { message: 'A senha deve ter no mínimo 8 caracteres' })
  password!: string;

  @IsNotEmpty({ message: 'Este campo é obrigatório' })
  @MinLength(8, { message: 'A senha deve ter no mínimo 8 caracteres' })
  confirmPassword!: string;
}
