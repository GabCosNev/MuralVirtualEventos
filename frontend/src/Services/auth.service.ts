import api from "./api";
import { type Login, type Register, type AuthResponse } from "../types";

export const loginUser = (dto: Login) => {
  return api.post<AuthResponse>("/auth/login", dto);
};

export const registerUser = (dto: Register) => {
  return api.post<AuthResponse>("/auth/register", dto);
};
