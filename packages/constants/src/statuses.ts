export const APPLICATION_STATUS = {
  SUBMITTED: 'SUBMITTED',
  UNDER_REVIEW: 'UNDER_REVIEW',
  APPROVED: 'APPROVED',
  REJECTED: 'REJECTED',
  EXCEPTION_PENDING: 'EXCEPTION_PENDING',
  ASSIGNED: 'ASSIGNED',
} as const;

export type ApplicationStatus =
  (typeof APPLICATION_STATUS)[keyof typeof APPLICATION_STATUS];

export const INVOICE_STATUS = {
  UNPAID: 'UNPAID',
  PAID: 'PAID',
  OVERDUE: 'OVERDUE',
  CANCELLED: 'CANCELLED',
} as const;

export type InvoiceStatus = (typeof INVOICE_STATUS)[keyof typeof INVOICE_STATUS];

export const BED_STATUS = {
  AVAILABLE: 'AVAILABLE',
  OCCUPIED: 'OCCUPIED',
  MAINTENANCE: 'MAINTENANCE',
  RESERVED: 'RESERVED',
} as const;

export type BedStatus = (typeof BED_STATUS)[keyof typeof BED_STATUS];

export const MAINTENANCE_STATUS = {
  PENDING: 'PENDING',
  IN_PROGRESS: 'IN_PROGRESS',
  RESOLVED: 'RESOLVED',
  CANCELLED: 'CANCELLED',
} as const;

export type MaintenanceStatus =
  (typeof MAINTENANCE_STATUS)[keyof typeof MAINTENANCE_STATUS];

export const CONTRACT_STATUS = {
  DRAFT: 'DRAFT',
  SIGNED: 'SIGNED',
  ACTIVE: 'ACTIVE',
  TERMINATED: 'TERMINATED',
} as const;

export type ContractStatus =
  (typeof CONTRACT_STATUS)[keyof typeof CONTRACT_STATUS];
