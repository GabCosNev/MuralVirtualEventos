import { api } from "./api";
import {
  type Login,
  type Register,
  type AuthResponse,
  type ForgotPassword,
  type ResetPassword,
} from "../types";

export const loginUser = async (dto: Login): Promise<AuthResponse> => {
  const { data } = await api.post<AuthResponse>("/auth/login", dto);
  return data;
};

export const registerUser = async (dto: Register): Promise<void> => {
  await api.post("/auth/register", dto);
};

export const verifyEmail = async (token: string): Promise<void> => {
  await api.post("/auth/verify-email", { token });
};

export const resendVerificationEmail = async (email: string): Promise<void> => {
  await api.post("/auth/resend-verification", { email });
};

export const forgotPassword = async (dto: ForgotPassword): Promise<void> => {
  await api.post("/auth/forgot-password", dto);
};
export const resetPassword = async (dto: ResetPassword): Promise<void> => {
  await api.post("/auth/reset-password", dto);
};
