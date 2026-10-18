import { useEffect, useMemo, useState } from 'react';
import { CheckCircle2, XCircle, ArrowLeft, ArrowRight, Mail, Timer, Lock, Check } from 'lucide-react';
import clsx from 'clsx';
import { useAuthStore } from '@features/auth';
import {
  ROOM_TYPES,
  DEPOSIT_CONFIG,
  stayTermsFrom,
  type RoomType,
  type RoomTypeId,
} from '@features/rooms/roomCatalog';
import { RoomTypeIllustration } from '@features/rooms/RoomTypeIllustration';
import {
  AppButton,
  PageHeader,
  SectionCard,
  StatusBadge,
  EmptyState,
  VietQrCode,
  formatVnd,
  formatCountdown,
  useToast, t } from '@shared-ui';

/**
 * F1 — Đăng ký lưu trú (docs/BUSINESS_FLOWS.md).
 * Kiểm tra thông tin & điều kiện → thời gian lưu trú → loại phòng → (phòng 2 người) bạn cùng phòng
 * → xác nhận chi phí → thanh toán tiền cọc qua VietQR.
 */

type StepKey = 'eligibility' | 'term' | 'room' | 'roommate' | 'confirm' | 'payment';
type Phase = 'FORM' | 'DONE' | 'HOLD_EXPIRED';
type RoommateMode = 'BY_ID' | 'MATCHING';

const STEP_LABEL: Record<StepKey, string> = {
  eligibility: t('Eligibility check'),
  term: t('Length of stay'),
  room: t('Room type'),
  roommate: t('Roommates'),
  confirm: t('Cost confirmation'),
  payment: t('Payment'),
};

const HOLD_SECONDS = 15 * 60;
const WINDOW = { open: true, term: 'Spring 2027', opens: '14/10/2026', closes: '15/11/2026' };
/** Sinh viên đang ở kỳ 5 (Fall 2026) → kỳ đăng ký kế tiếp là kỳ 6 (Spring 2027). */
const STUDENT_SEMESTER = { current: 5, next: 6, cohort: 'K17' };

const MATCH_OPTIONS = {
  cohort: [t('Same cohort K17'), t('Doesn\'t matter')],
  major: [t('Software Engineering'), t('Same IT faculty'), t('Doesn\'t matter')],
  hometown: [t('Same Southeast region'), t('Doesn\'t matter')],
  habit: [t('Sleeps early, quiet'), t('Studies late'), t('Doesn\'t matter')],
};

