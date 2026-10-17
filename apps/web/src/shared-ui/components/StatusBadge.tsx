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
