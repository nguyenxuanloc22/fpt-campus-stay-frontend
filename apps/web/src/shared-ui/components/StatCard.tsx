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
 * Tông cam trắng FPTU làm chủ đạo, mỗi chỉ số một sắc nhẹ để dễ phân biệt (CONVENTIONS §8.3).
 * `bar` là vạch màu mảnh trên đầu thẻ.
 */
const TONES = {
  orange: { icon: 'bg-gradient-to-br from-orange-500 to-amber-400 text-white shadow-orange-500/25', bar: 'from-orange-500 to-amber-400' },
  navy: { icon: 'bg-gradient-to-br from-slate-700 to-slate-500 text-white shadow-slate-500/25', bar: 'from-slate-700 to-slate-400' },
  emerald: { icon: 'bg-gradient-to-br from-emerald-500 to-teal-400 text-white shadow-emerald-500/25', bar: 'from-emerald-500 to-teal-400' },
  amber: { icon: 'bg-gradient-to-br from-amber-500 to-yellow-400 text-white shadow-amber-500/25', bar: 'from-amber-500 to-yellow-400' },
  rose: { icon: 'bg-gradient-to-br from-rose-500 to-pink-400 text-white shadow-rose-500/25', bar: 'from-rose-500 to-pink-400' },
  blue: { icon: 'bg-gradient-to-br from-sky-500 to-cyan-400 text-white shadow-sky-500/25', bar: 'from-sky-500 to-cyan-400' },
  purple: { icon: 'bg-gradient-to-br from-violet-500 to-fuchsia-400 text-white shadow-violet-500/25', bar: 'from-violet-500 to-fuchsia-400' },
};

export function StatCard({ label, value, icon: Icon, tone = 'orange', hint, trend }: StatCardProps) {
  return (
    <div className="relative overflow-hidden bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm hover:shadow-md transition">
      <div className={clsx('absolute inset-x-0 top-0 h-1 bg-gradient-to-r', TONES[tone].bar)} />
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <div className="text-[11px] font-semibold text-slate-500 uppercase tracking-wide">{label}</div>
          <div className="text-2xl font-extrabold text-slate-900 mt-1.5 truncate">{value}</div>
        </div>
        {Icon && (
          <div className={clsx('w-11 h-11 rounded-xl flex items-center justify-center shrink-0 shadow-md', TONES[tone].icon)}>
            <Icon className="w-5 h-5" />
          </div>
        )}
      </div>
      {(hint || trend) && (
        <div className="flex items-center gap-2 mt-2 text-[11px]">
          {trend && (
            <span
              className={clsx(
                'inline-flex items-center gap-0.5 font-semibold',
                trend.up ? 'text-emerald-600' : 'text-rose-600'
              )}
            >
              {trend.up ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
              {trend.value}
            </span>
          )}
          {hint && <span className="text-slate-500 truncate">{hint}</span>}
        </div>
      )}
    </div>
  );
}
