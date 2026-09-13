import { api } from "./api";
import { type UpdateUser, type User } from "../types";

export const getMe = async (): Promise<User> => {
  const { data } = await api.get<User>("/users/me");
  return data;
};

export const updateMe = async (dto: UpdateUser): Promise<User> => {
  const { data } = await api.patch<User>("/users/me", dto);
  return data;
};
