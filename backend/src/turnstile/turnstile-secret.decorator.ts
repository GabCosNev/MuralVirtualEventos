import { SetMetadata } from '@nestjs/common';

export const TURNSTILE_SECRET_KEY = 'turnstile_secret_key';

export const TurnstileSecret = (envVarName: string) =>
  SetMetadata(TURNSTILE_SECRET_KEY, envVarName);
