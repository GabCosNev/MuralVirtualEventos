import { IsEmail, IsNotEmpty, MinLength } from 'class-validator';

export class LoginDto {
  @IsNotEmpty({ message: 'Este campo é obrigatório' })
  @IsEmail({}, { message: 'Deve ser um e-mail válido' })
  email!: string;

  @IsNotEmpty({ message: 'Este campo é obrigatório' })
  @MinLength(8, { message: 'A senha deve ter no mínimo 8 caracteres' })
  password!: string;
}
