import { useState } from 'react';
import { Save, Plus, Trash2, ShieldCheck, RotateCcw, FlaskConical, History, Info } from 'lucide-react';
import clsx from 'clsx';
import { PageHeader, SectionCard, AppButton, StatusBadge, useToast, t } from '@shared-ui';

/**
 * Configure Eligibility Rules (Admin) — Phiếu đăng ký §3.2.c: năm học, ngành, khoảng cách, tình trạng học tập.
 * Hệ thống áp dụng khi sinh viên nộp đơn (include Validate Eligibility) và khi gửi email mời đăng ký.
 * Luật ưu tiên xếp phòng nằm ở trang Engine xếp phòng.
 */

interface Rule {
  id: string;
  name: string;
  field: string;
  operator: string;
  value: string;
  blocking: boolean;
  enabled: boolean;
}

const FIELDS = [
  { id: 'sis.enrollmentStatus', label: t('Enrollment status (SIS)') },
  { id: 'sis.yearOfStudy', label: t('Year of study') },
  { id: 'sis.program', label: t('Major / program') },
  { id: 'sis.homeDistanceKm', label: t('Home–campus distance (km)') },
  { id: 'dorm.overdueDebt', label: t('Overdue dormitory debt (₫)') },
  { id: 'dorm.activeApplication', label: t('Already has an active application this term') },
];

const INITIAL: Rule[] = [
  { id: 'r1', name: t('Full-time enrolled'), field: 'sis.enrollmentStatus', operator: '=', value: 'ACTIVE', blocking: true, enabled: true },
  { id: 'r2', name: t('No overdue dormitory debt'), field: 'dorm.overdueDebt', operator: '=', value: '0', blocking: true, enabled: true },
  { id: 'r3', name: t('Only one active application per term'), field: 'dorm.activeApplication', operator: '=', value: 'false', blocking: true, enabled: true },
  { id: 'r4', name: t('Students in years 1 to 4'), field: 'sis.yearOfStudy', operator: '<=', value: '4', blocking: true, enabled: true },
  { id: 'r5', name: t('Priority for homes more than 30 km from campus'), field: 'sis.homeDistanceKm', operator: '>', value: '30', blocking: false, enabled: true },
  { id: 'r6', name: t('Undergraduate programs only'), field: 'sis.program', operator: '!=', value: 'SHORT_COURSE', blocking: true, enabled: false },
];

const VERSIONS = [
  { v: 'v12', by: t('Administrator'), when: '10/10/2026', note: t('Apply the > 30 km distance rule to Spring 2027') },
  { v: 'v11', by: t('Administrator'), when: '25/07/2026', note: t('Added the one-active-application-per-term rule') },
  { v: 'v10', by: t('Administrator'), when: '02/04/2026', note: t('Added the overdue dormitory debt rule') },
];

