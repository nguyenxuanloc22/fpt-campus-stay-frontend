import clsx from 'clsx';
import { t } from '../i18n/t';

interface ProgressBarProps {
  value: number;
  max?: number;
  tone?: 'orange' | 'navy' | 'emerald' | 'amber' | 'rose' | 'blue';
  size?: 'sm' | 'md';
  className?: string;
  /** Nhãn cho trình đọc màn hình */
  label?: string;
}

const BAR = {
  orange: 'bg-brand-fill',
  navy: 'bg-ink',
  emerald: 'bg-success',
  amber: 'bg-chart-4',
  rose: 'bg-danger',
  blue: 'bg-info',
};

/** Thanh tiến độ — co giãn bằng transform (không animate width) để tránh nhảy bố cục. */
export function ProgressBar({ value, max = 100, tone = 'orange', size = 'sm', className, label }: ProgressBarProps) {
  const pct = Math.max(0, Math.min(100, (value / max) * 100));
  return (
    <div
      role="progressbar"
      aria-label={label ?? t('Progress')}
      aria-valuenow={Math.round(pct)}
      aria-valuemin={0}
      aria-valuemax={100}
      className={clsx('w-full bg-surface-sunken rounded-full overflow-hidden', size === 'sm' ? 'h-1.5' : 'h-2.5', className)}
    >
      <div className={clsx('h-full w-full origin-left rounded-full transition-transform', BAR[tone])} style={{ transform: `scaleX(${pct / 100})` }} />
    </div>
  );
}
