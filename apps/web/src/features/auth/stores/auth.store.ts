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
  loginWithRole: (role: Role, customName?: string) => void;
}

const roleNames: Record<Role, string> = {
  STUDENT: 'Nguyễn Thị Mai Anh',
  STAFF: 'Trần Văn Cường (Cán bộ KTX)',
  MANAGER: 'ThS. Hoàng Nam (Trưởng ban KTX)',
  ADMIN: 'Quản trị viên Hệ thống',
};

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      token: 'mock-jwt-token-campusstay',
      user: {
        id: 'usr-001',
        studentId: 'SE171234',
        name: 'Nguyễn Thị Mai Anh',
        email: 'anhntmse171234@fpt.edu.vn',
        role: 'STUDENT',
        gender: 'FEMALE',
        major: 'Kỹ thuật phần mềm (SE)',
      },
      isAuthenticated: true,
      login: (token, user) => set({ token, user, isAuthenticated: true }),
      logout: () => set({ token: null, user: null, isAuthenticated: false }),
      loginWithRole: (role, customName) =>
        set({
          token: 'mock-jwt-token-campusstay',
          isAuthenticated: true,
          user: {
            id: `usr-${role.toLowerCase()}-001`,
            studentId: role === 'STUDENT' ? 'SE171234' : undefined,
            name: customName || roleNames[role],
            email: `${role.toLowerCase()}@fpt.edu.vn`,
            role,
            gender: 'MALE',
            major: role === 'STUDENT' ? 'Kỹ thuật phần mềm (SE)' : undefined,
          },
        }),
      switchRole: (role) =>
        set((state) => {
          if (!state.user) {
            return {
              token: 'mock-jwt-token-campusstay',
              isAuthenticated: true,
              user: {
                id: `usr-${role.toLowerCase()}-001`,
                studentId: role === 'STUDENT' ? 'SE171234' : undefined,
                name: roleNames[role],
                email: `${role.toLowerCase()}@fpt.edu.vn`,
                role,
                gender: 'MALE',
                major: role === 'STUDENT' ? 'Kỹ thuật phần mềm (SE)' : undefined,
              },
            };
          }
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
