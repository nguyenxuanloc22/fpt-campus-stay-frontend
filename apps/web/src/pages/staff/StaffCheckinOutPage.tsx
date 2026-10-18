import { useState } from 'react';
import { UserCheck, LogOut, Clock, AlertTriangle, Search, CheckCircle2, XCircle, ScanLine, CreditCard, IdCard, Timer, ClipboardCheck } from 'lucide-react';
import clsx from 'clsx';
import { PageHeader, StatCard, SectionCard, Tabs, StatusBadge, AppButton, Avatar, Modal, ProgressBar, formatVnd, useToast } from '@shared-ui';

/**
 * Check-in / Check-out (Staff) — docs/BUSINESS_FLOWS.md F3.
 * Sinh viên tự check-in bằng QR; Staff: Process Manual / Late Check-in và Verify Room Condition at Check-out.
 * Hệ thống tự hủy phân bổ no-show khi hết khung giờ (Cancel No-show & Forfeit Deposit).
 */

type TabKey = 'monitor' | 'manual' | 'checkout';

interface PendingStudent {
  id: string;
  name: string;
  bed: string;
  hoursLeft: number;
  contacted: boolean;
}

interface ManualCase {
  id: string;
  name: string;
  bed: string;
  reason: string;
  arrived: string;
  paid: boolean;
  done?: boolean;
}

interface CheckoutReport {
  id: string;
  name: string;
  bed: string;
  submitted: string;
  differences: { item: string; atCheckin: string; now: string }[];
  deposit: number;
  verified?: boolean;
}

const BUILDINGS = [
  { b: 'Tòa A', done: 262, total: 276 },
  { b: 'Tòa B', done: 281, total: 298 },
  { b: 'Tòa C', done: 240, total: 268 },
  { b: 'Tòa D', done: 201, total: 230 },
];

const PENDING: PendingStudent[] = [
  { id: 'SE191020', name: 'Phạm Quốc Huy', bed: 'D402-G2', hoursLeft: 3, contacted: false },
  { id: 'BA190012', name: 'Lý Thanh Trúc', bed: 'B118-G6', hoursLeft: 3, contacted: true },
  { id: 'SE190777', name: 'Trịnh Bảo Long', bed: 'B305-G1', hoursLeft: 3, contacted: false },
  { id: 'GD190331', name: 'Ngô Bảo Châu', bed: 'C215-G4', hoursLeft: 3, contacted: false },
];

const MANUAL: ManualCase[] = [
  { id: 'SE190888', name: 'Nguyễn Hoàng Long', bed: 'B118-G3', reason: 'Đến muộn — chuyến xe từ Cà Mau trễ, ngoài khung giờ', arrived: '05/01 20:40', paid: true },
  { id: 'JP170601', name: 'Lâm Mỹ Duyên', bed: 'C215-G3', reason: 'Điện thoại hỏng, không quét được QR', arrived: '05/01 15:10', paid: false },
  { id: 'SS190234', name: 'Mai Khánh Vy', bed: 'C108-G1', reason: 'Nằm viện đến 06/01 — có giấy ra viện', arrived: 'Báo trước', paid: true },
];

const CHECKOUTS: CheckoutReport[] = [
  { id: 'SE170321', name: 'Hồ Tấn Phát', bed: 'B312-G3', submitted: '31/12/2026 14:20', differences: [], deposit: 500000 },
  { id: 'AI180990', name: 'Trương Gia Bảo', bed: 'D402-G2', submitted: '31/12/2026 10:05', differences: [{ item: 'Tủ quần áo có khóa', atCheckin: 'Tốt', now: 'Gãy bản lề' }, { item: 'Remote máy lạnh', atCheckin: 'Tốt', now: 'Mất' }], deposit: 500000 },
  { id: 'BA180123', name: 'Bùi Thanh Tâm', bed: 'B305-G5', submitted: '30/12/2026 17:45', differences: [{ item: 'Rèm cửa sổ', atCheckin: 'Tốt', now: 'Rách nhẹ' }], deposit: 500000 },
];

