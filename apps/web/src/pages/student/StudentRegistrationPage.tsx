import { useEffect, useState } from 'react';
import {
  CheckCircle2,
  XCircle,
  ArrowLeft,
  ArrowRight,
  CalendarDays,
  Users,
  Wind,
  Sun,
  Crown,
  Mail,
  MapPin,
  Timer,
  ShieldCheck,
  Lock,
  QrCode,
  Circle,
  Clock,
} from 'lucide-react';
import clsx from 'clsx';
import { useAuthStore } from '@features/auth';
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
 * Thời gian lưu trú → loại phòng (giữ chỗ có thời hạn) → bạn cùng phòng (tùy chọn)
 * → xác nhận & kiểm tra điều kiện → đóng cọc VietQR → đơn chuyển PROCESSING.
 */

type Step = 1 | 2 | 3 | 4 | 5;
type RoommateMode = 'NONE' | 'BY_ID' | 'BY_CRITERIA';
type Phase = 'FORM' | 'SUBMITTED' | 'HOLD_EXPIRED';

const STEPS = ['Thời gian lưu trú', 'Loại phòng', 'Bạn cùng phòng', 'Xác nhận', 'Đóng cọc'];
const HOLD_SECONDS = 15 * 60;

const WINDOW = { status: 'OPEN' as 'SCHEDULED' | 'OPEN' | 'CLOSED', term: 'Spring 2027', opens: '14/10/2026 08:00', closes: '15/11/2026 23:59', daysLeft: 29 };

const PERIODS = [
  { id: 'SP27', label: 'Học kỳ Spring 2027', range: '04/01/2027 – 30/04/2027', months: 4 },
  { id: 'SP27_SU27', label: 'Spring + Summer 2027', range: '04/01/2027 – 25/08/2027', months: 8 },
];

const ROOM_TYPES = [
  { id: 'VIP_2', name: 'Phòng 2 giường', price: 2200000, deposit: 1000000, left: 6, total: 72, icon: Crown, note: 'Máy lạnh, WC riêng' },
  { id: 'AC_4', name: 'Phòng 4 giường máy lạnh', price: 1200000, deposit: 500000, left: 84, total: 720, icon: Wind, note: 'Máy lạnh, WC riêng' },
  { id: 'FAN_4', name: 'Phòng 4 giường quạt', price: 950000, deposit: 500000, left: 31, total: 144, icon: Sun, note: 'Quạt trần, WC riêng' },
  { id: 'STD_6', name: 'Phòng 6 giường', price: 800000, deposit: 300000, left: 0, total: 264, icon: Users, note: 'Quạt trần, WC chung tầng' },
];

const REGIONS = ['Không quan trọng', 'Đông Nam Bộ', 'Tây Nam Bộ', 'Tây Nguyên', 'Nam Trung Bộ', 'Bắc Trung Bộ', 'Miền Bắc'];
const SEMESTERS = ['Không quan trọng', 'Cùng học kỳ với tôi', 'Chênh lệch ≤ 1 kỳ'];
const MAJORS = ['Không quan trọng', 'Cùng ngành với tôi', 'Cùng khối Công nghệ thông tin', 'Cùng khối Kinh tế'];

const NEXT_STEPS = [
  { t: 'Chốt ghép bạn cùng phòng', d: 'Hệ thống chốt cặp đã xác nhận email và ghép theo tiêu chí — 24/11/2026' },
  { t: 'Chạy thuật toán xếp phòng', d: 'Đề xuất được Staff rà soát và Manager phê duyệt — 25/11/2026' },
  { t: 'Nhận kết quả & hợp đồng số', d: 'Xem tại “Phòng của tôi”, ký hợp đồng điện tử' },
  { t: 'Check-in & thanh toán phần còn lại', d: 'Tự quét QR trong khung 02/01 – 05/01/2027' },
];

