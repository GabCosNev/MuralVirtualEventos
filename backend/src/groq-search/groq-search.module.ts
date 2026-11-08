import { Module } from '@nestjs/common';
import { GroqSearchService } from './groq-search.service';
import { GroqSearchController } from './groq-search.controller';
import { PostsModule } from '../posts/posts.module';
import { GroqLlmService } from './groq-llm.service';
import { ThrottlerModule } from '@nestjs/throttler';

@Module({
  imports: [PostsModule, ThrottlerModule.forRoot([{ ttl: 60_000, limit: 5 }])],
  providers: [GroqSearchService, GroqLlmService],
  controllers: [GroqSearchController],
})
export class GroqSearchModule {}
