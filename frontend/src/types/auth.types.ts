export interface Login {
  email: string;
  password: string;
}

export interface Register {
  name: string;
  email: string;
  password: string;
  confirmPassword: string
}

export interface AuthResponse {
  access_token: string;
}
