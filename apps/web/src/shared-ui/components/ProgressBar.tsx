import clsx from 'clsx';

interface ProgressBarProps {
  value: number;
  max?: number;
  tone?: 'orange' | 'navy' | 'emerald' | 'amber' | 'rose' | 'blue';
  size?: 'sm' | 'md';
  className?: string;
}

const BAR = {
  orange: 'bg-[#F26F21]',
  navy: 'bg-[#1A365D]',
  emerald: 'bg-emerald-500',
  amber: 'bg-amber-500',
  rose: 'bg-rose-500',
  blue: 'bg-blue-500',
};

export function ProgressBar({ value, max = 100, tone = 'orange', size = 'sm', className }: ProgressBarProps) {
  const pct = Math.max(0, Math.min(100, (value / max) * 100));
  return (
    <div className={clsx('w-full bg-slate-100 rounded-full overflow-hidden', size === 'sm' ? 'h-1.5' : 'h-2.5', className)}>
      <div className={clsx('h-full rounded-full transition-all', BAR[tone])} style={{ width: `${pct}%` }} />
    </div>
  );
}
