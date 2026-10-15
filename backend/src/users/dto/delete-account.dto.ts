// src/users/dto/delete-account.dto.ts
import { IsString, IsNotEmpty } from 'class-validator';

export class DeleteAccountDto {
  @IsString()
  @IsNotEmpty({ message: 'Digite sua senha' })
  password!: string;
}
