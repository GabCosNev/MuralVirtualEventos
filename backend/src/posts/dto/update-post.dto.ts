import { PartialType } from '@nestjs/mapped-types';
import { CreatePostDto } from './create-post.dto';

// transforma todos os campos em opcionais, mantendo todas as validações.
export class UpdatePostDto extends PartialType(CreatePostDto) {}
