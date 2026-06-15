import api from './api';
import { type LoginDto, type RegisterDto, type AuthResponse, type User} from '../types';

export const loginUser = (dto: LoginDto) => {
  return api.post<AuthResponse>('/auth/login', dto);
};

export const registerUser = (dto: RegisterDto) => {
  return api.post<AuthResponse>('/auth/register', dto);
}

export const getMe = () => {
  return api.get<User>('users/me');
}
