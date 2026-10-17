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

export function Tabs<T extends string>({ items, value, onChange, className }: TabsProps<T>) {
  return (
    <div className={clsx('flex items-center gap-1 bg-slate-100 p-1 rounded-xl w-fit max-w-full overflow-x-auto', className)}>
      {items.map((item) => (
        <button
          key={item.value}
          type="button"
          onClick={() => onChange(item.value)}
          className={clsx(
            'px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition flex items-center gap-1.5',
            value === item.value ? 'bg-white text-[#F26F21] shadow-xs' : 'text-slate-600 hover:text-slate-900'
          )}
        >
          {item.label}
          {item.count !== undefined && (
            <span
              className={clsx(
                'px-1.5 py-0.5 rounded-full text-[10px] leading-none',
                value === item.value ? 'bg-orange-100 text-[#F26F21]' : 'bg-slate-200 text-slate-600'
              )}
            >
              {item.count}
            </span>
          )}
        </button>
      ))}
    </div>
  );
}
