import { useState } from 'react';
import {
  Send,
  Megaphone,
  Mail,
  Smartphone,
  MessageSquare,
  Users,
  Building2,
  Clock,
  Eye,
  FileText,
  CheckCircle2,
  BarChart3,
  Bell,
  Paperclip,
  AlertTriangle,
} from 'lucide-react';
import clsx from 'clsx';
import { PageHeader, StatCard, SectionCard, StatusBadge, AppButton, Tabs, ProgressBar, useToast, t } from '@shared-ui';

type Audience = 'ALL' | 'BUILDING' | 'FLOOR' | 'ROOM' | 'DEBT';
type Channel = 'INAPP' | 'EMAIL' | 'SMS' | 'PUSH';

const TEMPLATES = [
  { id: 'water', name: t('Water outage for maintenance'), category: 'MAINTENANCE', title: t('Water supply suspended in Building {building}'), body: t('The Dormitory Management Board announces that water supply in Building {building} will be suspended from {start time} to {end time} on {date} for system maintenance. Please store water in advance. Thank you!') },
  { id: 'inspection', name: t('Room inspection schedule'), category: 'KTX', title: t('Periodic room inspection on {date}'), body: t('The inspection team will check cleanliness and fire safety in Building {building} rooms at {time}. Please tidy your room and be present if possible.') },
  { id: 'debt', name: t('Fee reminder'), category: 'FINANCE', title: t('Dormitory fee payment reminder'), body: t('Our records show an unpaid fee on your account. Please pay via VietQR before {deadline} to avoid having your access card suspended.') },
  { id: 'fire', name: t('Fire drill'), category: 'SAFETY', title: t('Dormitory-wide fire drill'), body: t('At {time} on {date}, the dormitory will hold a fire drill. When the alarm sounds, follow the emergency exits to the assembly yard.') },
];

const HISTORY = [
  { title: t('Water outage for tank maintenance, Building A, 19/10'), audience: t('Building A (288 students)'), channels: ['INAPP', 'PUSH', 'EMAIL'], sent: '16/10/2026 14:00', by: 'Lê Minh Khoa', read: 82, status: 'COMPLETED' },
  { title: t('Periodic room inspection, October 2026'), audience: t('Whole dormitory (1.075 students)'), channels: ['INAPP', 'EMAIL'], sent: '15/10/2026 08:00', by: 'Nguyễn Thu Hà', read: 91, status: 'COMPLETED' },
  { title: t('Wi-Fi 6 system upgrade'), audience: t('Whole dormitory (1.075 students)'), channels: ['INAPP', 'PUSH'], sent: '12/10/2026 10:00', by: 'Trần Văn Cường', read: 76, status: 'COMPLETED' },
  { title: t('Fire drill on 02/11'), audience: t('Whole dormitory (1.075 students)'), channels: ['INAPP', 'PUSH', 'SMS'], sent: t('Scheduled 30/10/2026 07:00'), by: 'Trần Văn Cường', read: 0, status: 'SCHEDULED' },
  { title: t('September utility fee reminder'), audience: t('Students with debt (37 students)'), channels: ['EMAIL', 'SMS'], sent: '10/10/2026 09:00', by: t('System'), read: 64, status: 'COMPLETED' },
];

const CHANNELS: { id: Channel; label: string; icon: typeof Mail; cost?: string }[] = [
  { id: 'INAPP', label: 'In-app', icon: Bell },
  { id: 'PUSH', label: 'Push mobile', icon: Smartphone },
  { id: 'EMAIL', label: 'Email', icon: Mail },
  { id: 'SMS', label: 'SMS', icon: MessageSquare, cost: '~350 ₫/tin' },
];

const AUDIENCE_SIZE: Record<Audience, number> = { ALL: 1075, BUILDING: 288, FLOOR: 48, ROOM: 4, DEBT: 37 };

