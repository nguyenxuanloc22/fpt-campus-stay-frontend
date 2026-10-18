import { useId, useState } from 'react';
import { Lock, RotateCcw, Unlock } from 'lucide-react';
import { AppButton, SectionCard, t, useToast } from '@shared-ui';
import { SemesterTimelineChart, TimelineLegend } from './SemesterTimelineChart';
import { TimelinePhaseList } from './TimelinePhaseList';
import { currentWeekOf, useSemesterTimeline } from './timeline';

/** Khối “Chu trình 16 tuần” của trang cấu hình học kỳ: thanh công cụ (ngày bắt đầu, khóa, khôi phục), biểu đồ, danh sách giai đoạn. */
export function SemesterTimelineCard() {
  const { cycleStart, cycleLabel, phases, locked, setCycleStart, toggleLock, reset } = useSemesterTimeline();
  const { show, toastNode } = useToast();
  const [selectedId, setSelectedId] = useState<string | null>(() => phases.find((p) => p.startWeek <= (currentWeekOf(cycleStart) ?? 0) && (currentWeekOf(cycleStart) ?? 0) <= p.endWeek)?.id ?? null);
  const dateId = useId();
  const week = currentWeekOf(cycleStart);

  return (
    <SectionCard
      title={t('16-week dormitory cycle')}
      subtitle={t('{0} · week 1 starts {1}', { 0: cycleLabel, 1: cycleStart.split('-').reverse().join('/') })}
      actions={
        <>
          <AppButton
            size="sm"
            variant="outline"
            leftIcon={locked ? <Unlock className="w-4 h-4" /> : <Lock className="w-4 h-4" />}
            onClick={() => {
              toggleLock();
              show(locked ? t('Timeline unlocked — you can edit the weeks') : t('Timeline locked — dates are fixed'), 'info');
            }}
          >
            {locked ? t('Unlock to edit') : t('Lock dates')}
          </AppButton>
          <AppButton
            size="sm"
            variant="ghost"
            leftIcon={<RotateCcw className="w-4 h-4" />}
            disabled={locked}
            title={locked ? t('Unlock the timeline first') : undefined}
            onClick={() => {
              reset();
              show(t('Timeline reset to the default 16-week plan'), 'info');
            }}
          >
            {t('Reset')}
          </AppButton>
        </>
      }
    >
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-end gap-4 justify-between">
          <div className="w-full sm:w-56">
            <label htmlFor={dateId} className="block text-label font-semibold text-ink mb-1">
              {t('Cycle start date (week 1)')}
            </label>
            <input id={dateId} type="date" value={cycleStart} disabled={locked} onChange={(e) => e.target.value && setCycleStart(e.target.value)} className="field disabled:opacity-60" />
          </div>
          <TimelineLegend />
        </div>

        <SemesterTimelineChart cycleStart={cycleStart} phases={phases} selectedId={selectedId} onSelect={setSelectedId} />

        <div>
          <h3 className="text-body font-semibold text-ink mb-2">
            {t('Phases')}
            {week && <span className="ml-2 font-normal text-ink-muted">· {t('currently week {0} of 16', { 0: week })}</span>}
          </h3>
          <TimelinePhaseList selectedId={selectedId} onSelect={setSelectedId} />
        </div>
      </div>
      {toastNode}
    </SectionCard>
  );
}
