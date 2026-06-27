import api from './api';
import { type CreatePost, type Post, type ReviewPost,type UpdatePost } from '../types';

export const createPost = (dto: CreatePost) => {
  return api.post<Post>('/posts', dto);
};

export const updatePost = (dto: UpdatePost, id: number) => {
  return api.patch<Post>(`/posts/${id}`, dto)
}

export const reviewPost= (dto: ReviewPost, id: number) => {
  return api.patch<Post>(`/posts/${id}`, dto)
}

export const getPostHome = () => {
  return api.get<Post[]>('/posts',)
}

export const getPostMine = () => {
  return api.get<Post[]>('/posts/mine',)
}

export const getPostPending = () => {
  return api.get<Post[]>('/posts/pending',)
}

export const deletePost = (id: number) => {
  return api.delete<Post>(`/posts/${id}`,)
}




