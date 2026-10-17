export const ROLES = {
  STUDENT: 'STUDENT',
  STAFF: 'STAFF',
  MANAGER: 'MANAGER',
  ADMIN: 'ADMIN',
} as const;

export type Role = (typeof ROLES)[keyof typeof ROLES];

export const ROLE_LABELS: Record<Role, string> = {
  [ROLES.STUDENT]: 'Sinh viên',
  [ROLES.STAFF]: 'Cán bộ KTX',
  [ROLES.MANAGER]: 'Trưởng ban KTX',
  [ROLES.ADMIN]: 'Quản trị viên',
};
