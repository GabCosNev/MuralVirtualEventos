import { Injectable } from '@nestjs/common';
import { ThrottlerGuard } from '@nestjs/throttler';
import type { Request } from 'express';
import type { JwtPayload } from '../auth/types/jwt-payload.type';

@Injectable()
export class UserThrottlerGuard extends ThrottlerGuard {
  protected getTracker(req: Record<string, any>): Promise<string> {
    const user = (req as Request & { user?: JwtPayload }).user;
    return Promise.resolve(user ? `user-${user.id}` : String(req.ip));
  }
}
