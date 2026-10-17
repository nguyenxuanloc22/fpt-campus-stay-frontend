import React from 'react';
import clsx from 'clsx';

interface SectionCardProps {
  title?: React.ReactNode;
  subtitle?: React.ReactNode;
  actions?: React.ReactNode;
  children: React.ReactNode;
  className?: string;
  bodyClassName?: string;
  noPadding?: boolean;
}

export function SectionCard({ title, subtitle, actions, children, className, bodyClassName, noPadding }: SectionCardProps) {
  return (
    <section className={clsx('bg-white rounded-2xl border border-slate-200/80 shadow-xs', className)}>
      {(title || actions) && (
        <div className="flex flex-wrap items-center justify-between gap-3 px-5 py-4 border-b border-slate-100">
          <div className="min-w-0">
            {title && <h2 className="text-sm font-bold text-[#1A365D]">{title}</h2>}
            {subtitle && <p className="text-[11px] text-slate-500 mt-0.5">{subtitle}</p>}
          </div>
          {actions && <div className="flex flex-wrap items-center gap-2">{actions}</div>}
        </div>
      )}
      <div className={clsx(!noPadding && 'p-5', bodyClassName)}>{children}</div>
    </section>
  );
}
