import { useState } from 'react';
import {
  CheckCircle2,
  QrCode,
  ScanLine,
  KeyRound,
  ClipboardCheck,
  CreditCard,
  AlertTriangle,
  Camera,
  LogOut,
  CalendarCheck,
  Clock,
  MapPin,
  Wifi,
  Download,
  Info,
} from 'lucide-react';
import clsx from 'clsx';
import { useAuthStore } from '@features/auth';
import {
  PageHeader,
  SectionCard,
  StatusBadge,
  AppButton,
  Tabs,
  VietQrCode,
  formatVnd,
  useToast, t } from '@shared-ui';

/**
 * F3 — Self Check-in / Self Check-out (docs/BUSINESS_FLOWS.md).
 * Quét QR → kiểm tra khung giờ → Pay Invoice phần còn lại → nhận thông tin truy cập
 * → Submit Digital Room-Condition Report. Ngoài khung giờ: Staff check-in thủ công/trễ.
 */

type TabKey = 'checkin' | 'checkout' | 'history';
type CheckinStep = 'SCAN' | 'OUT_OF_WINDOW' | 'PAY' | 'ACCESS' | 'REPORT' | 'DONE';
type Condition = 'OK' | 'ISSUE';

const ASSIGNMENT = {
  term: 'Spring 2027',
  room: 'A204',
  bed: 'G1',
  building: t('Building A (Female)'),
  window: '02/01/2027 08:00 – 05/01/2027 20:00',
  remaining: 4160000,
};

const ASSETS = [
  t('Door lock & key card'),
  t('Bunk bed + mattress'),
  t('Desk and chair'),
  t('Lockable wardrobe'),
  t('Air conditioner + remote'),
  t('Water heater'),
  t('Lighting'),
  t('Window curtain'),
];

const HISTORY = [
  { type: 'IN', term: 'Fall 2026', room: 'A204 - G1', date: '30/08/2026 09:42', by: t('Self-service (QR)'), status: 'CHECKED_IN' },
  { type: 'OUT', term: 'Summer 2026', room: 'A204 - G1', date: '24/08/2026 15:10', by: t('Self-service · verified by staff Nguyễn Thu Hà'), status: 'CHECKED_OUT' },
  { type: 'IN', term: 'Summer 2026', room: 'A204 - G1', date: '06/05/2026 21:15', by: t('Late check-in · staff Trần Văn Cường'), status: 'CHECKED_IN' },
];

function ConditionReport({
  values,
  onChange,
  note,
  onNote,
}: {
  values: Record<string, Condition>;
  onChange: (asset: string, c: Condition) => void;
  note: string;
  onNote: (v: string) => void;
}) {
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
        {ASSETS.map((a) => (
          <div key={a} className="flex items-center justify-between p-2.5 rounded-lg border border-line text-xs">
            <span className="text-ink">{a}</span>
            <div className="flex gap-1">
              {(['OK', 'ISSUE'] as const).map((c) => (
                <button
                  key={c}
                  type="button"
                  onClick={() => onChange(a, c)}
                  className={clsx(
                    'px-2 py-1 rounded-md font-semibold',
                    values[a] === c ? (c === 'OK' ? 'bg-emerald-500 text-white' : 'bg-rose-500 text-white') : 'bg-surface-sunken text-ink-muted'
                  )}
                >
                  {c === 'OK' ? t('Good') : t('Has an issue')}
                </button>
              ))}
            </div>
          </div>
        ))}
      </div>
      <textarea
        value={note}
        onChange={(e) => onNote(e.target.value)}
        rows={2}
        placeholder={t('Describe the issue (if any) — a maintenance request is created automatically')}
        className="w-full px-3 py-2 text-xs border border-line rounded-lg"
      />
      <button type="button" className="w-full p-3 rounded-xl border-2 border-dashed border-line-strong text-xs text-ink-muted flex items-center justify-center gap-2 hover:border-brand">
        <Camera className="w-4 h-4" /> {t('Take photos of the room condition')}
      </button>
    </div>
  );
}

