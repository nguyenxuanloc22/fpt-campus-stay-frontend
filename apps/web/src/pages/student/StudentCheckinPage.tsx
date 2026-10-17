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
  useToast,
} from '@shared-ui';

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
  building: 'Tòa A (Nữ)',
  window: '02/01/2027 08:00 – 05/01/2027 20:00',
  remaining: 4160000,
};

const ASSETS = [
  'Khóa cửa & thẻ từ',
  'Giường tầng + nệm',
  'Bàn ghế học tập',
  'Tủ quần áo có khóa',
  'Máy lạnh + remote',
  'Bình nóng lạnh',
  'Đèn chiếu sáng',
  'Rèm cửa sổ',
];

const HISTORY = [
  { type: 'IN', term: 'Fall 2026', room: 'A204 - G1', date: '30/08/2026 09:42', by: 'Tự phục vụ (QR)', status: 'CHECKED_IN' },
  { type: 'OUT', term: 'Summer 2026', room: 'A204 - G1', date: '24/08/2026 15:10', by: 'Tự phục vụ · CB Nguyễn Thu Hà xác minh', status: 'CHECKED_OUT' },
  { type: 'IN', term: 'Summer 2026', room: 'A204 - G1', date: '06/05/2026 21:15', by: 'Check-in trễ · CB Trần Văn Cường', status: 'CHECKED_IN' },
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
          <div key={a} className="flex items-center justify-between p-2.5 rounded-lg border border-slate-200 text-xs">
            <span className="text-slate-700">{a}</span>
            <div className="flex gap-1">
              {(['OK', 'ISSUE'] as const).map((c) => (
                <button
                  key={c}
                  type="button"
                  onClick={() => onChange(a, c)}
                  className={clsx(
                    'px-2 py-1 rounded-md font-semibold',
                    values[a] === c ? (c === 'OK' ? 'bg-emerald-500 text-white' : 'bg-rose-500 text-white') : 'bg-slate-100 text-slate-500'
                  )}
                >
                  {c === 'OK' ? 'Tốt' : 'Có vấn đề'}
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
        placeholder="Mô tả sự cố (nếu có) — sẽ tự tạo yêu cầu bảo trì"
        className="w-full px-3 py-2 text-xs border border-slate-200 rounded-lg"
      />
      <button type="button" className="w-full p-3 rounded-xl border-2 border-dashed border-slate-300 text-xs text-slate-500 flex items-center justify-center gap-2 hover:border-[#F26F21]">
        <Camera className="w-4 h-4" /> Chụp ảnh hiện trạng phòng
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
    show(issues ? `Đã nhận phòng — ${issues} sự cố được chuyển thành yêu cầu bảo trì` : 'Check-in thành công. Chào mừng bạn về phòng!');
  };

  const FLOW: { key: CheckinStep; label: string; icon: typeof QrCode }[] = [
    { key: 'SCAN', label: 'Quét QR', icon: ScanLine },
    { key: 'PAY', label: 'Thanh toán', icon: CreditCard },
    { key: 'ACCESS', label: 'Nhận quyền vào phòng', icon: KeyRound },
    { key: 'REPORT', label: 'Biên bản hiện trạng', icon: ClipboardCheck },
  ];
  const order: CheckinStep[] = ['SCAN', 'PAY', 'ACCESS', 'REPORT', 'DONE'];
  const idx = order.indexOf(step === 'OUT_OF_WINDOW' ? 'SCAN' : step);

  return (
    <div className="space-y-6">
      <PageHeader title="Check-in / Check-out" description="Tự nhận và trả phòng bằng mã QR, kèm biên bản hiện trạng số" />

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="md:col-span-2 p-5 rounded-2xl bg-slate-900 text-white flex flex-col sm:flex-row sm:items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-white/10 flex items-center justify-center"><KeyRound className="w-7 h-7 text-orange-300" /></div>
          <div className="flex-1">
            <div className="text-xs text-slate-300">Phân bổ học kỳ {ASSIGNMENT.term}</div>
            <div className="text-lg font-bold">Phòng {ASSIGNMENT.room} · Giường {ASSIGNMENT.bed}</div>
            <div className="text-xs text-slate-300">{ASSIGNMENT.building} · Khung check-in {ASSIGNMENT.window}</div>
          </div>
          <StatusBadge status={step === 'DONE' ? 'CHECKED_IN' : 'ASSIGNED'} customLabel={step === 'DONE' ? undefined : 'Chờ nhận phòng'} />
        </div>
        <div className="p-5 rounded-2xl bg-amber-50 border border-amber-200 text-xs text-amber-900 flex gap-2">
          <AlertTriangle className="w-5 h-5 shrink-0 text-amber-600" />
          <span>
            Không check-in trước <strong>20:00 ngày 05/01/2027</strong> và không liên hệ cán bộ KTX, hệ thống sẽ hủy phân bổ và <strong>giữ lại tiền cọc</strong>.
          </span>
        </div>
      </div>

      <Tabs<TabKey>
        items={[
          { value: 'checkin', label: 'Check-in' },
          { value: 'checkout', label: 'Check-out' },
          { value: 'history', label: 'Lịch sử', count: HISTORY.length },
        ]}
        value={tab}
        onChange={setTab}
      />

      {tab === 'checkin' && (
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
          <div className="xl:col-span-2 space-y-4">
            <ol className="grid grid-cols-4 gap-2">
              {FLOW.map((f, i) => (
                <li key={f.key} className={clsx('p-3 rounded-xl border text-center text-[11px] font-semibold', i < idx ? 'bg-emerald-50 border-emerald-200 text-emerald-700' : i === idx ? 'bg-[#FFF2EA] border-orange-200 text-[#F26F21]' : 'bg-white border-slate-200 text-slate-400')}>
                  <f.icon className="w-4 h-4 mx-auto mb-1" />
                  {f.label}
                </li>
              ))}
            </ol>

            {step === 'SCAN' && (
              <SectionCard title="Bước 1 — Quét mã QR tại sảnh tòa nhà" subtitle="Mã QR dán tại quầy sảnh Tòa A; quét bằng ứng dụng CampusStay hoặc camera điện thoại">
                <div className="flex flex-col sm:flex-row items-center gap-6">
                  <div className="w-40 h-40 rounded-2xl border-2 border-dashed border-slate-300 flex flex-col items-center justify-center text-slate-400 text-xs gap-2">
                    <ScanLine className="w-10 h-10" /> Khung quét
                  </div>
                  <div className="flex-1 space-y-3 text-xs">
                    <p className="text-slate-600">Hệ thống sẽ kiểm tra khung thời gian check-in và điều kiện nhận phòng của bạn.</p>
                    <AppButton leftIcon={<QrCode className="w-4 h-4" />} onClick={scan}>Quét mã QR</AppButton>
                    <button type="button" onClick={() => setStep('OUT_OF_WINDOW')} className="block text-xs font-semibold text-slate-500 hover:text-slate-900">
                      Không quét được mã hoặc đến ngoài khung giờ?
                    </button>
                  </div>
                </div>
              </SectionCard>
            )}

            {step === 'OUT_OF_WINDOW' && (
              <SectionCard title="Ngoài khung giờ check-in tự phục vụ">
                <div className="p-4 rounded-xl bg-rose-50 border border-rose-200 text-xs text-rose-800 space-y-2">
                  <div className="font-bold flex items-center gap-1.5"><AlertTriangle className="w-4 h-4" /> Không thể tự check-in lúc này</div>
                  <p>Vui lòng đến quầy cán bộ KTX (Sảnh Tòa A — quầy số 2) để được <strong>check-in thủ công / check-in trễ</strong>. Mang theo CCCD và thẻ sinh viên.</p>
                  <p className="flex items-center gap-1"><Clock className="w-3.5 h-3.5" /> Quầy làm việc 07:30 – 21:00 hằng ngày trong tuần nhận phòng.</p>
                </div>
                <AppButton variant="outline" size="sm" className="mt-4" onClick={() => setStep('SCAN')}>Quét lại</AppButton>
              </SectionCard>
            )}

            {step === 'PAY' && (
              <SectionCard title="Bước 2 — Thanh toán phí còn lại" subtitle="Phí phòng học kỳ sau khi trừ tiền cọc đã đóng khi đăng ký">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 items-center">
                  <div className="flex flex-col items-center p-4 rounded-2xl border border-slate-200">
                    <VietQrCode value={`ROOM-${user?.studentId}-SP27`} />
                    <div className="text-xs font-bold text-[#F26F21] mt-2">{formatVnd(ASSIGNMENT.remaining)}</div>
                  </div>
                  <div className="space-y-2 text-xs">
                    <div className="flex justify-between p-2.5 rounded-lg bg-slate-50"><span className="text-slate-500">Phí phòng Spring 2027 (phòng 4 người)</span><span>{formatVnd(5200000)}</span></div>
                    <div className="flex justify-between p-2.5 rounded-lg bg-slate-50"><span className="text-slate-500">Trừ tiền cọc giữ chỗ (20%)</span><span>-{formatVnd(1040000)}</span></div>
                    <div className="flex justify-between p-2.5 rounded-lg bg-orange-50 font-bold"><span>Cần thanh toán</span><span className="text-[#F26F21]">{formatVnd(ASSIGNMENT.remaining)}</span></div>
                    <AppButton className="w-full" onClick={() => { setStep('ACCESS'); show('Thanh toán thành công — biên nhận đã gửi qua email'); }}>
                      Tôi đã thanh toán
                    </AppButton>
                  </div>
                </div>
              </SectionCard>
            )}

            {step === 'ACCESS' && (
              <SectionCard title="Bước 3 — Thông tin truy cập phòng">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                  <div className="p-4 rounded-xl bg-[#EBF2FB]"><KeyRound className="w-5 h-5 text-[#1A365D]" /><div className="text-slate-500 mt-2">Thẻ từ ra vào</div><div className="font-bold text-[#1A365D]">Đã kích hoạt trên thẻ SV</div></div>
                  <div className="p-4 rounded-xl bg-[#EBF2FB]"><MapPin className="w-5 h-5 text-[#1A365D]" /><div className="text-slate-500 mt-2">Phòng</div><div className="font-bold text-[#1A365D]">A204 · Tầng 2 · Giường G1</div></div>
                  <div className="p-4 rounded-xl bg-[#EBF2FB]"><Wifi className="w-5 h-5 text-[#1A365D]" /><div className="text-slate-500 mt-2">Wi-Fi</div><div className="font-bold text-[#1A365D]">FPTU-DORM-A · đăng nhập SV</div></div>
                </div>
                <p className="text-xs text-slate-600 mt-4">Nhận chìa khóa tủ cá nhân tại quầy sảnh, sau đó lên phòng và lập biên bản hiện trạng trong vòng 24 giờ.</p>
                <AppButton className="mt-4" onClick={() => setStep('REPORT')}>Lập biên bản hiện trạng</AppButton>
              </SectionCard>
            )}

            {step === 'REPORT' && (
              <SectionCard title="Bước 4 — Biên bản hiện trạng phòng số" subtitle="Biên bản là căn cứ đối chiếu khi trả phòng và hoàn cọc">
                <ConditionReport values={report} onChange={(a, c) => setReport({ ...report, [a]: c })} note={note} onNote={setNote} />
                <div className="flex justify-end mt-4">
                  <AppButton leftIcon={<CheckCircle2 className="w-4 h-4" />} onClick={submitReport}>Gửi biên bản & nhận phòng</AppButton>
                </div>
              </SectionCard>
            )}

            {step === 'DONE' && (
              <SectionCard>
                <div className="text-center py-6">
                  <CheckCircle2 className="w-12 h-12 text-emerald-500 mx-auto mb-3" />
                  <div className="text-lg font-bold text-[#1A365D]">Bạn đã nhận phòng A204</div>
                  <p className="text-xs text-slate-500 mt-1">{issues ? `${issues} hạng mục có vấn đề đã được gửi tới bộ phận bảo trì.` : 'Biên bản hiện trạng đã được lưu.'}</p>
                </div>
              </SectionCard>
            )}
          </div>

          <SectionCard title="Cần chuẩn bị">
            <ul className="space-y-2.5 text-xs text-slate-700">
              {['CCCD và thẻ sinh viên', 'Ứng dụng ngân hàng để quét VietQR', 'Điện thoại để chụp ảnh hiện trạng', 'Hợp đồng đã ký trong “Phòng của tôi”'].map((d) => (
                <li key={d} className="flex gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />{d}</li>
              ))}
            </ul>
            <div className="mt-4 p-3 rounded-lg bg-blue-50 text-[11px] text-blue-800 flex gap-2">
              <Info className="w-4 h-4 shrink-0" /> Gặp sự cố khi quét mã? Cán bộ KTX tại quầy sẽ check-in thủ công cho bạn.
            </div>
          </SectionCard>
        </div>
      )}

      {tab === 'checkout' && (
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
          <div className="xl:col-span-2">
            <SectionCard title="Tự check-out — phòng A204 (Fall 2026)" subtitle="Hợp đồng hiện tại kết thúc 31/12/2026">
              {checkoutSent ? (
                <div className="text-center py-6 text-xs">
                  <Clock className="w-10 h-10 text-amber-500 mx-auto mb-2" />
                  <div className="text-sm font-bold text-slate-800">Đã gửi biên bản trả phòng</div>
                  <p className="text-slate-500 mt-1">Cán bộ KTX sẽ đối chiếu hiện trạng với biên bản nhận phòng. Tiền cọc hoàn lại trong 15 ngày làm việc.</p>
                  <StatusBadge status="PENDING" customLabel="Chờ cán bộ xác minh" />
                </div>
              ) : (
                <div className="space-y-4">
                  <ConditionReport values={outReport} onChange={(a, c) => setOutReport({ ...outReport, [a]: c })} note={outNote} onNote={setOutNote} />
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">Tài khoản nhận hoàn cọc</label>
                    <input value={refundAccount} onChange={(e) => setRefundAccount(e.target.value)} placeholder="Ngân hàng — số tài khoản — chủ tài khoản" className="w-full px-3 py-2 text-xs border border-slate-200 rounded-lg" />
                  </div>
                  <div className="flex justify-end">
                    <AppButton disabled={refundAccount.length < 8} leftIcon={<LogOut className="w-4 h-4" />} onClick={() => { setCheckoutSent(true); show('Đã gửi yêu cầu trả phòng'); }}>
                      Gửi biên bản trả phòng
                    </AppButton>
                  </div>
                </div>
              )}
            </SectionCard>
          </div>
          <SectionCard title="Trước khi trả phòng">
            <ul className="space-y-2 text-xs text-slate-700 list-disc pl-4">
              <li>Thanh toán hết hóa đơn còn nợ.</li>
              <li>Dọn sạch giường, tủ, bàn học; mang hết đồ cá nhân.</li>
              <li>Trả chìa khóa tủ tại quầy; thẻ từ tự vô hiệu sau khi xác minh.</li>
              <li>Hư hỏng so với biên bản nhận phòng sẽ được khấu trừ vào tiền cọc.</li>
            </ul>
          </SectionCard>
        </div>
      )}

      {tab === 'history' && (
        <SectionCard noPadding>
          <div className="overflow-x-auto">
            <table className="w-full text-xs">
              <thead className="bg-slate-50 text-slate-500">
                <tr>
                  <th className="text-left font-semibold px-5 py-3">Loại</th>
                  <th className="text-left font-semibold px-5 py-3">Học kỳ</th>
                  <th className="text-left font-semibold px-5 py-3">Phòng</th>
                  <th className="text-left font-semibold px-5 py-3">Thời gian</th>
                  <th className="text-left font-semibold px-5 py-3">Hình thức</th>
                  <th className="text-left font-semibold px-5 py-3">Trạng thái</th>
                  <th className="px-5 py-3" />
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {HISTORY.map((h) => (
                  <tr key={h.date}>
                    <td className="px-5 py-3">
                      <span className={clsx('inline-flex items-center gap-1 font-semibold', h.type === 'IN' ? 'text-emerald-700' : 'text-blue-700')}>
                        {h.type === 'IN' ? <CalendarCheck className="w-3.5 h-3.5" /> : <LogOut className="w-3.5 h-3.5" />}
                        {h.type === 'IN' ? 'Nhận phòng' : 'Trả phòng'}
                      </span>
                    </td>
                    <td className="px-5 py-3">{h.term}</td>
                    <td className="px-5 py-3 font-semibold">{h.room}</td>
                    <td className="px-5 py-3 text-slate-500">{h.date}</td>
                    <td className="px-5 py-3">{h.by}</td>
                    <td className="px-5 py-3"><StatusBadge status={h.status} /></td>
                    <td className="px-5 py-3 text-right">
                      <button type="button" onClick={() => show('Đang tải biên bản hiện trạng (PDF)')} className="text-[#F26F21] font-semibold inline-flex items-center gap-1"><Download className="w-3 h-3" />Biên bản</button>
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
