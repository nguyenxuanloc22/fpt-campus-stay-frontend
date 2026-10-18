import clsx from 'clsx';
import { CheckCircle2 } from 'lucide-react';
import { t } from '@shared-ui';
import { WEEKS, currentWeekOf, dayOfCycle, formatDate, phaseDates, phaseStatus, weekStartDate, type TimelinePhase } from './timeline';
import { OWNER_META } from './phaseVisuals';

interface Props {
  cycleStart: string;
  phases: TimelinePhase[];
  selectedId: string | null;
  onSelect: (id: string) => void;
}

const WEEK_LIST = Array.from({ length: WEEKS }, (_, i) => i + 1);
const ROW = 'h-14';

/**
 * Biểu đồ Gantt 16 tuần: mỗi giai đoạn một hàng, thanh màu theo người phụ trách, vạch đỏ “Hôm nay”.
 * Trên màn hẹp, biểu đồ cuộn ngang bên trong khung (không cuộn cả trang).
 */
export function SemesterTimelineChart({ cycleStart, phases, selectedId, onSelect }: Props) {
  const week = currentWeekOf(cycleStart);
  const day = dayOfCycle(cycleStart);
  const todayPct = day >= 0 && day < WEEKS * 7 ? ((day + 0.5) / (WEEKS * 7)) * 100 : null;
  const sorted = [...phases].sort((a, b) => a.startWeek - b.startWeek || a.endWeek - b.endWeek);

  return (
    <div className="overflow-x-auto -mx-4 sm:mx-0" role="region" aria-label={t('16-week timeline chart')} tabIndex={0}>
      <div className="min-w-[46rem] px-4 sm:px-0 grid" style={{ gridTemplateColumns: 'minmax(11rem, 16rem) 1fr' }}>
        {/* Cột tên giai đoạn */}
        <div>
          <div className="h-12 flex items-end pb-2 text-label font-semibold text-ink-muted">{t('Phase')}</div>
          {sorted.map((p) => {
            const { start, end } = phaseDates(cycleStart, p);
            const done = phaseStatus(cycleStart, p) === 'done';
            return (
              <div key={p.id} className={clsx(ROW, 'flex flex-col justify-center pr-3 border-t border-line')}>
                <span className="text-body font-semibold text-ink truncate flex items-center gap-1" title={t(p.title)}>
                  {done && <CheckCircle2 className="w-4 h-4 text-success shrink-0" aria-hidden="true" />}
                  {t(p.title)}
                </span>
                <span className="text-label text-ink-muted">
                  {t('W{0}–{1}', { 0: p.startWeek, 1: p.endWeek })} · {formatDate(start)} – {formatDate(end)}
                </span>
              </div>
            );
          })}
        </div>

        {/* Vùng biểu đồ */}
        <div className="relative pb-8">
          <div className="h-12 grid" style={{ gridTemplateColumns: `repeat(${WEEKS}, minmax(0, 1fr))` }}>
            {WEEK_LIST.map((w) => (
              <div
                key={w}
                className={clsx('flex flex-col items-center justify-end pb-2 border-l border-line', w === week && 'bg-surface-sunken rounded-t-control')}
              >
                <span className={clsx('text-label', w === week ? 'font-bold text-ink' : 'font-semibold text-ink-muted')}>{t('W{0}', { 0: w })}</span>
                <span className="text-label text-ink-muted tabular-nums">{formatDate(weekStartDate(cycleStart, w))}</span>
              </div>
            ))}
          </div>

          {sorted.map((p) => {
            const status = phaseStatus(cycleStart, p);
            const owner = OWNER_META[p.owner];
            const { start, end } = phaseDates(cycleStart, p);
            const selected = p.id === selectedId;
            return (
              <div key={p.id} className={clsx(ROW, 'grid items-center border-t border-line')} style={{ gridTemplateColumns: `repeat(${WEEKS}, minmax(0, 1fr))` }}>
                {/* đường kẻ tuần */}
                {WEEK_LIST.map((w) => (
                  <div key={w} className={clsx('h-full border-l border-line', w === week && 'bg-surface-sunken')} style={{ gridColumn: w, gridRow: 1 }} aria-hidden="true" />
                ))}
                <button
                  type="button"
                  onClick={() => onSelect(p.id)}
                  aria-pressed={selected}
                  aria-label={t('{0}: {1} – {2}', { 0: t(p.title), 1: formatDate(start, true), 2: formatDate(end, true) })}
                  className={clsx(
                    'relative mx-0.5 h-7 rounded-full transition-[opacity,box-shadow] hover:opacity-90',
                    owner.bar,
                    status === 'done' && 'opacity-45',
                    status === 'active' && 'ring-2 ring-offset-2 ring-offset-surface ring-ink',
                    selected && 'outline-2 outline-offset-2 outline-brand-ink'
                  )}
                  style={{ gridColumn: `${p.startWeek} / ${p.endWeek + 1}`, gridRow: 1 }}
                />
              </div>
            );
          })}

          {todayPct !== null && (
            <div className="absolute top-12 bottom-2 pointer-events-none" style={{ left: `${todayPct}%` }} aria-hidden="true">
              <div className="w-0.5 h-full bg-danger-fill -translate-x-1/2" />
              <div className="absolute bottom-0 translate-y-full -translate-x-1/2 px-1.5 rounded-full bg-danger-fill text-white text-label font-semibold whitespace-nowrap">{t('Today')}</div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

/** Chú thích màu theo người phụ trách và trạng thái */
export function TimelineLegend() {
  return (
    <ul className="flex flex-wrap gap-x-4 gap-y-2 text-label text-ink-muted">
      {Object.values(OWNER_META).map((o) => (
        <li key={o.label} className="flex items-center gap-1.5">
          <span className={clsx('w-6 h-2.5 rounded-full', o.bar)} aria-hidden="true" />
          {o.label}
        </li>
      ))}
      <li className="flex items-center gap-1.5">
        <span className="w-6 h-2.5 rounded-full bg-ink-subtle opacity-45" aria-hidden="true" />
        {t('Done')}
      </li>
      <li className="flex items-center gap-1.5">
        <span className="w-6 h-2.5 rounded-full bg-ink-subtle ring-2 ring-offset-1 ring-offset-surface ring-ink" aria-hidden="true" />
        {t('In progress')}
      </li>
      <li className="flex items-center gap-1.5">
        <span className="w-0.5 h-3 bg-danger-fill" aria-hidden="true" />
        {t('Today')}
      </li>
    </ul>
  );
}
