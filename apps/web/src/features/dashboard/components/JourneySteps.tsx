import { Check } from 'lucide-react';
import clsx from 'clsx';

export interface JourneyStep {
  label: string;
  date?: string;
  state: 'done' | 'current' | 'todo';
}

const STATE_TEXT = { done: 'Đã xong', current: 'Bước hiện tại', todo: 'Chưa tới' };

/** Thanh hành trình: dọc trên mobile, ngang từ 640px. Bước hiện tại có aria-current="step". */
export function JourneySteps({ steps }: { steps: JourneyStep[] }) {
  return (
    <ol className="flex flex-col sm:flex-row gap-4 sm:gap-2">
      {steps.map((s, i) => (
        <li key={s.label} aria-current={s.state === 'current' ? 'step' : undefined} className="flex sm:flex-col gap-3 sm:gap-2 flex-1 min-w-0">
          <div className="flex sm:flex-row items-center gap-2">
            <span
              className={clsx(
                'w-8 h-8 rounded-full flex items-center justify-center shrink-0 text-label font-semibold border-2',
                s.state === 'done' && 'bg-success border-success text-white',
                s.state === 'current' && 'bg-surface border-ink text-ink',
                s.state === 'todo' && 'bg-surface border-line-strong text-ink-muted'
              )}
              aria-hidden="true"
            >
              {s.state === 'done' ? <Check className="w-4 h-4" /> : i + 1}
            </span>
            {i < steps.length - 1 && (
              <span className={clsx('hidden sm:block h-0.5 flex-1 rounded-full', s.state === 'done' ? 'bg-success' : 'bg-line')} aria-hidden="true" />
            )}
          </div>
          <div className="min-w-0">
            <div className={clsx('text-body', s.state === 'current' ? 'font-semibold text-ink' : 'text-ink')}>{s.label}</div>
            <div className="text-label text-ink-muted">
              <span className="sr-only">{STATE_TEXT[s.state]}. </span>
              {s.state === 'current' ? <span className="font-semibold text-pending">Đang chờ bạn</span> : s.date}
            </div>
          </div>
        </li>
      ))}
  </ol>
  );
}