export function AdminRulesPage() {
  const { show, toastNode } = useToast();
  const [rules, setRules] = useState(INITIAL);
  const [dirty, setDirty] = useState(false);
  const [testId, setTestId] = useState('SE171234');
  const [result, setResult] = useState<null | { ok: boolean; failed: string[]; soft: string[] }>(null);

  const update = (id: string, patch: Partial<Rule>) => {
    setRules((all) => all.map((r) => (r.id === id ? { ...r, ...patch } : r)));
    setDirty(true);
  };

  const runTest = () => {
    const failed = testId.startsWith('AI') ? [t('No overdue dormitory debt')] : [];
    setResult({ ok: failed.length === 0, failed, soft: [t('Priority for homes more than 30 km from campus — met (52 km)')] });
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title={t('Eligibility rules')}
        description={t('Conditions for students to be invited and to apply for the dormitory — data from FPT SIS')}
        badge={<span className="text-label font-bold px-2 py-0.5 rounded-full bg-surface-sunken text-ink">{t('Version v12')}</span>}
        actions={
          <>
            <AppButton size="sm" variant="outline" leftIcon={<RotateCcw className="w-4 h-4" />} disabled={!dirty} onClick={() => { setRules(INITIAL); setDirty(false); }}>{t('Undo')}</AppButton>
            <AppButton size="sm" leftIcon={<Save className="w-4 h-4" />} disabled={!dirty} onClick={() => { setDirty(false); show(t('Rule set v13 published — applies to applications submitted from now on')); }}>{t('Save & publish')}</AppButton>
          </>
        }
      />

      {dirty && <div className="p-3 rounded-xl bg-amber-50 border border-amber-200 text-xs text-amber-900">{t('You have unsaved changes. The new rule set does not apply retroactively to submitted applications.')}</div>}

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        <SectionCard
          className="xl:col-span-2"
          title={<span className="flex items-center gap-2"><ShieldCheck className="w-4 h-4" />{t('Rules')}</span>}
          subtitle={t('If a “blocking” rule fails, the student cannot apply. “Soft” rules are only recorded so the allocation engine can prioritize.')}
          actions={
            <AppButton size="sm" variant="outline" leftIcon={<Plus className="w-3.5 h-3.5" />} onClick={() => { setRules([...rules, { id: `r${Date.now()}`, name: t('New rule'), field: FIELDS[0]!.id, operator: '=', value: '', blocking: false, enabled: true }]); setDirty(true); }}>
              {t('Add rule')}
            </AppButton>
          }
          noPadding
        >
          <ul className="divide-y divide-line">
            {rules.map((r) => (
              <li key={r.id} className={clsx('px-4 py-3 flex flex-col lg:flex-row lg:items-center gap-2', !r.enabled && 'opacity-50')}>
                <input value={r.name} onChange={(e) => update(r.id, { name: e.target.value })} className="flex-1 px-2.5 py-1.5 text-xs font-semibold border border-transparent hover:border-line rounded-lg" />
                <select value={r.field} onChange={(e) => update(r.id, { field: e.target.value })} className="px-2 py-1.5 text-xs border border-line rounded-lg bg-surface">
                  {FIELDS.map((f) => <option key={f.id} value={f.id}>{f.label}</option>)}
                </select>
                <select value={r.operator} onChange={(e) => update(r.id, { operator: e.target.value })} className="px-1.5 py-1.5 text-xs border border-line rounded-lg bg-surface">
                  {['=', '!=', '>=', '<=', '>', '<'].map((o) => <option key={o}>{o}</option>)}
                </select>
                <input value={r.value} onChange={(e) => update(r.id, { value: e.target.value })} className="w-28 px-2 py-1.5 text-xs border border-line rounded-lg" />
                <label className="flex items-center gap-1 text-label font-semibold text-rose-700"><input type="checkbox" checked={r.blocking} onChange={(e) => update(r.id, { blocking: e.target.checked })} className="accent-rose-600" />{t('Blocking')}</label>
                <label className="flex items-center gap-1 text-label font-semibold text-ink-muted"><input type="checkbox" checked={r.enabled} onChange={(e) => update(r.id, { enabled: e.target.checked })} className="accent-brand-ink" />{t('On')}</label>
                <button type="button" onClick={() => { setRules(rules.filter((x) => x.id !== r.id)); setDirty(true); }} className="text-ink-subtle hover:text-rose-600" aria-label={t('Delete rule')}><Trash2 className="w-4 h-4" /></button>
              </li>
            ))}
          </ul>
        </SectionCard>

        <div className="space-y-6">
          <SectionCard title={<span className="flex items-center gap-2"><FlaskConical className="w-4 h-4 text-purple-600" />{t('Test run')}</span>}>
            <p className="text-label text-ink-muted mb-3">{t('Apply the current rule set to one student\'s SIS data.')}</p>
            <div className="flex gap-2">
              <input value={testId} onChange={(e) => setTestId(e.target.value.toUpperCase())} className="flex-1 px-3 py-2 text-xs border border-line rounded-lg" />
              <AppButton size="sm" onClick={runTest}>{t('Run')}</AppButton>
            </div>
            {result && (
              <div className={clsx('mt-3 p-3 rounded-lg text-xs space-y-1', result.ok ? 'bg-emerald-50 text-emerald-800' : 'bg-rose-50 text-rose-800')}>
                <div className="font-bold">{result.ok ? t('✓ Eligible to apply') : t('✗ Not eligible')}</div>
                {result.failed.map((f) => <div key={f}>{t('Failed:')} {f}</div>)}
                {result.soft.map((s) => <div key={s} className="text-ink-muted">{s}</div>)}
              </div>
            )}
          </SectionCard>

          <SectionCard title={<span className="flex items-center gap-2"><History className="w-4 h-4" />{t('Versions')}</span>} noPadding>
            <ul className="divide-y divide-line">
              {VERSIONS.map((v, i) => (
                <li key={v.v} className="px-5 py-3 text-xs">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-ink">{v.v}</span>
                    {i === 0 ? <StatusBadge status="ACTIVE" customLabel={t('Current')} /> : <button type="button" onClick={() => show(t('Restored {0} to draft', { 0: v.v }), 'info')} className="text-label font-semibold text-brand-ink">{t('Restore')}</button>}
                  </div>
                  <div className="text-ink-muted">{v.note}</div>
                  <div className="text-label text-ink-subtle">{v.by} · {v.when}</div>
                </li>
              ))}
            </ul>
          </SectionCard>

          <div className="p-3 rounded-xl bg-blue-50 text-label text-blue-800 flex gap-2">
            <Info className="w-4 h-4 shrink-0" /> {t('Allocation priority weights (submission date, preference, roommates, major/year) are configured on the Allocation engine page.')}
          </div>
        </div>
      </div>

      {toastNode}
    </div>
  );
}
