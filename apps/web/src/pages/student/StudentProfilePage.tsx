import React, { useState } from 'react';
import {
  Mail,
  Phone,
  MapPin,
  GraduationCap,
  IdCard,
  Calendar,
  Users,
  Shield,
  Bell,
  Lock,
  Smartphone,
  Pencil,
  Save,
  HeartPulse,
  Building2,
  Award,
  LogIn,
  RefreshCw,
} from 'lucide-react';
import clsx from 'clsx';
import { useSearchParams } from 'react-router-dom';
import { useAuthStore } from '@features/auth';
import {
  PageHeader,
  SectionCard,
  Tabs,
  AppButton,
  Avatar,
  StatusBadge,
  ProgressBar,
  useToast, t } from '@shared-ui';

type TabKey = 'info' | 'emergency' | 'settings' | 'activity';

function Field({ icon: Icon, label, value }: { icon: React.ComponentType<{ className?: string }>; label: string; value: React.ReactNode }) {
  return (
    <div className="p-3 bg-surface-muted rounded-xl flex items-start gap-3">
      <Icon className="w-4 h-4 text-ink-subtle mt-0.5 shrink-0" />
      <div className="min-w-0">
        <div className="text-label text-ink-subtle font-medium">{label}</div>
        <div className="text-xs font-semibold text-ink break-words">{value}</div>
      </div>
    </div>
  );
}

function Toggle({ checked, onChange }: { checked: boolean; onChange: (v: boolean) => void }) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      onClick={() => onChange(!checked)}
      className={clsx('w-10 h-6 rounded-full p-0.5 transition', checked ? 'bg-brand-fill' : 'bg-slate-300')}
    >
      <span className={clsx('block w-5 h-5 rounded-full bg-surface shadow transition', checked && 'translate-x-4')} />
    </button>
  );
}

const ACTIVITY = [
  { time: '17/10/2026 07:58', text: t('Signed in from Chrome — Windows'), ip: '14.161.22.x', icon: LogIn },
  { time: '16/10/2026 21:12', text: t('Submitted maintenance request TK-10482'), ip: '14.161.22.x', icon: RefreshCw },
  { time: '15/10/2026 20:03', text: t('Signed in from the CampusStay iOS app'), ip: '27.72.101.x', icon: Smartphone },
  { time: '12/10/2026 09:40', text: t('Updated contact phone number'), ip: '14.161.22.x', icon: Pencil },
  { time: '05/10/2026 18:25', text: t('Paid invoice INV-2026-0905'), ip: '27.72.101.x', icon: RefreshCw },
];

