import { IsEmail, IsNotEmpty, IsString, IsStrongPassword, Length, Matches } from 'class-validator';

export class RegisterDto {
  @IsNotEmpty({ message: 'Nome em branco.' })
  @IsString()
  @Length(2, 100, { message: 'Nome deve ter entre 2 e 100 caracteres.' })
  @Matches(/^[a-zA-ZÀ-ÖØ-öø-ÿ'\- ]+$/, {
    message: 'Nome contém caracteres inválidos.',
  })
  @Matches(/^(?!.*(.)\1{3,}).*$/, {
    message: 'Nome inválido.',
  })
  @Matches(/[aeiouáéíóúâêîôûãõAEIOUÁÉÍÓÚÂÊÎÔÛÃÕ]/, {
    message: 'Nome inválido.',
  })
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
        ' Senha deve ter no Mínimo 12 caracteres; caracteres especiais como # $ @ ...; pelo menos uma letra maiúscula e minúscula; e pelo menos um número',
    },
  )
  password!: string;

  @IsNotEmpty({ message: ' Confirmação de senha em branco.' })
  @IsString()
  confirmPassword!: string;

  @IsNotEmpty({ message: ' Token de verificação ausente.' })
  @IsString()
  turnstileToken!: string;

  @IsNotEmpty({ message: 'Código de convite em branco.' })
  @IsString()
  inviteCode!: string;
}
