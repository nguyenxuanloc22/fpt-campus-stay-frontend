import { useState } from 'react';
import { Plus, Calendar, Pencil, Lock, Unlock, CalendarRange, Flag, Hourglass, Copy } from 'lucide-react';
import clsx from 'clsx';
import { PageHeader, StatCard, StatusBadge, AppButton, Modal, ProgressBar, useToast, t } from '@shared-ui';
import { SemesterTimelineCard, currentWeekOf, daysUntil, formatDate, phaseDates, phaseStatus, useSemesterTimeline } from '@features/semesters';

type SemStatus = 'ACTIVE' | 'UPCOMING' | 'COMPLETED' | 'DRAFT';

interface Semester {
  code: string;
  name: string;
  start: string;
  end: string;
  regOpen: string;
  regClose: string;
  checkin: string;
  status: SemStatus;
  regLocked: boolean;
  applications: number;
  residents: number;
  progress: number;
}

export const SEMESTERS: Semester[] = [
  { code: 'SP27', name: 'Spring 2027', start: '04/01/2027', end: '30/04/2027', regOpen: '14/10/2026', regClose: '15/11/2026', checkin: '02/01/2027 – 05/01/2027', status: 'UPCOMING', regLocked: false, applications: 1284, residents: 0, progress: 0 },
  { code: 'FA26', name: 'Fall 2026', start: '01/09/2026', end: '31/12/2026', regOpen: '01/08/2026', regClose: '25/08/2026', checkin: '28/08/2026 – 31/08/2026', status: 'ACTIVE', regLocked: true, applications: 1356, residents: 1075, progress: 38 },
  { code: 'SU26', name: 'Summer 2026', start: '05/05/2026', end: '25/08/2026', regOpen: '01/04/2026', regClose: '25/04/2026', checkin: '03/05/2026 – 05/05/2026', status: 'COMPLETED', regLocked: true, applications: 712, residents: 658, progress: 100 },
  { code: 'SP26', name: 'Spring 2026', start: '05/01/2026', end: '30/04/2026', regOpen: '15/10/2025', regClose: '20/11/2025', checkin: '03/01/2026 – 05/01/2026', status: 'COMPLETED', regLocked: true, applications: 1198, residents: 1051, progress: 100 },
  { code: 'SU27', name: 'Summer 2027', start: '05/05/2027', end: '25/08/2027', regOpen: '—', regClose: '—', checkin: '—', status: 'DRAFT', regLocked: true, applications: 0, residents: 0, progress: 0 },
];

