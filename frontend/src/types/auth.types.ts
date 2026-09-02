import type { User } from "./user.types";

export type LoginViewMode =
  | "login"
  | "emailNotVerified"
  | "forgotPassword"
  | "forgotPasswordSent";
export type VerifyStatus = "loading" | "invalid" | "expired" | "success";

export interface Login {
  email: string;
  password: string;
  turnstileToken: string;
}

export interface Register {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
  turnstileToken: string;
}

export interface AuthResponse {
  user: User;
}

export interface ForgotPassword {
  email: string;
  turnstileToken: string;
}

export interface ResetPassword {
  token: string;
  newPassword: string;
  confirmPassword: string;
}