export function StudentProfilePage() {
  const user = useAuthStore((state) => state.user);
  const { show, toastNode } = useToast();
  const [params] = useSearchParams();
  const [tab, setTab] = useState<TabKey>(params.get('tab') === 'settings' ? 'settings' : 'info');
  const [editing, setEditing] = useState(false);
  const [phone, setPhone] = useState(user?.phoneNumber || '0901 234 567');
  const [personalEmail, setPersonalEmail] = useState('maianh.nguyen@gmail.com');
  const [emergency, setEmergency] = useState({
    name: 'Nguyễn Văn Hùng',
    relation: t('Father'),
    phone: '0913 556 778',
    address: t('Phuoc Hoa Commune, Phu Giao District, Binh Duong Province'),
  });
  const [notify, setNotify] = useState({ email: true, push: true, sms: false, invoice: true, maintenance: true, events: false });
  const [twoFa, setTwoFa] = useState(true);

  return (
    <div className="space-y-6">
      <PageHeader title={t('Student profile')} description={t('Personal information synced from FPT SIS • Last synced at 07:00 today')} />

      {/* Header card */}
      <div className="bg-surface rounded-2xl border border-line/80 shadow-xs overflow-hidden">
        <div className="h-20 bg-surface-sunken" />
        <div className="px-6 pb-6 -mt-10 flex flex-col md:flex-row md:items-end gap-4">
          <div className="w-20 h-20 rounded-2xl bg-surface p-1 shadow">
            <div className="w-full h-full rounded-xl bg-brand-soft text-brand-ink flex items-center justify-center font-bold text-3xl">
              {user?.name?.split(' ').pop()?.charAt(0) || 'A'}
            </div>
          </div>
          <div className="flex-1">
            <div className="flex flex-wrap items-center gap-2">
              <h2 className="text-lg font-bold text-ink">{user?.name}</h2>
              <StatusBadge status="ACTIVE" customLabel={t('In residence')} />
            </div>
            <div className="text-xs text-ink-muted">
              MSSV: <strong>{user?.studentId || 'SE171234'}</strong> • {user?.major || t('Software Engineering (SE)')} {t('• Cohort K17')}
            </div>
          </div>
          <div className="grid grid-cols-3 gap-3 text-center">
            {[
              ['3', t('Semesters in dorm')],
              ['96', t('Conduct score')],
              ['0', t('Violations')],
            ].map(([v, l]) => (
              <div key={l} className="px-3 py-2 rounded-xl bg-surface-muted">
                <div className="text-lg font-bold text-ink">{v}</div>
                <div className="text-label text-ink-muted">{l}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <Tabs<TabKey>
        items={[
          { value: 'info', label: t('Personal information') },
          { value: 'emergency', label: t('Emergency contact') },
          { value: 'settings', label: t('Settings & security') },
          { value: 'activity', label: t('Recent activity') },
        ]}
        value={tab}
        onChange={setTab}
      />

      {tab === 'info' && (
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
          <div className="xl:col-span-2 space-y-6">
            <SectionCard title={t('Academic information')} subtitle={t('Read-only — edit at the Academic Affairs Office')}>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <Field icon={IdCard} label={t('Student ID')} value={user?.studentId || 'SE171234'} />
                <Field icon={GraduationCap} label={t('Major')} value={user?.major || t('Software Engineering (SE)')} />
                <Field icon={Calendar} label={t('Date of birth')} value="14/03/2005" />
                <Field icon={Users} label={t('Gender')} value={t(user?.gender === 'FEMALE' ? 'Female' : 'Male')} />
                <Field icon={Building2} label={t('Campus')} value={t('FPT University Tan Uyen (Binh Duong)')} />
                <Field icon={Award} label={t('Current semester')} value={t('Term 5 — cumulative GPA 8.2')} />
                <Field icon={IdCard} label={t('National ID number')} value="074 305 xxx 912" />
                <Field icon={MapPin} label={t('Permanent address')} value={t('Phuoc Hoa Commune, Phu Giao District, Binh Duong Province (> 50 km)')} />
              </div>
            </SectionCard>

            <SectionCard
              title={t('Contact information')}
              subtitle={t('You can update this yourself')}
              actions={
                editing ? (
                  <AppButton
                    size="sm"
                    leftIcon={<Save className="w-3.5 h-3.5" />}
                    onClick={() => {
                      setEditing(false);
                      show(t('Contact information saved'));
                    }}
                  >
                    {t('Save')}
                  </AppButton>
                ) : (
                  <AppButton size="sm" variant="outline" leftIcon={<Pencil className="w-3.5 h-3.5" />} onClick={() => setEditing(true)}>
                    {t('Edit')}
                  </AppButton>
                )
              }
            >
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <Field icon={Mail} label={t('Student email')} value={user?.email} />
                {editing ? (
                  <>
                    <div>
                      <label className="text-label text-ink-muted">{t('Phone number')}</label>
                      <input value={phone} onChange={(e) => setPhone(e.target.value)} className="w-full px-3 py-2 text-xs border border-line rounded-lg" />
                    </div>
                    <div>
                      <label className="text-label text-ink-muted">{t('Personal email')}</label>
                      <input value={personalEmail} onChange={(e) => setPersonalEmail(e.target.value)} className="w-full px-3 py-2 text-xs border border-line rounded-lg" />
                    </div>
                  </>
                ) : (
                  <>
                    <Field icon={Phone} label={t('Phone number')} value={phone} />
                    <Field icon={Mail} label={t('Personal email')} value={personalEmail} />
                  </>
                )}
                <Field icon={MapPin} label={t('Current address')} value={t('Room A204, Building A, FPT Tan Uyen Dormitory')} />
              </div>
            </SectionCard>
          </div>

          <div className="space-y-6">
            <SectionCard title={t('Profile completeness')}>
              <div className="flex items-end justify-between mb-2">
                <span className="text-2xl font-bold text-ink">85%</span>
                <span className="text-label text-ink-muted">{t('2 items left')}</span>
              </div>
              <ProgressBar value={85} tone="emerald" size="md" />
              <ul className="mt-4 space-y-2 text-xs">
                {[
                  [t('Basic information'), true],
                  [t('Portrait photo'), true],
                  [t('Emergency contact'), true],
                  [t('Medical information'), false],
                  [t('Refund bank account'), false],
                ].map(([l, ok]) => (
                  <li key={String(l)} className="flex items-center justify-between">
                    <span className="text-ink-muted">{l}</span>
                    <span className={ok ? 'text-emerald-600 font-semibold' : 'text-amber-600 font-semibold'}>{ok ? t('Provided') : t('Missing')}</span>
                  </li>
                ))}
              </ul>
            </SectionCard>
            <SectionCard title={<span className="flex items-center gap-2"><HeartPulse className="w-4 h-4 text-rose-500" /> {t('Medical information')}</span>}>
              <div className="space-y-2 text-xs">
                <div className="flex justify-between"><span className="text-ink-muted">{t('Blood type')}</span><span className="font-semibold">O+</span></div>
                <div className="flex justify-between"><span className="text-ink-muted">{t('Allergies')}</span><span className="font-semibold">{t('Pollen')}</span></div>
                <div className="flex justify-between"><span className="text-ink-muted">BHYT</span><span className="font-semibold">SV4 74 xxx 2210</span></div>
              </div>
              <AppButton size="sm" variant="outline" className="w-full mt-4" onClick={() => show(t('Medical update form opened'), 'info')}>
                {t('Update')}
              </AppButton>
            </SectionCard>
          </div>
        </div>
      )}

      {tab === 'emergency' && (
        <SectionCard title={t('Emergency contact person')} subtitle={t('The Dormitory Management Board only contacts them when necessary')}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-3xl">
            {(
              [
                ['name', t('Full name')],
                ['relation', t('Relationship')],
                ['phone', t('Phone number')],
                ['address', t('Address')],
              ] as const
            ).map(([k, label]) => (
              <div key={k} className={k === 'address' ? 'md:col-span-2' : ''}>
                <label className="block text-xs font-semibold text-ink mb-1">{label}</label>
                <input
                  value={emergency[k]}
                  onChange={(e) => setEmergency({ ...emergency, [k]: e.target.value })}
                  className="w-full px-3 py-2 text-xs border border-line rounded-lg"
                />
              </div>
            ))}
          </div>
          <div className="flex items-center gap-3 mt-5 p-3 rounded-xl bg-surface-muted max-w-3xl">
            <Avatar name={emergency.name} size="md" />
            <div className="flex-1 text-xs">
              <div className="font-semibold text-ink">{emergency.name}</div>
              <div className="text-ink-muted">
                {emergency.relation} • {emergency.phone}
              </div>
            </div>
            <AppButton size="sm" onClick={() => show(t('Emergency contact saved'))}>
              {t('Save changes')}
            </AppButton>
          </div>
        </SectionCard>
      )}

      {tab === 'settings' && (
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
          <SectionCard title={<span className="flex items-center gap-2"><Bell className="w-4 h-4 text-brand-ink" /> {t('Announcement')}</span>}>
            <ul className="divide-y divide-line">
              {(
                [
                  ['email', t('Email notifications'), 'anhntmse171234@fpt.edu.vn'],
                  ['push', t('In-app push notifications'), 'CampusStay iOS / Android'],
                  ['sms', t('SMS messages'), t('Only for emergencies')],
                  ['invoice', t('Payment due reminders'), t('3 days before and on the due date')],
                  ['maintenance', t('Maintenance request updates'), t('When the status changes')],
                  ['events', t('Dormitory events & activities'), t('Music nights, sports, clubs')],
                ] as const
              ).map(([k, label, desc]) => (
                <li key={k} className="py-3 flex items-center justify-between gap-3">
                  <div>
                    <div className="text-xs font-semibold text-ink">{label}</div>
                    <div className="text-label text-ink-muted">{desc}</div>
                  </div>
                  <Toggle checked={notify[k]} onChange={(v) => setNotify({ ...notify, [k]: v })} />
                </li>
              ))}
            </ul>
          </SectionCard>
          <div className="space-y-6">
            <SectionCard title={<span className="flex items-center gap-2"><Shield className="w-4 h-4 text-ink" /> {t('Account security')}</span>}>
              <div className="space-y-4">
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <div className="text-xs font-semibold text-ink">{t('Two-factor authentication (OTP)')}</div>
                    <div className="text-label text-ink-muted">{t('Require OTP when signing contracts & paying')}</div>
                  </div>
                  <Toggle checked={twoFa} onChange={setTwoFa} />
                </div>
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <div className="text-xs font-semibold text-ink">{t('Sign in with FPT SSO')}</div>
                    <div className="text-label text-ink-muted">{t('Password managed by FPT Education')}</div>
                  </div>
                  <AppButton size="sm" variant="outline" leftIcon={<Lock className="w-3.5 h-3.5" />} onClick={() => show(t('Redirecting to the FPT SSO password page'), 'info')}>
                    {t('Change password')}
                  </AppButton>
                </div>
              </div>
            </SectionCard>
            <SectionCard title={t('Signed-in devices')} noPadding>
              <ul className="divide-y divide-line">
                {[
                  { d: t('Chrome on Windows 11'), where: t('Binh Duong • Active now'), current: true },
                  { d: 'CampusStay iOS — iPhone 15', where: t('Binh Duong • 2 days ago'), current: false },
                ].map((s) => (
                  <li key={s.d} className="px-5 py-3 flex items-center gap-3">
                    <Smartphone className="w-4 h-4 text-ink-subtle" />
                    <div className="flex-1 text-xs">
                      <div className="font-semibold text-ink">{s.d}</div>
                      <div className="text-ink-muted">{s.where}</div>
                    </div>
                    {s.current ? (
                      <span className="text-label font-semibold text-emerald-600">{t('This device')}</span>
                    ) : (
                      <button type="button" onClick={() => show(t('Device signed out'), 'info')} className="text-label font-semibold text-rose-600 hover:underline">
                        {t('Sign out')}
                      </button>
                    )}
                  </li>
                ))}
              </ul>
            </SectionCard>
          </div>
        </div>
      )}

      {tab === 'activity' && (
        <SectionCard title={t('Account activity log')} subtitle={t('Last 30 days')} noPadding>
          <ul className="divide-y divide-line">
            {ACTIVITY.map((a) => (
              <li key={a.time} className="px-5 py-3 flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-orange-50 text-orange-600 flex items-center justify-center">
                  <a.icon className="w-4 h-4" />
                </div>
                <div className="flex-1 text-xs">
                  <div className="font-semibold text-ink">{a.text}</div>
                  <div className="text-ink-subtle">
                    {a.time} • IP {a.ip}
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </SectionCard>
      )}

      {toastNode}
    </div>
  );
}
