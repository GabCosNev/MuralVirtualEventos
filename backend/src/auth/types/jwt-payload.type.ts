export interface RawJwtPayload {
  sub: number;
  email: string;
  role: string;
  iat?: number;
}

export interface JwtPayload {
  id: number;
  email: string;
  role: string;
}

export interface AuthenticatedRequest {
  user: JwtPayload;
}
