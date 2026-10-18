import { t } from '../i18n/t';
import clsx from 'clsx';

export type StatusVariant =
  | 'SUBMITTED'
  | 'UNDER_REVIEW'
  | 'APPROVED'
  | 'REJECTED'
  | 'EXCEPTION_PENDING'
  | 'ASSIGNED'
  | 'UNPAID'
  | 'PAID'
  | 'OVERDUE'
  | 'AVAILABLE'
  | 'OCCUPIED'
  | 'MAINTENANCE'
  | 'PENDING'
  | 'IN_PROGRESS'
  | 'RESOLVED';

/** Bộ màu trạng thái cố định: vàng = chờ, xanh dương = đang xử lý, xanh lá = xong, đỏ = quá hạn / bị chặn. */
export type StatusTone = 'pending' | 'info' | 'success' | 'danger' | 'neutral';

export const STATUS_TONE_CLASS: Record<StatusTone, string> = {
  pending: 'bg-pending-soft text-pending',
  info: 'bg-info-soft text-info',
  success: 'bg-success-soft text-success',
  danger: 'bg-danger-soft text-danger',
  neutral: 'bg-surface-sunken text-ink-muted',
};

const STATUS_CONFIGS: Record<string, { label: string; tone: StatusTone }> = {
  SUBMITTED: { label: t('Application submitted'), tone: 'info' },
  UNDER_REVIEW: { label: t('Under review'), tone: 'pending' },
  APPROVED: { label: t('Approved'), tone: 'success' },
  REJECTED: { label: t('Reject'), tone: 'danger' },
  EXCEPTION_PENDING: { label: t('Awaiting exception approval'), tone: 'pending' },
  ASSIGNED: { label: t('Room assigned'), tone: 'info' },
  UNPAID: { label: t('Unpaid'), tone: 'pending' },
  PAID: { label: t('Paid'), tone: 'success' },
  OVERDUE: { label: t('Overdue'), tone: 'danger' },
  AVAILABLE: { label: t('Available'), tone: 'success' },
  OCCUPIED: { label: t('Occupied'), tone: 'neutral' },
  MAINTENANCE: { label: t('Maintenance'), tone: 'danger' },
  PENDING: { label: t('Awaiting intake'), tone: 'pending' },
  IN_PROGRESS: { label: t('Processing'), tone: 'info' },
  RESOLVED: { label: t('Completed'), tone: 'success' },
  DRAFT: { label: t('Draft'), tone: 'neutral' },
  ACTIVE: { label: t('Active'), tone: 'success' },
  INACTIVE: { label: t('Inactive'), tone: 'neutral' },
  LOCKED: { label: t('Locked'), tone: 'danger' },
  RUNNING: { label: t('Running'), tone: 'info' },
  SUCCESS: { label: t('Succeeded'), tone: 'success' },
  FAILED: { label: t('Failed'), tone: 'danger' },
  CANCELLED: { label: t('Cancelled'), tone: 'neutral' },
  SCHEDULED: { label: t('Scheduled'), tone: 'info' },
  COMPLETED: { label: t('Completed'), tone: 'success' },
  EXPIRED: { label: t('Expired'), tone: 'neutral' },
  UPCOMING: { label: t('Upcoming'), tone: 'info' },
  HIGH: { label: t('Urgent'), tone: 'danger' },
  MEDIUM: { label: t('Medium'), tone: 'pending' },
  LOW: { label: t('Low'), tone: 'neutral' },
  PARTIAL: { label: t('Partially paid'), tone: 'info' },
  WARNING: { label: t('Warning'), tone: 'pending' },
  // Trạng thái theo State Diagram / Use Case v2 (docs/BUSINESS_FLOWS.md)
  PENDING_PAYMENT: { label: t('Awaiting deposit'), tone: 'pending' },
  PROCESSING: { label: t('Processing'), tone: 'info' },
  WAITING_NEXT_ROUND: { label: t('Waiting for round 2'), tone: 'pending' },
  REFUNDED: { label: t('Refunded'), tone: 'neutral' },
  FORFEITED: { label: t('Deposit forfeited'), tone: 'danger' },
  RESERVED: { label: t('On hold'), tone: 'pending' },
  CHECKED_IN: { label: t('Checked in'), tone: 'success' },
  CHECKED_OUT: { label: t('Checked out'), tone: 'neutral' },
  NO_SHOW: { label: t('No-show'), tone: 'danger' },
  PENDING_APPROVAL: { label: t('Awaiting manager approval'), tone: 'pending' },
  STUDENT_RESPONSE: { label: t('Awaiting your response'), tone: 'pending' },
  SENT: { label: t('Submitted'), tone: 'neutral' },
  CLOSED: { label: t('Closed'), tone: 'neutral' },
  OPEN: { label: t('Open'), tone: 'success' },
  SIGNED: { label: t('Signed'), tone: 'success' },
};

interface StatusBadgeProps {
  status: string;
  customLabel?: string;
}

export function StatusBadge({ status, customLabel }: StatusBadgeProps) {
  const config: { label: string; tone: StatusTone } = STATUS_CONFIGS[status] ?? { label: customLabel || status, tone: 'neutral' };

  return (
    <span className={clsx('inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-label font-semibold whitespace-nowrap', STATUS_TONE_CLASS[config.tone])}>
      <span className="w-1.5 h-1.5 rounded-full bg-current" aria-hidden="true" />
      {customLabel || config.label}
    </span>
  );
}
