import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class ForgotPasswordDto {
  @IsEmail()
  email!: string;

  @IsNotEmpty({ message: ' Token de verificação ausente.' })
  @IsString()
  turnstileToken!: string;
}
