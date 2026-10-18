import React from 'react';
import { AlertTriangle, RotateCw } from 'lucide-react';
import { AppButton } from './AppButton';
import { EmptyState } from './EmptyState';

interface ErrorStateProps {
  title?: string;
  description?: string;
  onRetry?: () => void;
}

/** Trạng thái lỗi: nói chuyện gì xảy ra và bước tiếp theo. */
export function ErrorState({
  title = 'Không tải được dữ liệu',
  description = 'Kết nối tới máy chủ bị gián đoạn. Kiểm tra mạng rồi thử lại.',
  onRetry,
}: ErrorStateProps) {
  return (
    <div role="alert" className="flex flex-col items-center justify-center p-6 sm:p-8 text-center bg-surface rounded-card border border-line">
      <AlertTriangle className="w-8 h-8 mb-3 text-danger" aria-hidden="true" />
      <h3 className="text-section font-semibold text-ink mb-1">{title}</h3>
      <p className="text-body text-ink-muted max-w-sm">{description}</p>
      {onRetry && (
        <AppButton className="mt-4" variant="outline" leftIcon={<RotateCw className="w-4 h-4" />} onClick={onRetry}>
          Thử lại
        </AppButton>
      )}
    </div>
  );
}

export type DataStatus = 'loading' | 'error' | 'ready';

interface DataStateProps {
  status?: DataStatus;
  isEmpty: boolean;
  /** Khung skeleton cùng kích thước khối thật */
  skeleton: React.ReactNode;
  empty: { title: string; description?: string; actionText?: string; onAction?: () => void };
  onRetry?: () => void;
  children: React.ReactNode;
}

/**
 * Khung 4 trạng thái hiển thị dùng chung: đang tải → lỗi → trống → có dữ liệu.
 * Hiện dữ liệu mẫu là đồng bộ nên `status` mặc định 'ready'; khi nối API chỉ cần truyền trạng thái của query.
 */
export function DataState({ status = 'ready', isEmpty, skeleton, empty, onRetry, children }: DataStateProps) {
  if (status === 'loading') return <>{skeleton}</>;
  if (status === 'error') return <ErrorState onRetry={onRetry} />;
  if (isEmpty) return <EmptyState {...empty} />;
  return <>{children}</>;
}
