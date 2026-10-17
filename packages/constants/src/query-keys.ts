export const QUERY_KEYS = {
  AUTH: {
    ME: ['auth', 'me'] as const,
  },
  SEMESTER: {
    CURRENT: ['semesters', 'current'] as const,
    ALL: ['semesters', 'all'] as const,
  },
  ELIGIBILITY: {
    CHECK: ['eligibility', 'check'] as const,
  },
  ROOMS: {
    LIST: (filter?: Record<string, unknown>) => ['rooms', 'list', filter] as const,
    DETAIL: (id: string) => ['rooms', 'detail', id] as const,
    BUILDINGS: ['rooms', 'buildings'] as const,
  },
  APPLICATIONS: {
    MY: ['applications', 'my'] as const,
    LIST: (status?: string) => ['applications', 'list', status] as const,
    DETAIL: (id: string) => ['applications', 'detail', id] as const,
  },
  ROOMMATES: {
    MY_GROUP: ['roommates', 'my-group'] as const,
  },
  CONTRACTS: {
    MY: ['contracts', 'my'] as const,
    ALL: ['contracts', 'all'] as const,
  },
  INVOICES: {
    LIST: ['invoices', 'list'] as const,
    DETAIL: (id: string) => ['invoices', 'detail', id] as const,
    VIETQR: (id: string) => ['invoices', 'vietqr', id] as const,
  },
  MAINTENANCE: {
    LIST: ['maintenance', 'list'] as const,
  },
  CHECKIN: {
    APPOINTMENTS: ['checkin', 'appointments'] as const,
  },
  REPORTS: {
    OCCUPANCY: ['reports', 'occupancy'] as const,
  },
  AUDIT: {
    LOGS: ['audit', 'logs'] as const,
  },
} as const;
