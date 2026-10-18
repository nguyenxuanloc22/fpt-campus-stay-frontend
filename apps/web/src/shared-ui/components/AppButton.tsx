import React from 'react';
import clsx from 'clsx';
import { Loader2 } from 'lucide-react';

export interface AppButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'danger' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  isLoading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

/** Màu theo token; trạng thái hover / pressed / disabled bằng CSS, focus dùng outline toàn cục (index.css). */
const VARIANTS = {
  primary: 'bg-brand-fill text-white hover:bg-brand-fill-hover active:bg-brand-fill-hover',
  secondary: 'bg-ink text-surface hover:bg-ink-hover active:bg-ink-hover',
  outline: 'border border-line-control bg-surface text-ink hover:bg-surface-muted active:bg-surface-sunken',
  danger: 'bg-danger-fill text-white hover:opacity-90 active:opacity-80',
  ghost: 'bg-transparent text-ink-muted hover:bg-surface-sunken hover:text-ink active:bg-line',
};

/** Vùng bấm >= 44px trên mobile, gọn lại từ 640px */
const SIZES = {
  sm: 'text-label px-3 gap-1.5 min-h-touch sm:min-h-8',
  md: 'text-body px-4 gap-2 min-h-touch sm:min-h-10',
  lg: 'text-section px-5 gap-2 min-h-12',
};

export function AppButton({
  children,
  variant = 'primary',
  size = 'md',
  isLoading = false,
  leftIcon,
  rightIcon,
  className,
  disabled,
  ...props
}: AppButtonProps) {
  return (
    <button
      className={clsx(
        'inline-flex items-center justify-center font-semibold rounded-control transition-colors select-none',
        'disabled:opacity-50 disabled:cursor-not-allowed disabled:pointer-events-none',
        VARIANTS[variant],
        SIZES[size],
        className
      )}
      disabled={disabled || isLoading}
      aria-busy={isLoading || undefined}
      {...props}
    >
      {isLoading ? <Loader2 className="w-4 h-4 animate-spin" aria-hidden="true" /> : leftIcon && <span className="inline-flex" aria-hidden="true">{leftIcon}</span>}
      {children}
      {!isLoading && rightIcon && <span className="inline-flex" aria-hidden="true">{rightIcon}</span>}
    </button>
  );
}
