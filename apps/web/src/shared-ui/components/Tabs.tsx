import clsx from 'clsx';

export interface TabItem<T extends string> {
  value: T;
  label: string;
  count?: number;
}

interface TabsProps<T extends string> {
  items: TabItem<T>[];
  value: T;
  onChange: (value: T) => void;
  className?: string;
}

/** Thanh tab dạng segmented; cuộn ngang bên trong khung khi hẹp, không làm cuộn cả trang. */
export function Tabs<T extends string>({ items, value, onChange, className }: TabsProps<T>) {
  return (
    <div role="tablist" className={clsx('flex items-center gap-1 bg-surface-sunken p-1 rounded-control w-fit max-w-full overflow-x-auto', className)}>
      {items.map((item) => {
        const active = value === item.value;
        return (
          <button
            key={item.value}
            type="button"
            role="tab"
            aria-selected={active}
            onClick={() => onChange(item.value)}
            className={clsx(
              'px-3 min-h-touch sm:min-h-8 rounded-control text-body whitespace-nowrap transition-colors flex items-center gap-2',
              active ? 'bg-surface text-ink font-semibold shadow-card' : 'text-ink-muted hover:text-ink hover:bg-surface-muted'
            )}
          >
            {item.label}
            {item.count !== undefined && (
              <span className={clsx('px-2 rounded-full text-label', active ? 'bg-surface-sunken text-ink' : 'bg-line text-ink-muted')}>{item.count}</span>
            )}
          </button>
        );
      })}
    </div>
  );
}
