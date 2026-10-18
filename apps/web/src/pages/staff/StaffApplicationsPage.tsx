import { useState } from 'react';
import { Search, Flag, CheckCircle2, XCircle, Send, FileText, Download, MessageSquare, ShieldCheck, Users, Clock } from 'lucide-react';
import clsx from 'clsx';
import { PageHeader, StatCard, SectionCard, Tabs, StatusBadge, AppButton, Avatar, Modal, useToast, t } from '@shared-ui';
import type { ApplicationStatus } from '@campusstay/constants';

/**
 * Review Dormitory Applications (Staff) — docs/BUSINESS_FLOWS.md F1.
 * Điều kiện được hệ thống kiểm tra tự động khi nộp; Staff chỉ rà soát đơn bị gắn cờ:
 * xác nhận hợp lệ, hoặc chuyển Manager quyết định (Approve / Reject Dormitory Applications).
 */

type ReviewState = 'FLAGGED' | 'CLEARED' | 'ESCALATED';

interface Application {
  code: string;
  name: string;
  studentId: string;
  gender: 'Male' | 'Female';
  major: string;
  roomType: string;
  submitted: string;
  status: ApplicationStatus;
  roommate: string;
  flag?: string;
  review?: ReviewState;
  checks: { label: string; ok: boolean }[];
  note?: string;
}

const okChecks = [
  { label: t('Full-time student (academic database)'), ok: true },
  { label: t('No outstanding dormitory fees'), ok: true },
  { label: t('Eligible to register this term'), ok: true },
  { label: t('Deposit paid'), ok: true },
];

const APPLICATIONS: Application[] = [
  { code: 'APP-SP27-004809', name: 'Đỗ Minh Quân', studentId: 'SE190455', gender: 'Male', major: t('Software Engineering'), roomType: t('4-bed air-conditioned'), submitted: '16/10/2026 18:02', status: 'PROCESSING', roommate: t('Matched by criteria'), flag: t('Academic record updated for a repeating student — Decision 1123/QĐ-FPTU is valid'), review: 'FLAGGED', checks: [{ label: t('Full-time student (academic database)'), ok: false }, ...okChecks.slice(1)], note: t('Attached repeat-study decision 1123/QĐ-FPTU.') },
  { code: 'APP-SP27-004788', name: 'Phan Thùy Dung', studentId: 'GD190087', gender: 'Female', major: t('Graphic Design'), roomType: t('4-bed with fan'), submitted: '15/10/2026 14:10', status: 'PROCESSING', roommate: t('Invited SE190112'), flag: t('The invited roommate\'s record needs re-verification'), review: 'FLAGGED', checks: okChecks },
  { code: 'APP-SP27-004771', name: 'Mai Khánh Vy', studentId: 'SS190234', gender: 'Female', major: 'Digital Marketing', roomType: t('4-bed air-conditioned'), submitted: '14/10/2026 21:47', status: 'PROCESSING', roommate: t('Assigned by the system'), flag: t('Special request: lower floor needed (medical certificate)'), review: 'FLAGGED', checks: okChecks, note: t('Knee arthritis; advised to limit stair climbing.') },
  { code: 'APP-SP27-004760', name: 'Trương Gia Bảo', studentId: 'AI180990', gender: 'Male', major: t('Artificial Intelligence'), roomType: t('2-bed'), submitted: '14/10/2026 10:12', status: 'PROCESSING', roommate: t('Assigned by the system'), flag: t('Outstanding utility bill of 405.000 ₫ (under dispute)'), review: 'ESCALATED', checks: [okChecks[0]!, { label: t('No outstanding dormitory fees'), ok: false }, okChecks[2]!, okChecks[3]!] },
  { code: 'APP-SP27-004812', name: 'Nguyễn Thị Mai Anh', studentId: 'SE171234', gender: 'Female', major: t('Software Engineering'), roomType: t('4-bed air-conditioned'), submitted: '16/10/2026 20:15', status: 'PROCESSING', roommate: t('Invited SE172211'), checks: okChecks },
  { code: 'APP-SP27-004801', name: 'Lê Thị Hồng Nhung', studentId: 'SE190112', gender: 'Female', major: t('Information Security'), roomType: t('4-bed air-conditioned'), submitted: '16/10/2026 09:44', status: 'ASSIGNED', roommate: t('Matched by criteria'), checks: okChecks },
  { code: 'APP-SP27-004795', name: 'Hồ Tấn Phát', studentId: 'SE170321', gender: 'Male', major: t('Software Engineering'), roomType: t('4-bed air-conditioned'), submitted: '15/10/2026 22:30', status: 'PENDING_PAYMENT', roommate: t('Assigned by the system'), checks: [...okChecks.slice(0, 3), { label: t('Deposit paid'), ok: false }] },
  { code: 'APP-SP27-004702', name: 'Châu Ngọc Trâm', studentId: 'BA190045', gender: 'Female', major: t('Business Administration'), roomType: t('6-bed'), submitted: '13/10/2026 08:20', status: 'CANCELLED', roommate: '—', checks: okChecks, note: t('Cancelled by the system: hold expired before the deposit was paid.') },
];

