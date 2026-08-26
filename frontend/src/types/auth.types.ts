import type { User } from "./user.types";

export type LoginViewMode = "login" | "emailNotVerified";

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
