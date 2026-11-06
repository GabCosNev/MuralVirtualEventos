import { Module } from '@nestjs/common';
import { GroqSearchService } from './groq-search.service';
import { GroqSearchController } from './groq-search.controller';

@Module({
  providers: [GroqSearchService],
  controllers: [GroqSearchController],
})
export class GroqSearchModule {}
