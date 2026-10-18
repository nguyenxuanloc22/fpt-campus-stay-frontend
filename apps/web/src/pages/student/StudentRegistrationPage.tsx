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
  useToast,
} from '@shared-ui';

/**
 * F1 — Đăng ký lưu trú (docs/BUSINESS_FLOWS.md).
 * Kiểm tra thông tin & điều kiện → thời gian lưu trú → loại phòng → (phòng 2 người) bạn cùng phòng
 * → xác nhận chi phí → thanh toán tiền cọc qua VietQR.
 */

type StepKey = 'eligibility' | 'term' | 'room' | 'roommate' | 'confirm' | 'payment';
type Phase = 'FORM' | 'DONE' | 'HOLD_EXPIRED';
type RoommateMode = 'BY_ID' | 'MATCHING';

const STEP_LABEL: Record<StepKey, string> = {
  eligibility: 'Kiểm tra điều kiện',
  term: 'Thời gian lưu trú',
  room: 'Loại phòng',
  roommate: 'Bạn cùng phòng',
  confirm: 'Xác nhận chi phí',
  payment: 'Thanh toán',
};

const HOLD_SECONDS = 15 * 60;
const WINDOW = { open: true, term: 'Spring 2027', opens: '14/10/2026', closes: '15/11/2026' };
/** Sinh viên đang ở kỳ 5 (Fall 2026) → kỳ đăng ký kế tiếp là kỳ 6 (Spring 2027). */
const STUDENT_SEMESTER = { current: 5, next: 6, cohort: 'K17' };

