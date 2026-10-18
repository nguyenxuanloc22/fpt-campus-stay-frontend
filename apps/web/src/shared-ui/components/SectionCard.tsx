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
    <section className={clsx('bg-white rounded-2xl border border-slate-200/80 shadow-sm', className)}>
      {(title || actions) && (
        <div className="flex flex-wrap items-center justify-between gap-3 px-5 py-4 border-b border-slate-100">
          <div className="min-w-0">
            {title && (
              <h2 className="flex items-center gap-2 text-sm font-extrabold text-slate-900">
                <span className="w-1 h-4 rounded-full bg-gradient-to-b from-[#F26F21] to-amber-400" />
                {title}
              </h2>
            )}
            {subtitle && <p className="text-[11px] text-slate-500 mt-0.5 pl-3">{subtitle}</p>}
          </div>
          {actions && <div className="flex flex-wrap items-center gap-2">{actions}</div>}
        </div>
      )}
      <div className={clsx(!noPadding && 'p-5', bodyClassName)}>{children}</div>
    </section>
  );
}
