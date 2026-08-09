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
  access_token: string;
}