export function StudentRegistrationPage() {
  const user = useAuthStore((s) => s.user);
  const { show, toastNode } = useToast();
  const [phase, setPhase] = useState<Phase>('FORM');
  const [step, setStep] = useState<Step>(1);
  const [period, setPeriod] = useState(PERIODS[0]!.id);
  const [roomType, setRoomType] = useState<string | null>(null);
  const [holdLeft, setHoldLeft] = useState<number | null>(null);
  const [mode, setMode] = useState<RoommateMode>('NONE');
  const [mateId, setMateId] = useState('');
  const [mateInvited, setMateInvited] = useState(false);
  const [criteria, setCriteria] = useState({ region: REGIONS[1]!, semester: SEMESTERS[1]!, major: MAJORS[1]! });
  const [consent, setConsent] = useState(false);

  const room = ROOM_TYPES.find((r) => r.id === roomType);
  const months = PERIODS.find((p) => p.id === period)?.months ?? 4;

  // Giữ chỗ có thời hạn — hết hạn: System "Release Expired Room Hold" + "Cancel Unpaid Registration"
  useEffect(() => {
    if (holdLeft === null || phase !== 'FORM') return;
    if (holdLeft <= 0) {
      setPhase('HOLD_EXPIRED');
      return;
    }
    const t = window.setTimeout(() => setHoldLeft((s) => (s === null ? s : s - 1)), 1000);
    return () => window.clearTimeout(t);
  }, [holdLeft, phase]);

  const chooseRoom = (id: string) => {
    setRoomType(id);
    setHoldLeft(HOLD_SECONDS);
  };

  const restart = () => {
    setPhase('FORM');
    setStep(1);
    setRoomType(null);
    setHoldLeft(null);
    setConsent(false);
  };

  const inviteMate = () => {
    setMateInvited(true);
    show(`Đã gửi email xác nhận ở chung tới ${mateId.toLowerCase()}@fpt.edu.vn`);
  };

  const paid = () => {
    setPhase('SUBMITTED');
    show('Đóng cọc thành công — đơn đăng ký đã được lưu');
  };

  const eligibility = [
    { label: 'Đang là sinh viên chính quy (FPT SIS)', ok: true },
    { label: 'Không còn công nợ KTX quá hạn', ok: true },
    { label: 'Năm học / ngành thuộc diện được đăng ký kỳ này', ok: true },
    { label: 'Chưa có đơn hiệu lực khác trong kỳ Spring 2027', ok: true },
  ];

  if (WINDOW.status !== 'OPEN') {
    return (
      <div className="space-y-6">
        <PageHeader title="Đăng ký lưu trú" description={`Học kỳ ${WINDOW.term}`} />
        <EmptyState
          icon={<Lock className="w-7 h-7" />}
          title={WINDOW.status === 'SCHEDULED' ? 'Cổng đăng ký chưa mở' : 'Cổng đăng ký đã đóng'}
          description={`Cổng đăng ký mở từ ${WINDOW.opens} đến ${WINDOW.closes}. Bạn sẽ nhận email mời khi cổng mở.`}
        />
      </div>
    );
  }

  if (phase === 'HOLD_EXPIRED') {
    return (
      <div className="max-w-2xl mx-auto space-y-6">
        <PageHeader title="Đăng ký lưu trú" description={`Học kỳ ${WINDOW.term}`} />
        <div className="bg-white p-8 rounded-2xl border border-rose-200 text-center">
          <XCircle className="w-12 h-12 text-rose-500 mx-auto mb-3" />
          <h2 className="text-lg font-bold text-slate-800">Hết thời gian giữ chỗ</h2>
          <p className="text-sm text-slate-500 mt-1">
            Bạn chưa đóng cọc trong 15 phút nên giường đã được nhả lại và đơn bị hủy. Bạn chưa bị trừ tiền.
          </p>
          <AppButton className="mt-5" onClick={restart}>Đăng ký lại</AppButton>
        </div>
      </div>
    );
  }

  if (phase === 'SUBMITTED') {
    return (
      <div className="max-w-3xl mx-auto space-y-6">
        <PageHeader title="Đăng ký lưu trú" description={`Học kỳ ${WINDOW.term}`} />
        <div className="bg-white p-8 rounded-2xl border border-slate-200 text-center">
          <CheckCircle2 className="w-12 h-12 text-emerald-500 mx-auto mb-3" />
          <h2 className="text-lg font-bold text-[#1A365D]">Đơn đăng ký đã được lưu</h2>
          <p className="text-sm text-slate-500 mt-1">
            Mã đơn <strong className="text-[#F26F21]">APP-SP27-004812</strong> · Biên nhận cọc đã gửi tới {user?.email}
          </p>
          <div className="mt-5 grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs text-left">
            <div className="p-3 rounded-xl bg-slate-50"><div className="text-slate-400">Loại phòng</div><div className="font-semibold">{room?.name}</div></div>
            <div className="p-3 rounded-xl bg-slate-50"><div className="text-slate-400">Tiền cọc đã đóng</div><div className="font-semibold">{formatVnd(room?.deposit ?? 0)}</div></div>
            <div className="p-3 rounded-xl bg-slate-50"><div className="text-slate-400">Trạng thái</div><StatusBadge status="PROCESSING" customLabel="Chờ xếp phòng" /></div>
          </div>
        </div>
        <SectionCard title="Tiến trình tiếp theo">
          <ol className="space-y-4">
            {NEXT_STEPS.map((s, i) => (
              <li key={s.t} className="flex gap-3">
                <span className="w-6 h-6 rounded-full bg-[#FFF2EA] text-[#F26F21] text-xs font-bold flex items-center justify-center shrink-0">{i + 1}</span>
                <div>
                  <div className="text-xs font-semibold text-slate-800">{s.t}</div>
                  <div className="text-[11px] text-slate-500">{s.d}</div>
                </div>
              </li>
            ))}
          </ol>
          <p className="mt-4 text-[11px] text-slate-500">
            Nếu vòng 1 không còn giường phù hợp, đơn chuyển sang <strong>Chờ vòng 2</strong>. Bạn có thể hủy để được hoàn cọc.
          </p>
        </SectionCard>
        {toastNode}
      </div>
    );
  }

  const canNext =
    (step === 1 && !!period) ||
    (step === 2 && !!roomType) ||
    (step === 3 && (mode !== 'BY_ID' || mateInvited)) ||
    (step === 4 && consent && eligibility.every((e) => e.ok));

  return (
    <div className="space-y-6">
      <PageHeader
        title="Đăng ký lưu trú"
        description={`Học kỳ ${WINDOW.term} · Cổng mở ${WINDOW.opens} – ${WINDOW.closes}`}
        badge={<StatusBadge status="OPEN" customLabel={`Đang mở · còn ${WINDOW.daysLeft} ngày`} />}
      />

      {holdLeft !== null && (
        <div className={clsx('flex items-center gap-3 p-3.5 rounded-xl border text-xs', holdLeft < 180 ? 'bg-rose-50 border-rose-200 text-rose-800' : 'bg-amber-50 border-amber-200 text-amber-900')}>
          <Timer className="w-5 h-5 shrink-0" />
          <span className="flex-1">
            Đang giữ 1 giường <strong>{room?.name}</strong> cho bạn. Hoàn tất đóng cọc trước khi hết giờ, nếu không giường sẽ được nhả lại.
          </span>
          <span className="text-lg font-bold tabular-nums">{formatCountdown(holdLeft)}</span>
        </div>
      )}

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        <div className="xl:col-span-2 space-y-4 min-w-0">
          <ol className="grid grid-cols-5 gap-1 bg-white p-2 rounded-xl border border-slate-200 min-w-0">
            {STEPS.map((label, i) => (
              <li
                key={label}
                title={label}
                className={clsx(
                  'p-2 rounded-lg text-center text-[11px] font-semibold truncate min-w-0',
                  step > i + 1 && 'bg-emerald-50 text-emerald-700',
                  step === i + 1 && 'bg-[#FFF2EA] text-[#F26F21]',
                  step < i + 1 && 'text-slate-400'
                )}
              >
                <span className="hidden sm:inline">{i + 1}. </span>{label}
              </li>
            ))}
          </ol>

          {step === 1 && (
            <SectionCard title="Chọn thời gian lưu trú">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {PERIODS.map((p) => (
                  <label key={p.id} className={clsx('p-4 rounded-xl border cursor-pointer flex gap-3', period === p.id ? 'border-[#F26F21] bg-orange-50/50' : 'border-slate-200')}>
                    <input type="radio" checked={period === p.id} onChange={() => setPeriod(p.id)} className="mt-0.5 accent-[#F26F21]" />
                    <div>
                      <div className="text-sm font-bold text-slate-800">{p.label}</div>
                      <div className="text-xs text-slate-500 flex items-center gap-1 mt-0.5"><CalendarDays className="w-3.5 h-3.5" />{p.range} · {p.months} tháng</div>
                    </div>
                  </label>
                ))}
              </div>
            </SectionCard>
          )}

          {step === 2 && (
            <SectionCard title="Chọn loại phòng" subtitle="Sức chứa còn lại được cập nhật theo thời gian thực. Khi chọn, hệ thống giữ chỗ cho bạn 15 phút.">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {ROOM_TYPES.map((r) => {
                  const full = r.left === 0;
                  return (
                    <button
                      key={r.id}
                      type="button"
                      disabled={full}
                      onClick={() => chooseRoom(r.id)}
                      className={clsx(
                        'p-4 rounded-xl border text-left flex gap-3 transition disabled:opacity-50 disabled:cursor-not-allowed',
                        roomType === r.id ? 'border-[#F26F21] bg-orange-50/50 ring-2 ring-orange-100' : 'border-slate-200 hover:border-slate-300'
                      )}
                    >
                      <r.icon className="w-5 h-5 text-[#1A365D] mt-0.5 shrink-0" />
                      <div className="flex-1">
                        <div className="text-xs font-bold text-slate-800">{r.name}</div>
                        <div className="text-[11px] text-slate-500">{r.note}</div>
                        <div className="text-sm font-bold text-[#F26F21] mt-1">{formatVnd(r.price)}/tháng</div>
                        <div className={clsx('text-[11px] font-semibold mt-1', full ? 'text-rose-600' : r.left < 10 ? 'text-amber-600' : 'text-emerald-600')}>
                          {full ? 'Đã hết chỗ' : `Còn ${r.left}/${r.total} giường`}
                        </div>
                      </div>
                    </button>
                  );
                })}
              </div>
            </SectionCard>
          )}

          {step === 3 && (
            <SectionCard title="Bạn cùng phòng (không bắt buộc)" subtitle="Hệ thống sẽ chốt ghép trước khi chạy thuật toán xếp phòng">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 mb-5">
                {(
                  [
                    ['NONE', 'Để hệ thống tự xếp'],
                    ['BY_ID', 'Tôi đã có bạn cùng phòng'],
                    ['BY_CRITERIA', 'Ghép theo tiêu chí'],
                  ] as const
                ).map(([m, label]) => (
                  <button
                    key={m}
                    type="button"
                    onClick={() => setMode(m)}
                    className={clsx('p-3 rounded-lg border text-xs font-semibold', mode === m ? 'border-[#1A365D] bg-[#EBF2FB] text-[#1A365D]' : 'border-slate-200 text-slate-600')}
                  >
                    {label}
                  </button>
                ))}
              </div>

              {mode === 'BY_ID' && (
                <div className="space-y-3 text-xs">
                  <label className="block font-semibold text-slate-700">Mã sinh viên của bạn cùng phòng</label>
                  <div className="flex gap-2">
                    <input
                      value={mateId}
                      onChange={(e) => { setMateId(e.target.value.toUpperCase()); setMateInvited(false); }}
                      placeholder="VD: SE172211"
                      className="flex-1 px-3 py-2 border border-slate-200 rounded-lg"
                    />
                    <AppButton size="sm" variant="outline" disabled={!/^[A-Z]{2}\d{6}$/.test(mateId)} leftIcon={<Mail className="w-3.5 h-3.5" />} onClick={inviteMate}>
                      Gửi email xác nhận
                    </AppButton>
                  </div>
                  {mateInvited && (
                    <div className="p-3 rounded-lg bg-emerald-50 text-emerald-800 flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4" /> Đã gửi lời mời tới {mateId}. Hai bạn cần cùng giới tính và cùng chọn loại phòng {room?.name}.
                    </div>
                  )}
                </div>
              )}

              {mode === 'BY_CRITERIA' && (
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                  {(
                    [
                      ['region', 'Vùng / quê quán', REGIONS, MapPin],
                      ['semester', 'Học kỳ', SEMESTERS, CalendarDays],
                      ['major', 'Ngành học', MAJORS, Users],
                    ] as const
                  ).map(([key, label, options, Icon]) => (
                    <div key={key}>
                      <label className="font-semibold text-slate-700 flex items-center gap-1 mb-1"><Icon className="w-3.5 h-3.5" />{label}</label>
                      <select
                        value={criteria[key]}
                        onChange={(e) => setCriteria({ ...criteria, [key]: e.target.value })}
                        className="w-full px-3 py-2 border border-slate-200 rounded-lg bg-white"
                      >
                        {options.map((o) => <option key={o}>{o}</option>)}
                      </select>
                    </div>
                  ))}
                </div>
              )}

              {mode === 'NONE' && <p className="text-xs text-slate-500">Bạn sẽ được xếp cùng sinh viên cùng giới tính, cùng loại phòng theo thuật toán của hệ thống.</p>}
            </SectionCard>
          )}

          {step === 4 && (
            <SectionCard title="Xác nhận thông tin & kiểm tra điều kiện" subtitle="Điều kiện kiểm tra tự động với dữ liệu FPT SIS">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs mb-5">
                {[
                  ['Họ tên', user?.name ?? ''],
                  ['MSSV', user?.studentId ?? 'SE171234'],
                  ['Thời gian lưu trú', PERIODS.find((p) => p.id === period)?.label ?? ''],
                  ['Loại phòng', room?.name ?? ''],
                  ['Bạn cùng phòng', mode === 'BY_ID' ? mateId : mode === 'BY_CRITERIA' ? 'Ghép theo tiêu chí' : 'Hệ thống tự xếp'],
                  ['Tiền cọc', formatVnd(room?.deposit ?? 0)],
                ].map(([k, v]) => (
                  <div key={k} className="p-3 rounded-lg bg-slate-50"><div className="text-slate-400">{k}</div><div className="font-semibold text-slate-800">{v}</div></div>
                ))}
              </div>
              <ul className="space-y-2 mb-5">
                {eligibility.map((e) => (
                  <li key={e.label} className="flex items-center gap-2 text-xs">
                    {e.ok ? <CheckCircle2 className="w-4 h-4 text-emerald-500" /> : <XCircle className="w-4 h-4 text-rose-500" />}
                    <span className={e.ok ? 'text-slate-700' : 'text-rose-700 font-semibold'}>{e.label}</span>
                  </li>
                ))}
              </ul>
              <label className="flex items-start gap-2 text-xs text-slate-700">
                <input type="checkbox" checked={consent} onChange={(e) => setConsent(e.target.checked)} className="mt-0.5 accent-[#F26F21]" />
                <span>
                  Tôi đồng ý với <strong>Nội quy KTX</strong> và cho phép xử lý dữ liệu cá nhân cho mục đích xếp phòng theo
                  <strong> Nghị định 13/2023/NĐ-CP</strong>.
                </span>
              </label>
            </SectionCard>
          )}

          {step === 5 && room && (
            <SectionCard title="Đóng tiền cọc qua VietQR" subtitle="Hệ thống tự xác nhận khi ngân hàng báo giao dịch thành công">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 items-center">
                <div className="flex flex-col items-center p-4 rounded-2xl border border-slate-200">
                  <div className="text-[11px] font-bold text-[#1A365D] mb-2 flex items-center gap-1"><QrCode className="w-3.5 h-3.5" />VIETQR · NAPAS 247</div>
                  <VietQrCode value={`DEP-${user?.studentId}-${room.id}`} />
                  <div className="text-[11px] text-slate-500 mt-2 flex items-center gap-1"><Clock className="w-3 h-3" /> Đang chờ thanh toán…</div>
                </div>
                <div className="space-y-2 text-xs">
                  {[
                    ['Số tiền', formatVnd(room.deposit)],
                    ['Ngân hàng', 'Vietcombank'],
                    ['Chủ tài khoản', 'TRUONG DAI HOC FPT'],
                    ['Nội dung', `KTX ${user?.studentId ?? 'SE171234'} DEP SP27`],
                  ].map(([k, v]) => (
                    <div key={k} className="flex justify-between p-2.5 rounded-lg bg-slate-50"><span className="text-slate-500">{k}</span><span className="font-semibold">{v}</span></div>
                  ))}
                  <AppButton className="w-full mt-2" leftIcon={<ShieldCheck className="w-4 h-4" />} onClick={paid}>
                    Mô phỏng: ngân hàng báo thành công
                  </AppButton>
                </div>
              </div>
            </SectionCard>
          )}

          <div className="flex justify-between">
            <AppButton variant="outline" disabled={step === 1} leftIcon={<ArrowLeft className="w-4 h-4" />} onClick={() => setStep((s) => (s - 1) as Step)}>
              Quay lại
            </AppButton>
            {step < 5 && (
              <AppButton disabled={!canNext} rightIcon={<ArrowRight className="w-4 h-4" />} onClick={() => setStep((s) => (s + 1) as Step)}>
                {step === 4 ? 'Xác nhận & tạo hóa đơn cọc' : 'Tiếp tục'}
              </AppButton>
            )}
          </div>
        </div>

        <div className="space-y-6">
          <SectionCard title="Dự toán chi phí">
            <div className="space-y-2 text-xs">
              <div className="flex justify-between"><span className="text-slate-500">Phí phòng</span><span className="font-semibold">{room ? `${formatVnd(room.price)} × ${months}` : '—'}</span></div>
              <div className="flex justify-between"><span className="text-slate-500">Đóng ngay (tiền cọc)</span><span className="font-semibold text-[#F26F21]">{room ? formatVnd(room.deposit) : '—'}</span></div>
              <div className="flex justify-between"><span className="text-slate-500">Đóng khi check-in</span><span className="font-semibold">{room ? formatVnd(room.price * months - room.deposit) : '—'}</span></div>
              <div className="border-t border-dashed pt-2 flex justify-between text-sm"><span className="font-bold">Tổng kỳ</span><span className="font-bold">{room ? formatVnd(room.price * months) : '—'}</span></div>
              <p className="text-[11px] text-slate-400">Không đến nhận phòng trong khung check-in sẽ mất tiền cọc.</p>
            </div>
          </SectionCard>

          <SectionCard title="Mốc thời gian Spring 2027">
            <ul className="space-y-3 text-xs">
              {[
                { d: '14/10 – 15/11', t: 'Nộp đơn & đóng cọc', active: true },
                { d: '24/11', t: 'Chốt ghép bạn cùng phòng' },
                { d: '25/11', t: 'Xếp phòng vòng 1' },
                { d: '02/12', t: 'Vòng 2 & lấp chỗ trống' },
                { d: '02/01 – 05/01', t: 'Check-in tự phục vụ' },
              ].map((m) => (
                <li key={m.t} className="flex gap-3">
                  {m.active ? <CheckCircle2 className="w-4 h-4 text-[#F26F21] shrink-0" /> : <Circle className="w-4 h-4 text-slate-300 shrink-0" />}
                  <div>
                    <div className={clsx('font-semibold', m.active ? 'text-[#F26F21]' : 'text-slate-800')}>{m.d}</div>
                    <div className="text-slate-500">{m.t}</div>
                  </div>
                </li>
              ))}
            </ul>
          </SectionCard>
        </div>
      </div>
      {toastNode}
    </div>
  );
}