const MATCH_OPTIONS = {
  cohort: ['Cùng khóa K17', 'Không quan trọng'],
  major: ['Kỹ thuật phần mềm', 'Cùng khối CNTT', 'Không quan trọng'],
  hometown: ['Cùng vùng Đông Nam Bộ', 'Không quan trọng'],
  habit: ['Ngủ sớm, yên tĩnh', 'Học khuya', 'Không quan trọng'],
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
    { label: 'Là sinh viên FPT University (tài khoản @fpt.edu.vn, có trên FPT SIS)', ok: isFptu },
    { label: 'Đang học chính quy', ok: true },
    { label: `Kỳ hiện tại ${STUDENT_SEMESTER.current} — còn trong giới hạn lưu trú đến kỳ 9`, ok: STUDENT_SEMESTER.current < 9 },
    { label: 'Không còn công nợ KTX quá hạn', ok: true },
    { label: `Chưa có đơn hiệu lực trong kỳ ${WINDOW.term}`, ok: true },
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
        <PageHeader title="Đăng ký lưu trú" />
        <EmptyState icon={<Lock className="w-7 h-7" />} title="Cổng đăng ký chưa mở" description={`Bạn sẽ nhận email khi cổng đăng ký kỳ ${WINDOW.term} mở.`} />
      </div>
    );
  }

  if (phase === 'HOLD_EXPIRED') {
    return (
      <div className="max-w-xl mx-auto space-y-6">
        <PageHeader title="Đăng ký lưu trú" />
        <SectionCard>
          <div className="text-center py-6">
            <XCircle className="w-10 h-10 text-slate-400 mx-auto mb-3" />
            <div className="text-base font-bold text-slate-900">Hết thời gian giữ chỗ</div>
            <p className="text-sm text-slate-500 mt-1">Bạn chưa đóng cọc trong 15 phút nên chỗ đã được nhả lại. Bạn chưa bị trừ tiền.</p>
            <AppButton className="mt-5" onClick={restart}>Đăng ký lại</AppButton>
          </div>
        </SectionCard>
      </div>
    );
  }

  if (phase === 'DONE') {
    return (
      <div className="max-w-2xl mx-auto space-y-6">
        <PageHeader title="Đăng ký lưu trú" />
        <SectionCard>
          <div className="text-center py-4">
            <CheckCircle2 className="w-12 h-12 text-emerald-500 mx-auto mb-3" />
            <div className="text-lg font-bold text-slate-900">Đăng ký thành công</div>
            <p className="text-sm text-slate-500 mt-1">Mã đơn <strong className="text-slate-900">APP-SP27-004812</strong> · Biên nhận đã gửi tới {user?.email}</p>
          </div>
          <dl className="grid grid-cols-2 gap-3 text-sm mt-4">
            <div className="p-3 rounded-xl bg-slate-50"><dt className="text-xs text-slate-500">Loại phòng</dt><dd className="font-semibold">{room?.name}</dd></div>
            <div className="p-3 rounded-xl bg-slate-50"><dt className="text-xs text-slate-500">Thời gian</dt><dd className="font-semibold">{stayTerms[0]?.label} → {stayTerms[stayTerms.length - 1]?.label}</dd></div>
            <div className="p-3 rounded-xl bg-slate-50"><dt className="text-xs text-slate-500">Đã thanh toán</dt><dd className="font-semibold">{formatVnd(totalNow)}</dd></div>
            <div className="p-3 rounded-xl bg-slate-50"><dt className="text-xs text-slate-500">Trạng thái</dt><dd><StatusBadge status="PROCESSING" customLabel="Chờ xếp phòng" /></dd></div>
          </dl>
          <p className="text-xs text-slate-500 mt-4">Kết quả xếp phòng và hợp đồng sẽ hiển thị tại “Phòng của tôi”. Phần phí phòng còn lại thanh toán khi check-in.</p>
        </SectionCard>
        {toastNode}
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-5xl">
      <PageHeader
        title="Đăng ký lưu trú"
        description={`Học kỳ ${WINDOW.term} · Cổng đăng ký mở ${WINDOW.opens} – ${WINDOW.closes}`}
        badge={<StatusBadge status="OPEN" customLabel="Đang mở" />}
      />

      <ol className="flex items-center gap-2 overflow-x-auto pb-1">
        {steps.map((s, i) => (
          <li key={s} className="flex items-center gap-2 shrink-0">
            <span
              className={clsx(
                'w-7 h-7 rounded-full text-xs font-bold flex items-center justify-center',
                i < stepIdx && 'bg-emerald-500 text-white',
                i === stepIdx && 'bg-[#F26F21] text-white',
                i > stepIdx && 'bg-slate-100 text-slate-400'
              )}
            >
              {i < stepIdx ? <Check className="w-3.5 h-3.5" /> : i + 1}
            </span>
            <span className={clsx('text-xs font-semibold', i === stepIdx ? 'text-slate-900' : 'text-slate-400')}>{STEP_LABEL[s]}</span>
            {i < steps.length - 1 && <span className="w-6 h-px bg-slate-200" />}
          </li>
        ))}
      </ol>

      {holdLeft !== null && stepIdx >= steps.indexOf('room') && (
        <div className="flex items-center gap-3 px-4 py-3 rounded-xl border border-slate-200 bg-white text-sm">
          <Timer className="w-4 h-4 text-[#F26F21] shrink-0" />
          <span className="flex-1 text-slate-600">Hệ thống đang giữ chỗ <strong className="text-slate-900">{room?.name}</strong> cho bạn. Hoàn tất thanh toán trước khi hết giờ.</span>
          <span className={clsx('font-bold tabular-nums', holdLeft < 180 ? 'text-rose-600' : 'text-slate-900')}>{formatCountdown(holdLeft)}</span>
        </div>
      )}

      {step === 'eligibility' && (
        <SectionCard title="Kiểm tra thông tin & điều kiện" subtitle="Dữ liệu lấy từ FPT SIS, điều kiện theo cấu hình của Quản trị viên">
          <dl className="grid grid-cols-2 md:grid-cols-4 gap-3 text-sm mb-5">
            {[
              ['Họ tên', user?.name ?? '—'],
              ['MSSV', user?.studentId ?? '—'],
              ['Email', user?.email ?? '—'],
              ['Khóa · Kỳ hiện tại', `${STUDENT_SEMESTER.cohort} · Kỳ ${STUDENT_SEMESTER.current}`],
            ].map(([k, v]) => (
              <div key={k} className="p-3 rounded-xl bg-slate-50 min-w-0"><dt className="text-xs text-slate-500">{k}</dt><dd className="font-semibold text-slate-900 truncate">{v}</dd></div>
            ))}
          </dl>
          <ul className="space-y-2.5">
            {checks.map((c) => (
              <li key={c.label} className="flex items-center gap-2.5 text-sm">
                {c.ok ? <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" /> : <XCircle className="w-4 h-4 text-rose-500 shrink-0" />}
                <span className={c.ok ? 'text-slate-700' : 'text-rose-700 font-semibold'}>{c.label}</span>
              </li>
            ))}
          </ul>
          {!eligible && <p className="mt-4 text-sm text-rose-600">Chỉ sinh viên FPT University đủ điều kiện mới được đăng ký lưu trú.</p>}
        </SectionCard>
      )}

      {step === 'term' && (
        <SectionCard title="Thời gian lưu trú" subtitle="Mỗi năm có 3 kỳ: Spring, Summer, Fall. Bạn được đăng ký lưu trú tối đa đến kỳ 9.">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div>
              <div className="text-xs font-semibold text-slate-500 mb-1.5">Kỳ bắt đầu (hệ thống tự xác định)</div>
              <div className="px-3 py-2.5 rounded-lg bg-slate-50 border border-slate-200 text-sm font-semibold text-slate-900">
                {terms[0]!.label} · Kỳ {terms[0]!.semester}
              </div>
            </div>
            <div>
              <label htmlFor="end-term" className="block text-xs font-semibold text-slate-500 mb-1.5">Lưu trú đến hết kỳ</label>
              <select id="end-term" value={endSemester} onChange={(e) => setEndSemester(Number(e.target.value))} className="w-full px-3 py-2.5 rounded-lg border border-slate-200 bg-white text-sm">
                {terms.map((t) => <option key={t.semester} value={t.semester}>{t.label} · Kỳ {t.semester}</option>)}
              </select>
            </div>
          </div>
          <div className="mt-5 flex flex-wrap gap-2">
            {terms.map((t) => (
              <span key={t.semester} className={clsx('px-3 py-1.5 rounded-full text-xs font-semibold border', t.semester <= endSemester ? 'bg-[#F26F21] text-white border-[#F26F21]' : 'bg-white text-slate-400 border-slate-200')}>
                {t.label}
              </span>
            ))}
          </div>
          <p className="text-xs text-slate-500 mt-3">Đăng ký {stayTerms.length} kỳ. Phí phòng được thu theo từng kỳ; kỳ đầu thanh toán khi check-in.</p>
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
                  'text-left rounded-2xl border bg-white overflow-hidden transition disabled:opacity-50',
                  selected ? 'border-[#F26F21] ring-2 ring-orange-100' : 'border-slate-200 hover:border-slate-300'
                )}
              >
                <RoomTypeIllustration type={r.id} className="w-full h-36 bg-slate-50" />
                <div className="p-4">
                  <div className="flex items-start justify-between gap-2">
                    <div className="text-base font-bold text-slate-900">{r.name}</div>
                    {selected && <span className="w-6 h-6 rounded-full bg-[#F26F21] text-white flex items-center justify-center"><Check className="w-3.5 h-3.5" /></span>}
                  </div>
                  <div className="text-lg font-bold text-slate-900 mt-1">{formatVnd(r.pricePerTerm)}<span className="text-xs font-medium text-slate-500"> / kỳ / sinh viên</span></div>
                  <p className="text-xs text-slate-500 mt-1">{r.description}</p>
                  <ul className="mt-3 space-y-1">
                    {r.amenities.map((a) => (
                      <li key={a.code} className="flex items-center justify-between text-xs">
                        <span className="text-slate-700">{a.name}{a.qty > 1 ? ` × ${a.qty}` : ''}</span>
                        <code className="text-[10px] text-slate-400">{a.code}</code>
                      </li>
                    ))}
                  </ul>
                  <div className="mt-3 pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                    <span className="text-slate-500">{r.canChooseRoommate ? 'Được chọn bạn cùng phòng' : 'Hệ thống tự xếp bạn cùng phòng'}</span>
                    <span className={clsx('font-semibold', full ? 'text-rose-600' : r.availability === 'LIMITED' ? 'text-amber-600' : 'text-emerald-600')}>
                      {full ? 'Hết chỗ' : r.availability === 'LIMITED' ? 'Sắp hết' : 'Còn chỗ'}
                    </span>
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      )}

      {step === 'roommate' && room && (
        <SectionCard title="Bạn cùng phòng" subtitle="Chỉ áp dụng cho phòng 2 người">
          <div className="grid grid-cols-2 gap-2 mb-5">
            {(
              [
                ['BY_ID', 'Đã có bạn cùng phòng (nhập MSSV)'],
                ['MATCHING', 'Chưa có — hệ thống ghép theo tiêu chí'],
              ] as const
            ).map(([m, label]) => (
              <button
                key={m}
                type="button"
                onClick={() => setMode(m)}
                className={clsx('p-3 rounded-xl border text-sm font-semibold', mode === m ? 'border-[#F26F21] bg-orange-50 text-[#C2410C]' : 'border-slate-200 text-slate-600 hover:border-slate-300')}
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
                  placeholder="MSSV, ví dụ SE172211"
                  className="flex-1 px-3 py-2.5 border border-slate-200 rounded-lg text-sm"
                />
                <AppButton variant="outline" disabled={!/^[A-Z]{2}\d{6}$/.test(mateId)} leftIcon={<Mail className="w-4 h-4" />} onClick={() => { setMateInvited(true); show(`Đã gửi email xác nhận tới ${mateId}`); }}>
                  Gửi lời mời
                </AppButton>
              </div>
              {mateInvited && <p className="text-sm text-emerald-700">Đã gửi lời mời tới {mateId}. Bạn ấy cần cùng giới tính và cũng đăng ký phòng 2 người.</p>}
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {(
                [
                  ['cohort', 'Khóa học'],
                  ['major', 'Chuyên ngành'],
                  ['hometown', 'Quê quán'],
                  ['habit', 'Thói quen sinh hoạt'],
                ] as const
              ).map(([key, label]) => (
                <label key={key} className="block">
                  <span className="block text-xs font-semibold text-slate-500 mb-1.5">{label}</span>
                  <select value={match[key]} onChange={(e) => setMatch({ ...match, [key]: e.target.value })} className="w-full px-3 py-2.5 rounded-lg border border-slate-200 bg-white text-sm">
                    {MATCH_OPTIONS[key].map((o) => <option key={o}>{o}</option>)}
                  </select>
                </label>
              ))}
            </div>
          )}
        </SectionCard>
      )}

      {step === 'confirm' && room && (
        <SectionCard title="Xác nhận thông tin & chi phí">
          <dl className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-sm mb-5">
            <div className="p-3 rounded-xl bg-slate-50"><dt className="text-xs text-slate-500">Loại phòng</dt><dd className="font-semibold">{room.name}</dd></div>
            <div className="p-3 rounded-xl bg-slate-50"><dt className="text-xs text-slate-500">Thời gian lưu trú</dt><dd className="font-semibold">{stayTerms[0]?.label} → {stayTerms[stayTerms.length - 1]?.label}</dd></div>
            <div className="p-3 rounded-xl bg-slate-50">
              <dt className="text-xs text-slate-500">Bạn cùng phòng</dt>
              <dd className="font-semibold">{!room.canChooseRoommate ? 'Hệ thống xếp' : mode === 'BY_ID' ? mateId : 'Ghép theo tiêu chí'}</dd>
            </div>
          </dl>
          <table className="w-full text-sm">
            <tbody className="divide-y divide-slate-100">
              <tr><td className="py-2.5 text-slate-600">Phí phòng {stayTerms[0]?.label} (tham khảo)</td><td className="py-2.5 text-right text-slate-500">{formatVnd(room.pricePerTerm)}</td></tr>
              <tr><td className="py-2.5 text-slate-900">Tiền cọc giữ chỗ ({DEPOSIT_CONFIG.percent}% phí kỳ đầu)</td><td className="py-2.5 text-right font-semibold">{formatVnd(deposit)}</td></tr>
              <tr><td className="py-2.5 text-slate-900">Cọc điện nước</td><td className="py-2.5 text-right font-semibold">{formatVnd(DEPOSIT_CONFIG.utilityDeposit)}</td></tr>
            </tbody>
            <tfoot>
              <tr className="border-t-2 border-slate-900">
                <td className="py-3 font-bold text-slate-900">Tổng thanh toán ngay</td>
                <td className="py-3 text-right text-lg font-bold text-[#F26F21]">{formatVnd(totalNow)}</td>
              </tr>
            </tfoot>
          </table>
          <p className="text-xs text-slate-500 mt-2">
            Phần còn lại của phí kỳ đầu ({formatVnd(room.pricePerTerm - deposit)}) thanh toán khi check-in. Không nhận phòng trong khung check-in sẽ mất tiền cọc.
          </p>
          <label className="flex items-start gap-2.5 mt-5 text-sm text-slate-700">
            <input type="checkbox" checked={confirmed} onChange={(e) => setConfirmed(e.target.checked)} className="mt-0.5 w-4 h-4 accent-[#F26F21]" />
            <span>Tôi đã kiểm tra các khoản phí, đồng ý với Nội quy KTX và cho phép xử lý dữ liệu cá nhân theo Nghị định 13/2023/NĐ-CP.</span>
          </label>
        </SectionCard>
      )}

      {step === 'payment' && room && (
        <SectionCard title="Thanh toán qua VietQR" subtitle="Hệ thống tự xác nhận khi ngân hàng báo giao dịch thành công">
          <div className="flex flex-col md:flex-row items-center gap-8">
            <div className="p-4 rounded-2xl border border-slate-200 bg-white">
              <VietQrCode value={`DEP-${user?.studentId}-${room.id}-${totalNow}`} size={208} />
            </div>
            <div className="flex-1 w-full space-y-3">
              <div>
                <div className="text-xs text-slate-500">Số tiền</div>
                <div className="text-3xl font-bold text-slate-900">{formatVnd(totalNow)}</div>
              </div>
              <div className="text-sm text-slate-600">Nội dung: <code className="px-2 py-0.5 rounded bg-slate-100 text-slate-900">KTX {user?.studentId} DEP SP27</code></div>
              <p className="text-xs text-slate-500">Mở ứng dụng ngân hàng, quét mã và xác nhận. Không cần nhập số tài khoản.</p>
              <AppButton onClick={() => { setPhase('DONE'); show('Thanh toán thành công'); }}>Tôi đã thanh toán</AppButton>
            </div>
          </div>
        </SectionCard>
      )}

      {step !== 'payment' && (
        <div className="flex justify-between">
          <AppButton variant="outline" disabled={stepIdx === 0} leftIcon={<ArrowLeft className="w-4 h-4" />} onClick={back}>Quay lại</AppButton>
          <AppButton disabled={!canNext} rightIcon={<ArrowRight className="w-4 h-4" />} onClick={next}>
            {step === 'confirm' ? 'Xác nhận & thanh toán' : 'Tiếp tục'}
          </AppButton>
        </div>
      )}
      {step === 'payment' && (
        <AppButton variant="ghost" leftIcon={<ArrowLeft className="w-4 h-4" />} onClick={back}>Quay lại xác nhận</AppButton>
      )}
      {toastNode}
    </div>
  );
}
