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

const STATUS_CONFIGS: Record<string, { label: string; className: string }> = {
  SUBMITTED: { label: 'Đã nộp đơn', className: 'bg-blue-50 text-blue-700 border-blue-200' },
  UNDER_REVIEW: { label: 'Đang thẩm định', className: 'bg-amber-50 text-amber-700 border-amber-200' },
  APPROVED: { label: 'Đã duyệt', className: 'bg-emerald-50 text-emerald-700 border-emerald-200' },
  REJECTED: { label: 'Từ chối', className: 'bg-rose-50 text-rose-700 border-rose-200' },
  EXCEPTION_PENDING: { label: 'Chờ duyệt ngoại lệ', className: 'bg-purple-50 text-purple-700 border-purple-200' },
  ASSIGNED: { label: 'Đã xếp phòng', className: 'bg-indigo-50 text-indigo-700 border-indigo-200' },
  UNPAID: { label: 'Chưa thanh toán', className: 'bg-amber-50 text-amber-700 border-amber-200' },
  PAID: { label: 'Đã thanh toán', className: 'bg-emerald-50 text-emerald-700 border-emerald-200' },
  OVERDUE: { label: 'Quá hạn', className: 'bg-rose-50 text-rose-700 border-rose-200' },
  AVAILABLE: { label: 'Còn trống', className: 'bg-emerald-50 text-emerald-700 border-emerald-200' },
  OCCUPIED: { label: 'Đang ở', className: 'bg-slate-100 text-slate-700 border-slate-300' },
  MAINTENANCE: { label: 'Bảo trì', className: 'bg-rose-50 text-rose-700 border-rose-200' },
  PENDING: { label: 'Chờ tiếp nhận', className: 'bg-amber-50 text-amber-700 border-amber-200' },
  IN_PROGRESS: { label: 'Đang xử lý', className: 'bg-blue-50 text-blue-700 border-blue-200' },
  RESOLVED: { label: 'Đã hoàn thành', className: 'bg-emerald-50 text-emerald-700 border-emerald-200' },
  DRAFT: { label: 'Bản nháp', className: 'bg-slate-100 text-slate-600 border-slate-200' },
  ACTIVE: { label: 'Đang hoạt động', className: 'bg-emerald-50 text-emerald-700 border-emerald-200' },
  INACTIVE: { label: 'Ngừng hoạt động', className: 'bg-slate-100 text-slate-600 border-slate-200' },
  LOCKED: { label: 'Đã khóa', className: 'bg-rose-50 text-rose-700 border-rose-200' },
  RUNNING: { label: 'Đang chạy', className: 'bg-blue-50 text-blue-700 border-blue-200' },
  SUCCESS: { label: 'Thành công', className: 'bg-emerald-50 text-emerald-700 border-emerald-200' },
  FAILED: { label: 'Thất bại', className: 'bg-rose-50 text-rose-700 border-rose-200' },
  CANCELLED: { label: 'Đã hủy', className: 'bg-slate-100 text-slate-600 border-slate-200' },
  SCHEDULED: { label: 'Đã lên lịch', className: 'bg-indigo-50 text-indigo-700 border-indigo-200' },
  COMPLETED: { label: 'Hoàn tất', className: 'bg-emerald-50 text-emerald-700 border-emerald-200' },
  EXPIRED: { label: 'Hết hạn', className: 'bg-slate-100 text-slate-600 border-slate-200' },
  UPCOMING: { label: 'Sắp diễn ra', className: 'bg-blue-50 text-blue-700 border-blue-200' },
  HIGH: { label: 'Khẩn cấp', className: 'bg-rose-50 text-rose-700 border-rose-200' },
  MEDIUM: { label: 'Trung bình', className: 'bg-amber-50 text-amber-700 border-amber-200' },
  LOW: { label: 'Thấp', className: 'bg-slate-100 text-slate-600 border-slate-200' },
  PARTIAL: { label: 'Thanh toán một phần', className: 'bg-blue-50 text-blue-700 border-blue-200' },
  WARNING: { label: 'Cảnh báo', className: 'bg-amber-50 text-amber-700 border-amber-200' },
  // Trạng thái theo State Diagram / Use Case v2 (docs/BUSINESS_FLOWS.md)
  PENDING_PAYMENT: { label: 'Chờ đóng cọc', className: 'bg-amber-50 text-amber-700 border-amber-200' },
  PROCESSING: { label: 'Đang xử lý', className: 'bg-blue-50 text-blue-700 border-blue-200' },
  WAITING_NEXT_ROUND: { label: 'Chờ vòng 2', className: 'bg-purple-50 text-purple-700 border-purple-200' },
  REFUNDED: { label: 'Đã hoàn tiền', className: 'bg-slate-100 text-slate-600 border-slate-200' },
  FORFEITED: { label: 'Mất cọc', className: 'bg-rose-50 text-rose-700 border-rose-200' },
  RESERVED: { label: 'Đang giữ chỗ', className: 'bg-amber-50 text-amber-700 border-amber-200' },
  CHECKED_IN: { label: 'Đã nhận phòng', className: 'bg-emerald-50 text-emerald-700 border-emerald-200' },
  CHECKED_OUT: { label: 'Đã trả phòng', className: 'bg-slate-100 text-slate-600 border-slate-200' },
  NO_SHOW: { label: 'Không đến nhận phòng', className: 'bg-rose-50 text-rose-700 border-rose-200' },
  PENDING_APPROVAL: { label: 'Chờ Manager duyệt', className: 'bg-purple-50 text-purple-700 border-purple-200' },
  STUDENT_RESPONSE: { label: 'Chờ bạn phản hồi', className: 'bg-amber-50 text-amber-700 border-amber-200' },
  SENT: { label: 'Đã gửi', className: 'bg-slate-100 text-slate-600 border-slate-200' },
  CLOSED: { label: 'Đã đóng', className: 'bg-slate-100 text-slate-600 border-slate-200' },
  OPEN: { label: 'Đang mở', className: 'bg-emerald-50 text-emerald-700 border-emerald-200' },
  SIGNED: { label: 'Đã ký', className: 'bg-emerald-50 text-emerald-700 border-emerald-200' },
};

interface StatusBadgeProps {
  status: string;
  customLabel?: string;
}

export function StatusBadge({ status, customLabel }: StatusBadgeProps) {
  const config = STATUS_CONFIGS[status] || {
    label: customLabel || status,
    className: 'bg-slate-100 text-slate-700 border-slate-200',
  };

  return (
    <span
      className={clsx(
        'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold border',
        config.className
      )}
    >
      <span className="w-1.5 h-1.5 rounded-full mr-1.5 bg-current opacity-70" />
      {customLabel || config.label}
    </span>
  );
}