export function StaffBroadcastPage() {
  const { show, toastNode } = useToast();
  const [tab, setTab] = useState<'compose' | 'history'>('compose');
  const [audience, setAudience] = useState<Audience>('BUILDING');
  const [building, setBuilding] = useState('A');
  const [channels, setChannels] = useState<Channel[]>(['INAPP', 'PUSH']);
  const [category, setCategory] = useState('MAINTENANCE');
  const [title, setTitle] = useState('');
  const [body, setBody] = useState('');
  const [urgent, setUrgent] = useState(false);
  const [schedule, setSchedule] = useState<'now' | 'later'>('now');
  const [history, setHistory] = useState(HISTORY);

  const recipients = AUDIENCE_SIZE[audience];
  const toggleChannel = (c: Channel) => setChannels((all) => (all.includes(c) ? all.filter((x) => x !== c) : [...all, c]));

  const applyTemplate = (id: string) => {
    const tpl = TEMPLATES.find((x) => x.id === id);
    if (!tpl) return;
    setTitle(tpl.title.replace(t('{building}'), building));
    setBody(tpl.body.replaceAll(t('{building}'), building));
    setCategory(tpl.category);
  };

  const send = () => {
    const audienceLabel = audience === 'ALL' ? t('Whole dormitory ({0} students)', { 0: recipients }) : audience === 'BUILDING' ? t('Building {0} ({1} students)', { 0: building, 1: recipients }) : audience === 'DEBT' ? t('Students with debt ({0} students)', { 0: recipients }) : `${recipients} SV`;
    setHistory([{ title, audience: audienceLabel, channels, sent: schedule === 'now' ? t('Just now') : t('Scheduled'), by: 'Trần Văn Cường', read: 0, status: schedule === 'now' ? 'COMPLETED' : 'SCHEDULED' }, ...history]);
    show(schedule === 'now' ? t('Announcement sent to {0} students', { 0: recipients }) : t('Announcement scheduled'));
    setTitle('');
    setBody('');
    setTab('history');
  };

  return (
    <div className="space-y-6">
      <PageHeader title={t('Send announcement')} description={t('Send operational notices, safety alerts and reminders to students by building, floor or room')} />

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard label={t('Sent this month')} value="24" icon={Megaphone} tone="orange" />
        <StatCard label={t('Average read rate')} value="83%" icon={Eye} tone="emerald" trend={{ value: '+5%', up: true }} />
        <StatCard label={t('Scheduled')} value={history.filter((h) => h.status === 'SCHEDULED').length} icon={Clock} tone="blue" />
        <StatCard label={t('SMS remaining')} value="4.250" icon={MessageSquare} tone="navy" hint={t('October plan')} />
      </div>

      <Tabs
        items={[
          { value: 'compose' as const, label: t('Compose') },
          { value: 'history' as const, label: t('Send history'), count: history.length },
        ]}
        value={tab}
        onChange={setTab}
      />

      {tab === 'compose' ? (
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
          <div className="xl:col-span-2 space-y-6">
            <SectionCard title={t('1. Recipients')}>
              <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
                {(
                  [
                    ['ALL', t('Whole dormitory'), Users],
                    ['BUILDING', t('By building'), Building2],
                    ['FLOOR', t('By floor'), Building2],
                    ['ROOM', t('By room'), Building2],
                    ['DEBT', t('Students with debt'), AlertTriangle],
                  ] as const
                ).map(([id, label, Icon]) => (
                  <button
                    key={id}
                    type="button"
                    onClick={() => setAudience(id)}
                    className={clsx('p-3 rounded-xl border text-xs font-semibold flex flex-col items-center gap-1.5', audience === id ? 'border-brand bg-orange-50 text-brand-ink' : 'border-line text-ink-muted')}
                  >
                    <Icon className="w-4 h-4" />
                    {label}
                  </button>
                ))}
              </div>
              {(audience === 'BUILDING' || audience === 'FLOOR' || audience === 'ROOM') && (
                <div className="flex flex-wrap gap-2 mt-4">
                  <select value={building} onChange={(e) => setBuilding(e.target.value)} className="px-3 py-2 text-xs border border-line rounded-lg bg-surface">
                    {['A', 'B', 'C', 'D'].map((b) => (
                      <option key={b} value={b}>{t('Building')} {b}</option>
                    ))}
                  </select>
                  {audience !== 'BUILDING' && (
                    <select className="px-3 py-2 text-xs border border-line rounded-lg bg-surface">
                      {[1, 2, 3, 4, 5].map((f) => (
                        <option key={f}>{t('Floor')} {f}</option>
                      ))}
                    </select>
                  )}
                  {audience === 'ROOM' && <input placeholder="VD: A204, A205" className="px-3 py-2 text-xs border border-line rounded-lg" />}
                </div>
              )}
              <div className="mt-4 text-xs text-ink-muted">
                {t('Estimated')} <strong className="text-ink">{recipients.toLocaleString('vi-VN')}</strong> {t('students will receive the announcement.')}
              </div>
            </SectionCard>

            <SectionCard title={t('2. Content')} actions={
              <select onChange={(e) => applyTemplate(e.target.value)} defaultValue="" className="px-2.5 py-1.5 text-xs border border-line rounded-lg bg-surface">
                <option value="" disabled>{t('Use a template...')}</option>
                {TEMPLATES.map((t) => (
                  <option key={t.id} value={t.id}>{t.name}</option>
                ))}
              </select>
            }>
              <div className="space-y-4 text-xs">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block font-semibold text-ink mb-1">{t('Category')}</label>
                    <select value={category} onChange={(e) => setCategory(e.target.value)} className="w-full px-3 py-2 border border-line rounded-lg bg-surface">
                      <option value="KTX">{t('Dormitory')}</option>
                      <option value="MAINTENANCE">{t('Maintenance')}</option>
                      <option value="SAFETY">{t('Safety')}</option>
                      <option value="FINANCE">{t('Finance')}</option>
                      <option value="EVENT">{t('Event')}</option>
                    </select>
                  </div>
                  <label className="flex items-center gap-2 mt-5 font-semibold text-rose-700">
                    <input type="checkbox" checked={urgent} onChange={(e) => setUrgent(e.target.checked)} className="accent-rose-600" />
                    {t('Mark as URGENT (pinned at the top + sound alert)')}
                  </label>
                </div>
                <div>
                  <label className="block font-semibold text-ink mb-1">{t('Title')}</label>
                  <input value={title} onChange={(e) => setTitle(e.target.value)} maxLength={120} className="w-full px-3 py-2 border border-line rounded-lg" placeholder={t('Short, clear title')} />
                  <div className="text-right text-label text-ink-subtle mt-0.5">{title.length}/120</div>
                </div>
                <div>
                  <label className="block font-semibold text-ink mb-1">{t('Content')}</label>
                  <textarea value={body} onChange={(e) => setBody(e.target.value)} rows={6} className="w-full px-3 py-2 border border-line rounded-lg" placeholder={t('Detailed content...')} />
                  <div className="flex justify-between text-label text-ink-subtle mt-0.5">
                    <span>{channels.includes('SMS') && body.length > 160 ? t('The SMS will be split into {0} messages', { 0: Math.ceil(body.length / 160) }) : ''}</span>
                    <span>{body.length} {t('characters')}</span>
                  </div>
                </div>
                <button type="button" className="flex items-center gap-1.5 text-ink font-semibold"><Paperclip className="w-3.5 h-3.5" /> {t('Attach files (PDF, images)')}</button>
              </div>
            </SectionCard>

            <SectionCard title={t('3. Channels & timing')}>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mb-4">
                {CHANNELS.map((c) => (
                  <button
                    key={c.id}
                    type="button"
                    onClick={() => toggleChannel(c.id)}
                    className={clsx('p-3 rounded-xl border text-xs font-semibold flex flex-col items-center gap-1', channels.includes(c.id) ? 'border-ink bg-surface-sunken text-ink' : 'border-line text-ink-muted')}
                  >
                    <c.icon className="w-4 h-4" />
                    {c.label}
                    {c.cost && <span className="text-label font-normal text-ink-subtle">{c.cost}</span>}
                  </button>
                ))}
              </div>
              <div className="flex flex-wrap items-center gap-4 text-xs">
                <label className="flex items-center gap-2"><input type="radio" checked={schedule === 'now'} onChange={() => setSchedule('now')} className="accent-brand-ink" /> {t('Send now')}</label>
                <label className="flex items-center gap-2"><input type="radio" checked={schedule === 'later'} onChange={() => setSchedule('later')} className="accent-brand-ink" /> {t('Schedule')}</label>
                {schedule === 'later' && <input type="datetime-local" defaultValue="2026-10-18T07:00" className="px-3 py-1.5 border border-line rounded-lg" />}
              </div>
              <div className="flex justify-end gap-2 mt-5 pt-4 border-t">
                <AppButton variant="outline" onClick={() => show(t('Draft saved'), 'info')}>{t('Save draft')}</AppButton>
                <AppButton disabled={!title || !body || channels.length === 0} leftIcon={<Send className="w-4 h-4" />} onClick={send}>
                  {schedule === 'now' ? t('Send announcement') : t('Schedule send')}
                </AppButton>
              </div>
            </SectionCard>
          </div>

          <div className="space-y-6">
            <SectionCard title={<span className="flex items-center gap-2"><Smartphone className="w-4 h-4" /> {t('Phone preview')}</span>}>
              <div className="mx-auto w-60 rounded-[2rem] border-8 border-slate-800 bg-surface-sunken p-3 min-h-96">
                <div className="text-center text-label text-ink-muted mb-3">09:41</div>
                <div className={clsx('rounded-xl bg-surface p-3 shadow-sm', urgent && 'ring-2 ring-rose-400')}>
                  <div className="flex items-center gap-2 mb-1.5">
                    <div className="w-5 h-5 rounded bg-brand-fill text-white text-[9px] font-bold flex items-center justify-center">CS</div>
                    <span className="text-label font-semibold text-ink-muted">{t('CampusStay • now')}</span>
                  </div>
                  {urgent && <div className="text-[9px] font-bold text-rose-600 mb-0.5">{t('⚠ URGENT')}</div>}
                  <div className="text-label font-bold text-ink leading-snug">{title || t('Announcement title')}</div>
                  <div className="text-label text-ink-muted mt-1 line-clamp-6">{body || t('The announcement content will appear here...')}</div>
                </div>
              </div>
            </SectionCard>
            <SectionCard title={t('Templates')} noPadding>
              <ul className="divide-y divide-line">
                {TEMPLATES.map((t) => (
                  <li key={t.id}>
                    <button type="button" onClick={() => applyTemplate(t.id)} className="w-full px-5 py-3 text-left hover:bg-surface-muted flex items-center gap-2 text-xs">
                      <FileText className="w-4 h-4 text-ink" />
                      <span className="font-semibold text-ink">{t.name}</span>
                    </button>
                  </li>
                ))}
              </ul>
            </SectionCard>
          </div>
        </div>
      ) : (
        <SectionCard noPadding>
          <div className="overflow-x-auto">
            <table className="w-full text-xs">
              <thead className="bg-surface-muted text-ink-muted">
                <tr>
                  <th className="text-left font-semibold px-5 py-3">{t('Announcement')}</th>
                  <th className="text-left font-semibold px-5 py-3">{t('Audience')}</th>
                  <th className="text-left font-semibold px-5 py-3">{t('Channel')}</th>
                  <th className="text-left font-semibold px-5 py-3">{t('Read rate')}</th>
                  <th className="text-left font-semibold px-5 py-3">{t('Status')}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-line">
                {history.map((h, i) => (
                  <tr key={i} className="hover:bg-surface-muted">
                    <td className="px-5 py-3">
                      <div className="font-semibold text-ink">{h.title}</div>
                      <div className="text-label text-ink-subtle">{h.sent} • {h.by}</div>
                    </td>
                    <td className="px-5 py-3 text-ink-muted">{h.audience}</td>
                    <td className="px-5 py-3">
                      <div className="flex gap-1">
                        {h.channels.map((c) => {
                          const ch = CHANNELS.find((x) => x.id === c);
                          return ch ? <span key={c} title={ch.label} className="w-6 h-6 rounded-md bg-surface-sunken flex items-center justify-center"><ch.icon className="w-3 h-3 text-ink-muted" /></span> : null;
                        })}
                      </div>
                    </td>
                    <td className="px-5 py-3 w-40">
                      {h.status === 'COMPLETED' ? (
                        <div className="flex items-center gap-2"><ProgressBar value={h.read} tone="emerald" /><span className="font-semibold">{h.read}%</span></div>
                      ) : (
                        <span className="text-ink-subtle">—</span>
                      )}
                    </td>
                    <td className="px-5 py-3">
                      {h.status === 'COMPLETED' ? <StatusBadge status="COMPLETED" customLabel={t('Submitted')} /> : <StatusBadge status="SCHEDULED" />}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="px-5 py-3 border-t text-label text-ink-muted flex items-center gap-1.5">
            <BarChart3 className="w-3.5 h-3.5" /> {t('Read rate is measured on the in-app & push channels.')} <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 ml-2" /> {t('Emails delivered successfully: 99.2%.')}
          </div>
        </SectionCard>
      )}

      {toastNode}
    </div>
  );
}