type TabKey = 'flagged' | 'all' | 'escalated';

export function StaffApplicationsPage() {
  const { show, toastNode } = useToast();
  const [apps, setApps] = useState(APPLICATIONS);
  const [tab, setTab] = useState<TabKey>('flagged');
  const [query, setQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'ALL' | ApplicationStatus>('ALL');
  const [activeCode, setActiveCode] = useState(APPLICATIONS[0]!.code);
  const [escalateOpen, setEscalateOpen] = useState(false);
  const [comment, setComment] = useState('');

  const filtered = apps.filter((a) => {
    if (tab === 'flagged' && a.review !== 'FLAGGED') return false;
    if (tab === 'escalated' && a.review !== 'ESCALATED') return false;
    if (statusFilter !== 'ALL' && a.status !== statusFilter) return false;
    return !query || `${a.code} ${a.name} ${a.studentId}`.toLowerCase().includes(query.toLowerCase());
  });
  const active = apps.find((a) => a.code === activeCode) ?? apps[0]!;
  const count = (r: ReviewState) => apps.filter((a) => a.review === r).length;

  const setReview = (code: string, review: ReviewState, msg: string) => {
    setApps((all) => all.map((a) => (a.code === code ? { ...a, review } : a)));
    show(msg);
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title={t('Application review')}
        description={t('Spring 2027 registration · Eligibility is verified automatically — only flagged applications need staff action')}
        actions={<AppButton size="sm" variant="outline" leftIcon={<Download className="w-4 h-4" />} onClick={() => show(t('Application list exported'))}>{t('Export list')}</AppButton>}
      />

      <div className="grid grid-cols-2 xl:grid-cols-4 gap-4">
        <StatCard label={t('Total applications')} value="1.284" icon={FileText} tone="navy" hint={t('+48 today')} />
        <StatCard label={t('Awaiting deposit')} value="96" icon={Clock} tone="amber" hint={t('Cancelled automatically when overdue')} />
        <StatCard label={t('Flagged')} value={count('FLAGGED')} icon={Flag} tone="rose" hint={t('Needs staff review')} />
        <StatCard label={t('Escalated to manager')} value={count('ESCALATED')} icon={Send} tone="purple" />
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-5 gap-6">
        <div className="xl:col-span-3">
          <SectionCard noPadding>
            <div className="p-4 border-b border-line space-y-3">
              <Tabs<TabKey>
                items={[
                  { value: 'flagged', label: t('Needs review'), count: count('FLAGGED') },
                  { value: 'escalated', label: t('Escalated to manager'), count: count('ESCALATED') },
                  { value: 'all', label: t('All'), count: apps.length },
                ]}
                value={tab}
                onChange={setTab}
              />
              <div className="flex flex-col sm:flex-row gap-2">
                <div className="relative flex-1">
                  <Search className="w-4 h-4 text-ink-subtle absolute left-3 top-1/2 -translate-y-1/2" />
                  <input value={query} onChange={(e) => setQuery(e.target.value)} placeholder={t('Application ID, name, student ID…')} className="w-full pl-9 pr-3 py-2 text-xs rounded-lg border border-line" />
                </div>
                <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value as 'ALL' | ApplicationStatus)} className="px-3 py-2 text-xs rounded-lg border border-line bg-surface">
                  <option value="ALL">{t('All statuses')}</option>
                  <option value="PENDING_PAYMENT">{t('Awaiting deposit')}</option>
                  <option value="PROCESSING">{t('Processing')}</option>
                  <option value="WAITING_NEXT_ROUND">{t('Waiting for round 2')}</option>
                  <option value="ASSIGNED">{t('Room assigned')}</option>
                  <option value="CANCELLED">{t('Cancelled')}</option>
                </select>
              </div>
            </div>
            <ul className="divide-y divide-line max-h-[600px] overflow-y-auto">
              {filtered.map((a) => (
                <li key={a.code}>
                  <button type="button" onClick={() => setActiveCode(a.code)} className={clsx('w-full px-4 py-3 flex items-center gap-3 text-left', active.code === a.code ? 'bg-orange-50/60' : 'hover:bg-surface-muted')}>
                    <Avatar name={a.name} />
                    <div className="flex-1 min-w-0">
                      <div className="text-xs font-bold text-ink truncate">{a.name} <span className="font-normal text-ink-subtle">{a.studentId}</span></div>
                      <div className="text-label text-ink-muted truncate">{a.code} · {a.roomType}</div>
                      {a.flag && <div className="text-label text-rose-600 truncate flex items-center gap-1"><Flag className="w-3 h-3" />{a.flag}</div>}
                    </div>
                    <StatusBadge status={a.status} />
                  </button>
                </li>
              ))}
              {filtered.length === 0 && <li className="py-10 text-center text-xs text-ink-subtle">{t('No applications need attention 🎉')}</li>}
            </ul>
          </SectionCard>
        </div>

        <div className="xl:col-span-2">
          <SectionCard title={active.code} subtitle={t('Submitted at {0}', { 0: active.submitted })} actions={<StatusBadge status={active.status} />}>
            <div className="space-y-5 text-xs">
              <div className="flex items-center gap-3">
                <Avatar name={active.name} size="lg" />
                <div>
                  <div className="text-sm font-bold text-ink">{active.name}</div>
                  <div className="text-ink-muted">{active.studentId} · {t(active.gender)} · {active.major}</div>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div className="p-2.5 rounded-lg bg-surface-muted"><div className="text-ink-subtle">{t('Room type')}</div><div className="font-semibold">{active.roomType}</div></div>
                <div className="p-2.5 rounded-lg bg-surface-muted"><div className="text-ink-subtle flex items-center gap-1"><Users className="w-3 h-3" />{t('Roommates')}</div><div className="font-semibold">{active.roommate}</div></div>
              </div>
              <div>
                <div className="font-bold text-ink mb-2 flex items-center gap-1.5"><ShieldCheck className="w-4 h-4" />{t('Automatic check results')}</div>
                <ul className="space-y-1.5">
                  {active.checks.map((c) => (
                    <li key={c.label} className="flex items-center gap-2">
                      {c.ok ? <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" /> : <XCircle className="w-3.5 h-3.5 text-rose-500" />}
                      <span className={c.ok ? 'text-ink' : 'text-rose-700 font-semibold'}>{c.label}</span>
                    </li>
                  ))}
                </ul>
              </div>
              {active.flag && <div className="p-3 rounded-lg bg-rose-50 text-rose-800 flex gap-2"><Flag className="w-4 h-4 shrink-0" />{active.flag}</div>}
              {active.note && <div className="p-3 rounded-lg bg-amber-50 text-amber-900 flex gap-2"><MessageSquare className="w-4 h-4 shrink-0" />{active.note}</div>}

              {active.review === 'FLAGGED' && (
                <div className="grid grid-cols-2 gap-2 pt-2 border-t">
                  <AppButton size="sm" variant="outline" leftIcon={<CheckCircle2 className="w-3.5 h-3.5" />} onClick={() => setReview(active.code, 'CLEARED', t('{0} confirmed as valid — the application continues to wait for allocation', { 0: active.code }))}>
                    {t('Confirm as valid')}
                  </AppButton>
                  <AppButton size="sm" leftIcon={<Send className="w-3.5 h-3.5" />} onClick={() => setEscalateOpen(true)}>{t('Escalate to manager')}</AppButton>
                </div>
              )}
              {active.review === 'ESCALATED' && <p className="text-label text-purple-700">{t('Waiting for the manager to approve / reject.')}</p>}
              {active.review === 'CLEARED' && <p className="text-label text-emerald-700">{t('Confirmed as valid.')}</p>}
            </div>
          </SectionCard>
        </div>
      </div>

      <Modal
        open={escalateOpen}
        onClose={() => setEscalateOpen(false)}
        title={t('Escalate {0} to the manager', { 0: active.code })}
        subtitle={t('The manager will approve or reject the application')}
        footer={
          <>
            <AppButton variant="outline" onClick={() => setEscalateOpen(false)}>{t('Cancel')}</AppButton>
            <AppButton disabled={comment.length < 10} onClick={() => { setReview(active.code, 'ESCALATED', t('{0} escalated to the manager', { 0: active.code })); setEscalateOpen(false); setComment(''); }}>{t('Send')}</AppButton>
          </>
        }
      >
        <label className="block text-xs font-semibold text-ink mb-1">{t('Staff recommendation (at least 10 characters)')}</label>
        <textarea value={comment} onChange={(e) => setComment(e.target.value)} rows={4} className="w-full px-3 py-2 text-xs border border-line rounded-lg" placeholder={t('E.g. Medical records are valid; recommend approval with floor 1 priority.')} />
      </Modal>

      {toastNode}
    </div>
  );
}
