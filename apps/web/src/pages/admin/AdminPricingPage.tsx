import { useState } from 'react';
import { Save, History } from 'lucide-react';
import { PageHeader, SectionCard, AppButton, formatVnd, useToast } from '@shared-ui';
import { ROOM_TYPES, DEPOSIT_CONFIG } from '@features/rooms/roomCatalog';

/**
 * Configure Room & Bed Pricing (Admin). KTX Tân Uyên có 3 loại phòng (2, 4, 6 người), giá tính theo kỳ.
 * Tiền cọc khi đăng ký = % phí kỳ đầu + cọc điện nước — dùng trực tiếp ở bước xác nhận chi phí của sinh viên.
 */

const HISTORY = [
  { when: '10/10/2026', change: 'Cọc điện nước 300.000 → 500.000 ₫', by: 'Quản trị viên' },
  { when: '15/07/2026', change: 'Phòng 4 người 4.800.000 → 5.200.000 ₫/kỳ', by: 'Quản trị viên' },
  { when: '15/07/2026', change: 'Tiền cọc giữ chỗ 15% → 20% phí kỳ đầu', by: 'Quản trị viên' },
];

export function AdminPricingPage() {
  const { show, toastNode } = useToast();
  const [prices, setPrices] = useState(() => Object.fromEntries(ROOM_TYPES.map((r) => [r.id, r.pricePerTerm])) as Record<string, number>);
  const [percent, setPercent] = useState(DEPOSIT_CONFIG.percent);
  const [utilityDeposit, setUtilityDeposit] = useState(DEPOSIT_CONFIG.utilityDeposit);
  const [effective, setEffective] = useState('2027-01-04');

  return (
    <div className="space-y-6 max-w-6xl">
      <PageHeader
        title="Loại phòng & giá"
        description="Giá phòng theo kỳ và cấu hình tiền cọc — áp dụng cho đơn đăng ký mới, không cần triển khai lại"
        actions={
          <>
            <label className="flex items-center gap-2 text-xs text-ink-muted">
              Hiệu lực từ
              <input type="date" value={effective} onChange={(e) => setEffective(e.target.value)} className="px-2.5 py-1.5 border border-line rounded-lg" />
            </label>
            <AppButton size="sm" leftIcon={<Save className="w-4 h-4" />} onClick={() => show(`Đã lưu, hiệu lực từ ${effective.split('-').reverse().join('/')}`)}>Lưu</AppButton>
          </>
        }
      />

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        <SectionCard className="xl:col-span-2" title="Giá phòng theo kỳ" subtitle="Giá / sinh viên / kỳ, đã gồm phí quản lý và Wi-Fi" noPadding>
          <table className="w-full text-sm">
            <thead className="text-xs text-ink-muted bg-surface-muted">
              <tr>
                <th className="text-left font-medium px-5 py-3">Loại phòng</th>
                <th className="text-left font-medium px-5 py-3">Bạn cùng phòng</th>
                <th className="text-right font-medium px-5 py-3">Giá / kỳ (₫)</th>
                <th className="text-right font-medium px-5 py-3">Cọc giữ chỗ</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-line">
              {ROOM_TYPES.map((r) => (
                <tr key={r.id}>
                  <td className="px-5 py-3">
                    <div className="font-semibold text-ink">{r.name}</div>
                    <div className="text-xs text-ink-subtle">{r.id} · {r.amenities.map((a) => a.code).join(', ')}</div>
                  </td>
                  <td className="px-5 py-3 text-ink-muted">{r.canChooseRoommate ? 'Sinh viên được chọn' : 'Hệ thống xếp'}</td>
                  <td className="px-5 py-3 text-right">
                    <input
                      type="number"
                      step={100000}
                      value={prices[r.id]}
                      onChange={(e) => setPrices({ ...prices, [r.id]: Number(e.target.value) })}
                      aria-label={`Giá ${r.name}`}
                      className="w-32 px-2 py-1.5 text-right border border-line rounded-lg"
                    />
                  </td>
                  <td className="px-5 py-3 text-right font-semibold text-ink tabular-nums">{formatVnd(Math.round(((prices[r.id] ?? 0) * percent) / 100))}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </SectionCard>

        <div className="space-y-6">
          <SectionCard title="Tiền cọc khi đăng ký">
            <div className="space-y-4 text-sm">
              <label className="block">
                <span className="block text-xs font-semibold text-ink-muted mb-1">Cọc giữ chỗ (% phí kỳ đầu)</span>
                <input type="number" min={0} max={100} value={percent} onChange={(e) => setPercent(Number(e.target.value))} className="w-full px-3 py-2 border border-line rounded-lg" />
              </label>
              <label className="block">
                <span className="block text-xs font-semibold text-ink-muted mb-1">Cọc điện nước (₫)</span>
                <input type="number" step={50000} value={utilityDeposit} onChange={(e) => setUtilityDeposit(Number(e.target.value))} className="w-full px-3 py-2 border border-line rounded-lg" />
              </label>
              <p className="text-xs text-ink-muted">
                Ví dụ phòng 4 người: {formatVnd(Math.round(((prices.ROOM_4 ?? 0) * percent) / 100))} + {formatVnd(utilityDeposit)} ={' '}
                <strong className="text-ink">{formatVnd(Math.round(((prices.ROOM_4 ?? 0) * percent) / 100) + utilityDeposit)}</strong>
              </p>
            </div>
          </SectionCard>
          <SectionCard title={<span className="flex items-center gap-2"><History className="w-4 h-4" /> Lịch sử thay đổi</span>} noPadding>
            <ul className="divide-y divide-line">
              {HISTORY.map((h) => (
                <li key={h.change} className="px-5 py-3 text-xs"><div className="text-ink">{h.change}</div><div className="text-ink-subtle">{h.when} · {h.by}</div></li>
              ))}
            </ul>
          </SectionCard>
        </div>
      </div>
      {toastNode}
    </div>
  );
}
