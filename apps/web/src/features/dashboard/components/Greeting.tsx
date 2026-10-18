import React from 'react';
import { t } from '@shared-ui';

interface GreetingProps {
  name?: string;
  /** Chip trạng thái ngắn cạnh lời chào, ví dụ "Đang ở KTX · A204-G1" */
  chip?: React.ReactNode;
  /** Dòng phụ, ví dụ ca làm việc */
  subtitle?: React.ReactNode;
  /** 1–2 nút bên phải (xuống dòng trên mobile) */
  actions?: React.ReactNode;
}

/** Dòng chào một dòng — h1 duy nhất của trang dashboard. */
export function Greeting({ name, chip, subtitle, actions }: GreetingProps) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
      <div className="min-w-0">
        <div className="flex flex-wrap items-center gap-x-3 gap-y-2">
          <h1 className="text-page-title font-bold text-ink">{t('Hello,')} {name ?? t('there')}</h1>
          {chip}
        </div>
        {subtitle && <p className="text-body text-ink-muted mt-1">{subtitle}</p>}
      </div>
      {actions && <div className="flex flex-wrap gap-2 shrink-0">{actions}</div>}
    </div>
  );
}
