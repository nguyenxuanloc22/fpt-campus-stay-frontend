import { useState } from 'react';
import {
  BedDouble,
  Building2,
  FileText,
  Download,
  PenLine,
  CheckCircle2,
  Wind,
  Wifi,
  Droplets,
  ShieldCheck,
  Users,
  Mail,
  CalendarDays,
  History,
} from 'lucide-react';
import { useAuthStore } from '@features/auth';
import {
  PageHeader,
  SectionCard,
  Tabs,
  StatusBadge,
  AppButton,
  Avatar,
  Modal,
  ProgressBar,
  formatVnd,
  maskPhone,
  useToast,
} from '@shared-ui';

/**
 * Phòng của tôi — View Room Assignment, bạn cùng phòng và hợp đồng số (docs/ARCHITECTURE.md §5.1).
 * Hợp đồng được sinh ra sau khi Manager duyệt đề xuất xếp phòng (F2).
 */

type TabKey = 'assignment' | 'roommates' | 'contract';

const CURRENT = {
  term: 'Fall 2026',
  room: 'A204',
  bed: 'G1',
  building: 'Tòa A (Nữ)',
  floor: 2,
  type: 'Phòng 4 giường máy lạnh',
  price: 1200000,
  period: '01/09/2026 – 31/12/2026',
  status: 'CHECKED_IN',
  checkedIn: '30/08/2026 09:42',
  daysStayed: 47,
  daysTotal: 122,
};

const NEXT = {
  term: 'Spring 2027',
  room: 'A204',
  bed: 'G1',
  status: 'ASSIGNED',
  contract: 'HD-KTX-1102',
  signed: false,
};

const ROOMMATES = [
  { name: 'Nguyễn Thị Mai Anh', id: 'SE171234', major: 'Kỹ thuật phần mềm', bed: 'G1', phone: '0901234567', via: '—', isMe: true },
  { name: 'Võ Thị Bảo Ngọc', id: 'SE172211', major: 'Kỹ thuật phần mềm', bed: 'G2', phone: '0912456789', via: 'Mời bằng mã SV', isMe: false },
  { name: 'Phạm Ngọc Hân', id: 'SS170789', major: 'Digital Marketing', bed: 'G3', phone: '0987112233', via: 'Ghép theo tiêu chí', isMe: false },
  { name: 'Trần Khánh Linh', id: 'SE180321', major: 'Trí tuệ nhân tạo', bed: 'G4', phone: '0938777654', via: 'Hệ thống tự xếp', isMe: false },
];

const CLAUSES = [
  { title: 'Điều 1. Đối tượng', body: 'Bên A cho Bên B thuê 01 chỗ ở tại giường G1, phòng A204, Tòa A, KTX FPT University Tân Uyên trong thời hạn học kỳ.' },
  { title: 'Điều 2. Giá thuê & thanh toán', body: 'Giá thuê 1.200.000 ₫/tháng. Tiền cọc đóng khi đăng ký; phần còn lại thanh toán qua VietQR khi check-in.' },
  { title: 'Điều 3. Tiền đặt cọc', body: 'Tiền cọc được hoàn trong 15 ngày làm việc sau khi trả phòng, trừ chi phí hư hỏng (nếu có). Không nhận phòng trong khung check-in sẽ mất cọc.' },
  { title: 'Điều 4. Nghĩa vụ Bên B', body: 'Giữ gìn tài sản, chấp hành nội quy KTX, không tự ý chuyển nhượng chỗ ở; đổi phòng phải được Ban quản lý phê duyệt.' },
  { title: 'Điều 5. Chấm dứt', body: 'Hợp đồng chấm dứt khi hết hạn, khi Bên B thôi học hoặc vi phạm nội quy ở mức buộc rời KTX.' },
];

const CONTRACT_HISTORY = [
  { code: 'HD-KTX-1102', term: 'Spring 2027', room: 'A204 - G1', status: 'DRAFT' },
  { code: 'HD-KTX-0789', term: 'Fall 2026', room: 'A204 - G1', status: 'ACTIVE' },
  { code: 'HD-KTX-0512', term: 'Summer 2026', room: 'A204 - G1', status: 'EXPIRED' },
];

