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

const TONES = {
  orange: 'bg-orange-50 text-[#F26F21]',
  navy: 'bg-[#EBF2FB] text-[#1A365D]',
  emerald: 'bg-emerald-50 text-emerald-600',
  amber: 'bg-amber-50 text-amber-600',
  rose: 'bg-rose-50 text-rose-600',
  blue: 'bg-blue-50 text-blue-600',
  purple: 'bg-purple-50 text-purple-600',
};

export function StatCard({ label, value, icon: Icon, tone = 'orange', hint, trend }: StatCardProps) {
  return (
    <div className="bg-white p-5 rounded-xl border border-slate-200/80 shadow-xs">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <div className="text-[11px] font-semibold text-slate-500 uppercase tracking-wide">{label}</div>
          <div className="text-2xl font-bold text-slate-800 mt-1.5 truncate">{value}</div>
        </div>
        {Icon && (
          <div className={clsx('w-10 h-10 rounded-xl flex items-center justify-center shrink-0', TONES[tone])}>
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
