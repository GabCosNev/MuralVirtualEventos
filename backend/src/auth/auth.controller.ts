import { Controller, Post, Body, Res, UseGuards } from '@nestjs/common';
import type { Response } from 'express';
import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { TurnstileGuard } from '../turnstile/turnstile.guard';
import { TurnstileSecret } from '../turnstile/turnstile-secret.decorator';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  private getCookieOptions(maxAgeMs: number, path: string) {
    return {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict' as const,
      maxAge: maxAgeMs,
      path,
    };
  }

  @Post('register')
  @UseGuards(TurnstileGuard)
  @TurnstileSecret('TURNSTILE_SECRET_KEY_REGISTER')
  register(@Body() dto: RegisterDto) {
    return this.authService.register(dto);
  }

  @Post('login')
  @UseGuards(TurnstileGuard)
  @TurnstileSecret('TURNSTILE_SECRET_KEY_LOGIN')
  async login(@Body() dto: LoginDto, @Res({ passthrough: true }) res: Response) {
    const { accessToken, refreshToken, user } = await this.authService.login(dto);

    res.cookie('access_token', accessToken, this.getCookieOptions(15 * 60 * 1000, '/'));
    res.cookie(
      'refresh_token',
      refreshToken,
      this.getCookieOptions(7 * 24 * 60 * 60 * 1000, '/auth/refresh'),
    );

    return { user };
  }
}
