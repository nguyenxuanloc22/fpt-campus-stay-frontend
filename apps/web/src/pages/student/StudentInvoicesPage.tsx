import { useState } from 'react';
import {
  CreditCard,
  Wallet,
  Receipt,
  AlertTriangle,
  Download,
  QrCode,
  Copy,
  Building,
  Search,
  Zap,
  Droplets,
  CheckCircle2,
  Clock,
  Smartphone,
  Landmark,
} from 'lucide-react';
import clsx from 'clsx';
import {
  PageHeader,
  StatCard,
  SectionCard,
  Tabs,
  StatusBadge,
  AppButton,
  Modal,
  BarChart,
  VietQrCode,
  formatVnd,
  useToast,
} from '@shared-ui';
import type { InvoiceStatus, InvoiceType } from '@campusstay/constants';

/**
 * Hóa đơn & thanh toán (docs/BUSINESS_FLOWS.md F1, F3, F6):
 * DEPOSIT đóng khi đăng ký · ROOM_FEE do hệ thống tạo đầu kỳ / phần còn lại khi check-in
 * · UTILITY là phần mở rộng (Flow 6). Quá hạn do hệ thống tự đánh dấu.
 */

interface Invoice {
  code: string;
  title: string;
  type: InvoiceType;
  issued: string;
  due: string;
  amount: number;
  paid: number;
  status: InvoiceStatus;
  items: { name: string; qty: string; price: number }[];
}

const INVOICES: Invoice[] = [
  {
    code: 'INV-2026-1012',
    title: 'Phí phòng Fall 2026 — đợt 2',
    type: 'ROOM_FEE',
    issued: '01/10/2026',
    due: '24/10/2026',
    amount: 2400000,
    paid: 0,
    status: 'UNPAID',
    items: [{ name: 'Phí giường A204-G1 tháng 11–12/2026', qty: '2 tháng', price: 2400000 }],
  },
  {
    code: 'INV-2026-1009',
    title: 'Điện nước tháng 09/2026',
    type: 'UTILITY',
    issued: '05/10/2026',
    due: '15/10/2026',
    amount: 94500,
    paid: 0,
    status: 'OVERDUE',
    items: [
      { name: 'Điện: 104 kWh × 3.000 ₫ ÷ 4 người', qty: '26 kWh', price: 78000 },
      { name: 'Nước: 4.4 m³ × 15.000 ₫ ÷ 4 người', qty: '1.1 m³', price: 16500 },
    ],
  },
  {
    code: 'DEP-SP27-004812',
    title: 'Tiền cọc đăng ký Spring 2027',
    type: 'DEPOSIT',
    issued: '16/10/2026',
    due: '16/10/2026',
    amount: 500000,
    paid: 500000,
    status: 'PAID',
    items: [{ name: 'Tiền cọc giữ chỗ (trừ vào phí phòng khi check-in)', qty: '1', price: 500000 }],
  },
  {
    code: 'INV-2026-0830',
    title: 'Phí phòng Fall 2026 — thanh toán khi check-in',
    type: 'ROOM_FEE',
    issued: '30/08/2026',
    due: '30/08/2026',
    amount: 1900000,
    paid: 1900000,
    status: 'PAID',
    items: [
      { name: 'Phí giường A204-G1 tháng 9–10/2026', qty: '2 tháng', price: 2400000 },
      { name: 'Trừ tiền cọc đã đóng khi đăng ký', qty: '1', price: -500000 },
    ],
  },
  {
    code: 'DEP-FA26-002311',
    title: 'Tiền cọc đăng ký Fall 2026',
    type: 'DEPOSIT',
    issued: '05/08/2026',
    due: '05/08/2026',
    amount: 500000,
    paid: 500000,
    status: 'PAID',
    items: [{ name: 'Tiền cọc giữ chỗ', qty: '1', price: 500000 }],
  },
];

const PAYMENTS = [
  { ref: 'FT26289112233', date: '16/10/2026 20:31', method: 'VietQR — Vietcombank', amount: 500000, invoice: 'DEP-SP27-004812' },
  { ref: 'FT26242765432', date: '30/08/2026 09:40', method: 'VietQR — MB Bank', amount: 1900000, invoice: 'INV-2026-0830' },
  { ref: 'FT26217001234', date: '05/08/2026 21:12', method: 'VietQR — Techcombank', amount: 500000, invoice: 'DEP-FA26-002311' },
];

