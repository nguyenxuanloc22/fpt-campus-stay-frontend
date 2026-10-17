import clsx from 'clsx';

const PALETTE = [
  'bg-orange-100 text-[#F26F21]',
  'bg-blue-100 text-blue-700',
  'bg-emerald-100 text-emerald-700',
  'bg-purple-100 text-purple-700',
  'bg-amber-100 text-amber-700',
  'bg-rose-100 text-rose-700',
  'bg-[#EBF2FB] text-[#1A365D]',
];

interface AvatarProps {
  name: string;
  size?: 'xs' | 'sm' | 'md' | 'lg';
  className?: string;
}

const SIZES = { xs: 'w-6 h-6 text-[10px]', sm: 'w-8 h-8 text-xs', md: 'w-10 h-10 text-sm', lg: 'w-14 h-14 text-lg' };

export function Avatar({ name, size = 'sm', className }: AvatarProps) {
  const parts = name.trim().split(/\s+/);
  const initials = ((parts[parts.length - 2]?.[0] ?? '') + (parts[parts.length - 1]?.[0] ?? '')).toUpperCase();
  const hash = Array.from(name).reduce((acc, ch) => acc + ch.charCodeAt(0), 0);
  return (
    <div
      className={clsx(
        'rounded-full flex items-center justify-center font-bold shrink-0',
        SIZES[size],
        PALETTE[hash % PALETTE.length],
        className
      )}
    >
      {initials || '?'}
    </div>
  );
}
