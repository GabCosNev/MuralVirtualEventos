import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { JwtGuard } from '../auth/guards/jwt.guard';
import { GroqSearchService } from './groq-search.service';
import { SearchQuestionDto } from './dto/serach-question.dto';
import { UserThrottlerGuard } from './user-throttler.guard';

@UseGuards(JwtGuard, UserThrottlerGuard)
@Controller('search')
export class GroqSearchController {
  constructor(private groqSearchService: GroqSearchService) {}

  @Post()
  search(@Body() dto: SearchQuestionDto) {
    return this.groqSearchService.search(dto.question);
  }
}