export function StudentCheckinPage() {
  const user = useAuthStore((s) => s.user);
  const { show, toastNode } = useToast();
  const [tab, setTab] = useState<TabKey>('checkin');
  const [step, setStep] = useState<CheckinStep>('SCAN');
  const [report, setReport] = useState<Record<string, Condition>>(() => Object.fromEntries(ASSETS.map((a) => [a, 'OK'])));
  const [note, setNote] = useState('');
  const [outReport, setOutReport] = useState<Record<string, Condition>>(() => Object.fromEntries(ASSETS.map((a) => [a, 'OK'])));
  const [outNote, setOutNote] = useState('');
  const [refundAccount, setRefundAccount] = useState('');
  const [checkoutSent, setCheckoutSent] = useState(false);

  const issues = Object.values(report).filter((c) => c === 'ISSUE').length;

  const scan = () => setStep('PAY');

  const submitReport = () => {
    setStep('DONE');
    show(issues ? t('Checked in — {0} issues were turned into maintenance requests', { 0: issues }) : t('Check-in successful. Welcome to your room!'));
  };

  const FLOW: { key: CheckinStep; label: string; icon: typeof QrCode }[] = [
    { key: 'SCAN', label: t('Scan QR'), icon: ScanLine },
    { key: 'PAY', label: t('Payment'), icon: CreditCard },
    { key: 'ACCESS', label: t('Room access'), icon: KeyRound },
    { key: 'REPORT', label: t('Condition report'), icon: ClipboardCheck },
  ];
  const order: CheckinStep[] = ['SCAN', 'PAY', 'ACCESS', 'REPORT', 'DONE'];
  const idx = order.indexOf(step === 'OUT_OF_WINDOW' ? 'SCAN' : step);

  return (
    <div className="space-y-6">
      <PageHeader title="Check-in / Check-out" description={t('Check in and out by yourself with a QR code and a digital condition report')} />

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="md:col-span-2 p-5 rounded-2xl bg-gradient-to-r from-brand to-brand text-white shadow-lg shadow-orange-500/20 flex flex-col sm:flex-row sm:items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-surface/20 flex items-center justify-center"><KeyRound className="w-7 h-7 text-white" /></div>
          <div className="flex-1">
            <div className="text-xs text-white/85">{t('Allocation for semester')} {ASSIGNMENT.term}</div>
            <div className="text-lg font-bold">{t('Room')} {ASSIGNMENT.room} {t('· Bed')} {ASSIGNMENT.bed}</div>
            <div className="text-xs text-white/85">{ASSIGNMENT.building} · Khung check-in {ASSIGNMENT.window}</div>
          </div>
          <StatusBadge status={step === 'DONE' ? 'CHECKED_IN' : 'ASSIGNED'} customLabel={step === 'DONE' ? undefined : t('Waiting to check in')} />
        </div>
        <div className="p-5 rounded-2xl bg-amber-50 border border-amber-200 text-xs text-amber-900 flex gap-2">
          <AlertTriangle className="w-5 h-5 shrink-0 text-amber-600" />
          <span>
            {t('If you don\'t check in before')} <strong>{t('20:00 on 05/01/2027')}</strong> {t('and don\'t contact dormitory staff, the system will cancel your allocation and')} <strong>{t('keep your deposit')}</strong>.
          </span>
        </div>
      </div>

      <Tabs<TabKey>
        items={[
          { value: 'checkin', label: 'Check-in' },
          { value: 'checkout', label: 'Check-out' },
          { value: 'history', label: t('History'), count: HISTORY.length },
        ]}
        value={tab}
        onChange={setTab}
      />

      {tab === 'checkin' && (
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
          <div className="xl:col-span-2 space-y-4">
            <ol className="grid grid-cols-4 gap-2">
              {FLOW.map((f, i) => (
                <li key={f.key} className={clsx('p-3 rounded-xl border text-center text-label font-semibold', i < idx ? 'bg-emerald-50 border-emerald-200 text-emerald-700' : i === idx ? 'bg-brand-soft border-orange-200 text-brand-ink' : 'bg-surface border-line text-ink-subtle')}>
                  <f.icon className="w-4 h-4 mx-auto mb-1" />
                  {f.label}
                </li>
              ))}
            </ol>

            {step === 'SCAN' && (
              <SectionCard title={t('Step 1 — Scan the QR code in the building lobby')} subtitle={t('The QR code is posted at the Building A lobby desk; scan it with the CampusStay app or your phone camera')}>
                <div className="flex flex-col sm:flex-row items-center gap-6">
                  <div className="w-40 h-40 rounded-2xl border-2 border-dashed border-line-strong flex flex-col items-center justify-center text-ink-subtle text-xs gap-2">
                    <ScanLine className="w-10 h-10" /> {t('Scan frame')}
                  </div>
                  <div className="flex-1 space-y-3 text-xs">
                    <p className="text-ink-muted">{t('The system will check your check-in window and eligibility to receive the room.')}</p>
                    <AppButton leftIcon={<QrCode className="w-4 h-4" />} onClick={scan}>{t('Scan QR code')}</AppButton>
                    <button type="button" onClick={() => setStep('OUT_OF_WINDOW')} className="block text-xs font-semibold text-ink-muted hover:text-ink">
                      {t('Can\'t scan the code or arriving outside the window?')}
                    </button>
                  </div>
                </div>
              </SectionCard>
            )}

            {step === 'OUT_OF_WINDOW' && (
              <SectionCard title={t('Outside the self-service check-in window')}>
                <div className="p-4 rounded-xl bg-rose-50 border border-rose-200 text-xs text-rose-800 space-y-2">
                  <div className="font-bold flex items-center gap-1.5"><AlertTriangle className="w-4 h-4" /> {t('You can\'t check in by yourself right now')}</div>
                  <p>{t('Please go to the dormitory staff desk (Building A lobby — desk 2) for a')} <strong>{t('manual / late check-in')}</strong>{t('. Bring your national ID card and student card.')}</p>
                  <p className="flex items-center gap-1"><Clock className="w-3.5 h-3.5" /> {t('The desk is open 07:30 – 21:00 daily during check-in week.')}</p>
                </div>
                <AppButton variant="outline" size="sm" className="mt-4" onClick={() => setStep('SCAN')}>{t('Scan again')}</AppButton>
              </SectionCard>
            )}

            {step === 'PAY' && (
              <SectionCard title={t('Step 2 — Pay the remaining fee')} subtitle={t('Semester room fee after deducting the deposit paid at registration')}>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 items-center">
                  <div className="flex flex-col items-center p-4 rounded-2xl border border-line">
                    <VietQrCode value={`ROOM-${user?.studentId}-SP27`} />
                    <div className="text-xs font-bold text-brand-ink mt-2">{formatVnd(ASSIGNMENT.remaining)}</div>
                  </div>
                  <div className="space-y-2 text-xs">
                    <div className="flex justify-between p-2.5 rounded-lg bg-surface-muted"><span className="text-ink-muted">{t('Spring 2027 room fee (4-person room)')}</span><span>{formatVnd(5200000)}</span></div>
                    <div className="flex justify-between p-2.5 rounded-lg bg-surface-muted"><span className="text-ink-muted">{t('Minus holding deposit (20%)')}</span><span>-{formatVnd(1040000)}</span></div>
                    <div className="flex justify-between p-2.5 rounded-lg bg-orange-50 font-bold"><span>{t('Amount due')}</span><span className="text-brand-ink">{formatVnd(ASSIGNMENT.remaining)}</span></div>
                    <AppButton className="w-full" onClick={() => { setStep('ACCESS'); show(t('Payment successful — receipt sent by email')); }}>
                      {t('I have paid')}
                    </AppButton>
                  </div>
                </div>
              </SectionCard>
            )}

            {step === 'ACCESS' && (
              <SectionCard title={t('Step 3 — Room access information')}>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                  <div className="p-4 rounded-xl bg-orange-50"><KeyRound className="w-5 h-5 text-orange-600" /><div className="text-ink-muted mt-2">{t('Access key card')}</div><div className="font-bold text-ink">{t('Activated on your student card')}</div></div>
                  <div className="p-4 rounded-xl bg-sky-50"><MapPin className="w-5 h-5 text-sky-600" /><div className="text-ink-muted mt-2">{t('Room')}</div><div className="font-bold text-ink">{t('A204 · Floor 2 · Bed G1')}</div></div>
                  <div className="p-4 rounded-xl bg-emerald-50"><Wifi className="w-5 h-5 text-emerald-600" /><div className="text-ink-muted mt-2">Wi-Fi</div><div className="font-bold text-ink">{t('FPTU-DORM-A · student login')}</div></div>
                </div>
                <p className="text-xs text-ink-muted mt-4">{t('Collect your personal locker key at the lobby desk, then go to your room and submit the condition report within 24 hours.')}</p>
                <AppButton className="mt-4" onClick={() => setStep('REPORT')}>{t('Create condition report')}</AppButton>
              </SectionCard>
            )}

            {step === 'REPORT' && (
              <SectionCard title={t('Step 4 — Digital room condition report')} subtitle={t('The report is the reference for comparison at check-out and for the deposit refund')}>
                <ConditionReport values={report} onChange={(a, c) => setReport({ ...report, [a]: c })} note={note} onNote={setNote} />
                <div className="flex justify-end mt-4">
                  <AppButton leftIcon={<CheckCircle2 className="w-4 h-4" />} onClick={submitReport}>{t('Submit report & take the room')}</AppButton>
                </div>
              </SectionCard>
            )}

            {step === 'DONE' && (
              <SectionCard>
                <div className="text-center py-6">
                  <CheckCircle2 className="w-12 h-12 text-emerald-500 mx-auto mb-3" />
                  <div className="text-lg font-bold text-ink">{t('You have checked in to room A204')}</div>
                  <p className="text-xs text-ink-muted mt-1">{issues ? t('{0} items with issues were sent to the maintenance team.', { 0: issues }) : t('Condition report saved.')}</p>
                </div>
              </SectionCard>
            )}
          </div>

          <SectionCard title={t('What to bring')}>
            <ul className="space-y-2.5 text-xs text-ink">
              {[t('National ID card and student card'), t('Banking app to scan VietQR'), t('Phone to photograph the room condition'), t('Contract signed in “My room”')].map((d) => (
                <li key={d} className="flex gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />{d}</li>
              ))}
            </ul>
            <div className="mt-4 p-3 rounded-lg bg-blue-50 text-label text-blue-800 flex gap-2">
              <Info className="w-4 h-4 shrink-0" /> {t('Trouble scanning the code? Dormitory staff at the desk will check you in manually.')}
            </div>
          </SectionCard>
        </div>
      )}

      {tab === 'checkout' && (
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
          <div className="xl:col-span-2">
            <SectionCard title={t('Self check-out — room A204 (Fall 2026)')} subtitle={t('Current contract ends 31/12/2026')}>
              {checkoutSent ? (
                <div className="text-center py-6 text-xs">
                  <Clock className="w-10 h-10 text-amber-500 mx-auto mb-2" />
                  <div className="text-sm font-bold text-ink">{t('Check-out report submitted')}</div>
                  <p className="text-ink-muted mt-1">{t('Dormitory staff will compare the condition with your check-in report. The deposit is refunded within 15 working days.')}</p>
                  <StatusBadge status="PENDING" customLabel={t('Waiting for staff verification')} />
                </div>
              ) : (
                <div className="space-y-4">
                  <ConditionReport values={outReport} onChange={(a, c) => setOutReport({ ...outReport, [a]: c })} note={outNote} onNote={setOutNote} />
                  <div>
                    <label className="block text-xs font-semibold text-ink mb-1">{t('Refund account')}</label>
                    <input value={refundAccount} onChange={(e) => setRefundAccount(e.target.value)} placeholder={t('Bank — account number — account holder')} className="w-full px-3 py-2 text-xs border border-line rounded-lg" />
                  </div>
                  <div className="flex justify-end">
                    <AppButton disabled={refundAccount.length < 8} leftIcon={<LogOut className="w-4 h-4" />} onClick={() => { setCheckoutSent(true); show(t('Check-out request submitted')); }}>
                      {t('Submit check-out report')}
                    </AppButton>
                  </div>
                </div>
              )}
            </SectionCard>
          </div>
          <SectionCard title={t('Before checking out')}>
            <ul className="space-y-2 text-xs text-ink list-disc pl-4">
              <li>{t('Pay all outstanding invoices.')}</li>
              <li>{t('Clean the bed, wardrobe and desk; take all personal belongings.')}</li>
              <li>{t('Return the locker key at the desk; the key card is disabled after verification.')}</li>
              <li>{t('Damage compared with the check-in report will be deducted from the deposit.')}</li>
            </ul>
          </SectionCard>
        </div>
      )}

      {tab === 'history' && (
        <SectionCard noPadding>
          <div className="overflow-x-auto">
            <table className="w-full text-xs">
              <thead className="bg-surface-muted text-ink-muted">
                <tr>
                  <th className="text-left font-semibold px-5 py-3">{t('Type')}</th>
                  <th className="text-left font-semibold px-5 py-3">{t('Semester')}</th>
                  <th className="text-left font-semibold px-5 py-3">{t('Room')}</th>
                  <th className="text-left font-semibold px-5 py-3">{t('Time')}</th>
                  <th className="text-left font-semibold px-5 py-3">{t('Type')}</th>
                  <th className="text-left font-semibold px-5 py-3">{t('Status')}</th>
                  <th className="px-5 py-3" />
                </tr>
              </thead>
              <tbody className="divide-y divide-line">
                {HISTORY.map((h) => (
                  <tr key={h.date}>
                    <td className="px-5 py-3">
                      <span className={clsx('inline-flex items-center gap-1 font-semibold', h.type === 'IN' ? 'text-emerald-700' : 'text-blue-700')}>
                        {h.type === 'IN' ? <CalendarCheck className="w-3.5 h-3.5" /> : <LogOut className="w-3.5 h-3.5" />}
                        {h.type === 'IN' ? t('Check-ins') : t('Check-out')}
                      </span>
                    </td>
                    <td className="px-5 py-3">{h.term}</td>
                    <td className="px-5 py-3 font-semibold">{h.room}</td>
                    <td className="px-5 py-3 text-ink-muted">{h.date}</td>
                    <td className="px-5 py-3">{h.by}</td>
                    <td className="px-5 py-3"><StatusBadge status={h.status} /></td>
                    <td className="px-5 py-3 text-right">
                      <button type="button" onClick={() => show(t('Downloading the condition report (PDF)'))} className="text-brand-ink font-semibold inline-flex items-center gap-1"><Download className="w-3 h-3" />{t('Report')}</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </SectionCard>
      )}

      {toastNode}
    </div>
  );
}
