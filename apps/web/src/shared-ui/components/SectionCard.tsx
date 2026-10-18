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

/** Thẻ khối nội dung: nền trắng, viền 1px, bo 12px, tiêu đề khối 16px (h2). */
export function SectionCard({ title, subtitle, actions, children, className, bodyClassName, noPadding }: SectionCardProps) {
  return (
    <section className={clsx('bg-surface rounded-card border border-line shadow-card', className)}>
      {(title || actions) && (
        <div className="flex flex-wrap items-center justify-between gap-3 px-4 sm:px-6 py-4 border-b border-line">
          <div className="min-w-0">
            {title && <h2 className="text-section font-semibold text-ink">{title}</h2>}
            {subtitle && <p className="text-label text-ink-muted mt-1">{subtitle}</p>}
          </div>
          {actions && <div className="flex flex-wrap items-center gap-2">{actions}</div>}
        </div>
      )}
      <div className={clsx(!noPadding && 'p-4 sm:p-6', bodyClassName)}>{children}</div>
    </section>
  );
}
