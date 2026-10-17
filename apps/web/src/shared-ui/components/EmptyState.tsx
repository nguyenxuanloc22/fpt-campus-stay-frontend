import React from 'react';
import { Inbox } from 'lucide-react';

interface EmptyStateProps {
  title?: string;
  description?: string;
  actionText?: string;
  onAction?: () => void;
  icon?: React.ReactNode;
}

export function EmptyState({
  title = 'Không có dữ liệu',
  description = 'Hiện tại chưa có bản ghi nào để hiển thị trong mục này.',
  actionText,
  onAction,
  icon,
}: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center p-8 md:p-12 text-center bg-white rounded-xl border border-dashed border-slate-300">
      <div className="w-14 h-14 mb-4 rounded-full bg-slate-100 flex items-center justify-center text-slate-400">
        {icon || <Inbox className="w-7 h-7" />}
      </div>
      <h3 className="text-base font-semibold text-slate-800 mb-1">{title}</h3>
      <p className="text-sm text-slate-500 max-w-sm mb-5">{description}</p>
      {actionText && onAction && (
        <button
          type="button"
          onClick={onAction}
          className="inline-flex items-center px-4 py-2 text-sm font-medium text-white bg-[#F26F21] hover:bg-[#D95A12] rounded-lg transition-colors shadow-sm"
        >
          {actionText}
        </button>
      )}
    </div>
  );
}
