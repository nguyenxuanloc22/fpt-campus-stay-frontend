export const ROLES = {
  STUDENT: 'STUDENT',
  STAFF: 'STAFF',
  MANAGER: 'MANAGER',
  ADMIN: 'ADMIN',
} as const;

export type Role = (typeof ROLES)[keyof typeof ROLES];

/** Nhãn tiếng Anh; ứng dụng web hiển thị qua t(ROLE_LABELS[role]) để có bản tiếng Việt. */
export const ROLE_LABELS: Record<Role, string> = {
  [ROLES.STUDENT]: 'Student',
  [ROLES.STAFF]: 'Dormitory staff',
  [ROLES.MANAGER]: 'Dormitory manager',
  [ROLES.ADMIN]: 'Administrator',
};
