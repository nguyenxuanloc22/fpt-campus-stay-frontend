import { useState } from 'react';
import { Check, X, FileText, ArrowLeftRight, Repeat, ShieldCheck, CheckCircle2, AlertTriangle, MessageSquare, CalendarClock, Users } from 'lucide-react';
import clsx from 'clsx';
import { PageHeader, StatCard, SectionCard, Tabs, StatusBadge, AppButton, Avatar, Modal, useToast, t } from '@shared-ui';

/**
 * Trung tâm phê duyệt (Manager) — Use Case v2:
 * Approve / Reject Dormitory Applications · Approve / Reject Room Change Requests · Approve Periodic Maintenance Schedules.
 */

type TabKey = 'applications' | 'room-changes' | 'schedules';
type Decision = 'PENDING' | 'APPROVED' | 'REJECTED';

interface AppItem {
  code: string;
  name: string;
  studentId: string;
  roomType: string;
  flag: string;
  staffNote: string;
  staff: string;
  docs: string[];
  decision: Decision;
}

interface ChangeItem {
  id: string;
  kind: 'SWAP' | 'MOVE';
  a: { name: string; room: string };
  b?: { name: string; room: string };
  reason: string;
  verified: boolean;
  warnings: string[];
  decision: Decision;
}

interface ScheduleItem {
  id: string;
  title: string;
  scope: string;
  when: string;
  repeat: string;
  impact: string;
  proposer: string;
  decision: Decision;
}

const APPS: AppItem[] = [
  { code: 'APP-SP27-004760', name: 'Trương Gia Bảo', studentId: 'AI180990', roomType: t('2-bed'), flag: t('Outstanding utility bill of 405.000 ₫ (meter reading under dispute)'), staffNote: t('The September meter reading was recorded incorrectly; confirmed with the maintenance team. Recommend approval.'), staff: 'Trần Văn Cường', docs: ['bien-ban-doi-chieu-cong-to.pdf'], decision: 'PENDING' },
  { code: 'APP-SP27-004809', name: 'Đỗ Minh Quân', studentId: 'SE190455', roomType: t('4-bed air-conditioned'), flag: t('Academic record updated for a repeating student — Decision 1123/QĐ-FPTU is valid'), staffNote: t('Repeat-study decision 1123/QĐ-FPTU is valid and the data has been reconciled. Recommend approval.'), staff: 'Nguyễn Thu Hà', docs: ['quyet-dinh-hoc-lai.pdf'], decision: 'PENDING' },
  { code: 'APP-SP27-004771', name: 'Mai Khánh Vy', studentId: 'SS190234', roomType: t('4-bed air-conditioned'), flag: t('Requests a lower floor for health reasons'), staffNote: t('Has a doctor\'s referral. Recommend approval and a note for the engine to prioritize floor 1.'), staff: 'Lê Minh Khoa', docs: ['chi-dinh-bac-si.pdf'], decision: 'PENDING' },
];

const CHANGES: ChangeItem[] = [
  { id: 'RC-2026-0231', kind: 'SWAP', a: { name: 'Nguyễn Thị Mai Anh', room: 'A204-G1' }, b: { name: 'Võ Thị Bảo Ngọc', room: 'A310-G2' }, reason: t('Wants to share a room with a classmate for group study.'), verified: true, warnings: [], decision: 'PENDING' },
  { id: 'RC-2026-0229', kind: 'SWAP', a: { name: 'Đỗ Minh Quân', room: 'B210-G4' }, b: { name: 'Lý Gia Huy', room: 'B105-G1' }, reason: t('Wants to live near a friend from the same hometown.'), verified: true, warnings: [t('Lý Gia Huy has an overdue invoice of 120.000 ₫')], decision: 'PENDING' },
];

const SCHEDULES: ScheduleItem[] = [
  { id: 'PM-2026-11', title: t('Air conditioner maintenance for all of Building C'), scope: t('Building C · 80 rooms'), when: '04/11 – 08/11/2026, 08:00 – 11:00', repeat: t('Every semester'), impact: t('Technicians enter rooms; AC off for 30 minutes per room'), proposer: 'Lê Văn Tài', decision: 'PENDING' },
  { id: 'PM-2026-12', title: t('Periodic water heater inspection, Building B'), scope: t('Building B · 64 rooms'), when: '15/11/2026, 13:30 – 17:00', repeat: t('Quarterly'), impact: t('Hot water off for 1 hour'), proposer: 'Nguyễn Thành Đạt', decision: 'PENDING' },
];

type Pending = { type: TabKey; id: string; title: string; action: 'APPROVED' | 'REJECTED' };

