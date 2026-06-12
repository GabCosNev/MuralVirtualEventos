export interface User {
  id: number;
  name: string;
  email: string;
  role: 'USER' | 'ADMIN';
  avatar: string | null;
}

export interface LoginDto {
  email: string;
  password: string;
}

export interface RegisterDto {
  name: string;
  email: string;
  password: string;
  confirmPassword: string
}

export interface AuthResponse {
  access_token: string;
}

export interface Post {
  id: number;
  title: string;
  content: string;
  eventType: 'ANNOUNCEMENT' | 'EVENT' | 'CELEBRATION';
  status: 'PENDING' | 'APPROVED' | 'REJECTED';
  rejectedReason: string | null;
  createdAt: string;
  updatedAt: string;
  authorId: number;
  author?: {
    id: number;
    name: string;
    avatar: string | null;
  };
}
