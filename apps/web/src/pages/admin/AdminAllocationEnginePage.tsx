import { useEffect, useState } from 'react';
import { Cpu, Play, Save, Settings2, Users, Building2, Sparkles, Terminal, GripVertical, Clock, History, AlertTriangle } from 'lucide-react';
import clsx from 'clsx';
import { PageHeader, StatCard, SectionCard, AppButton, ProgressBar, DonutChart, StatusBadge, useToast, CHART_COLORS, t } from '@shared-ui';

/**
 * Configure Assignment Rules & Priorities + Monitor Assignment Engine (Admin) — docs/BUSINESS_FLOWS.md F2.
 * Engine là actor System: tự chạy theo lịch kỳ học (Finalize Roommate Matching → Execute Room Assignment Algorithm
 * → Detect Assignment Conflicts → Open Round 2 & Backfill). Admin chỉ cấu hình, chạy thử và giám sát.
 */

const STRATEGIES = [
  { id: 'DATE_FIRST', name: t('Submission date first'), desc: t('Applications with earlier deposits are placed first into their chosen room type.') },
  { id: 'GROUP_FIRST', name: t('Roommates first'), desc: t('Confirmed pairs/groups are placed first so they are not split.') },
  { id: 'BALANCED', name: t('Balanced (recommended)'), desc: t('Optimizes the total score using the weights below, keeps groups and balances floors.') },
];

const CONSTRAINTS = [
  { id: 'gender', label: t('Correct gender zone'), hard: true, enabled: true },
  { id: 'type', label: t('Room type matches the paid deposit'), hard: true, enabled: true },
  { id: 'capacity', label: t('No over-capacity / no double-booked beds'), hard: true, enabled: true },
  { id: 'pair', label: t('Do not split confirmed roommate pairs'), hard: false, enabled: true },
  { id: 'keep', label: t('Keep current room for existing residents'), hard: false, enabled: true },
  { id: 'cohort', label: t('Group students of the same cohort / major'), hard: false, enabled: true },
];

/** Tiêu chí ưu tiên theo Phiếu đăng ký §3.2.c */
const WEIGHTS = [
  ['date', t('Application / deposit date')],
  ['preference', t('Room type preference')],
  ['roommate', t('Roommate request')],
  ['program', t('Major / year of study')],
] as const;

const LOG_LINES = [
  t('[03:00:00] Engine v2.3 started — BALANCED strategy'),
  t('[03:00:02] Loaded 1.284 paid applications, 412 free beds'),
  t('[03:00:09] Finalize Roommate Matching — 44 confirmed pairs/groups, 37 more matched by criteria'),
  t('[03:00:18] Kept current rooms for 121 existing residents'),
  t('[03:01:31] Execute Room Assignment Algorithm — individual placement by weight'),
  t('[03:02:05] Detect Assignment Conflicts — 6 warnings (2 double-booked beds, 1 split pair, 2 wrong zone, 1 over capacity)'),
  t('[03:02:10] 18 applications have no suitable bed → waiting for round 2'),
  t('[03:02:14] Done: proposal BR-SP27-02 (342 allocations) → waiting for staff review'),
];

export const RUNS = [
  { id: 'BR-SP27-02', when: '25/11/2026 03:00', type: t('Round 1'), total: 342, conflicts: 6, status: 'PENDING_APPROVAL' },
  { id: 'BR-SP27-01', when: '24/11/2026 15:12', type: t('Trial run'), total: 298, conflicts: 14, status: 'COMPLETED' },
  { id: 'BR-FA26-04', when: '20/08/2026 03:00', type: t('Round 2'), total: 186, conflicts: 2, status: 'APPROVED' },
  { id: 'BR-FA26-03', when: '12/08/2026 03:00', type: t('Round 1'), total: 1012, conflicts: 9, status: 'APPROVED' },
];