export function ManagerApprovalsPage() {
  const { show, toastNode } = useToast();
  const [tab, setTab] = useState<TabKey>('applications');
  const [apps, setApps] = useState(APPS);
  const [changes, setChanges] = useState(CHANGES);
  const [schedules, setSchedules] = useState(SCHEDULES);
  const [confirm, setConfirm] = useState<Pending | null>(null);
  const [note, setNote] = useState('');

  const pendingCount = (list: { decision: Decision }[]) => list.filter((x) => x.decision === 'PENDING').length;

  const decide = () => {
    if (!confirm) return;
    const set = <T extends { decision: Decision }>(fn: React.Dispatch<React.SetStateAction<T[]>>, key: keyof T) =>
      fn((all) => all.map((x) => (x[key] === confirm.id ? { ...x, decision: confirm.action } : x)));
    if (confirm.type === 'applications') set(setApps, 'code');
    if (confirm.type === 'room-changes') set(setChanges, 'id');
    if (confirm.type === 'schedules') set(setSchedules, 'id');
    show(t('{0} {1} — all parties notified', { 0: confirm.action === 'APPROVED' ? t('Approved') : t('Rejected'), 1: confirm.id }), confirm.action === 'APPROVED' ? 'success' : 'info');
    setConfirm(null);
    setNote('');
  };

  const Actions = ({ type, id, title, decision }: { type: TabKey; id: string; title: string; decision: Decision }) =>
    decision === 'PENDING' ? (
      <div className="flex gap-2 shrink-0">
        <AppButton size="sm" variant="outline" leftIcon={<X className="w-3.5 h-3.5" />} onClick={() => setConfirm({ type, id, title, action: 'REJECTED' })}>{t('Reject')}</AppButton>
        <AppButton size="sm" leftIcon={<Check className="w-3.5 h-3.5" />} onClick={() => setConfirm({ type, id, title, action: 'APPROVED' })}>{t('Approve')}</AppButton>
      </div>
    ) : (
      <StatusBadge status={decision} />
    );

  return (
    <div className="space-y-6">
      <PageHeader title={t('Approval center')} description={t('Decisions within the dormitory manager\'s authority — every decision is recorded in the change log')} />

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard label={t('Applications')} value={pendingCount(apps)} icon={FileText} tone="purple" hint={t('Escalated by staff')} />
        <StatCard label={t('Room changes')} value={pendingCount(changes)} icon={ArrowLeftRight} tone="blue" />
        <StatCard label={t('Periodic maintenance schedules')} value={pendingCount(schedules)} icon={CalendarClock} tone="amber" />
        <StatCard label={t('Average handling time')} value={t('5.2 hours')} icon={ShieldCheck} tone="emerald" hint={t('Target ≤ 24 hours')} />
      </div>

      <Tabs<TabKey>
        items={[
          { value: 'applications', label: t('Applications'), count: pendingCount(apps) },
          { value: 'room-changes', label: t('Room changes'), count: pendingCount(changes) },
          { value: 'schedules', label: t('Periodic maintenance schedules'), count: pendingCount(schedules) },
        ]}
        value={tab}
        onChange={setTab}
      />

      {tab === 'applications' && (
        <div className="space-y-3">
          {apps.map((a) => (
            <SectionCard key={a.code}>
              <div className="flex flex-col lg:flex-row gap-4">
                <Avatar name={a.name} size="md" />
                <div className="flex-1 text-xs space-y-2">
                  <div className="text-sm font-bold text-ink">{a.name} <span className="font-normal text-ink-subtle">{a.studentId} · {a.code}</span></div>
                  <div className="text-ink-muted">{a.roomType}</div>
                  <div className="p-2.5 rounded-lg bg-rose-50 text-rose-800 flex gap-2"><AlertTriangle className="w-4 h-4 shrink-0" />{a.flag}</div>
                  <div className="p-2.5 rounded-lg bg-surface-muted text-ink flex gap-2"><MessageSquare className="w-4 h-4 shrink-0 text-ink-subtle" /><span><strong>{a.staff}:</strong> {a.staffNote}</span></div>
                  <div className="flex flex-wrap gap-2">
                    {a.docs.map((d) => (
                      <button key={d} type="button" onClick={() => show(t('Open {0}', { 0: d }), 'info')} className="inline-flex items-center gap-1 px-2 py-1 rounded-md border border-line text-label text-ink-muted hover:border-brand">
                        <FileText className="w-3 h-3 text-rose-500" />{d}
                      </button>
                    ))}
                  </div>
                </div>
                <Actions type="applications" id={a.code} title={t('application {0} of {1}', { 0: a.code, 1: a.name })} decision={a.decision} />
              </div>
            </SectionCard>
          ))}
        </div>
      )}

      {tab === 'room-changes' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {changes.map((c) => (
            <SectionCard key={c.id}>
              <div className="flex items-center justify-between mb-3">
                <span className={clsx('text-label font-bold px-2 py-0.5 rounded flex items-center gap-1', c.kind === 'SWAP' ? 'bg-purple-100 text-purple-700' : 'bg-blue-100 text-blue-700')}>
                  {c.kind === 'SWAP' ? <ArrowLeftRight className="w-3 h-3" /> : <Repeat className="w-3 h-3" />}{c.kind === 'SWAP' ? t('Swap') : t('Room changes')} · {c.id}
                </span>
                {c.verified && <span className="text-label font-semibold text-emerald-600 flex items-center gap-1"><ShieldCheck className="w-3.5 h-3.5" />{t('Verified by staff')}</span>}
              </div>
              <div className="flex items-center gap-2 text-xs">
                <div className="flex-1 p-2.5 rounded-lg bg-surface-muted"><div className="font-semibold">{c.a.name}</div><div className="text-ink-muted">{c.a.room}</div></div>
                <ArrowLeftRight className="w-4 h-4 text-purple-500 shrink-0" />
                <div className="flex-1 p-2.5 rounded-lg bg-surface-muted"><div className="font-semibold">{c.b?.name}</div><div className="text-ink-muted">{c.b?.room}</div></div>
              </div>
              <p className="text-xs text-ink-muted mt-3">{c.reason}</p>
              <p className="text-label text-emerald-700 mt-2 flex items-center gap-1"><Users className="w-3.5 h-3.5" />{t('Both students agreed to swap')}</p>
              {c.warnings.map((w) => <p key={w} className="text-label text-amber-700 mt-1 flex items-center gap-1"><AlertTriangle className="w-3.5 h-3.5" />{w}</p>)}
              {c.warnings.length === 0 && <p className="text-label text-emerald-700 mt-1 flex items-center gap-1"><CheckCircle2 className="w-3.5 h-3.5" />{t('Eligible for a room change')}</p>}
              <div className="flex justify-end mt-4"><Actions type="room-changes" id={c.id} title={t('request {0}', { 0: c.id })} decision={c.decision} /></div>
            </SectionCard>
          ))}
        </div>
      )}

      {tab === 'schedules' && (
        <SectionCard noPadding>
          <ul className="divide-y divide-line">
            {schedules.map((s) => (
              <li key={s.id} className="px-5 py-4 flex flex-col lg:flex-row lg:items-center gap-4 text-xs">
                <div className="w-11 h-11 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center shrink-0"><CalendarClock className="w-5 h-5" /></div>
                <div className="flex-1">
                  <div className="text-sm font-bold text-ink">{s.title}</div>
                  <div className="text-ink-muted">{s.id} · {s.scope} · {s.repeat}</div>
                  <div className="text-ink-muted mt-1">{s.when}</div>
                  <div className="text-amber-700 mt-0.5">{t('Impact:')} {s.impact}</div>
                  <div className="text-label text-ink-subtle mt-0.5">{t('Proposed by')} {s.proposer}</div>
                </div>
                <Actions type="schedules" id={s.id} title={t('schedule {0}', { 0: s.id })} decision={s.decision} />
              </li>
            ))}
          </ul>
          <div className="px-5 py-3 border-t text-label text-ink-muted">{t('After approval, the system creates maintenance requests on schedule and notifies students in affected rooms.')}</div>
        </SectionCard>
      )}

      <Modal
        open={!!confirm}
        onClose={() => setConfirm(null)}
        title={confirm?.action === 'APPROVED' ? t('Confirm approval') : t('Confirm rejection')}
        subtitle={confirm?.title}
        footer={
          <>
            <AppButton variant="outline" onClick={() => setConfirm(null)}>{t('Cancel')}</AppButton>
            <AppButton variant={confirm?.action === 'APPROVED' ? 'primary' : 'danger'} disabled={confirm?.action === 'REJECTED' && note.length < 10} onClick={decide}>
              {confirm?.action === 'APPROVED' ? t('Approve') : t('Reject')}
            </AppButton>
          </>
        }
      >
        <label className="block text-xs font-semibold text-ink mb-1">
          {t('Comment')} {confirm?.action === 'REJECTED' ? t('(required — sent to the student with the notification)') : t('(optional)')}
        </label>
        <textarea value={note} onChange={(e) => setNote(e.target.value)} rows={3} className="w-full px-3 py-2 text-xs border border-line rounded-lg" />
      </Modal>

      {toastNode}
    </div>
  );
}
