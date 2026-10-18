import React from 'react';
import clsx from 'clsx';
import { TrendingDown, TrendingUp } from 'lucide-react';

interface StatCardProps {
  label: string;
  value: React.ReactNode;
  icon?: React.ComponentType<{ className?: string }>;
  tone?: 'orange' | 'navy' | 'emerald' | 'amber' | 'rose' | 'blue' | 'purple';
  hint?: React.ReactNode;
  trend?: { value: string; up?: boolean };
}

/**
 * Thẻ số liệu trung tính (CONVENTIONS §8.3): icon trần, chỉ tô màu khi `tone` mang nghĩa trạng thái
 * (emerald = tốt, amber = cần chú ý, rose = vượt ngưỡng). Cam dành cho nút chính và menu đang chọn.
 */
const ICON_TONE = {
  orange: 'text-ink-subtle',
  navy: 'text-ink-subtle',
  blue: 'text-ink-subtle',
  purple: 'text-ink-subtle',
  emerald: 'text-success',
  amber: 'text-pending',
  rose: 'text-danger',
};

export function StatCard({ label, value, icon: Icon, tone = 'orange', hint, trend }: StatCardProps) {
  return (
    <div className="bg-surface p-4 sm:p-6 rounded-card border border-line shadow-card">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <div className="text-label font-medium text-ink-muted">{label}</div>
          <div className="text-2xl font-bold text-ink mt-1 break-words">{value}</div>
        </div>
        {Icon && <Icon className={clsx('w-5 h-5 shrink-0', ICON_TONE[tone])} aria-hidden="true" />}
      </div>
      {(hint || trend) && (
        <div className="flex flex-wrap items-center gap-2 mt-2 text-label">
          {trend && (
            <span className={clsx('inline-flex items-center gap-1 font-semibold', trend.up ? 'text-success' : 'text-danger')}>
              {trend.up ? <TrendingUp className="w-3 h-3" aria-hidden="true" /> : <TrendingDown className="w-3 h-3" aria-hidden="true" />}
              {trend.value}
            </span>
          )}
          {hint && <span className="text-ink-muted">{hint}</span>}
        </div>
      )}
    </div>
  );
}