export function AdminAllocationEnginePage() {
  const { show, toastNode } = useToast();
  const [strategy, setStrategy] = useState('BALANCED');
  const [constraints, setConstraints] = useState(CONSTRAINTS);
  const [weights, setWeights] = useState<Record<(typeof WEIGHTS)[number][0], number>>({ date: 40, preference: 30, roommate: 20, program: 10 });
  const [running, setRunning] = useState(false);
  const [progress, setProgress] = useState(0);
  const [logs, setLogs] = useState<string[]>(LOG_LINES);

  useEffect(() => {
    if (!running) return;
    if (progress >= 100) {
      setRunning(false);
      show(t('Trial run finished — no official proposal was created'));
      return;
    }
    const timer = window.setTimeout(() => {
      const next = Math.min(100, progress + 12.5);
      setLogs(LOG_LINES.slice(0, Math.round(next / 12.5)));
      setProgress(next);
    }, 500);
    return () => window.clearTimeout(timer);
  }, [running, progress, show]);

  const start = () => {
    setLogs([]);
    setProgress(0);
    setRunning(true);
  };

  const totalWeight = Object.values(weights).reduce((s, v) => s + v, 0);

  return (
    <div className="space-y-6">
      <PageHeader
        title={t('Allocation engine')}
        description={t('Configure rules and priority weights, run trials and monitor automatic runs')}
        badge={<span className="text-label font-bold px-2 py-0.5 rounded-full bg-surface-sunken text-ink">v2.3</span>}
        actions={
          <>
            <AppButton size="sm" variant="outline" isLoading={running} leftIcon={<Play className="w-4 h-4" />} onClick={start}>{t('Trial run')}</AppButton>
            <AppButton size="sm" disabled={totalWeight !== 100} leftIcon={<Save className="w-4 h-4" />} onClick={() => show(t('Configuration saved — applies to the next run'))}>{t('Save configuration')}</AppButton>
          </>
        }
      />

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard label={t('Paid applications')} value="1.284" icon={Users} tone="navy" />
        <StatCard label={t('Available beds')} value="412" icon={Building2} tone="emerald" hint={t('after keeping current rooms')} />
        <StatCard label={t('Conflicts in the latest run')} value="6" icon={AlertTriangle} tone="rose" hint={t('Staff resolved 6/6')} />
        <StatCard label={t('Next scheduled run')} value="02/12 03:00" icon={Clock} tone="blue" hint={t('Round 2 & fill vacancies')} />
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        <div className="xl:col-span-2 space-y-6">
          <SectionCard title={<span className="flex items-center gap-2"><Cpu className="w-4 h-4" /> {t('Allocation strategy')}</span>}>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              {STRATEGIES.map((s) => (
                <label key={s.id} className={clsx('p-4 rounded-xl border cursor-pointer', strategy === s.id ? 'border-brand bg-orange-50/50 ring-2 ring-orange-100' : 'border-line')}>
                  <div className="flex items-center gap-2 mb-1">
                    <input type="radio" checked={strategy === s.id} onChange={() => setStrategy(s.id)} className="accent-brand-ink" />
                    <span className="text-xs font-bold text-ink">{s.name}</span>
                  </div>
                  <p className="text-label text-ink-muted leading-relaxed">{s.desc}</p>
                </label>
              ))}
            </div>
          </SectionCard>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <SectionCard title={<span className="flex items-center gap-2"><Settings2 className="w-4 h-4" /> {t('Constraints')}</span>} noPadding>
              <ul className="divide-y divide-line">
                {constraints.map((c) => (
                  <li key={c.id} className="px-4 py-2.5 flex items-center gap-2 text-xs">
                    <GripVertical className="w-3.5 h-3.5 text-ink-subtle" />
                    <span className="flex-1 text-ink">{c.label}</span>
                    <span className={clsx('text-label font-bold px-1.5 py-0.5 rounded', c.hard ? 'bg-rose-50 text-rose-600' : 'bg-surface-sunken text-ink-muted')}>{c.hard ? t('Hard') : t('Soft')}</span>
                    <input type="checkbox" disabled={c.hard} checked={c.enabled} onChange={(e) => setConstraints(constraints.map((x) => (x.id === c.id ? { ...x, enabled: e.target.checked } : x)))} className="accent-brand-ink" />
                  </li>
                ))}
              </ul>
            </SectionCard>

            <SectionCard title={<span className="flex items-center gap-2"><Sparkles className="w-4 h-4" /> {t('Priority weights (%)')}</span>}>
              <div className="space-y-4 text-xs">
                {WEIGHTS.map(([k, l]) => (
                  <div key={k}>
                    <div className="flex justify-between mb-1"><span className="text-ink-muted">{l}</span><span className="font-bold">{weights[k]}</span></div>
                    <input type="range" min={0} max={100} step={5} value={weights[k]} onChange={(e) => setWeights({ ...weights, [k]: Number(e.target.value) })} className="w-full accent-brand-ink" />
                  </div>
                ))}
                <div className={clsx('pt-2 border-t font-semibold', totalWeight === 100 ? 'text-emerald-600' : 'text-rose-600')}>
                  {t('Total:')} {totalWeight}% {totalWeight !== 100 && t('— must equal 100% to save')}
                </div>
              </div>
            </SectionCard>
          </div>

          <SectionCard title={<span className="flex items-center gap-2"><History className="w-4 h-4" /> {t('Run history')}</span>} noPadding>
            <table className="w-full text-xs">
              <thead className="bg-surface-muted text-ink-muted">
                <tr><th className="text-left px-5 py-2.5 font-semibold">{t('Proposal')}</th><th className="text-left px-5 py-2.5 font-semibold">{t('Time')}</th><th className="text-left px-5 py-2.5 font-semibold">{t('Type')}</th><th className="text-right px-5 py-2.5 font-semibold">{t('Allocations')}</th><th className="text-right px-5 py-2.5 font-semibold">{t('Conflicts')}</th><th className="text-left px-5 py-2.5 font-semibold">{t('Status')}</th></tr>
              </thead>
              <tbody className="divide-y divide-line">
                {RUNS.map((r) => (
                  <tr key={r.id}>
                    <td className="px-5 py-2.5 font-bold text-ink">{r.id}</td>
                    <td className="px-5 py-2.5 text-ink-muted">{r.when}</td>
                    <td className="px-5 py-2.5">{r.type}</td>
                    <td className="px-5 py-2.5 text-right">{r.total.toLocaleString('vi-VN')}</td>
                    <td className={clsx('px-5 py-2.5 text-right font-semibold', r.conflicts ? 'text-amber-600' : 'text-ink-muted')}>{r.conflicts}</td>
                    <td className="px-5 py-2.5"><StatusBadge status={r.status} customLabel={r.type === t('Trial run') ? t('Trial run') : undefined} /></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </SectionCard>


          <SectionCard
            title={<span className="flex items-center gap-2"><Terminal className="w-4 h-4" /> {t('Execution log')}</span>}
            actions={running ? <StatusBadge status="RUNNING" /> : <StatusBadge status="SUCCESS" customLabel={t('Latest run succeeded')} />}
          >
            {(running || progress > 0) && (
              <div className="mb-3">
                <div className="flex justify-between text-label text-ink-muted mb-1"><span>{t('Progress')}</span><span>{progress}%</span></div>
                <ProgressBar value={progress} tone="orange" size="md" />
              </div>
            )}
            <div className="bg-ink text-emerald-300 rounded-xl p-4 font-mono text-label leading-relaxed h-56 overflow-y-auto">
              {logs.map((l) => <div key={l}>{l}</div>)}
              {running && <div className="animate-pulse">▋</div>}
            </div>
          </SectionCard>
        </div>

        <div className="space-y-6">
          <SectionCard title={t('Latest run results')} subtitle="BR-SP27-02 • 17/10/2026 03:00">
            <DonutChart
              size={130}
              centerValue="342"
              centerLabel={t('allocations')}
              segments={[
                { label: t('1st choice match'), value: 243, color: CHART_COLORS.green },
                { label: t('2nd–3rd choice match'), value: 68, color: CHART_COLORS.blue },
                { label: t('Outside preferences'), value: 25, color: CHART_COLORS.amber },
                { label: t('Warning'), value: 6, color: CHART_COLORS.red },
              ]}
            />
          </SectionCard>
          <SectionCard title={t('Strategy comparison (trial run)')}>
            <table className="w-full text-xs">
              <thead className="text-ink-muted border-b"><tr><th className="text-left py-2 font-semibold">{t('Strategy')}</th><th className="text-right py-2 font-semibold">{t('Preference match')}</th><th className="text-right py-2 font-semibold">{t('Groups kept')}</th></tr></thead>
              <tbody className="divide-y divide-line">
                <tr><td className="py-2">{t('Submission date first')}</td><td className="py-2 text-right">88.2%</td><td className="py-2 text-right">72%</td></tr>
                <tr><td className="py-2">{t('Roommates first')}</td><td className="py-2 text-right">84.6%</td><td className="py-2 text-right">98%</td></tr>
                <tr className="font-bold text-ink"><td className="py-2">{t('Balance')}</td><td className="py-2 text-right">90.9%</td><td className="py-2 text-right">93%</td></tr>
              </tbody>
            </table>
          </SectionCard>
        </div>
      </div>

      {toastNode}
    </div>
  );
}
