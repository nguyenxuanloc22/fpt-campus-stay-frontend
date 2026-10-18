import { useId } from 'react';
import { ChevronDown, Lock } from 'lucide-react';
import clsx from 'clsx';
import { t } from '@shared-ui';
import { WEEKS, daysUntil, formatDate, phaseDates, phaseStatus, useSemesterTimeline, type TimelinePhase } from './timeline';
import { OWNER_META, STATUS_META, statusClass } from './phaseVisuals';

const WEEK_OPTIONS = Array.from({ length: WEEKS }, (_, i) => i + 1);

function WeekSelect({ label, value, min = 1, onChange, disabled }: { label: string; value: number; min?: number; onChange: (w: number) => void; disabled: boolean }) {
  const id = useId();
  return (
    <div>
      <label htmlFor={id} className="block text-label font-semibold text-ink mb-1">
        {label}
      </label>
      <select id={id} value={value} disabled={disabled} onChange={(e) => onChange(Number(e.target.value))} className="field disabled:opacity-60">
        {WEEK_OPTIONS.filter((w) => w >= min).map((w) => (
          <option key={w} value={w}>
            {t('Week {0}', { 0: w })}
          </option>
        ))}
      </select>
    </div>
  );
}

function PhaseRow({ phase, open, onToggle }: { phase: TimelinePhase; open: boolean; onToggle: () => void }) {
  const { cycleStart, locked, updatePhase } = useSemesterTimeline();
  const status = phaseStatus(cycleStart, phase);
  const owner = OWNER_META[phase.owner];
  const { start, end } = phaseDates(cycleStart, phase);
  const panelId = useId();
  const startsIn = daysUntil(start);

  return (
    <li className={clsx('rounded-card border', open ? 'border-line-strong bg-surface-muted' : 'border-line')}>
      <button type="button" onClick={onToggle} aria-expanded={open} aria-controls={panelId} className="w-full min-h-touch flex items-center gap-3 px-4 py-3 text-left">
        <span className={clsx('w-9 h-9 rounded-full flex items-center justify-center shrink-0 text-surface', owner.bar)} aria-hidden="true">
          <owner.icon className="w-4 h-4" />
        </span>
        <span className="flex-1 min-w-0">
          <span className="block text-body font-semibold text-ink">{t(phase.title)}</span>
          <span className="block text-label text-ink-muted">
            {t('Week {0}–{1}', { 0: phase.startWeek, 1: phase.endWeek })} · {formatDate(start, true)} – {formatDate(end, true)}
          </span>
        </span>
        <span className={clsx('hidden sm:inline-flex px-2 py-0.5 rounded-full text-label font-semibold whitespace-nowrap', statusClass(status))}>{STATUS_META[status].label}</span>
        <ChevronDown className={clsx('w-4 h-4 text-ink-muted shrink-0 transition-transform', open && 'rotate-180')} aria-hidden="true" />
      </button>

      {open && (
        <div id={panelId} className="px-4 pb-4 space-y-4">
          <div className="flex flex-wrap gap-2 text-label">
            <span className={clsx('sm:hidden px-2 py-0.5 rounded-full font-semibold', statusClass(status))}>{STATUS_META[status].label}</span>
            <span className="px-2 py-0.5 rounded-full bg-surface-sunken text-ink-muted font-semibold">{owner.label}</span>
            {status === 'upcoming' && <span className="px-2 py-0.5 rounded-full bg-surface-sunken text-ink-muted font-semibold">{t('Starts in {0} days', { 0: startsIn })}</span>}
          </div>
          <p className="text-body text-ink leading-relaxed">{t(phase.description)}</p>
          <div className="grid grid-cols-2 gap-3 max-w-md">
            <WeekSelect label={t('Start week')} value={phase.startWeek} disabled={locked} onChange={(w) => updatePhase(phase.id, { startWeek: w })} />
            <WeekSelect label={t('End week')} value={phase.endWeek} min={phase.startWeek} disabled={locked} onChange={(w) => updatePhase(phase.id, { endWeek: w })} />
          </div>
          {locked && (
            <p className="flex items-center gap-1.5 text-label text-ink-muted">
              <Lock className="w-3.5 h-3.5" aria-hidden="true" /> {t('Dates are locked. Unlock the timeline to edit.')}
            </p>
          )}
        </div>
      )}
    </li>
  );
}

/** Danh sách giai đoạn: xem chi tiết và chỉnh tuần bắt đầu / kết thúc (khi chưa khóa). */
export function TimelinePhaseList({ selectedId, onSelect }: { selectedId: string | null; onSelect: (id: string | null) => void }) {
  const phases = useSemesterTimeline((s) => s.phases);
  const sorted = [...phases].sort((a, b) => a.startWeek - b.startWeek || a.endWeek - b.endWeek);
  return (
    <ol className="space-y-2">
      {sorted.map((p) => (
        <PhaseRow key={p.id} phase={p} open={p.id === selectedId} onToggle={() => onSelect(p.id === selectedId ? null : p.id)} />
      ))}
    </ol>
  );
}
