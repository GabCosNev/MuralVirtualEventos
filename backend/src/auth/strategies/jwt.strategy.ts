import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';
import type { Request } from 'express';
import { JwtPayload, RawJwtPayload } from '../types/jwt-payload.type';

function extractJwtFromCookie(req: Request): string | null {
  const token = req.cookies?.access_token as string | undefined;
  return token ?? null;
}

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') {
  constructor(config: ConfigService) {
    super({
      jwtFromRequest: extractJwtFromCookie,
      secretOrKey: config.getOrThrow<string>('JWT_SECRET'),
    });
  }

  validate(payload: RawJwtPayload): JwtPayload {
    return { id: payload.sub, email: payload.email, role: payload.role };
  }
}
