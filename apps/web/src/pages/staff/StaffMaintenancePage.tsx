import { useState } from 'react';
import {
  Wrench,
  Clock,
  CheckCircle2,
  AlertTriangle,
  Search,
  MapPin,
  Camera,
  CalendarClock,
  ClipboardCheck,
  Plus,
  User,
  Repeat,
  XCircle,
} from 'lucide-react';
import clsx from 'clsx';
import { PageHeader, StatCard, SectionCard, Tabs, StatusBadge, AppButton, Avatar, Modal, useToast, t } from '@shared-ui';
import type { MaintenanceStatus } from '@campusstay/constants';

/**
 * Bảo trì & kiểm tra phòng (Staff) — docs/BUSINESS_FLOWS.md F5.
 * Handle Maintenance Requests · Schedule Room Inspections · Inspect Room / Equipment · Record Maintenance Follow-ups.
 * Trạng thái theo State Diagram yêu cầu sửa chữa.
 */

type TabKey = 'tickets' | 'inspections' | 'schedules';

interface Ticket {
  id: string;
  title: string;
  room: string;
  source: 'STUDENT' | 'PERIODIC';
  reporter: string;
  created: string;
  status: MaintenanceStatus;
  technician?: string;
  scheduledAt?: string;
  photos: number;
  log: string[];
}

const TECHNICIANS = [t('Lê Văn Tài — Refrigeration'), t('Phạm Hùng — Electrical'), t('Nguyễn Thành Đạt — Plumbing'), t('Vũ Quốc Bảo — Network')];

const TICKETS: Ticket[] = [
  { id: 'TK-10501', title: t('Water leaking from the bathroom ceiling'), room: 'B108', source: 'STUDENT', reporter: 'Đỗ Minh Quân', created: '17/10 06:40', status: 'SENT', photos: 3, log: [t('Submitted by a student')] },
  { id: 'TK-10499', title: t('Power outage on all of floor 3'), room: t('Building D — floor 3'), source: 'STUDENT', reporter: t('Night-shift security'), created: '17/10 05:15', status: 'PENDING', photos: 1, log: [t('Request created'), t('Received')] },
  { id: 'TK-10490', title: t('Air conditioner maintenance, floor 2, Building A'), room: t('Building A — floor 2'), source: 'PERIODIC', reporter: t('System (periodic schedule)'), created: '16/10 00:00', status: 'APPROVED', photos: 0, log: [t('Created automatically from the approved schedule'), t('Approved')] },
  { id: 'TK-10482', title: t('Air conditioner leaking, not cooling'), room: 'A204', source: 'STUDENT', reporter: 'Nguyễn Thị Mai Anh', created: '15/10 21:10', status: 'SCHEDULED', technician: TECHNICIANS[0], scheduledAt: '18/10 09:00', photos: 2, log: [t('Submitted by a student'), t('Category: refrigeration'), t('Approved'), t('Inspection scheduled 18/10 09:00')] },
  { id: 'TK-10478', title: t('Wi-Fi unstable in the evenings'), room: 'C305', source: 'STUDENT', reporter: 'Lê Thị Hồng Nhung', created: '16/10 22:05', status: 'PROCESSING', photos: 0, log: [t('Submitted by a student'), t('Categorizing')] },
  { id: 'TK-10466', title: t('Water heater not heating'), room: 'D402', source: 'STUDENT', reporter: 'Trương Gia Bảo', created: '16/10 07:20', status: 'IN_PROGRESS', technician: TECHNICIANS[2], scheduledAt: '17/10 08:00', photos: 1, log: [t('Submitted by a student'), t('Approved'), t('Technician started the repair')] },
  { id: 'TK-10377', title: t('Bathroom light bulb burned out'), room: 'A204', source: 'STUDENT', reporter: 'Nguyễn Thị Mai Anh', created: '08/10 19:02', status: 'RESOLVED', technician: TECHNICIANS[1], photos: 1, log: [t('LED bulb replaced — waiting for student confirmation')] },
  { id: 'TK-10290', title: t('Loose desk power socket'), room: 'A204', source: 'STUDENT', reporter: 'Nguyễn Thị Mai Anh', created: '01/10 20:15', status: 'CLOSED', technician: TECHNICIANS[1], photos: 0, log: [t('Student confirmed completion')] },
];