export function AdminSemestersPage() {
  const { show, toastNode } = useToast();
  const [items, setItems] = useState(SEMESTERS);
  const [editing, setEditing] = useState<Semester | null>(null);
  const [creating, setCreating] = useState(false);

  const toggleLock = (code: string) => {
    setItems((all) => all.map((s) => (s.code === code ? { ...s, regLocked: !s.regLocked } : s)));
    const s = items.find((x) => x.code === code);
    show(s?.regLocked ? t('Registration opened for {0}', { 0: s.name }) : t('Registration locked for {0}', { 0: s?.name }), 'info');
  };

  const active = items.find((s) => s.status === 'ACTIVE');
  const upcoming = items.find((s) => s.status === 'UPCOMING');

  // Số liệu đầu trang lấy từ chu trình 16 tuần
  const { cycleStart, phases } = useSemesterTimeline();
  const week = currentWeekOf(cycleStart);
  const byStart = [...phases].sort((a, b) => a.startWeek - b.startWeek);
  const current = byStart.filter((p) => phaseStatus(cycleStart, p) === 'active');
  const next = byStart.find((p) => phaseStatus(cycleStart, p) === 'upcoming');
  const currentRange = current[0] && phaseDates(cycleStart, current[0]);

  return (
    <div className="space-y-6">
      <PageHeader
        title={t('Semester configuration')}
        description={t('Manage residence semesters, registration windows, check-in and operational milestones')}
        actions={<AppButton size="sm" leftIcon={<Plus className="w-4 h-4" />} onClick={() => setCreating(true)}>{t('Create semester')}</AppButton>}
      />

      <div className="grid grid-cols-2 xl:grid-cols-4 gap-4">
        <StatCard label={t('Current semester')} value={active?.name ?? '—'} icon={Calendar} hint={week ? t('Week {0} of 16', { 0: week }) : t('Outside the cycle')} />
        <StatCard
          label={t('Current phase')}
          value={current.length ? current.map((p) => t(p.title)).join(' · ') : '—'}
          icon={Flag}
          hint={currentRange ? `${formatDate(currentRange.start)} – ${formatDate(currentRange.end)}` : undefined}
        />
        <StatCard
          label={t('Next phase')}
          value={next ? t(next.title) : '—'}
          icon={Hourglass}
          hint={next ? t('Starts in {0} days', { 0: daysUntil(phaseDates(cycleStart, next).start) }) : undefined}
        />
        <StatCard label={t('Registration open')} value={upcoming?.name ?? '—'} icon={CalendarRange} hint={t('{0} applications', { 0: upcoming?.applications.toLocaleString('vi-VN') })} />
      </div>

      <SemesterTimelineCard />

      <h2 className="text-section font-semibold text-ink">{t('Semesters')}</h2>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {items.map((s) => (
          <div key={s.code} className={clsx('bg-surface p-4 sm:p-6 rounded-card border shadow-card', s.status === 'ACTIVE' || s.status === 'UPCOMING' ? 'border-line-strong' : 'border-line')}>
            <div className="flex items-start justify-between gap-3 mb-4">
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-section font-semibold text-ink">{s.name}</h3>
                  <span className="text-label font-bold text-ink-subtle">{s.code}</span>
                </div>
                <div className="text-xs text-ink-muted">{s.start} – {s.end}</div>
              </div>
              <StatusBadge status={s.status} />
            </div>
            <div className="grid grid-cols-2 gap-2 text-xs mb-4">
              <div className="p-2.5 rounded-lg bg-surface-muted"><div className="text-ink-subtle">{t('Registration window')}</div><div className="font-semibold">{s.regOpen} – {s.regClose}</div></div>
              <div className="p-2.5 rounded-lg bg-surface-muted"><div className="text-ink-subtle">Check-in</div><div className="font-semibold">{s.checkin}</div></div>
              <div className="p-2.5 rounded-lg bg-surface-muted"><div className="text-ink-subtle">{t('Applications')}</div><div className="font-semibold">{s.applications.toLocaleString('vi-VN')}</div></div>
              <div className="p-2.5 rounded-lg bg-surface-muted"><div className="text-ink-subtle">{t('Residents')}</div><div className="font-semibold">{s.residents.toLocaleString('vi-VN')}</div></div>
            </div>
            {s.status === 'ACTIVE' && (
              <div className="mb-4">
                <div className="flex justify-between text-label text-ink-muted mb-1"><span>{t('Semester progress')}</span><span>{s.progress}%</span></div>
                <ProgressBar value={s.progress} tone="emerald" />
              </div>
            )}
            <div className="flex flex-wrap gap-2">
              <AppButton size="sm" variant="outline" leftIcon={<Pencil className="w-3.5 h-3.5" />} onClick={() => setEditing(s)} disabled={s.status === 'COMPLETED'}>{t('Edit')}</AppButton>
              {(s.status === 'UPCOMING' || s.status === 'DRAFT') && (
                <AppButton size="sm" variant={s.regLocked ? 'primary' : 'outline'} leftIcon={s.regLocked ? <Unlock className="w-3.5 h-3.5" /> : <Lock className="w-3.5 h-3.5" />} onClick={() => toggleLock(s.code)}>
                  {s.regLocked ? t('Registration opens') : t('Lock registration')}
                </AppButton>
              )}
              <AppButton size="sm" variant="ghost" leftIcon={<Copy className="w-3.5 h-3.5" />} onClick={() => show(t('Duplicated configuration of {0}', { 0: s.name }), 'info')}>{t('Duplicate')}</AppButton>
            </div>
          </div>
        ))}
      </div>

      <Modal
        open={!!editing || creating}
        onClose={() => { setEditing(null); setCreating(false); }}
        size="lg"
        title={creating ? t('Create a new semester') : t('Edit {0}', { 0: editing?.name })}
        footer={
          <>
            <AppButton variant="outline" onClick={() => { setEditing(null); setCreating(false); }}>{t('Cancel')}</AppButton>
            <AppButton onClick={() => { show(creating ? t('Semester created (draft)') : t('Semester settings saved')); setEditing(null); setCreating(false); }}>{t('Save')}</AppButton>
          </>
        }
      >
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
          <div><label className="block text-label font-semibold text-ink mb-1">{t('Semester code')}</label><input defaultValue={editing?.code ?? 'FA27'} className="field" /></div>
          <div><label className="block text-label font-semibold text-ink mb-1">{t('Display name')}</label><input defaultValue={editing?.name ?? 'Fall 2027'} className="field" /></div>
          <div><label className="block text-label font-semibold text-ink mb-1">{t('Residence start date')}</label><input type="date" defaultValue="2027-09-01" className="field" /></div>
          <div><label className="block text-label font-semibold text-ink mb-1">{t('End date')}</label><input type="date" defaultValue="2027-12-31" className="field" /></div>
          <div><label className="block text-label font-semibold text-ink mb-1">{t('Registration opens')}</label><input type="datetime-local" defaultValue="2027-08-01T08:00" className="field" /></div>
          <div><label className="block text-label font-semibold text-ink mb-1">{t('Registration closes')}</label><input type="datetime-local" defaultValue="2027-08-25T23:59" className="field" /></div>
          <div><label className="block text-label font-semibold text-ink mb-1">{t('Hold time before deposit (minutes)')}</label><input type="number" defaultValue={15} className="field" /></div>
          <div><label className="block text-label font-semibold text-ink mb-1">{t('Allocation round 1 date')}</label><input type="datetime-local" defaultValue="2027-08-27T03:00" className="field" /></div>
          <div><label className="block text-label font-semibold text-ink mb-1">{t('Round 2 & vacancy fill date')}</label><input type="datetime-local" defaultValue="2027-09-03T03:00" className="field" /></div>
          <div><label className="block text-label font-semibold text-ink mb-1">{t('Room fee payment due date')}</label><input type="date" defaultValue="2027-08-28" className="field" /></div>
          <div><label className="block text-label font-semibold text-ink mb-1">{t('Check-in window opens')}</label><input type="datetime-local" defaultValue="2027-08-29T08:00" className="field" /></div>
          <div><label className="block text-label font-semibold text-ink mb-1">{t('Check-in window closes (no-shows cancelled after)')}</label><input type="datetime-local" defaultValue="2027-09-01T20:00" className="field" /></div>
          <label className="sm:col-span-2 flex items-center gap-2"><input type="checkbox" defaultChecked className="accent-brand-ink" /> {t('Send registration invitation emails when the window opens')}</label>
          <label className="sm:col-span-2 flex items-center gap-2"><input type="checkbox" defaultChecked className="accent-brand-ink" /> {t('Keep current rooms for existing residents registering for the next term')}</label>
          <p className="sm:col-span-2 text-label text-ink-muted">{t('These milestones drive the system\'s automatic jobs: opening/closing windows, releasing holds, allocation, round 2 and no-show cancellation.')}</p>
        </div>
      </Modal>

      {toastNode}
    </div>
  );
}
