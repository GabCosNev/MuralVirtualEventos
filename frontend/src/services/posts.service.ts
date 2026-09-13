import { api } from "./api";
import {
  type CreatePost,
  type Post,
  type ReviewPost,
  type UpdatePost,
} from "../types";

export const createPost = async (dto: CreatePost): Promise<Post> => {
  const { data } = await api.post<Post>("/posts", dto);
  return data;
};

export const updatePost = async (
  dto: UpdatePost,
  id: number,
): Promise<Post> => {
  const { data } = await api.patch<Post>(`/posts/${id}`, dto);
  return data;
};

export const reviewPost = async (
  dto: ReviewPost,
  id: number,
): Promise<Post> => {
  const { data } = await api.patch<Post>(`/posts/${id}/review`, dto);
  return data;
};

export const getPostHome = async (): Promise<Post[]> => {
  const { data } = await api.get<Post[]>("/posts");
  return data;
};

export const getPostMine = async (): Promise<Post[]> => {
  const { data } = await api.get<Post[]>("/posts/mine");
  return data;
};

export const getPostPending = async (): Promise<Post[]> => {
  const { data } = await api.get<Post[]>("/posts/pending");
  return data;
};

export const deletePost = async (id: number): Promise<Post> => {
  const { data } = await api.delete<Post>(`/posts/${id}`);
  return data;
};

export const getPostById = async (id: number): Promise<Post> => {
  const { data } = await api.get<Post>(`/posts/${id}`);
  return data;
};
