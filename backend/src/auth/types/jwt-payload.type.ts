export interface JwtPayload {
  sub: number;
  email: string;
  role: string;
}
export interface AuthenticatedRequest {
  user: JwtPayload;
}
