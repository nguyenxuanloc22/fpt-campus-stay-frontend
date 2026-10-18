import React from 'react';
import type { LucideIcon } from 'lucide-react';
import clsx from 'clsx';
import { AppButton, ListSkeleton, DataState, STATUS_TONE_CLASS, type DataStatus, type StatusTone } from '@shared-ui';

export interface ActionItem {
  id: string;
  icon: LucideIcon;
  title: string;
  /** Dòng phụ: số tiền, mã hợp đồng, người gửi… */
  meta?: React.ReactNode;
  /** Chip hạn / mức độ, ví dụ "Còn 6 ngày" */
  badge?: { label: string; tone: StatusTone };
  /** primary: nút chính duy nhất của trang (màu cam) */
  action: { label: string; onClick: () => void; primary?: boolean };
  /** Nút thứ hai (chỉ hàng đợi phê duyệt: Duyệt / Từ chối) */
  secondaryAction?: { label: string; onClick: () => void };
}

interface ActionListProps {
  items: ActionItem[];
  status?: DataStatus;
  empty: { title: string; description?: string };
}

/** Danh sách việc cần làm: mỗi dòng một nút hành động (hàng đợi phê duyệt có thêm nút thứ hai). Dùng chung cho dashboard các vai trò. */
export function ActionList({ items, status, empty }: ActionListProps) {
  return (
    <DataState status={status} isEmpty={items.length === 0} skeleton={<ListSkeleton rows={3} />} empty={empty}>
      <ul className="divide-y divide-line">
        {items.map((item) => (
          <li key={item.id} className="flex flex-col sm:flex-row sm:items-center gap-3 px-4 sm:px-6 py-4">
            <div className="flex items-start gap-3 flex-1 min-w-0">
              <item.icon className="w-5 h-5 mt-0.5 shrink-0 text-ink-muted" aria-hidden="true" />
              <div className="min-w-0">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="text-body font-semibold text-ink">{item.title}</span>
                  {item.badge && (
                    <span className={clsx('px-2 py-0.5 rounded-full text-label font-semibold whitespace-nowrap', STATUS_TONE_CLASS[item.badge.tone])}>
                      {item.badge.label}
                    </span>
                  )}
                </div>
                {item.meta && <div className="text-label text-ink-muted mt-1">{item.meta}</div>}
              </div>
            </div>
            <div className="flex gap-2 shrink-0">
              {item.secondaryAction && (
                <AppButton size="sm" variant="ghost" className="flex-1 sm:flex-none" onClick={item.secondaryAction.onClick}>
                  {item.secondaryAction.label}
                </AppButton>
              )}
              <AppButton size="sm" variant={item.action.primary ? 'primary' : 'outline'} className="flex-1 sm:flex-none" onClick={item.action.onClick}>
                {item.action.label}
              </AppButton>
            </div>
          </li>
        ))}
      </ul>
    </DataState>
  );
}