export function StaffCheckinOutPage() {
  const { show, toastNode } = useToast();
  const [tab, setTab] = useState<TabKey>('monitor');
  const [pending, setPending] = useState(PENDING);
  const [manual, setManual] = useState(MANUAL);
  const [checkouts, setCheckouts] = useState(CHECKOUTS);
  const [active, setActive] = useState<ManualCase | null>(null);
  const [steps, setSteps] = useState<string[]>([]);
  const [verifying, setVerifying] = useState<CheckoutReport | null>(null);
  const [deduction, setDeduction] = useState(0);
  const [lookup, setLookup] = useState('');

  const done = BUILDINGS.reduce((s, b) => s + b.done, 0);
  const total = BUILDINGS.reduce((s, b) => s + b.total, 0);

  const MANUAL_STEPS = [
    { key: 'id', label: 'Đối chiếu CCCD & thẻ sinh viên', icon: IdCard },
    { key: 'pay', label: 'Xác nhận đã thanh toán phần phí còn lại', icon: CreditCard },
    { key: 'access', label: 'Kích hoạt thẻ từ, giao chìa khóa tủ', icon: ScanLine },
    { key: 'report', label: 'Nhắc sinh viên nộp biên bản hiện trạng số', icon: ClipboardCheck },
  ];

  const completeManual = () => {
    if (!active) return;
    setManual((all) => all.map((m) => (m.id === active.id ? { ...m, done: true } : m)));
    show(`Đã check-in thủ công cho ${active.name} (${active.bed})`);
    setActive(null);
  };

  const verifyCheckout = () => {
    if (!verifying) return;
    setCheckouts((all) => all.map((c) => (c.id === verifying.id ? { ...c, verified: true } : c)));
    show(`Đã xác minh trả phòng ${verifying.bed} — hoàn cọc ${formatVnd(verifying.deposit - deduction)}`);
    setVerifying(null);
    setDeduction(0);
  };

  return (
    <div className="space-y-6">
      <PageHeader title="Check-in / Check-out" description="Tuần nhận phòng Spring 2027 · khung tự phục vụ 02/01 08:00 – 05/01/2027 20:00" />

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard label="Đã nhận phòng" value={`${done}/${total}`} icon={UserCheck} tone="emerald" hint={`${Math.round((done / total) * 100)}% · 94% qua QR`} />
        <StatCard label="Sắp no-show" value={pending.length} icon={Timer} tone="rose" hint="Còn 3 giờ đến hạn" />
        <StatCard label="Chờ check-in thủ công" value={manual.filter((m) => !m.done).length} icon={Clock} tone="amber" />
        <StatCard label="Trả phòng chờ xác minh" value={checkouts.filter((c) => !c.verified).length} icon={LogOut} tone="blue" />
      </div>

      <Tabs<TabKey>
        items={[
          { value: 'monitor', label: 'Theo dõi check-in' },
          { value: 'manual', label: 'Check-in thủ công / trễ', count: manual.filter((m) => !m.done).length },
          { value: 'checkout', label: 'Xác minh trả phòng', count: checkouts.filter((c) => !c.verified).length },
        ]}
        value={tab}
        onChange={setTab}
      />

      {tab === 'monitor' && (
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
          <SectionCard title="Tiến độ theo tòa">
            <ul className="space-y-4 text-xs">
              {BUILDINGS.map((b) => (
                <li key={b.b}>
                  <div className="flex justify-between mb-1"><span className="font-semibold text-ink">{b.b}</span><span>{b.done}/{b.total}</span></div>
                  <ProgressBar value={b.done} max={b.total} tone="emerald" size="md" />
                </li>
              ))}
            </ul>
          </SectionCard>
          <SectionCard
            className="xl:col-span-2"
            title="Chưa nhận phòng — sắp quá hạn"
            subtitle="Hết khung giờ, hệ thống tự hủy phân bổ và giữ tiền cọc. Liên hệ trước để tránh mất chỗ."
            noPadding
          >
            <ul className="divide-y divide-line">
              {pending.map((p) => (
                <li key={p.id} className="px-5 py-3 flex items-center gap-3 text-xs">
                  <Avatar name={p.name} />
                  <div className="flex-1">
                    <div className="font-semibold text-ink">{p.name} <span className="text-ink-subtle font-normal">{p.id}</span></div>
                    <div className="text-ink-muted">{p.bed} · còn {p.hoursLeft} giờ</div>
                  </div>
                  {p.contacted ? (
                    <span className="text-label font-semibold text-emerald-600">Đã liên hệ</span>
                  ) : (
                    <AppButton size="sm" variant="outline" onClick={() => { setPending((all) => all.map((x) => (x.id === p.id ? { ...x, contacted: true } : x))); show(`Đã gửi nhắc nhở tới ${p.name}`); }}>
                      Gửi nhắc nhở
                    </AppButton>
                  )}
                </li>
              ))}
            </ul>
          </SectionCard>
        </div>
      )}

      {tab === 'manual' && (
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
          <SectionCard className="xl:col-span-2" title="Sinh viên cần check-in thủ công / trễ" noPadding>
            <ul className="divide-y divide-line">
              {manual.map((m) => (
                <li key={m.id} className="px-5 py-3.5 flex flex-col md:flex-row md:items-center gap-3 text-xs">
                  <Avatar name={m.name} />
                  <div className="flex-1">
                    <div className="font-semibold text-ink">{m.name} <span className="text-ink-subtle font-normal">{m.id} · {m.bed}</span></div>
                    <div className="text-ink-muted">{m.reason}</div>
                    <div className="text-label text-ink-subtle">Đến quầy: {m.arrived} · {m.paid ? 'Đã thanh toán' : 'Chưa thanh toán phần còn lại'}</div>
                  </div>
                  {m.done ? <StatusBadge status="CHECKED_IN" /> : <AppButton size="sm" onClick={() => { setActive(m); setSteps([]); }}>Xử lý</AppButton>}
                </li>
              ))}
            </ul>
          </SectionCard>
          <SectionCard title="Tra cứu sinh viên tại quầy">
            <div className="flex gap-2">
              <div className="relative flex-1">
                <Search className="w-4 h-4 text-ink-subtle absolute left-3 top-1/2 -translate-y-1/2" />
                <input value={lookup} onChange={(e) => setLookup(e.target.value.toUpperCase())} placeholder="MSSV" className="w-full pl-9 pr-3 py-2 text-xs rounded-lg border border-line" />
              </div>
              <AppButton
                size="sm"
                disabled={lookup.length < 8}
                onClick={() => {
                  setManual((all) => [{ id: lookup, name: `Sinh viên ${lookup}`, bed: 'A220-G4', reason: 'Đến quầy trực tiếp', arrived: 'Vừa xong', paid: false }, ...all]);
                  setLookup('');
                }}
              >
                Thêm
              </AppButton>
            </div>
            <p className="text-label text-ink-muted mt-3">Chỉ check-in thủ công cho sinh viên đã có phân bổ phòng. Sinh viên đã bị hủy do no-show cần nộp đơn vòng 2.</p>
          </SectionCard>
        </div>
      )}

      {tab === 'checkout' && (
        <SectionCard title="Biên bản trả phòng chờ xác minh" subtitle="So sánh với biên bản hiện trạng khi nhận phòng" noPadding>
          <ul className="divide-y divide-line">
            {checkouts.map((c) => (
              <li key={c.id} className="px-5 py-3.5 flex flex-col md:flex-row md:items-center gap-3 text-xs">
                <Avatar name={c.name} />
                <div className="flex-1">
                  <div className="font-semibold text-ink">{c.name} <span className="text-ink-subtle font-normal">{c.id} · {c.bed}</span></div>
                  <div className="text-label text-ink-muted">Gửi lúc {c.submitted}</div>
                  <div className={clsx('text-label font-semibold', c.differences.length ? 'text-amber-600' : 'text-emerald-600')}>
                    {c.differences.length ? `${c.differences.length} hạng mục khác biệt` : 'Không có khác biệt'}
                  </div>
                </div>
                {c.verified ? <StatusBadge status="CHECKED_OUT" /> : <AppButton size="sm" variant="outline" onClick={() => { setVerifying(c); setDeduction(c.differences.length * 150000); }}>Xác minh</AppButton>}
              </li>
            ))}
          </ul>
        </SectionCard>
      )}

      <Modal
        open={!!active}
        onClose={() => setActive(null)}
        title={active ? `Check-in thủ công: ${active.name}` : ''}
        subtitle={active ? `${active.id} · ${active.bed}` : ''}
        footer={
          <>
            <AppButton variant="outline" onClick={() => setActive(null)}>Đóng</AppButton>
            <AppButton disabled={steps.length < MANUAL_STEPS.length} leftIcon={<CheckCircle2 className="w-4 h-4" />} onClick={completeManual}>Hoàn tất check-in</AppButton>
          </>
        }
      >
        {active && (
          <div className="space-y-3 text-xs">
            <div className="p-3 rounded-lg bg-amber-50 text-amber-900 flex gap-2"><AlertTriangle className="w-4 h-4 shrink-0" />{active.reason}</div>
            {MANUAL_STEPS.map((s) => {
              const on = steps.includes(s.key);
              return (
                <button key={s.key} type="button" onClick={() => setSteps((all) => (on ? all.filter((x) => x !== s.key) : [...all, s.key]))} className={clsx('w-full flex items-center gap-3 p-3 rounded-xl border text-left', on ? 'border-emerald-200 bg-emerald-50 text-emerald-800' : 'border-line text-ink')}>
                  {on ? <CheckCircle2 className="w-4 h-4 text-emerald-500" /> : <s.icon className="w-4 h-4 text-ink-subtle" />}
                  <span className="font-semibold">{s.label}</span>
                </button>
              );
            })}
            {!active.paid && <p className="text-label text-rose-600">Sinh viên chưa thanh toán — hướng dẫn quét VietQR tại quầy trước khi tick bước 2.</p>}
          </div>
        )}
      </Modal>

      <Modal
        open={!!verifying}
        onClose={() => setVerifying(null)}
        size="lg"
        title={verifying ? `Xác minh trả phòng ${verifying.bed}` : ''}
        subtitle={verifying?.name}
        footer={
          <>
            <AppButton variant="outline" onClick={() => setVerifying(null)}>Hủy</AppButton>
            <AppButton onClick={verifyCheckout}>Xác nhận trả phòng</AppButton>
          </>
        }
      >
        {verifying && (
          <div className="space-y-4 text-xs">
            {verifying.differences.length === 0 ? (
              <div className="p-3 rounded-lg bg-emerald-50 text-emerald-800 flex gap-2"><CheckCircle2 className="w-4 h-4" />Hiện trạng khớp biên bản nhận phòng.</div>
            ) : (
              <table className="w-full">
                <thead className="text-ink-muted border-b"><tr><th className="text-left py-2">Hạng mục</th><th className="text-left py-2">Khi nhận</th><th className="text-left py-2">Khi trả</th></tr></thead>
                <tbody className="divide-y divide-line">
                  {verifying.differences.map((d) => (
                    <tr key={d.item}><td className="py-2 font-semibold">{d.item}</td><td className="py-2 text-emerald-700">{d.atCheckin}</td><td className="py-2 text-rose-600 flex items-center gap-1"><XCircle className="w-3 h-3" />{d.now}</td></tr>
                  ))}
                </tbody>
              </table>
            )}
            <div className="grid grid-cols-3 gap-2">
              <div className="p-3 rounded-lg bg-surface-muted"><div className="text-ink-subtle">Tiền cọc</div><div className="font-bold">{formatVnd(verifying.deposit)}</div></div>
              <div className="p-3 rounded-lg bg-surface-muted">
                <div className="text-ink-subtle">Khấu trừ</div>
                <input type="number" step={50000} value={deduction} onChange={(e) => setDeduction(Math.min(verifying.deposit, Math.max(0, Number(e.target.value))))} className="w-full mt-1 px-2 py-1 border border-line rounded" />
              </div>
              <div className="p-3 rounded-lg bg-emerald-50"><div className="text-ink-subtle">Hoàn lại</div><div className="font-bold text-emerald-700">{formatVnd(verifying.deposit - deduction)}</div></div>
            </div>
          </div>
        )}
      </Modal>

      {toastNode}
    </div>
  );
}
