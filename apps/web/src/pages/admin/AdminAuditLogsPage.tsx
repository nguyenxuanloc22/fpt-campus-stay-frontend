import { useState } from 'react';
import { Search, Download, Shield, LogIn, Pencil, Trash2, CheckCircle2, AlertTriangle, Eye, Filter, Globe } from 'lucide-react';
import clsx from 'clsx';
import { PageHeader, StatCard, SectionCard, AppButton, Avatar, Modal, useToast, t } from '@shared-ui';

type Severity = 'INFO' | 'WARNING' | 'CRITICAL';
type Action = 'LOGIN' | 'CREATE' | 'UPDATE' | 'DELETE' | 'APPROVE' | 'EXPORT';

interface Log {
  id: string;
  time: string;
  actor: string;
  role: string;
  action: Action;
  resource: string;
  detail: string;
  ip: string;
  severity: Severity;
  before?: string;
  after?: string;
}

const LOGS: Log[] = [
  { id: 'AL-552190', time: '17/10/2026 09:41:12', actor: t('System'), role: 'SYSTEM', action: 'UPDATE', resource: 'invoice/INV-2026-1009', detail: t('Automatic reconciliation from the VietQR webhook'), ip: '103.21.x.x', severity: 'INFO', before: '{ "status": "UNPAID" }', after: '{ "status": "PAID", "paidAt": "2026-10-17T09:41:12" }' },
  { id: 'AL-552188', time: '17/10/2026 08:12:40', actor: 'ThS. Hoàng Nam', role: 'MANAGER', action: 'APPROVE', resource: 'batch/BR-FA26-04', detail: t('Approved 186 room allocations'), ip: '10.10.2.14', severity: 'INFO' },
  { id: 'AL-552181', time: '17/10/2026 08:01:05', actor: t('System Administrator'), role: 'ADMIN', action: 'LOGIN', resource: 'auth/session', detail: t('Signed in successfully (SSO + OTP)'), ip: '10.10.1.2', severity: 'INFO' },
  { id: 'AL-552176', time: '17/10/2026 07:52:33', actor: 'baotgai180990@fpt.edu.vn', role: 'STUDENT', action: 'LOGIN', resource: 'auth/session', detail: t('5 failed sign-ins — account temporarily locked'), ip: '113.161.x.x', severity: 'WARNING' },
  { id: 'AL-552160', time: '16/10/2026 17:20:11', actor: t('System Administrator'), role: 'ADMIN', action: 'UPDATE', resource: 'pricing/utility.electric', detail: t('Updated electricity unit price'), ip: '10.10.1.2', severity: 'WARNING', before: '{ "price": 2800 }', after: '{ "price": 3000 }' },
  { id: 'AL-552143', time: '16/10/2026 15:05:47', actor: 'Trần Văn Cường', role: 'STAFF', action: 'UPDATE', resource: 'room/B105', detail: t('Changed room status to LOCKED'), ip: '10.10.3.21', severity: 'INFO', before: '{ "status": "AVAILABLE" }', after: '{ "status": "LOCKED" }' },
  { id: 'AL-552120', time: '16/10/2026 11:30:02', actor: 'Phạm Thị Lan', role: 'MANAGER', action: 'EXPORT', resource: 'report/finance', detail: t('Exported September financial report (Excel)'), ip: '10.10.4.8', severity: 'INFO' },
  { id: 'AL-552098', time: '15/10/2026 22:47:19', actor: t('System Administrator'), role: 'ADMIN', action: 'DELETE', resource: 'user/vietdq@fpt.edu.vn', detail: t('Deactivated the account of a departed employee'), ip: '10.10.1.2', severity: 'CRITICAL' },
  { id: 'AL-552077', time: '15/10/2026 14:10:55', actor: t('System Administrator'), role: 'ADMIN', action: 'CREATE', resource: 'user/khoalm@fpt.edu.vn', detail: t('Created a new staff account, role STAFF'), ip: '10.10.1.2', severity: 'INFO' },
  { id: 'AL-552051', time: '15/10/2026 03:00:01', actor: 'Allocation Engine', role: 'SYSTEM', action: 'CREATE', resource: 'batch/BR-SP27-01', detail: t('Created a trial batch with 298 allocations'), ip: 'internal', severity: 'INFO' },
  { id: 'AL-552010', time: '14/10/2026 19:33:28', actor: 'Unknown', role: '—', action: 'LOGIN', resource: 'auth/admin', detail: t('Unauthorized access to the admin area — blocked by WAF'), ip: '45.142.x.x', severity: 'CRITICAL' },
];

