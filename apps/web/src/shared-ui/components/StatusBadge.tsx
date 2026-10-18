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
  SUBMITTED: { label: 'Đã nộp đơn', tone: 'info' },
  UNDER_REVIEW: { label: 'Đang thẩm định', tone: 'pending' },
  APPROVED: { label: 'Đã duyệt', tone: 'success' },
  REJECTED: { label: 'Từ chối', tone: 'danger' },
  EXCEPTION_PENDING: { label: 'Chờ duyệt ngoại lệ', tone: 'pending' },
  ASSIGNED: { label: 'Đã xếp phòng', tone: 'info' },
  UNPAID: { label: 'Chưa thanh toán', tone: 'pending' },
  PAID: { label: 'Đã thanh toán', tone: 'success' },
  OVERDUE: { label: 'Quá hạn', tone: 'danger' },
  AVAILABLE: { label: 'Còn trống', tone: 'success' },
  OCCUPIED: { label: 'Đang ở', tone: 'neutral' },
  MAINTENANCE: { label: 'Bảo trì', tone: 'danger' },
  PENDING: { label: 'Chờ tiếp nhận', tone: 'pending' },
  IN_PROGRESS: { label: 'Đang xử lý', tone: 'info' },
  RESOLVED: { label: 'Đã hoàn thành', tone: 'success' },
  DRAFT: { label: 'Bản nháp', tone: 'neutral' },
  ACTIVE: { label: 'Đang hoạt động', tone: 'success' },
  INACTIVE: { label: 'Ngừng hoạt động', tone: 'neutral' },
  LOCKED: { label: 'Đã khóa', tone: 'danger' },
  RUNNING: { label: 'Đang chạy', tone: 'info' },
  SUCCESS: { label: 'Thành công', tone: 'success' },
  FAILED: { label: 'Thất bại', tone: 'danger' },
  CANCELLED: { label: 'Đã hủy', tone: 'neutral' },
  SCHEDULED: { label: 'Đã lên lịch', tone: 'info' },
  COMPLETED: { label: 'Hoàn tất', tone: 'success' },
  EXPIRED: { label: 'Hết hạn', tone: 'neutral' },
  UPCOMING: { label: 'Sắp diễn ra', tone: 'info' },
  HIGH: { label: 'Khẩn cấp', tone: 'danger' },
  MEDIUM: { label: 'Trung bình', tone: 'pending' },
  LOW: { label: 'Thấp', tone: 'neutral' },
  PARTIAL: { label: 'Thanh toán một phần', tone: 'info' },
  WARNING: { label: 'Cảnh báo', tone: 'pending' },
  // Trạng thái theo State Diagram / Use Case v2 (docs/BUSINESS_FLOWS.md)
  PENDING_PAYMENT: { label: 'Chờ đóng cọc', tone: 'pending' },
  PROCESSING: { label: 'Đang xử lý', tone: 'info' },
  WAITING_NEXT_ROUND: { label: 'Chờ vòng 2', tone: 'pending' },
  REFUNDED: { label: 'Đã hoàn tiền', tone: 'neutral' },
  FORFEITED: { label: 'Mất cọc', tone: 'danger' },
  RESERVED: { label: 'Đang giữ chỗ', tone: 'pending' },
  CHECKED_IN: { label: 'Đã nhận phòng', tone: 'success' },
  CHECKED_OUT: { label: 'Đã trả phòng', tone: 'neutral' },
  NO_SHOW: { label: 'Không đến nhận phòng', tone: 'danger' },
  PENDING_APPROVAL: { label: 'Chờ Manager duyệt', tone: 'pending' },
  STUDENT_RESPONSE: { label: 'Chờ bạn phản hồi', tone: 'pending' },
  SENT: { label: 'Đã gửi', tone: 'neutral' },
  CLOSED: { label: 'Đã đóng', tone: 'neutral' },
  OPEN: { label: 'Đang mở', tone: 'success' },
  SIGNED: { label: 'Đã ký', tone: 'success' },
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
