// src/turnstile/turnstile.service.ts
import { Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';

interface TurnstileVerifyResponse {
  success: boolean;
  'error-codes'?: string[];
}

@Injectable()
export class TurnstileService {
  constructor(private readonly httpService: HttpService) {}

  async verify(token: string, secretKey: string): Promise<boolean> {
    const { data } = await firstValueFrom(
      this.httpService.post<TurnstileVerifyResponse>(
        'https://challenges.cloudflare.com/turnstile/v0/siteverify',
        {
          secret: secretKey,
          response: token,
        },
      ),
    );

    return data.success;
  }
}
