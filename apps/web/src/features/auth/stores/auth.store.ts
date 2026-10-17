import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { Role } from '@campusstay/constants';
import type { User } from '@campusstay/types';

export interface AuthState {
  token: string | null;
  user: User | null;
  isAuthenticated: boolean;
  login: (token: string, user: User) => void;
  logout: () => void;
  switchRole: (role: Role) => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      token: 'mock-jwt-token-campusstay',
      user: {
        id: 'usr-001',
        studentId: 'SE170123',
        name: 'Nguyễn Xuân Lộc',
        email: 'locnx.se@fpt.edu.vn',
        role: 'STUDENT',
        gender: 'MALE',
        major: 'Kỹ thuật phần mềm (SE)',
      },
      isAuthenticated: true,
      login: (token, user) => set({ token, user, isAuthenticated: true }),
      logout: () => set({ token: null, user: null, isAuthenticated: false }),
      switchRole: (role) =>
        set((state) => {
          if (!state.user) return state;
          const roleNames: Record<Role, string> = {
            STUDENT: 'Nguyễn Xuân Lộc (Sinh viên)',
            STAFF: 'Trần Văn Cường (Cán bộ KTX)',
            MANAGER: 'ThS. Hoàng Nam (Trưởng ban KTX)',
            ADMIN: 'Quản trị viên Hệ thống',
          };
          return {
            ...state,
            user: {
              ...state.user,
              role,
              name: roleNames[role] || state.user.name,
            },
          };
        }),
    }),
    {
      name: 'campusstay_auth_session',
    }
  )
);
