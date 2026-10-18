import clsx from 'clsx';
import { ProgressBar, STATUS_TONE_CLASS, type StatusTone, t } from '@shared-ui';

export interface CapacityRow {
  name: string;
  /** Ví dụ "Nữ" */
  note?: string;
  used: number;
  total: number;
  /** Dòng phụ, ví dụ "4 giường đang bảo trì" */
  detail?: string;
}

/** Ngưỡng công suất: >= 95% gần đầy (đỏ), >= 85% cao (vàng), còn lại còn chỗ (xanh). */
const level = (pct: number): { label: string; tone: StatusTone; bar: 'rose' | 'amber' | 'emerald' } =>
  pct >= 95 ? { label: t('Nearly full'), tone: 'danger', bar: 'rose' } : pct >= 85 ? { label: 'Cao', tone: 'pending', bar: 'amber' } : { label: t('Available'), tone: 'success', bar: 'emerald' };

/** Công suất / giường trống theo tòa — thanh tiến độ màu theo ngưỡng, luôn kèm chữ. */
export function CapacityList({ rows, showFree = false, className = 'space-y-4' }: { rows: CapacityRow[]; showFree?: boolean; className?: string }) {
  return (
    <ul className={className}>
      {rows.map((r) => {
        const pct = r.total ? (r.used / r.total) * 100 : 0;
        const lv = level(pct);
        return (
          <li key={r.name}>
            <div className="flex flex-wrap items-center justify-between gap-2 mb-1">
              <span className="text-body font-semibold text-ink">
                {r.name}
                {r.note && <span className="font-normal text-ink-muted"> · {r.note}</span>}
              </span>
              <span className="flex items-center gap-2">
                <span className={clsx('px-2 py-0.5 rounded-full text-label font-semibold', STATUS_TONE_CLASS[lv.tone])}>{lv.label}</span>
                <span className="text-body font-semibold text-ink tabular-nums">
                  {showFree ? t('{0} free', { 0: r.total - r.used }) : `${pct.toFixed(1)}%`}
                </span>
              </span>
            </div>
            <ProgressBar value={pct} tone={lv.bar} label={t('{0}: {1}% occupied', { 0: r.name, 1: pct.toFixed(1) })} />
            <div className="text-label text-ink-muted mt-1">
              {r.used}/{r.total} {t('beds in use')}{r.detail && ` · ${r.detail}`}
            </div>
          </li>
        );
      })}
    </ul>
  );
}
