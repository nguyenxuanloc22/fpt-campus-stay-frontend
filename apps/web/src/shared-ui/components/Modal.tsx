import { t } from '../i18n/t';
import React, { useEffect, useId } from 'react';
import clsx from 'clsx';
import { X } from 'lucide-react';

interface ModalProps {
  open: boolean;
  onClose: () => void;
  title: React.ReactNode;
  subtitle?: React.ReactNode;
  children: React.ReactNode;
  footer?: React.ReactNode;
  size?: 'sm' | 'md' | 'lg' | 'xl';
}

const SIZES = { sm: 'sm:max-w-md', md: 'sm:max-w-lg', lg: 'sm:max-w-2xl', xl: 'sm:max-w-4xl' };

/** Hộp thoại: trên mobile là bottom sheet (nút ở tầm ngón cái), từ 640px là hộp giữa màn hình. */
export function Modal({ open, onClose, title, subtitle, children, footer, size = 'md' }: ModalProps) {
  const titleId = useId();

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center sm:p-4">
      <div className="absolute inset-0 bg-ink/50" onClick={onClose} aria-hidden="true" />
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        className={clsx('relative w-full bg-surface rounded-t-card sm:rounded-card shadow-overlay flex flex-col max-h-[90dvh]', SIZES[size])}
      >
        <div className="flex items-start justify-between gap-4 px-4 sm:px-6 py-4 border-b border-line">
          <div className="min-w-0">
            <h2 id={titleId} className="text-section font-semibold text-ink">{title}</h2>
            {subtitle && <p className="text-label text-ink-muted mt-1">{subtitle}</p>}
          </div>
          <button
            type="button"
            onClick={onClose}
            className="-mr-2 -mt-1 w-touch h-touch shrink-0 inline-flex items-center justify-center rounded-control text-ink-muted hover:bg-surface-sunken hover:text-ink"
            aria-label={t('Close')}
          >
            <X className="w-5 h-5" aria-hidden="true" />
          </button>
        </div>
        <div className="px-4 sm:px-6 py-4 overflow-y-auto">{children}</div>
        {footer && (
          <div className="px-4 sm:px-6 py-4 pb-[max(1rem,env(safe-area-inset-bottom))] border-t border-line flex flex-wrap justify-end gap-2">{footer}</div>
        )}
      </div>
    </div>
  );
}
