// src/turnstile/turnstile.module.ts
import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { TurnstileService } from './turnstile.service';
import { TurnstileGuard } from './turnstile.guard';

@Module({
  imports: [HttpModule],
  providers: [TurnstileService, TurnstileGuard],
  exports: [TurnstileService, TurnstileGuard],
})
export class TurnstileModule {}