const ACTION_META: Record<Action, { label: string; icon: typeof LogIn; cls: string }> = {
  LOGIN: { label: t('Sign in'), icon: LogIn, cls: 'bg-surface-sunken text-ink-muted' },
  CREATE: { label: t('Create'), icon: CheckCircle2, cls: 'bg-emerald-50 text-emerald-700' },
  UPDATE: { label: t('Update'), icon: Pencil, cls: 'bg-blue-50 text-blue-700' },
  DELETE: { label: t('Delete / disable'), icon: Trash2, cls: 'bg-rose-50 text-rose-700' },
  APPROVE: { label: t('Approve'), icon: Shield, cls: 'bg-purple-50 text-purple-700' },
  EXPORT: { label: t('Export'), icon: Download, cls: 'bg-amber-50 text-amber-700' },
};

const SEVERITY_META: Record<Severity, string> = {
  INFO: 'bg-surface-sunken text-ink-muted',
  WARNING: 'bg-amber-50 text-amber-700',
  CRITICAL: 'bg-rose-50 text-rose-700',
};

export function AdminAuditLogsPage() {
  const { show, toastNode } = useToast();
  const [query, setQuery] = useState('');
  const [action, setAction] = useState<'ALL' | Action>('ALL');
  const [severity, setSeverity] = useState<'ALL' | Severity>('ALL');
  const [role, setRole] = useState('ALL');
  const [detail, setDetail] = useState<Log | null>(null);

  const filtered = LOGS.filter(
    (l) =>
      (action === 'ALL' || l.action === action) &&
      (severity === 'ALL' || l.severity === severity) &&
      (role === 'ALL' || l.role === role) &&
      (!query || `${l.id} ${l.actor} ${l.resource} ${l.detail} ${l.ip}`.toLowerCase().includes(query.toLowerCase()))
  );

  return (
    <div className="space-y-6">
      <PageHeader
        title={t('Change log')}
        description={t('Records every data change and system access — kept for 5 years, cannot be edited')}
        actions={<AppButton size="sm" variant="outline" leftIcon={<Download className="w-4 h-4" />} onClick={() => show(t('Exported {0} audit records (CSV, digitally signed)', { 0: filtered.length }))}>{t('Export log')}</AppButton>}
      />

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard label={t('Events (24h)')} value="12.408" icon={Shield} tone="navy" />
        <StatCard label={t('Data changes')} value="1.932" icon={Pencil} tone="blue" />
        <StatCard label={t('Warning')} value={LOGS.filter((l) => l.severity === 'WARNING').length} icon={AlertTriangle} tone="amber" />
        <StatCard label={t('Critical')} value={LOGS.filter((l) => l.severity === 'CRITICAL').length} icon={Globe} tone="rose" hint={t('1 unauthorized access blocked')} />
      </div>

      <SectionCard noPadding>
        <div className="p-4 border-b border-line flex flex-col lg:flex-row gap-2">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-ink-subtle absolute left-3 top-1/2 -translate-y-1/2" />
            <input value={query} onChange={(e) => setQuery(e.target.value)} placeholder={t('Search by actor, resource, IP...')} className="w-full pl-9 pr-3 py-2 text-xs rounded-lg border border-line" />
          </div>
          <div className="flex flex-wrap gap-2 items-center">
            <Filter className="w-4 h-4 text-ink-subtle" />
            <select value={action} onChange={(e) => setAction(e.target.value as 'ALL' | Action)} className="px-3 py-2 text-xs rounded-lg border border-line bg-surface">
              <option value="ALL">{t('All actions')}</option>
              {(Object.keys(ACTION_META) as Action[]).map((a) => <option key={a} value={a}>{ACTION_META[a].label}</option>)}
            </select>
            <select value={severity} onChange={(e) => setSeverity(e.target.value as 'ALL' | Severity)} className="px-3 py-2 text-xs rounded-lg border border-line bg-surface">
              <option value="ALL">{t('All severities')}</option>
              <option value="INFO">{t('Info')}</option>
              <option value="WARNING">{t('Warning')}</option>
              <option value="CRITICAL">{t('Critical')}</option>
            </select>
            <select value={role} onChange={(e) => setRole(e.target.value)} className="px-3 py-2 text-xs rounded-lg border border-line bg-surface">
              <option value="ALL">{t('All roles')}</option>
              <option value="ADMIN">Admin</option>
              <option value="MANAGER">Manager</option>
              <option value="STAFF">Staff</option>
              <option value="STUDENT">Student</option>
              <option value="SYSTEM">{t('System')}</option>
            </select>
            <input type="date" defaultValue="2026-10-17" className="px-3 py-2 text-xs rounded-lg border border-line" />
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-xs">
            <thead className="bg-surface-muted text-ink-muted">
              <tr>
                <th className="text-left px-4 py-3 font-semibold">{t('Time')}</th>
                <th className="text-left px-4 py-3 font-semibold">{t('Actor')}</th>
                <th className="text-left px-4 py-3 font-semibold">{t('Action')}</th>
                <th className="text-left px-4 py-3 font-semibold">{t('Resource')}</th>
                <th className="text-left px-4 py-3 font-semibold">{t('Description')}</th>
                <th className="text-left px-4 py-3 font-semibold">IP</th>
                <th className="text-left px-4 py-3 font-semibold">{t('Severity')}</th>
                <th className="px-4 py-3" />
              </tr>
            </thead>
            <tbody className="divide-y divide-line">
              {filtered.map((l) => {
                const m = ACTION_META[l.action];
                return (
                  <tr key={l.id} className={clsx('hover:bg-surface-muted', l.severity === 'CRITICAL' && 'bg-rose-50/30')}>
                    <td className="px-4 py-3 text-ink-muted whitespace-nowrap font-mono text-label">{l.time}</td>
                    <td className="px-4 py-3"><div className="flex items-center gap-2"><Avatar name={l.actor} size="xs" /><div><div className="font-semibold text-ink">{l.actor}</div><div className="text-label text-ink-subtle">{l.role}</div></div></div></td>
                    <td className="px-4 py-3"><span className={clsx('inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-label font-semibold', m.cls)}><m.icon className="w-3 h-3" />{m.label}</span></td>
                    <td className="px-4 py-3"><code className="text-label px-1.5 py-0.5 rounded bg-surface-sunken">{l.resource}</code></td>
                    <td className="px-4 py-3 text-ink-muted max-w-64 truncate">{l.detail}</td>
                    <td className="px-4 py-3 font-mono text-label text-ink-muted">{l.ip}</td>
                    <td className="px-4 py-3"><span className={clsx('px-2 py-0.5 rounded-full text-label font-bold', SEVERITY_META[l.severity])}>{l.severity}</span></td>
                    <td className="px-4 py-3 text-right"><button type="button" onClick={() => setDetail(l)} className="p-1.5 rounded-md hover:bg-surface-sunken" aria-label={t('View details')}><Eye className="w-4 h-4 text-ink-muted" /></button></td>
                  </tr>
                );
              })}
              {filtered.length === 0 && <tr><td colSpan={8} className="py-10 text-center text-ink-subtle">{t('No matching records')}</td></tr>}
            </tbody>
          </table>
        </div>
        <div className="px-4 py-3 border-t text-label text-ink-muted">{t('Showing')} {filtered.length} {t('/ 12.408 records in the last 24 hours')}</div>
      </SectionCard>

      <Modal open={!!detail} onClose={() => setDetail(null)} size="lg" title={detail ? t('Record {0}', { 0: detail.id }) : ''} subtitle={detail?.time}>
        {detail && (
          <div className="space-y-4 text-xs">
            <div className="grid grid-cols-2 gap-2">
              {[
                [t('Actor'), `${detail.actor} (${detail.role})`],
                [t('Action'), ACTION_META[detail.action].label],
                [t('Resource'), detail.resource],
                [t('IP address'), detail.ip],
                [t('Severity'), detail.severity],
                ['User-Agent', 'Mozilla/5.0 (Windows NT 10.0) Chrome/130'],
              ].map(([k, v]) => (
                <div key={k} className="p-2.5 rounded-lg bg-surface-muted"><div className="text-ink-subtle">{k}</div><div className="font-semibold text-ink break-all">{v}</div></div>
              ))}
            </div>
            <p className="p-3 rounded-lg border border-line text-ink">{detail.detail}</p>
            {(detail.before || detail.after) && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div><div className="font-bold text-ink mb-1">{t('Before')}</div><pre className="p-3 rounded-lg bg-rose-50 text-rose-800 font-mono text-label whitespace-pre-wrap">{detail.before ?? '—'}</pre></div>
                <div><div className="font-bold text-ink mb-1">Sau</div><pre className="p-3 rounded-lg bg-emerald-50 text-emerald-800 font-mono text-label whitespace-pre-wrap">{detail.after ?? '—'}</pre></div>
              </div>
            )}
            <div className="text-label text-ink-subtle">{t('Hash: sha256:9f2c…e81a • Records are signed and stored immutably (append-only).')}</div>
          </div>
        )}
      </Modal>

      {toastNode}
    </div>
  );
}
