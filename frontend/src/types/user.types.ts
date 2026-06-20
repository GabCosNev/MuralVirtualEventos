export interface User {
  id: number;
  name: string;
  email: string;
  role: 'USER' | 'ADMIN';
  avatar: string | null;
}

export interface UpdateUser {
  name?: string;
  avatar?: string;
  actualPassword?: string;
  password?: string;
  confirmPassword?: string;
}
