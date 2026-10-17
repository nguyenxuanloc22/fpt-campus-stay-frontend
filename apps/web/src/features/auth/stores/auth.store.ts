import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { User } from '@campusstay/types';
import { MOCK_ACCOUNTS, MOCK_PASSWORD } from '../mockAccounts';

export interface AuthState {
  token: string | null;
  user: User | null;
  isAuthenticated: boolean;
  login: (token: string, user: User) => void;
  /** Đăng nhập bằng tài khoản (cán bộ / quản trị). Trả về false nếu sai thông tin. */
  loginWithCredentials: (username: string, password: string) => boolean;
  /** Đăng nhập Google / FEID dành cho sinh viên. */
  loginWithStudentSso: () => void;
  logout: () => void;
}

const session = (user: User) => ({ token: `mock-jwt-${user.id}`, user, isAuthenticated: true });

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      token: null,
      user: null,
      isAuthenticated: false,
      login: (token, user) => set({ token, user, isAuthenticated: true }),
      loginWithCredentials: (username, password) => {
        const account = MOCK_ACCOUNTS[username.trim().toLowerCase()];
        if (!account || password !== MOCK_PASSWORD) return false;
        set(session(account));
        return true;
      },
      loginWithStudentSso: () => set(session(MOCK_ACCOUNTS.student!)),
      logout: () => set({ token: null, user: null, isAuthenticated: false }),
    }),
    { name: 'campusstay_auth_session' }
  )
);
