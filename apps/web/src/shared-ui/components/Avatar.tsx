import clsx from 'clsx';

interface AvatarProps {
  name: string;
  size?: 'xs' | 'sm' | 'md' | 'lg';
  className?: string;
}

const SIZES = { xs: 'w-6 h-6 text-label', sm: 'w-8 h-8 text-xs', md: 'w-10 h-10 text-sm', lg: 'w-14 h-14 text-lg' };

export function Avatar({ name, size = 'sm', className }: AvatarProps) {
  const parts = name.trim().split(/\s+/);
  const initials = ((parts[parts.length - 2]?.[0] ?? '') + (parts[parts.length - 1]?.[0] ?? '')).toUpperCase();
  return (
    <div
      className={clsx(
        'rounded-full flex items-center justify-center font-bold shrink-0',
        SIZES[size],
        'bg-surface-sunken text-ink-muted',
        className
      )}
    >
      {initials || '?'}
    </div>
  );
}
