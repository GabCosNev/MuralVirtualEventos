import { Controller, Post, Body, Req, Res, UseGuards, UnauthorizedException } from '@nestjs/common';
import type { Request, Response } from 'express';
import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { ResendVerificationDto } from './dto/resend-verification.dto';
import { VerifyEmailDto } from './dto/verify-email.dto';
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

  private setAuthCookies(res: Response, accessToken: string, refreshToken: string) {
    res.cookie('access_token', accessToken, this.getCookieOptions(15 * 60 * 1000, '/'));
    res.cookie(
      'refresh_token',
      refreshToken,
      this.getCookieOptions(7 * 24 * 60 * 60 * 1000, '/auth/refresh'),
    );
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

    this.setAuthCookies(res, accessToken, refreshToken);

    return { user };
  }
  @Post('refresh')
  async refresh(@Req() req: Request, @Res({ passthrough: true }) res: Response) {
    const refreshTokenValue = req.cookies?.refresh_token as string | undefined;

    if (!refreshTokenValue) {
      throw new UnauthorizedException('Sessão inválida');
    }

    const { accessToken, refreshToken } = await this.authService.refresh(refreshTokenValue);

    this.setAuthCookies(res, accessToken, refreshToken);
  }
  @Post('logout')
  async logout(@Req() req: Request, @Res({ passthrough: true }) res: Response) {
    const refreshTokenValue = req.cookies?.refresh_token as string | undefined;

    if (refreshTokenValue) {
      await this.authService.logout(refreshTokenValue);
    }

    res.clearCookie('access_token', { path: '/' });
    res.clearCookie('refresh_token', { path: '/auth/refresh' });
  }

  @Post('resend-verification')
  async resendVerification(@Body() dto: ResendVerificationDto) {
    await this.authService.resendVerificationEmail(dto.email);
  }
  @Post('verify-email')
  async verifyEmail(@Body() dto: VerifyEmailDto) {
    await this.authService.verifyEmail(dto.token);
  }
}
