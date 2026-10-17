/**
 * Trạng thái nghiệp vụ — bám sát State Diagram + Use Case v2 trong docs/BUSINESS_FLOWS.md.
 * Không tự ý thêm trạng thái ở Frontend; mọi thay đổi phải đi từ openapi.yaml.
 */

/** Cửa sổ đăng ký của kỳ học (UC System: Open / Close Registration Window) */
export const REGISTRATION_WINDOW_STATUS = {
  SCHEDULED: 'SCHEDULED',
  OPEN: 'OPEN',
  CLOSED: 'CLOSED',
} as const;

export type RegistrationWindowStatus =
  (typeof REGISTRATION_WINDOW_STATUS)[keyof typeof REGISTRATION_WINDOW_STATUS];

/**
 * Đơn đăng ký KTX: Draft → Pending → Processing → Assigned | Waiting vòng 2 → … | Cancelled → Refunded.
 * Use Case v2 bổ sung: PendingPayment → Cancelled khi quá hạn đóng cọc (Cancel Unpaid Registration).
 */
export const APPLICATION_STATUS = {
  DRAFT: 'DRAFT',
  PENDING_PAYMENT: 'PENDING_PAYMENT',
  PROCESSING: 'PROCESSING',
  WAITING_NEXT_ROUND: 'WAITING_NEXT_ROUND',
  ASSIGNED: 'ASSIGNED',
  CANCELLED: 'CANCELLED',
  REFUNDED: 'REFUNDED',
} as const;

export type ApplicationStatus = (typeof APPLICATION_STATUS)[keyof typeof APPLICATION_STATUS];

/** Đề xuất xếp phòng (batch) do engine sinh ra, chờ Manager duyệt */
export const ASSIGNMENT_PROPOSAL_STATUS = {
  PENDING_APPROVAL: 'PENDING_APPROVAL',
  APPROVED: 'APPROVED',
  REJECTED: 'REJECTED',
} as const;

export type AssignmentProposalStatus =
  (typeof ASSIGNMENT_PROPOSAL_STATUS)[keyof typeof ASSIGNMENT_PROPOSAL_STATUS];

/**
 * Phân bổ giường của một sinh viên.
 * NO_SHOW: không check-in trong khung giờ → hủy phân bổ & mất cọc (UC System: Cancel No-show & Forfeit Deposit).
 */
export const ASSIGNMENT_STATUS = {
  ASSIGNED: 'ASSIGNED',
  CHECKED_IN: 'CHECKED_IN',
  CHECKED_OUT: 'CHECKED_OUT',
  NO_SHOW: 'NO_SHOW',
} as const;

export type AssignmentStatus = (typeof ASSIGNMENT_STATUS)[keyof typeof ASSIGNMENT_STATUS];

/** Đơn đổi phòng: Draft → Pending → Student Response → Processing → Approved → Completed | Rejected */
export const ROOM_CHANGE_STATUS = {
  DRAFT: 'DRAFT',
  PENDING: 'PENDING',
  STUDENT_RESPONSE: 'STUDENT_RESPONSE',
  PROCESSING: 'PROCESSING',
  APPROVED: 'APPROVED',
  COMPLETED: 'COMPLETED',
  REJECTED: 'REJECTED',
} as const;

export type RoomChangeStatus = (typeof ROOM_CHANGE_STATUS)[keyof typeof ROOM_CHANGE_STATUS];

/** Yêu cầu sửa chữa: Sent → Pending → Processing → Approved → Scheduled → In Progress → Resolved → Closed | Cancelled */
export const MAINTENANCE_STATUS = {
  SENT: 'SENT',
  PENDING: 'PENDING',
  PROCESSING: 'PROCESSING',
  APPROVED: 'APPROVED',
  SCHEDULED: 'SCHEDULED',
  IN_PROGRESS: 'IN_PROGRESS',
  RESOLVED: 'RESOLVED',
  CLOSED: 'CLOSED',
  CANCELLED: 'CANCELLED',
} as const;

export type MaintenanceStatus = (typeof MAINTENANCE_STATUS)[keyof typeof MAINTENANCE_STATUS];

/** FORFEITED: tiền cọc bị giữ lại khi sinh viên no-show */
export const INVOICE_STATUS = {
  UNPAID: 'UNPAID',
  PAID: 'PAID',
  OVERDUE: 'OVERDUE',
  CANCELLED: 'CANCELLED',
  REFUNDED: 'REFUNDED',
  FORFEITED: 'FORFEITED',
} as const;

export type InvoiceStatus = (typeof INVOICE_STATUS)[keyof typeof INVOICE_STATUS];

/** Loại hóa đơn: cọc khi đăng ký, phần còn lại khi check-in, điện nước (Flow 6 mở rộng) */
export const INVOICE_TYPE = {
  DEPOSIT: 'DEPOSIT',
  ROOM_FEE: 'ROOM_FEE',
  UTILITY: 'UTILITY',
} as const;

export type InvoiceType = (typeof INVOICE_TYPE)[keyof typeof INVOICE_TYPE];

/** RESERVED: giường đang được giữ chỗ có thời hạn; hết hạn sẽ tự nhả (UC System: Release Expired Room Hold) */
export const BED_STATUS = {
  AVAILABLE: 'AVAILABLE',
  RESERVED: 'RESERVED',
  OCCUPIED: 'OCCUPIED',
  MAINTENANCE: 'MAINTENANCE',
} as const;

export type BedStatus = (typeof BED_STATUS)[keyof typeof BED_STATUS];

export const CONTRACT_STATUS = {
  DRAFT: 'DRAFT',
  SIGNED: 'SIGNED',
  ACTIVE: 'ACTIVE',
  TERMINATED: 'TERMINATED',
} as const;

export type ContractStatus = (typeof CONTRACT_STATUS)[keyof typeof CONTRACT_STATUS];
