import { Controller, Post, Body, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { TurnstileGuard } from '../turnstile/turnstile.guard';
import { TurnstileSecret } from '../turnstile/turnstile-secret.decorator';
import { Res } from '@nestjs/common';
import type { Response } from 'express';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('register')
  @UseGuards(TurnstileGuard)
  @TurnstileSecret('TURNSTILE_SECRET_KEY_REGISTER')
  register(@Body() dto: RegisterDto) {
    return this.authService.register(dto);
  }

  @Post('login')
  @UseGuards(TurnstileGuard)
  @TurnstileSecret('TURNSTILE_SECRET_KEY_LOGIN')
  login(@Body() dto: LoginDto, @Res({ passthrough: true }) res: Response) {
    return this.authService.login(dto);
  }
}