const COLUMNS: { label: string; statuses: MaintenanceStatus[]; dot: string }[] = [
  { label: t('New'), statuses: ['SENT', 'PENDING'], dot: 'bg-amber-500' },
  { label: t('Categorize & approve'), statuses: ['PROCESSING', 'APPROVED'], dot: 'bg-purple-500' },
  { label: t('Scheduled / in repair'), statuses: ['SCHEDULED', 'IN_PROGRESS'], dot: 'bg-blue-500' },
  { label: t('Completed'), statuses: ['RESOLVED', 'CLOSED'], dot: 'bg-emerald-500' },
];

const STATUS_LABEL: Record<MaintenanceStatus, string> = {
  SENT: t('Just submitted'), PENDING: t('Received'), PROCESSING: t('Categorizing'), APPROVED: t('Approved'), SCHEDULED: t('Scheduled'),
  IN_PROGRESS: t('In repair'), RESOLVED: t('Awaiting student confirmation'), CLOSED: t('Closed'), CANCELLED: t('Cancelled'),
};

const EQUIPMENT = ['Air conditioning', t('Water heater'), t('Electrical system'), t('Pipes / bathroom'), t('Doors & locks'), t('Lighting')];

const SCHEDULES = [
  { id: 'PM-2026-11', title: t('Air conditioner maintenance for all of Building C'), when: '04/11 – 08/11/2026', status: 'PENDING_APPROVAL' },
  { id: 'PM-2026-10', title: t('Water tank cleaning, Building A'), when: '19/10/2026', status: 'APPROVED' },
  { id: 'PM-2026-09', title: t('Fire safety system inspection, Building B'), when: '04/11/2026', status: 'APPROVED' },
];

