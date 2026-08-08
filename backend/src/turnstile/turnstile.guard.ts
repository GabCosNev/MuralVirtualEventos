// src/turnstile/turnstile.guard.ts
import { CanActivate, ExecutionContext, ForbiddenException, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { TurnstileService } from './turnstile.service';
import { TURNSTILE_SECRET_KEY } from './turnstile-secret.decorator';

@Injectable()
export class TurnstileGuard implements CanActivate {
  constructor(
    private readonly turnstileService: TurnstileService,
    private readonly reflector: Reflector,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const envVarName = this.reflector.get<string>(TURNSTILE_SECRET_KEY, context.getHandler());

    if (!envVarName) {
      return true;
    }

    const secretKey = process.env[envVarName];
    if (!secretKey) {
      throw new Error(`Variável de ambiente ${envVarName} não configurada para o TurnstileGuard.`);
    }

    const request = context.switchToHttp().getRequest<Request>();
    const token = (request.body as { turnstileToken?: string })?.turnstileToken;

    if (!token) {
      throw new ForbiddenException('Verificação de segurança ausente.');
    }

    const isValid = await this.turnstileService.verify(token, secretKey);
    if (!isValid) {
      throw new ForbiddenException('Falha na verificação de segurança.');
    }

    return true;
  }
}
