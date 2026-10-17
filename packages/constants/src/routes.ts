/** Sơ đồ trang theo docs/ARCHITECTURE.md §5. */
export const APP_ROUTES = {
  AUTH: {
    LOGIN: '/login',
    FORBIDDEN: '/403',
    NOT_FOUND: '/404',
  },
  /** Trang dùng chung cho mọi vai trò */
  COMMON: {
    NOTIFICATIONS: '/notifications',
    PROFILE: '/profile',
  },
  STUDENT: {
    ROOT: '/student',
    DASHBOARD: '/student/dashboard',
    REGISTRATION: '/student/registration',
    MY_ROOM: '/student/my-room',
    INVOICES: '/student/invoices',
    REQUESTS: '/student/requests',
    CHECKIN: '/student/checkin',
  },
  STAFF: {
    ROOT: '/staff',
    DASHBOARD: '/staff/dashboard',
    INVENTORY: '/staff/inventory',
    APPLICATIONS: '/staff/applications',
    ASSIGNMENT: '/staff/assignment',
    ROOM_CHANGES: '/staff/room-changes',
    CHECKIN_OUT: '/staff/checkin-out',
    MAINTENANCE: '/staff/maintenance',
    BROADCAST: '/staff/broadcast',
  },
  MANAGER: {
    ROOT: '/manager',
    DASHBOARD: '/manager/dashboard',
    APPROVALS: '/manager/approvals',
    ASSIGNMENT_APPROVAL: '/manager/assignment-approval',
    REPORTS: '/manager/reports',
  },
  ADMIN: {
    ROOT: '/admin',
    DASHBOARD: '/admin/dashboard',
    SEMESTERS: '/admin/semesters',
    RULES: '/admin/rules',
    PRICING: '/admin/pricing',
    ALLOCATION_ENGINE: '/admin/allocation-engine',
    INTEGRATIONS: '/admin/integrations',
    USERS: '/admin/users',
    REPORTS: '/admin/reports',
    AUDIT_LOGS: '/admin/audit-logs',
  },
} as const;
