import { t } from '../i18n/t';
import clsx from 'clsx';

interface SkeletonProps {
  className?: string;
}

/** Khối giữ chỗ khi đang tải — đặt cùng kích thước khối thật để không nhảy bố cục. */
export function Skeleton({ className }: SkeletonProps) {
  return <div aria-hidden="true" className={clsx('animate-pulse rounded-control bg-line', className)} />;
}

export function TableSkeleton({ rows = 5 }: { rows?: number }) {
  return (
    <div role="status" aria-label={t('Loading data')} className="w-full space-y-3 bg-surface p-6 rounded-card border border-line">
      <Skeleton className="h-8 w-1/4 mb-4" />
      {Array.from({ length: rows }).map((_, i) => (
        <div key={i} className="flex gap-4">
          <Skeleton className="h-6 w-1/6" />
          <Skeleton className="h-6 w-1/3" />
          <Skeleton className="h-6 w-1/4" />
          <Skeleton className="h-6 w-1/4" />
        </div>
      ))}
    </div>
  );
}

/** Danh sách dạng dòng (icon + 2 dòng chữ + nút) — khớp kích thước các danh sách trên dashboard. */
export function ListSkeleton({ rows = 3 }: { rows?: number }) {
  return (
    <ul role="status" aria-label={t('Loading data')} className="divide-y divide-line">
      {Array.from({ length: rows }).map((_, i) => (
        <li key={i} className="flex items-center gap-3 px-4 sm:px-6 py-4">
          <Skeleton className="w-5 h-5 shrink-0" />
          <div className="flex-1 space-y-2">
            <Skeleton className="h-4 w-2/3" />
            <Skeleton className="h-3 w-1/3" />
          </div>
          <Skeleton className="h-touch sm:h-8 w-24 shrink-0" />
        </li>
      ))}
    </ul>
  );
}