export function StudentMyRoomPage() {
  const user = useAuthStore((s) => s.user);
  const { show, toastNode } = useToast();
  const [tab, setTab] = useState<TabKey>('assignment');
  const [signOpen, setSignOpen] = useState(false);
  const [otp, setOtp] = useState('');
  const [signed, setSigned] = useState(NEXT.signed);

  return (
    <div className="space-y-6">
      <PageHeader
        title="Phòng của tôi"
        description="Kết quả xếp phòng, bạn cùng phòng và hợp đồng lưu trú số"
        actions={
          !signed && (
            <AppButton size="sm" leftIcon={<PenLine className="w-4 h-4" />} onClick={() => setSignOpen(true)}>
              Ký hợp đồng {NEXT.term}
            </AppButton>
          )
        }
      />

      {!signed && (
        <div className="flex items-center gap-3 p-4 rounded-xl border border-emerald-200 bg-emerald-50 text-xs text-emerald-900">
          <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
          <span className="flex-1">
            Bạn đã được xếp <strong>phòng {NEXT.room} – giường {NEXT.bed}</strong> cho học kỳ <strong>{NEXT.term}</strong>. Vui lòng ký hợp đồng
            <strong> {NEXT.contract}</strong> trước khi check-in.
          </span>
        </div>
      )}

      <Tabs<TabKey>
        items={[
          { value: 'assignment', label: 'Phân bổ phòng' },
          { value: 'roommates', label: 'Bạn cùng phòng', count: ROOMMATES.length - 1 },
          { value: 'contract', label: 'Hợp đồng' },
        ]}
        value={tab}
        onChange={setTab}
      />

      {tab === 'assignment' && (
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
          <SectionCard className="xl:col-span-2" title={`Học kỳ ${CURRENT.term}`} actions={<StatusBadge status={CURRENT.status} />}>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-xs mb-5">
              {[
                ['Phòng', CURRENT.room, Building2],
                ['Giường', CURRENT.bed, BedDouble],
                ['Tòa / tầng', `${CURRENT.building} · T${CURRENT.floor}`, Building2],
                ['Đơn giá', `${formatVnd(CURRENT.price)}/th`, FileText],
              ].map(([label, value, Icon]) => {
                const I = Icon as typeof Building2;
                return (
                  <div key={label as string} className="p-3 rounded-xl bg-slate-50">
                    <I className="w-4 h-4 text-[#1A365D]" />
                    <div className="text-slate-400 mt-1">{label as string}</div>
                    <div className="font-bold text-slate-800">{value as string}</div>
                  </div>
                );
              })}
            </div>
            <div className="flex justify-between text-[11px] text-slate-500 mb-1">
              <span>{CURRENT.period}</span>
              <span>{CURRENT.daysStayed}/{CURRENT.daysTotal} ngày</span>
            </div>
            <ProgressBar value={CURRENT.daysStayed} max={CURRENT.daysTotal} size="md" />
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mt-5 text-[11px] text-slate-700">
              {[
                { icon: Wind, label: 'Máy lạnh Inverter' },
                { icon: Wifi, label: 'Wi-Fi tốc độ cao' },
                { icon: Droplets, label: 'Bình nóng lạnh' },
                { icon: ShieldCheck, label: 'Thẻ từ ra vào' },
              ].map((f) => (
                <div key={f.label} className="flex items-center gap-2 p-2 rounded-lg bg-slate-50"><f.icon className="w-3.5 h-3.5 text-[#1A365D]" />{f.label}</div>
              ))}
            </div>
            <p className="text-[11px] text-slate-500 mt-4">Nhận phòng lúc {CURRENT.checkedIn}.</p>
          </SectionCard>

          <SectionCard title={`Học kỳ ${NEXT.term}`} actions={<StatusBadge status={NEXT.status} />}>
            <div className="text-2xl font-bold text-[#1A365D]">{NEXT.room} · {NEXT.bed}</div>
            <div className="text-xs text-slate-500 mt-1">Giữ nguyên phòng hiện tại</div>
            <ul className="mt-4 space-y-2 text-xs">
              <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-500" />Đã đóng cọc</li>
              <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-500" />Manager đã duyệt xếp phòng</li>
              <li className="flex items-center gap-2">{signed ? <CheckCircle2 className="w-4 h-4 text-emerald-500" /> : <PenLine className="w-4 h-4 text-amber-500" />}{signed ? 'Đã ký hợp đồng' : 'Chờ ký hợp đồng'}</li>
              <li className="flex items-center gap-2 text-slate-500"><CalendarDays className="w-4 h-4" />Check-in 02/01 – 05/01/2027</li>
            </ul>
          </SectionCard>
        </div>
      )}

      {tab === 'roommates' && (
        <SectionCard title={`Thành viên phòng ${CURRENT.room}`} subtitle="Số điện thoại được che một phần để bảo vệ dữ liệu cá nhân">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {ROOMMATES.map((m) => (
              <div key={m.id} className={m.isMe ? 'p-4 rounded-xl border border-[#F26F21] bg-orange-50/40' : 'p-4 rounded-xl border border-slate-200'}>
                <div className="flex items-start gap-3">
                  <Avatar name={m.name} size="md" />
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-bold text-slate-800 truncate">{m.name} {m.isMe && <span className="text-[#F26F21]">(Bạn)</span>}</div>
                    <div className="text-[11px] text-slate-500">{m.id} · {m.major}</div>
                    {!m.isMe && <div className="text-[11px] text-slate-500">{maskPhone(m.phone)} · {m.via}</div>}
                  </div>
                  <span className="text-xs font-bold px-2 py-1 rounded-lg bg-[#EBF2FB] text-[#1A365D]">{m.bed}</span>
                </div>
                {!m.isMe && (
                  <a href={`mailto:${m.id.toLowerCase()}@fpt.edu.vn`} className="mt-3 inline-flex items-center gap-1 text-[11px] font-semibold text-[#F26F21]">
                    <Mail className="w-3 h-3" /> Gửi email
                  </a>
                )}
              </div>
            ))}
          </div>
          <p className="text-[11px] text-slate-500 mt-4 flex items-center gap-1.5"><Users className="w-3.5 h-3.5" />Muốn đổi phòng hoặc hoán đổi với bạn khác? Vào mục “Yêu cầu”.</p>
        </SectionCard>
      )}

      {tab === 'contract' && (
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
          <SectionCard
            className="xl:col-span-2"
            title="Hợp đồng thuê chỗ ở ký túc xá"
            subtitle={`Số ${signed ? NEXT.contract : 'HD-KTX-0789'} · Bên B: ${user?.name}`}
            actions={<AppButton size="sm" variant="outline" leftIcon={<Download className="w-3.5 h-3.5" />} onClick={() => show('Đang tải hợp đồng (PDF)')}>Tải PDF</AppButton>}
          >
            <div className="space-y-4">
              {CLAUSES.map((c) => (
                <div key={c.title}>
                  <div className="text-xs font-bold text-slate-800">{c.title}</div>
                  <p className="text-xs text-slate-600 leading-relaxed">{c.body}</p>
                </div>
              ))}
            </div>
          </SectionCard>
          <SectionCard title={<span className="flex items-center gap-2"><History className="w-4 h-4" />Các hợp đồng</span>} noPadding>
            <ul className="divide-y divide-slate-100">
              {CONTRACT_HISTORY.map((h) => (
                <li key={h.code} className="px-5 py-3 flex items-center gap-3 text-xs">
                  <FileText className="w-4 h-4 text-[#1A365D]" />
                  <div className="flex-1">
                    <div className="font-semibold text-slate-800">{h.code}</div>
                    <div className="text-slate-500">{h.term} · {h.room}</div>
                  </div>
                  <StatusBadge status={h.code === NEXT.contract && signed ? 'SIGNED' : h.status} customLabel={h.status === 'DRAFT' && !signed ? 'Chờ ký' : undefined} />
                </li>
              ))}
            </ul>
          </SectionCard>
        </div>
      )}

      <Modal
        open={signOpen}
        onClose={() => setSignOpen(false)}
        size="sm"
        title={`Ký hợp đồng ${NEXT.contract}`}
        subtitle="Mã OTP đã được gửi tới email sinh viên"
        footer={
          <>
            <AppButton variant="outline" onClick={() => setSignOpen(false)}>Hủy</AppButton>
            <AppButton
              disabled={otp.length !== 6}
              onClick={() => {
                setSigned(true);
                setSignOpen(false);
                setOtp('');
                show('Đã ký hợp đồng điện tử thành công');
              }}
            >
              Xác nhận ký
            </AppButton>
          </>
        }
      >
        <input
          value={otp}
          onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
          inputMode="numeric"
          placeholder="Nhập 6 số OTP"
          className="w-full px-3 py-3 text-center text-lg tracking-[0.5em] font-bold border border-slate-200 rounded-lg"
        />
        <p className="text-[11px] text-slate-500 mt-3">Chữ ký điện tử có giá trị pháp lý theo Luật Giao dịch điện tử 2023.</p>
      </Modal>

      {toastNode}
    </div>
  );
}