export function StaffMaintenancePage() {
  const { show, toastNode } = useToast();
  const [tab, setTab] = useState<TabKey>('tickets');
  const [tickets, setTickets] = useState(TICKETS);
  const [query, setQuery] = useState('');
  const [detail, setDetail] = useState<Ticket | null>(null);
  const [tech, setTech] = useState(TECHNICIANS[0]!);
  const [when, setWhen] = useState('2026-10-18T09:00');
  const [followUp, setFollowUp] = useState('');
  const [inspecting, setInspecting] = useState<Ticket | null>(null);
  const [equipment, setEquipment] = useState<Record<string, boolean>>({});
  const [proposeOpen, setProposeOpen] = useState(false);

  const filtered = tickets.filter((t) => !query || `${t.id} ${t.title} ${t.room}`.toLowerCase().includes(query.toLowerCase()));
  const inspections = tickets.filter((t) => t.status === 'SCHEDULED');

  const move = (t: Ticket, status: MaintenanceStatus, logLine: string, patch: Partial<Ticket> = {}) => {
    setTickets((all) => all.map((x) => (x.id === t.id ? { ...x, ...patch, status, log: [...x.log, logLine] } : x)));
    setDetail(null);
    show(`${t.id}: ${logLine}`);
  };

  const finishInspection = () => {
    if (!inspecting) return;
    const broken = Object.entries(equipment).filter(([, bad]) => bad).map(([k]) => k);
    if (broken.length) {
      move(inspecting, 'IN_PROGRESS', t('Inspection: {0} need repair — repair started', { 0: broken.join(', ') }));
    } else {
      move(inspecting, 'RESOLVED', t('Inspection: equipment working normally — recorded for follow-up'));
    }
    setInspecting(null);
    setEquipment({});
  };

  const actions = (tk: Ticket) => {
    switch (tk.status) {
      case 'SENT':
      case 'PENDING':
        return <AppButton size="sm" onClick={() => move(tk, 'PROCESSING', t('Staff received & categorized'))}>{t('Receive & categorize')}</AppButton>;
      case 'PROCESSING':
        return (
          <div className="flex gap-2">
            <AppButton size="sm" variant="outline" leftIcon={<XCircle className="w-3.5 h-3.5" />} onClick={() => move(tk, 'CANCELLED', t('Cancelled: invalid request'))}>{t('Invalid')}</AppButton>
            <AppButton size="sm" onClick={() => move(tk, 'APPROVED', t('Valid request — approved'))}>{t('Approve')}</AppButton>
          </div>
        );
      case 'APPROVED':
        return (
          <div className="space-y-2">
            <select value={tech} onChange={(e) => setTech(e.target.value)} className="w-full px-3 py-2 text-xs border border-line rounded-lg bg-surface">
              {TECHNICIANS.map((x) => <option key={x}>{x}</option>)}
            </select>
            <input type="datetime-local" value={when} onChange={(e) => setWhen(e.target.value)} className="w-full px-3 py-2 text-xs border border-line rounded-lg" />
            <AppButton size="sm" className="w-full" leftIcon={<CalendarClock className="w-3.5 h-3.5" />} onClick={() => move(tk, 'SCHEDULED', t('Inspection scheduled {0} — {1}', { 0: when.replace('T', ' '), 1: tech }), { technician: tech, scheduledAt: when.replace('T', ' ') })}>
              {t('Schedule inspection')}
            </AppButton>
          </div>
        );
      case 'SCHEDULED':
        return <AppButton size="sm" leftIcon={<ClipboardCheck className="w-3.5 h-3.5" />} onClick={() => { setDetail(null); setInspecting(tk); }}>{t('Room / equipment inspection')}</AppButton>;
      case 'IN_PROGRESS':
        return (
          <div className="space-y-2">
            <textarea value={followUp} onChange={(e) => setFollowUp(e.target.value)} rows={2} placeholder={t('Record the repair result…')} className="w-full px-3 py-2 text-xs border border-line rounded-lg" />
            <AppButton size="sm" className="w-full" disabled={!followUp} onClick={() => { move(tk, 'RESOLVED', t('Recorded for follow-up: {0}', { 0: followUp })); setFollowUp(''); }}>{t('Repair completed')}</AppButton>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title={t('Maintenance & room inspection')}
        description={t('Receive requests, schedule inspections, repair and record follow-ups')}
        actions={<AppButton size="sm" variant="outline" leftIcon={<Plus className="w-4 h-4" />} onClick={() => setProposeOpen(true)}>{t('Propose a periodic schedule')}</AppButton>}
      />

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard label={t('New')} value={tickets.filter((t) => t.status === 'SENT' || t.status === 'PENDING').length} icon={AlertTriangle} tone="amber" />
        <StatCard label={t('Upcoming inspections')} value={inspections.length} icon={CalendarClock} tone="blue" />
        <StatCard label={t('In repair')} value={tickets.filter((t) => t.status === 'IN_PROGRESS').length} icon={Wrench} tone="purple" />
        <StatCard label={t('Awaiting student confirmation')} value={tickets.filter((t) => t.status === 'RESOLVED').length} icon={CheckCircle2} tone="emerald" />
      </div>

      <Tabs<TabKey>
        items={[
          { value: 'tickets', label: t('Repair requests'), count: tickets.filter((t) => t.status !== 'CLOSED' && t.status !== 'CANCELLED').length },
          { value: 'inspections', label: t('Room inspection schedule'), count: inspections.length },
          { value: 'schedules', label: t('Periodic maintenance'), count: SCHEDULES.length },
        ]}
        value={tab}
        onChange={setTab}
      />

      {tab === 'tickets' && (
        <>
          <div className="relative">
            <Search className="w-4 h-4 text-ink-subtle absolute left-3 top-1/2 -translate-y-1/2" />
            <input value={query} onChange={(e) => setQuery(e.target.value)} placeholder={t('Search ID, title, room…')} className="w-full pl-9 pr-3 py-2 text-xs rounded-lg border border-line bg-surface" />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
            {COLUMNS.map((c) => {
              const col = filtered.filter((t) => c.statuses.includes(t.status));
              return (
                <div key={c.label} className="bg-surface-sunken/70 rounded-2xl p-3">
                  <div className="flex items-center justify-between px-1 mb-3">
                    <span className="flex items-center gap-2 text-xs font-bold text-ink"><span className={clsx('w-2 h-2 rounded-full', c.dot)} />{c.label}</span>
                    <span className="text-label font-bold text-ink-muted bg-surface px-2 py-0.5 rounded-full">{col.length}</span>
                  </div>
                  <div className="space-y-2.5">
                    {col.map((tk) => (
                      <button key={tk.id} type="button" onClick={() => setDetail(tk)} className="w-full text-left p-3 rounded-xl bg-surface border border-line hover:border-brand transition">
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-label font-bold text-ink-subtle">{tk.id}</span>
                          <span className={clsx('text-label font-bold px-1.5 py-0.5 rounded', tk.source === 'PERIODIC' ? 'bg-purple-50 text-purple-700' : 'bg-surface-sunken text-ink-muted')}>
                            {tk.source === 'PERIODIC' ? t('Periodic') : t('Student report')}
                          </span>
                        </div>
                        <div className="text-xs font-bold text-ink">{tk.title}</div>
                        <div className="text-label text-ink-muted flex items-center gap-1 mt-1"><MapPin className="w-3 h-3" />{tk.room}</div>
                        <div className="mt-2"><StatusBadge status={tk.status} customLabel={STATUS_LABEL[tk.status]} /></div>
                      </button>
                    ))}
                    {col.length === 0 && <div className="text-center text-label text-ink-subtle py-6">{t('Empty')}</div>}
                  </div>
                </div>
              );
            })}
          </div>
        </>
      )}

      {tab === 'inspections' && (
        <SectionCard title={t('Room / equipment inspection schedule')} noPadding>
          <ul className="divide-y divide-line">
            {inspections.map((tk) => (
              <li key={tk.id} className="px-5 py-3.5 flex flex-col md:flex-row md:items-center gap-3 text-xs">
                <div className="w-12 h-12 rounded-xl bg-surface-sunken text-ink flex items-center justify-center shrink-0"><CalendarClock className="w-5 h-5" /></div>
                <div className="flex-1">
                  <div className="font-bold text-ink">{tk.room} — {tk.title}</div>
                  <div className="text-ink-muted">{tk.scheduledAt} · {tk.technician}</div>
                </div>
                <AppButton size="sm" leftIcon={<ClipboardCheck className="w-3.5 h-3.5" />} onClick={() => setInspecting(tk)}>{t('Inspect')}</AppButton>
              </li>
            ))}
            {inspections.length === 0 && <li className="py-10 text-center text-xs text-ink-subtle">{t('No inspections scheduled.')}</li>}
          </ul>
        </SectionCard>
      )}

      {tab === 'schedules' && (
        <SectionCard title={t('Periodic maintenance schedules')} subtitle={t('Approved by the manager; the system creates requests automatically when due')} noPadding>
          <ul className="divide-y divide-line">
            {SCHEDULES.map((s) => (
              <li key={s.id} className="px-5 py-3.5 flex items-center gap-3 text-xs">
                <Repeat className="w-4 h-4 text-purple-600" />
                <div className="flex-1"><div className="font-bold text-ink">{s.title}</div><div className="text-ink-muted">{s.id} · {s.when}</div></div>
                <StatusBadge status={s.status} />
              </li>
            ))}
          </ul>
        </SectionCard>
      )}

      <Modal open={!!detail} onClose={() => setDetail(null)} size="lg" title={detail?.title ?? ''} subtitle={detail ? `${detail.id} · ${detail.room} · ${detail.created}` : ''}>
        {detail && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 text-xs">
            <div className="space-y-3">
              <StatusBadge status={detail.status} customLabel={STATUS_LABEL[detail.status]} />
              <div className="flex items-center gap-2"><Avatar name={detail.reporter} size="xs" />{detail.reporter}</div>
              {detail.technician && <div className="flex items-center gap-2 text-ink-muted"><User className="w-3.5 h-3.5" />{detail.technician}</div>}
              {detail.photos > 0 && (
                <div className="flex gap-2">{Array.from({ length: detail.photos }).map((_, i) => <div key={i} className="w-14 h-14 rounded-lg bg-line flex items-center justify-center text-ink-subtle"><Camera className="w-4 h-4" /></div>)}</div>
              )}
              <ol className="border-l border-line ml-1 space-y-2">
                {detail.log.map((l) => <li key={l} className="pl-3 text-ink-muted flex gap-1.5"><Clock className="w-3 h-3 mt-0.5 shrink-0" />{l}</li>)}
              </ol>
            </div>
            <div>
              <div className="font-bold text-ink mb-2">{t('Next step')}</div>
              {actions(detail) ?? <p className="text-ink-muted">{t('No more actions for staff.')}</p>}
            </div>
          </div>
        )}
      </Modal>

      <Modal
        open={!!inspecting}
        onClose={() => setInspecting(null)}
        title={inspecting ? t('Inspect {0}', { 0: inspecting.room }) : ''}
        subtitle={t('Mark equipment that needs repair')}
        footer={
          <>
            <AppButton variant="outline" onClick={() => setInspecting(null)}>{t('Cancel')}</AppButton>
            <AppButton onClick={finishInspection}>{t('Save inspection result')}</AppButton>
          </>
        }
      >
        <div className="grid grid-cols-2 gap-2 text-xs">
          {EQUIPMENT.map((e) => (
            <label key={e} className={clsx('flex items-center gap-2 p-2.5 rounded-lg border cursor-pointer', equipment[e] ? 'border-rose-300 bg-rose-50 text-rose-800' : 'border-line')}>
              <input type="checkbox" checked={!!equipment[e]} onChange={(ev) => setEquipment({ ...equipment, [e]: ev.target.checked })} className="accent-rose-600" />
              {e} {t('— needs repair')}
            </label>
          ))}
        </div>
        <p className="text-label text-ink-muted mt-3">{t('No equipment needs repair → request moves to “Awaiting student confirmation”. Otherwise → “In repair”.')}</p>
      </Modal>

      <Modal
        open={proposeOpen}
        onClose={() => setProposeOpen(false)}
        title={t('Propose a periodic maintenance schedule')}
        subtitle={t('Sent to the manager for approval')}
        footer={
          <>
            <AppButton variant="outline" onClick={() => setProposeOpen(false)}>{t('Cancel')}</AppButton>
            <AppButton onClick={() => { setProposeOpen(false); show(t('Maintenance schedule proposal sent to the manager')); }}>{t('Send proposal')}</AppButton>
          </>
        }
      >
        <div className="space-y-3 text-xs">
          <input placeholder={t('Content, e.g. Air conditioner maintenance, Building D')} className="w-full px-3 py-2 border border-line rounded-lg" />
          <div className="grid grid-cols-2 gap-2">
            <input type="date" defaultValue="2026-11-10" className="px-3 py-2 border border-line rounded-lg" />
            <select className="px-3 py-2 border border-line rounded-lg bg-surface"><option>{t('One-time')}</option><option>{t('Monthly')}</option><option>{t('Every semester')}</option></select>
          </div>
          <select className="w-full px-3 py-2 border border-line rounded-lg bg-surface"><option>{t('Whole dormitory')}</option><option>{t('Building A')}</option><option>{t('Building B')}</option><option>{t('Building C')}</option><option>{t('Building D')}</option></select>
        </div>
      </Modal>

      {toastNode}
    </div>
  );
}
