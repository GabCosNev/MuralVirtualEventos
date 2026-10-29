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

export const deleteAccount = async (password: string): Promise<void> => {
  await api.delete("/users/me", { data: { password } });
};

export const uploadAvatar = async (file: File): Promise<{ avatar: string }> => {
  const formData = new FormData();
  formData.append("avatar", file);

  const { data } = await api.patch<{ avatar: string }>(
    "/users/me/avatar",
    formData,
  );
  return data;
};