const TYPE_LABEL: Record<InvoiceType, string> = {
  DEPOSIT: 'Tiền cọc',
  ROOM_FEE: 'Phí phòng',
  UTILITY: 'Điện nước',
};

export function StudentInvoicesPage() {
  const { show, toastNode } = useToast();
  const [tab, setTab] = useState<'ALL' | 'UNPAID' | 'PAID'>('UNPAID');
  const [typeFilter, setTypeFilter] = useState('ALL');
  const [query, setQuery] = useState('');
  const [detail, setDetail] = useState<Invoice | null>(null);
  const [paying, setPaying] = useState<Invoice | null>(null);
  const [method, setMethod] = useState<'QR' | 'ATM' | 'WALLET'>('QR');
  const [paidCodes, setPaidCodes] = useState<string[]>([]);

  const invoices = INVOICES.map((i) =>
    paidCodes.includes(i.code) ? { ...i, status: 'PAID' as const, paid: i.amount } : i
  );

  const filtered = invoices.filter((i) => {
    if (tab === 'UNPAID' && i.status === 'PAID') return false;
    if (tab === 'PAID' && i.status !== 'PAID') return false;
    if (typeFilter !== 'ALL' && i.type !== typeFilter) return false;
    if (query && !`${i.code} ${i.title}`.toLowerCase().includes(query.toLowerCase())) return false;
    return true;
  });

  const outstanding = invoices.filter((i) => i.status !== 'PAID').reduce((s, i) => s + i.amount - i.paid, 0);
  const paidTotal = invoices.reduce((s, i) => s + i.paid, 0);
  const overdue = invoices.filter((i) => i.status === 'OVERDUE');

  const confirmPayment = () => {
    if (!paying) return;
    setPaidCodes((c) => [...c, paying.code]);
    show(`Thanh toán ${paying.code} thành công — biên lai đã gửi qua email`);
    setPaying(null);
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Hóa Đơn & Thanh Toán"
        description="Thanh toán nhanh qua VietQR 24/7 — hệ thống tự động gạch nợ trong 1–3 phút"
        actions={
          <AppButton size="sm" variant="outline" leftIcon={<Download className="w-4 h-4" />} onClick={() => show('Đang xuất sao kê học kỳ (Excel)')}>
            Xuất sao kê
          </AppButton>
        }
      />

      {overdue.length > 0 && (
        <div className="flex flex-col sm:flex-row sm:items-center gap-3 p-4 rounded-xl border border-rose-200 bg-rose-50 text-rose-900">
          <AlertTriangle className="w-5 h-5 text-rose-600 shrink-0" />
          <div className="flex-1 text-xs">
            Bạn có <strong>{overdue.length} hóa đơn quá hạn</strong>. Hệ thống đã gửi nhắc nhở; nếu không thanh toán, cán bộ KTX sẽ
            liên hệ xử lý công nợ.
          </div>
          <AppButton size="sm" variant="danger" onClick={() => overdue[0] && setPaying(overdue[0])}>
            Thanh toán ngay
          </AppButton>
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        <StatCard label="Tổng công nợ" value={formatVnd(outstanding)} icon={Wallet} tone="rose" hint={`${invoices.filter((i) => i.status !== 'PAID').length} hóa đơn chưa thanh toán`} />
        <StatCard label="Đã thanh toán kỳ này" value={formatVnd(paidTotal)} icon={CheckCircle2} tone="emerald" hint="Fall 2026" />
        <StatCard label="Tiền cọc Spring 2027" value="500.000 ₫" icon={Landmark} tone="navy" hint="Trừ vào phí phòng khi check-in" />
        <StatCard label="Hạn gần nhất" value="24/10/2026" icon={Clock} tone="amber" hint="INV-2026-1012 • còn 7 ngày" />
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        <div className="xl:col-span-2 space-y-6">
          <SectionCard noPadding>
            <div className="p-4 border-b border-slate-100 flex flex-col lg:flex-row lg:items-center gap-3 justify-between">
              <Tabs
                items={[
                  { value: 'UNPAID' as const, label: 'Cần thanh toán', count: invoices.filter((i) => i.status !== 'PAID').length },
                  { value: 'PAID' as const, label: 'Đã thanh toán', count: invoices.filter((i) => i.status === 'PAID').length },
                  { value: 'ALL' as const, label: 'Tất cả', count: invoices.length },
                ]}
                value={tab}
                onChange={setTab}
              />
              <div className="flex gap-2">
                <div className="relative">
                  <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
                  <input
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder="Tìm mã hóa đơn..."
                    className="pl-8 pr-3 py-1.5 text-xs rounded-lg border border-slate-200 w-44"
                  />
                </div>
                <select value={typeFilter} onChange={(e) => setTypeFilter(e.target.value)} className="px-2.5 py-1.5 text-xs rounded-lg border border-slate-200 bg-white">
                  <option value="ALL">Mọi loại</option>
                  {Object.entries(TYPE_LABEL).map(([k, v]) => (
                    <option key={k} value={k}>
                      {v}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-xs">
                <thead className="bg-slate-50 text-slate-500">
                  <tr>
                    <th className="text-left font-semibold px-5 py-3">Hóa đơn</th>
                    <th className="text-left font-semibold px-5 py-3">Loại</th>
                    <th className="text-left font-semibold px-5 py-3">Hạn thanh toán</th>
                    <th className="text-right font-semibold px-5 py-3">Số tiền</th>
                    <th className="text-left font-semibold px-5 py-3">Trạng thái</th>
                    <th className="px-5 py-3" />
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filtered.map((inv) => (
                    <tr key={inv.code} className="hover:bg-slate-50">
                      <td className="px-5 py-3">
                        <button type="button" onClick={() => setDetail(inv)} className="text-left">
                          <div className="font-semibold text-slate-800 hover:text-[#F26F21]">{inv.title}</div>
                          <div className="text-[11px] text-slate-400">
                            {inv.code} • Phát hành {inv.issued}
                          </div>
                        </button>
                      </td>
                      <td className="px-5 py-3">
                        <span className="px-2 py-0.5 rounded bg-slate-100 text-slate-600 text-[11px] font-semibold">{TYPE_LABEL[inv.type]}</span>
                      </td>
                      <td className={clsx('px-5 py-3', inv.status === 'OVERDUE' ? 'text-rose-600 font-semibold' : 'text-slate-600')}>{inv.due}</td>
                      <td className="px-5 py-3 text-right font-bold text-slate-800">{formatVnd(inv.amount)}</td>
                      <td className="px-5 py-3">
                        <StatusBadge status={inv.status} />
                      </td>
                      <td className="px-5 py-3 text-right">
                        {inv.status === 'PAID' ? (
                          <button type="button" onClick={() => show(`Đang tải biên lai ${inv.code}`)} className="text-[#1A365D] font-semibold hover:underline">
                            Biên lai
                          </button>
                        ) : (
                          <AppButton size="sm" onClick={() => setPaying(inv)} leftIcon={<QrCode className="w-3.5 h-3.5" />}>
                            Thanh toán
                          </AppButton>
                        )}
                      </td>
                    </tr>
                  ))}
                  {filtered.length === 0 && (
                    <tr>
                      <td colSpan={6} className="px-5 py-10 text-center text-slate-400">
                        Không có hóa đơn nào trong mục này 🎉
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </SectionCard>

          <SectionCard title="Lịch sử giao dịch" subtitle="Các khoản thanh toán đã được ghi nhận" noPadding>
            <ul className="divide-y divide-slate-100">
              {PAYMENTS.map((p) => (
                <li key={p.ref} className="px-5 py-3 flex items-center gap-3">
                  <div className="w-9 h-9 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center">
                    <Receipt className="w-4 h-4" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-xs font-semibold text-slate-800">{p.method}</div>
                    <div className="text-[11px] text-slate-400">
                      {p.date} • Mã GD {p.ref} • {p.invoice}
                    </div>
                  </div>
                  <div className="text-xs font-bold text-emerald-600">+{formatVnd(p.amount)}</div>
                </li>
              ))}
            </ul>
          </SectionCard>
        </div>

        <div className="space-y-6">
          <SectionCard title="Điện nước phòng A204 (mở rộng)" subtitle="Cán bộ KTX ghi chỉ số ngày 01 hằng tháng">
            <div className="grid grid-cols-2 gap-3 mb-4">
              <div className="p-3 rounded-xl bg-orange-50">
                <Zap className="w-4 h-4 text-[#F26F21]" />
                <div className="text-[11px] text-slate-500 mt-1">Điện (01/10)</div>
                <div className="text-lg font-bold text-slate-800">08.412</div>
                <div className="text-[10px] text-slate-400">Kỳ trước 08.308</div>
              </div>
              <div className="p-3 rounded-xl bg-blue-50">
                <Droplets className="w-4 h-4 text-blue-600" />
                <div className="text-[11px] text-slate-500 mt-1">Nước (01/10)</div>
                <div className="text-lg font-bold text-slate-800">0312.6</div>
                <div className="text-[10px] text-slate-400">Kỳ trước 0308.2</div>
              </div>
            </div>
            <BarChart
              height={120}
              data={[
                { label: 'T5', value: 210 },
                { label: 'T6', value: 296 },
                { label: 'T7', value: 338 },
                { label: 'T8', value: 342 },
                { label: 'T9', value: 285 },
              ]}
              formatValue={(v) => `${v}.000 ₫`}
            />
            <p className="text-[11px] text-slate-500 mt-2">Chi phí điện nước cá nhân 5 tháng gần nhất (nghìn đồng)</p>
          </SectionCard>

          <SectionCard title="Thông tin chuyển khoản">
            <div className="space-y-2 text-xs">
              {[
                ['Ngân hàng', 'Vietcombank — CN Bình Dương'],
                ['Số tài khoản', '0281 000 456 789'],
                ['Chủ tài khoản', 'TRUONG DAI HOC FPT'],
                ['Nội dung', 'KTX SE171234 <mã hóa đơn>'],
              ].map(([k, v]) => (
                <div key={k} className="flex items-center justify-between gap-2 p-2 rounded-lg bg-slate-50">
                  <span className="text-slate-500">{k}</span>
                  <span className="font-semibold text-slate-800 text-right">{v}</span>
                </div>
              ))}
            </div>
            <p className="text-[11px] text-amber-700 bg-amber-50 p-2.5 rounded-lg mt-3">
              Ghi đúng nội dung chuyển khoản để hệ thống tự động gạch nợ. Sai nội dung có thể mất 2–3 ngày làm việc để đối soát.
            </p>
          </SectionCard>
        </div>
      </div>

      {/* Detail modal */}
      <Modal
        open={!!detail}
        onClose={() => setDetail(null)}
        title={detail?.title ?? ''}
        subtitle={detail ? `${detail.code} • Phát hành ${detail.issued} • Hạn ${detail.due}` : ''}
        footer={
          detail && (
            <>
              <AppButton variant="outline" leftIcon={<Download className="w-4 h-4" />} onClick={() => show(`Đang tải ${detail.code}.pdf`)}>
                Tải hóa đơn
              </AppButton>
              {detail.status !== 'PAID' && (
                <AppButton
                  onClick={() => {
                    setPaying(detail);
                    setDetail(null);
                  }}
                >
                  Thanh toán
                </AppButton>
              )}
            </>
          )
        }
      >
        {detail && (
          <div className="space-y-4">
            <table className="w-full text-xs">
              <thead className="text-slate-500 border-b">
                <tr>
                  <th className="text-left py-2 font-semibold">Khoản mục</th>
                  <th className="text-right py-2 font-semibold">SL</th>
                  <th className="text-right py-2 font-semibold">Thành tiền</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {detail.items.map((it) => (
                  <tr key={it.name}>
                    <td className="py-2.5 text-slate-700">{it.name}</td>
                    <td className="py-2.5 text-right text-slate-500">{it.qty}</td>
                    <td className="py-2.5 text-right font-semibold">{formatVnd(it.price)}</td>
                  </tr>
                ))}
              </tbody>
              <tfoot>
                <tr className="border-t-2">
                  <td colSpan={2} className="py-3 font-bold">
                    Tổng cộng
                  </td>
                  <td className="py-3 text-right font-bold text-[#F26F21] text-sm">{formatVnd(detail.amount)}</td>
                </tr>
              </tfoot>
            </table>
            <div className="flex items-center justify-between p-3 rounded-lg bg-slate-50 text-xs">
              <span className="text-slate-500">Trạng thái</span>
              <StatusBadge status={detail.status} />
            </div>
          </div>
        )}
      </Modal>

      {/* Payment modal */}
      <Modal
        open={!!paying}
        onClose={() => setPaying(null)}
        size="lg"
        title="Thanh toán hóa đơn"
        subtitle={paying ? `${paying.code} — ${paying.title}` : ''}
        footer={
          <>
            <AppButton variant="outline" onClick={() => setPaying(null)}>
              Để sau
            </AppButton>
            <AppButton onClick={confirmPayment} leftIcon={<CheckCircle2 className="w-4 h-4" />}>
              Tôi đã chuyển khoản
            </AppButton>
          </>
        }
      >
        {paying && (
          <div className="space-y-5">
            <div className="grid grid-cols-3 gap-2">
              {[
                { id: 'QR' as const, label: 'VietQR', icon: QrCode },
                { id: 'ATM' as const, label: 'Thẻ ATM nội địa', icon: CreditCard },
                { id: 'WALLET' as const, label: 'Ví MoMo / ZaloPay', icon: Smartphone },
              ].map((m) => (
                <button
                  key={m.id}
                  type="button"
                  onClick={() => setMethod(m.id)}
                  className={clsx(
                    'p-3 rounded-xl border text-xs font-semibold flex flex-col items-center gap-1.5',
                    method === m.id ? 'border-[#F26F21] bg-orange-50 text-[#F26F21]' : 'border-slate-200 text-slate-600'
                  )}
                >
                  <m.icon className="w-5 h-5" />
                  {m.label}
                </button>
              ))}
            </div>

            {method === 'QR' ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 items-center">
                <div className="flex flex-col items-center p-4 rounded-2xl border border-slate-200">
                  <div className="text-[11px] font-bold text-[#1A365D] mb-2">VIETQR • NAPAS 247</div>
                  <VietQrCode value={paying.code} />
                  <div className="text-[10px] text-slate-400 mt-2 flex items-center gap-1">
                    <Clock className="w-3 h-3" /> Mã QR hết hạn sau 14:59
                  </div>
                </div>
                <div className="space-y-2 text-xs">
                  {[
                    ['Ngân hàng', 'Vietcombank'],
                    ['Số tài khoản', '0281000456789'],
                    ['Chủ tài khoản', 'TRUONG DAI HOC FPT'],
                    ['Số tiền', formatVnd(paying.amount - paying.paid)],
                    ['Nội dung', `KTX SE171234 ${paying.code}`],
                  ].map(([k, v]) => (
                    <div key={k} className="flex items-center justify-between gap-2 p-2.5 rounded-lg bg-slate-50">
                      <span className="text-slate-500">{k}</span>
                      <span className="flex items-center gap-1.5 font-semibold text-slate-800">
                        {v}
                        <button type="button" onClick={() => show(`Đã sao chép: ${v}`, 'info')} aria-label="Sao chép">
                          <Copy className="w-3 h-3 text-slate-400 hover:text-[#F26F21]" />
                        </button>
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div className="p-6 rounded-xl bg-slate-50 text-center text-xs text-slate-600">
                <Building className="w-8 h-8 mx-auto text-slate-400 mb-2" />
                Bạn sẽ được chuyển tới cổng thanh toán {method === 'ATM' ? 'NAPAS' : 'ví điện tử'} để hoàn tất giao dịch{' '}
                <strong>{formatVnd(paying.amount - paying.paid)}</strong>. Phí giao dịch: 0 ₫.
              </div>
            )}
          </div>
        )}
      </Modal>

      {toastNode}
    </div>
  );
}
