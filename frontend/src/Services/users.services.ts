import api from './api';
import { type UpdateUser, type User} from '../types';

export const getMe = () => {
  return api.get<User>('/users/me');
}

export const updateMe = (dto: UpdateUser) => {
  return api.patch<User>('/users/me', dto);
};
