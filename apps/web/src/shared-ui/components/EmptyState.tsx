import { t } from '../i18n/t';
import React from 'react';
import { Inbox } from 'lucide-react';
import { AppButton } from './AppButton';

interface EmptyStateProps {
  title?: string;
  description?: string;
  actionText?: string;
  onAction?: () => void;
  icon?: React.ReactNode;
}

/** Trạng thái trống: nói rõ chưa có gì và gợi ý bước tiếp theo. */
export function EmptyState({
  title = t('No data yet'),
  description = t('There are no records in this section yet.'),
  actionText,
  onAction,
  icon,
}: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center p-6 sm:p-8 text-center bg-surface rounded-card border border-dashed border-line-strong">
      <div className="mb-3 text-ink-subtle" aria-hidden="true">{icon || <Inbox className="w-8 h-8" />}</div>
      <h3 className="text-section font-semibold text-ink mb-1">{title}</h3>
      <p className="text-body text-ink-muted max-w-sm">{description}</p>
      {actionText && onAction && (
        <AppButton className="mt-4" onClick={onAction}>
          {actionText}
        </AppButton>
      )}
    </div>
  );
}
