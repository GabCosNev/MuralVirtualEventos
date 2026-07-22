import api from "./api";
import { type Login, type Register, type AuthResponse } from "../types";

export const loginUser = async (dto: Login): Promise<AuthResponse> => {
  const { data } = await api.post<AuthResponse>("/auth/login", dto);
  return data;
};

export const registerUser = async (dto: Register): Promise<AuthResponse> => {
  const { data } = await api.post<AuthResponse>("/auth/register", dto);
  return data;
};
