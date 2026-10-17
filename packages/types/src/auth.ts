import type { Role } from '@campusstay/constants';

export interface User {
  id: string;
  studentId?: string;
  name: string;
  email: string;
  role: Role;
  phoneNumber?: string;
  gender?: 'MALE' | 'FEMALE';
  major?: string;
  avatarUrl?: string;
}

export interface AuthSession {
  token: string;
  refreshToken: string;
  user: User;
}

export interface LoginPayload {
  email: string;
  password?: string;
  role?: Role;
}