export function StudentRegistrationPage() {
  const user = useAuthStore((s) => s.user);
  const { show, toastNode } = useToast();
  const terms = useMemo(() => stayTermsFrom(STUDENT_SEMESTER.next, 'Spring', 2027), []);

  const [phase, setPhase] = useState<Phase>('FORM');
  const [step, setStep] = useState<StepKey>('eligibility');
  const [endSemester, setEndSemester] = useState(terms[0]!.semester);
  const [roomTypeId, setRoomTypeId] = useState<RoomTypeId | null>(null);
  const [holdLeft, setHoldLeft] = useState<number | null>(null);
  const [mode, setMode] = useState<RoommateMode>('MATCHING');
  const [mateId, setMateId] = useState('');
  const [mateInvited, setMateInvited] = useState(false);
  const [match, setMatch] = useState({ cohort: MATCH_OPTIONS.cohort[0]!, major: MATCH_OPTIONS.major[0]!, hometown: MATCH_OPTIONS.hometown[1]!, habit: MATCH_OPTIONS.habit[0]! });
  const [confirmed, setConfirmed] = useState(false);

  const room: RoomType | undefined = ROOM_TYPES.find((r) => r.id === roomTypeId);
  const steps: StepKey[] = ['eligibility', 'term', 'room', ...(room?.canChooseRoommate ? (['roommate'] as const) : []), 'confirm', 'payment'];
  const stepIdx = steps.indexOf(step);
  const stayTerms = terms.filter((t) => t.semester <= endSemester);

  const isFptu = !!user?.email.endsWith('@fpt.edu.vn') && user.role === 'STUDENT';
  const checks = [
    { label: t('FPT University student (@fpt.edu.vn account, listed in FPT SIS)'), ok: isFptu },
    { label: t('Full-time enrolled'), ok: true },
    { label: t('Current term {0} — within the stay limit up to term 9', { 0: STUDENT_SEMESTER.current }), ok: STUDENT_SEMESTER.current < 9 },
    { label: t('No overdue dormitory debt'), ok: true },
    { label: t('No active application for {0}', { 0: WINDOW.term }), ok: true },
  ];
  const eligible = checks.every((c) => c.ok);

  const deposit = room ? Math.round((room.pricePerTerm * DEPOSIT_CONFIG.percent) / 100) : 0;
  const totalNow = deposit + DEPOSIT_CONFIG.utilityDeposit;

  useEffect(() => {
    if (holdLeft === null || phase !== 'FORM') return;
    if (holdLeft <= 0) {
      setPhase('HOLD_EXPIRED');
      return;
    }
    const t = window.setTimeout(() => setHoldLeft((s) => (s === null ? s : s - 1)), 1000);
    return () => window.clearTimeout(t);
  }, [holdLeft, phase]);

  const chooseRoom = (r: RoomType) => {
    if (r.availability === 'FULL') return;
    setRoomTypeId(r.id);
    setHoldLeft(HOLD_SECONDS);
  };

  const canNext =
    (step === 'eligibility' && eligible) ||
    step === 'term' ||
    (step === 'room' && !!room) ||
    (step === 'roommate' && (mode === 'MATCHING' || mateInvited)) ||
    (step === 'confirm' && confirmed);

  const next = () => setStep(steps[stepIdx + 1]!);
  const back = () => setStep(steps[stepIdx - 1]!);

  const restart = () => {
    setPhase('FORM');
    setStep('eligibility');
    setRoomTypeId(null);
    setHoldLeft(null);
    setConfirmed(false);
  };

  if (!WINDOW.open) {
    return (
      <div className="space-y-6">
        <PageHeader title={t('Room registration')} />
        <EmptyState icon={<Lock className="w-7 h-7" />} title={t('Registration is not open yet')} description={t('You will get an email when registration for {0} opens.', { 0: WINDOW.term })} />
      </div>
    );
  }

  if (phase === 'HOLD_EXPIRED') {
    return (
      <div className="max-w-xl mx-auto space-y-6">
        <PageHeader title={t('Room registration')} />
        <SectionCard>
          <div className="text-center py-6">
            <XCircle className="w-10 h-10 text-ink-subtle mx-auto mb-3" />
            <div className="text-base font-bold text-ink">{t('Hold expired')}</div>
            <p className="text-sm text-ink-muted mt-1">{t('You didn\'t pay the deposit within 15 minutes, so your place was released. You have not been charged.')}</p>
            <AppButton className="mt-5" onClick={restart}>{t('Register again')}</AppButton>
          </div>
        </SectionCard>
      </div>
    );
  }

  if (phase === 'DONE') {
    return (
      <div className="max-w-2xl mx-auto space-y-6">
        <PageHeader title={t('Room registration')} />
        <SectionCard>
          <div className="text-center py-4">
            <CheckCircle2 className="w-12 h-12 text-emerald-500 mx-auto mb-3" />
            <div className="text-lg font-bold text-ink">{t('Registration successful')}</div>
            <p className="text-sm text-ink-muted mt-1">{t('Application ID')} <strong className="text-ink">APP-SP27-004812</strong> {t('· Receipt sent to')} {user?.email}</p>
          </div>
          <dl className="grid grid-cols-2 gap-3 text-sm mt-4">
            <div className="p-3 rounded-xl bg-surface-muted"><dt className="text-xs text-ink-muted">{t('Room type')}</dt><dd className="font-semibold">{room?.name}</dd></div>
            <div className="p-3 rounded-xl bg-surface-muted"><dt className="text-xs text-ink-muted">{t('Time')}</dt><dd className="font-semibold">{stayTerms[0]?.label} → {stayTerms[stayTerms.length - 1]?.label}</dd></div>
            <div className="p-3 rounded-xl bg-surface-muted"><dt className="text-xs text-ink-muted">{t('Paid')}</dt><dd className="font-semibold">{formatVnd(totalNow)}</dd></div>
            <div className="p-3 rounded-xl bg-surface-muted"><dt className="text-xs text-ink-muted">{t('Status')}</dt><dd><StatusBadge status="PROCESSING" customLabel={t('Awaiting allocation')} /></dd></div>
          </dl>
          <p className="text-xs text-ink-muted mt-4">{t('Your allocation result and contract will appear in “My room”. The remaining room fee is paid at check-in.')}</p>
        </SectionCard>
        {toastNode}
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-5xl">
      <PageHeader
        title={t('Room registration')}
        description={t('Semester {0} · Registration open {1} – {2}', { 0: WINDOW.term, 1: WINDOW.opens, 2: WINDOW.closes })}
        badge={<StatusBadge status="OPEN" customLabel={t('Open')} />}
      />

      <ol className="flex items-center gap-2 overflow-x-auto pb-1">
        {steps.map((s, i) => (
          <li key={s} className="flex items-center gap-2 shrink-0">
            <span
              className={clsx(
                'w-7 h-7 rounded-full text-xs font-bold flex items-center justify-center',
                i < stepIdx && 'bg-emerald-500 text-white',
                i === stepIdx && 'bg-brand-fill text-white',
                i > stepIdx && 'bg-surface-sunken text-ink-subtle'
              )}
            >
              {i < stepIdx ? <Check className="w-3.5 h-3.5" /> : i + 1}
            </span>
            <span className={clsx('text-xs font-semibold', i === stepIdx ? 'text-ink' : 'text-ink-subtle')}>{STEP_LABEL[s]}</span>
            {i < steps.length - 1 && <span className="w-6 h-px bg-line" />}
          </li>
        ))}
      </ol>

      {holdLeft !== null && stepIdx >= steps.indexOf('room') && (
        <div className="flex items-center gap-3 px-4 py-3 rounded-xl border border-line bg-surface text-sm">
          <Timer className="w-4 h-4 text-brand-ink shrink-0" />
          <span className="flex-1 text-ink-muted">{t('The system is holding')} <strong className="text-ink">{room?.name}</strong> {t('for you. Complete the payment before time runs out.')}</span>
          <span className={clsx('font-bold tabular-nums', holdLeft < 180 ? 'text-rose-600' : 'text-ink')}>{formatCountdown(holdLeft)}</span>
        </div>
      )}

      {step === 'eligibility' && (
        <SectionCard title={t('Check information & eligibility')} subtitle={t('Data from FPT SIS, eligibility according to the administrator\'s configuration')}>
          <dl className="grid grid-cols-2 md:grid-cols-4 gap-3 text-sm mb-5">
            {[
              [t('Full name'), user?.name ?? '—'],
              ['MSSV', user?.studentId ?? '—'],
              ['Email', user?.email ?? '—'],
              [t('Cohort · Current term'), t('{0} · Term {1}', { 0: STUDENT_SEMESTER.cohort, 1: STUDENT_SEMESTER.current })],
            ].map(([k, v]) => (
              <div key={k} className="p-3 rounded-xl bg-surface-muted min-w-0"><dt className="text-xs text-ink-muted">{k}</dt><dd className="font-semibold text-ink truncate">{v}</dd></div>
            ))}
          </dl>
          <ul className="space-y-2.5">
            {checks.map((c) => (
              <li key={c.label} className="flex items-center gap-2.5 text-sm">
                {c.ok ? <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" /> : <XCircle className="w-4 h-4 text-rose-500 shrink-0" />}
                <span className={c.ok ? 'text-ink' : 'text-rose-700 font-semibold'}>{c.label}</span>
              </li>
            ))}
          </ul>
          {!eligible && <p className="mt-4 text-sm text-rose-600">{t('Only eligible FPT University students can register for accommodation.')}</p>}
        </SectionCard>
      )}

      {step === 'term' && (
        <SectionCard title={t('Length of stay')} subtitle={t('There are 3 terms per year: Spring, Summer, Fall. You can register up to term 9.')}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div>
              <div className="text-xs font-semibold text-ink-muted mb-1.5">{t('Starting term (determined automatically)')}</div>
              <div className="px-3 py-2.5 rounded-lg bg-surface-muted border border-line text-sm font-semibold text-ink">
                {terms[0]!.label} {t('· Term')} {terms[0]!.semester}
              </div>
            </div>
            <div>
              <label htmlFor="end-term" className="block text-xs font-semibold text-ink-muted mb-1.5">{t('Stay until the end of term')}</label>
              <select id="end-term" value={endSemester} onChange={(e) => setEndSemester(Number(e.target.value))} className="w-full px-3 py-2.5 rounded-lg border border-line bg-surface text-sm">
                {terms.map((term) => <option key={term.semester} value={term.semester}>{term.label} {t('· Term')} {term.semester}</option>)}
              </select>
            </div>
          </div>
          <div className="mt-5 flex flex-wrap gap-2">
            {terms.map((t) => (
              <span key={t.semester} className={clsx('px-3 py-1.5 rounded-full text-xs font-semibold border', t.semester <= endSemester ? 'bg-brand-fill text-white border-brand' : 'bg-surface text-ink-subtle border-line')}>
                {t.label}
              </span>
            ))}
          </div>
          <p className="text-xs text-ink-muted mt-3">{t('Registration')} {stayTerms.length} {t('terms. Room fees are charged per term; the first term is paid at check-in.')}</p>
        </SectionCard>
      )}

      {step === 'room' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          {ROOM_TYPES.map((r) => {
            const selected = roomTypeId === r.id;
            const full = r.availability === 'FULL';
            return (
              <button
                key={r.id}
                type="button"
                disabled={full}
                onClick={() => chooseRoom(r)}
                aria-pressed={selected}
                className={clsx(
                  'text-left rounded-2xl border bg-surface overflow-hidden transition disabled:opacity-50',
                  selected ? 'border-brand ring-2 ring-orange-100' : 'border-line hover:border-line-strong'
                )}
              >
                <RoomTypeIllustration type={r.id} className="w-full h-36 bg-surface-muted" />
                <div className="p-4">
                  <div className="flex items-start justify-between gap-2">
                    <div className="text-base font-bold text-ink">{r.name}</div>
                    {selected && <span className="w-6 h-6 rounded-full bg-brand-fill text-white flex items-center justify-center"><Check className="w-3.5 h-3.5" /></span>}
                  </div>
                  <div className="text-lg font-bold text-ink mt-1">{formatVnd(r.pricePerTerm)}<span className="text-xs font-medium text-ink-muted"> {t('/ term / student')}</span></div>
                  <p className="text-xs text-ink-muted mt-1">{r.description}</p>
                  <ul className="mt-3 space-y-1">
                    {r.amenities.map((a) => (
                      <li key={a.code} className="flex items-center justify-between text-xs">
                        <span className="text-ink">{a.name}{a.qty > 1 ? ` × ${a.qty}` : ''}</span>
                        <code className="text-label text-ink-subtle">{a.code}</code>
                      </li>
                    ))}
                  </ul>
                  <div className="mt-3 pt-3 border-t border-line flex items-center justify-between text-xs">
                    <span className="text-ink-muted">{r.canChooseRoommate ? t('You choose your roommate') : t('The system assigns roommates')}</span>
                    <span className={clsx('font-semibold', full ? 'text-rose-600' : r.availability === 'LIMITED' ? 'text-amber-600' : 'text-emerald-600')}>
                      {full ? t('Full') : r.availability === 'LIMITED' ? t('Almost full') : t('Available')}
                    </span>
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      )}

      {step === 'roommate' && room && (
        <SectionCard title={t('Roommates')} subtitle={t('Only for 2-person rooms')}>
          <div className="grid grid-cols-2 gap-2 mb-5">
            {(
              [
                ['BY_ID', t('I have a roommate (enter student ID)')],
                ['MATCHING', t('Not yet — match me by criteria')],
              ] as const
            ).map(([m, label]) => (
              <button
                key={m}
                type="button"
                onClick={() => setMode(m)}
                className={clsx('p-3 rounded-xl border text-sm font-semibold', mode === m ? 'border-brand bg-orange-50 text-brand-ink' : 'border-line text-ink-muted hover:border-line-strong')}
              >
                {label}
              </button>
            ))}
          </div>
          {mode === 'BY_ID' ? (
            <div className="space-y-3">
              <div className="flex gap-2">
                <input
                  value={mateId}
                  onChange={(e) => { setMateId(e.target.value.toUpperCase()); setMateInvited(false); }}
                  placeholder={t('Student ID, e.g. SE172211')}
                  className="flex-1 px-3 py-2.5 border border-line rounded-lg text-sm"
                />
                <AppButton variant="outline" disabled={!/^[A-Z]{2}\d{6}$/.test(mateId)} leftIcon={<Mail className="w-4 h-4" />} onClick={() => { setMateInvited(true); show(t('Confirmation email sent to {0}', { 0: mateId })); }}>
                  {t('Send invitation')}
                </AppButton>
              </div>
              {mateInvited && <p className="text-sm text-emerald-700">{t('Invitation sent to')} {mateId}{t('. They must be the same gender and also register for a 2-person room.')}</p>}
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {(
                [
                  ['cohort', t('Cohort')],
                  ['major', t('Major')],
                  ['hometown', t('Hometown')],
                  ['habit', t('Lifestyle')],
                ] as const
              ).map(([key, label]) => (
                <label key={key} className="block">
                  <span className="block text-xs font-semibold text-ink-muted mb-1.5">{label}</span>
                  <select value={match[key]} onChange={(e) => setMatch({ ...match, [key]: e.target.value })} className="w-full px-3 py-2.5 rounded-lg border border-line bg-surface text-sm">
                    {MATCH_OPTIONS[key].map((o) => <option key={o}>{o}</option>)}
                  </select>
                </label>
              ))}
            </div>
          )}
        </SectionCard>
      )}

      {step === 'confirm' && room && (
        <SectionCard title={t('Confirm information & costs')}>
          <dl className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-sm mb-5">
            <div className="p-3 rounded-xl bg-surface-muted"><dt className="text-xs text-ink-muted">{t('Room type')}</dt><dd className="font-semibold">{room.name}</dd></div>
            <div className="p-3 rounded-xl bg-surface-muted"><dt className="text-xs text-ink-muted">{t('Length of stay')}</dt><dd className="font-semibold">{stayTerms[0]?.label} → {stayTerms[stayTerms.length - 1]?.label}</dd></div>
            <div className="p-3 rounded-xl bg-surface-muted">
              <dt className="text-xs text-ink-muted">{t('Roommates')}</dt>
              <dd className="font-semibold">{!room.canChooseRoommate ? t('Assigned by the system') : mode === 'BY_ID' ? mateId : t('Matched by criteria')}</dd>
            </div>
          </dl>
          <table className="w-full text-sm">
            <tbody className="divide-y divide-line">
              <tr><td className="py-2.5 text-ink-muted">{t('Room fee')} {stayTerms[0]?.label} {t('(reference)')}</td><td className="py-2.5 text-right text-ink-muted">{formatVnd(room.pricePerTerm)}</td></tr>
              <tr><td className="py-2.5 text-ink">{t('Holding deposit (')}{DEPOSIT_CONFIG.percent}{t('% of first term fee)')}</td><td className="py-2.5 text-right font-semibold">{formatVnd(deposit)}</td></tr>
              <tr><td className="py-2.5 text-ink">{t('Utility deposit')}</td><td className="py-2.5 text-right font-semibold">{formatVnd(DEPOSIT_CONFIG.utilityDeposit)}</td></tr>
            </tbody>
            <tfoot>
              <tr className="border-t-2 border-slate-900">
                <td className="py-3 font-bold text-ink">{t('Total to pay now')}</td>
                <td className="py-3 text-right text-lg font-bold text-brand-ink">{formatVnd(totalNow)}</td>
              </tr>
            </tfoot>
          </table>
          <p className="text-xs text-ink-muted mt-2">
            {t('The rest of the first term fee (')}{formatVnd(room.pricePerTerm - deposit)}{t(') is paid at check-in. If you don\'t check in during the check-in window, you lose the deposit.')}
          </p>
          <label className="flex items-start gap-2.5 mt-5 text-sm text-ink">
            <input type="checkbox" checked={confirmed} onChange={(e) => setConfirmed(e.target.checked)} className="mt-0.5 w-4 h-4 accent-brand-ink" />
            <span>{t('I have reviewed the fees, agree to the Dormitory Rules and consent to personal data processing under Decree 13/2023/ND-CP.')}</span>
          </label>
        </SectionCard>
      )}

      {step === 'payment' && room && (
        <SectionCard title={t('Pay with VietQR')} subtitle={t('The system confirms automatically when the bank reports a successful transaction')}>
          <div className="flex flex-col md:flex-row items-center gap-8">
            <div className="p-4 rounded-2xl border border-line bg-surface">
              <VietQrCode value={`DEP-${user?.studentId}-${room.id}-${totalNow}`} size={208} />
            </div>
            <div className="flex-1 w-full space-y-3">
              <div>
                <div className="text-xs text-ink-muted">{t('Amount')}</div>
                <div className="text-3xl font-bold text-ink">{formatVnd(totalNow)}</div>
              </div>
              <div className="text-sm text-ink-muted">{t('Payment note:')} <code className="px-2 py-0.5 rounded bg-surface-sunken text-ink">KTX {user?.studentId} DEP SP27</code></div>
              <p className="text-xs text-ink-muted">{t('Open your banking app, scan the code and confirm. No account number needed.')}</p>
              <AppButton onClick={() => { setPhase('DONE'); show(t('Payment successful')); }}>{t('I have paid')}</AppButton>
            </div>
          </div>
        </SectionCard>
      )}

      {step !== 'payment' && (
        <div className="flex justify-between">
          <AppButton variant="outline" disabled={stepIdx === 0} leftIcon={<ArrowLeft className="w-4 h-4" />} onClick={back}>{t('Go back')}</AppButton>
          <AppButton disabled={!canNext} rightIcon={<ArrowRight className="w-4 h-4" />} onClick={next}>
            {step === 'confirm' ? t('Confirm & pay') : t('Continue')}
          </AppButton>
        </div>
      )}
      {step === 'payment' && (
        <AppButton variant="ghost" leftIcon={<ArrowLeft className="w-4 h-4" />} onClick={back}>{t('Back to confirmation')}</AppButton>
      )}
      {toastNode}
    </div>
  );
}
