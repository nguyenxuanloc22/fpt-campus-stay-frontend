import { useState } from 'react';
import { Save, History } from 'lucide-react';
import { PageHeader, SectionCard, AppButton, formatVnd, useToast, t } from '@shared-ui';
import { ROOM_TYPES, DEPOSIT_CONFIG } from '@features/rooms/roomCatalog';

/**
 * Configure Room & Bed Pricing (Admin). KTX Tân Uyên có 3 loại phòng (2, 4, 6 người), giá tính theo kỳ.
 * Tiền cọc khi đăng ký = % phí kỳ đầu + cọc điện nước — dùng trực tiếp ở bước xác nhận chi phí của sinh viên.
 */

const HISTORY = [
  { when: '10/10/2026', change: t('Utility deposit 300.000 → 500.000 ₫'), by: t('Administrator') },
  { when: '15/07/2026', change: t('4-person room 4.800.000 → 5.200.000 ₫/term'), by: t('Administrator') },
  { when: '15/07/2026', change: t('Holding deposit 15% → 20% of the first term fee'), by: t('Administrator') },
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
        title={t('Room types & pricing')}
        description={t('Room prices per term and deposit settings — apply to new applications without redeployment')}
        actions={
          <>
            <label className="flex items-center gap-2 text-xs text-ink-muted">
              {t('Effective from')}
              <input type="date" value={effective} onChange={(e) => setEffective(e.target.value)} className="px-2.5 py-1.5 border border-line rounded-lg" />
            </label>
            <AppButton size="sm" leftIcon={<Save className="w-4 h-4" />} onClick={() => show(t('Saved, effective from {0}', { 0: effective.split('-').reverse().join('/') }))}>{t('Save')}</AppButton>
          </>
        }
      />

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        <SectionCard className="xl:col-span-2" title={t('Room prices per term')} subtitle={t('Price / student / term, including management fee and Wi-Fi')} noPadding>
          <table className="w-full text-sm">
            <thead className="text-xs text-ink-muted bg-surface-muted">
              <tr>
                <th className="text-left font-medium px-5 py-3">{t('Room type')}</th>
                <th className="text-left font-medium px-5 py-3">{t('Roommates')}</th>
                <th className="text-right font-medium px-5 py-3">{t('Price / term (₫)')}</th>
                <th className="text-right font-medium px-5 py-3">{t('Holding deposit')}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-line">
              {ROOM_TYPES.map((r) => (
                <tr key={r.id}>
                  <td className="px-5 py-3">
                    <div className="font-semibold text-ink">{r.name}</div>
                    <div className="text-xs text-ink-subtle">{r.id} · {r.amenities.map((a) => a.code).join(', ')}</div>
                  </td>
                  <td className="px-5 py-3 text-ink-muted">{r.canChooseRoommate ? t('Chosen by students') : t('Assigned by the system')}</td>
                  <td className="px-5 py-3 text-right">
                    <input
                      type="number"
                      step={100000}
                      value={prices[r.id]}
                      onChange={(e) => setPrices({ ...prices, [r.id]: Number(e.target.value) })}
                      aria-label={t('Price {0}', { 0: r.name })}
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
          <SectionCard title={t('Deposit on registration')}>
            <div className="space-y-4 text-sm">
              <label className="block">
                <span className="block text-xs font-semibold text-ink-muted mb-1">{t('Holding deposit (% of first term fee)')}</span>
                <input type="number" min={0} max={100} value={percent} onChange={(e) => setPercent(Number(e.target.value))} className="w-full px-3 py-2 border border-line rounded-lg" />
              </label>
              <label className="block">
                <span className="block text-xs font-semibold text-ink-muted mb-1">{t('Utility deposit (₫)')}</span>
                <input type="number" step={50000} value={utilityDeposit} onChange={(e) => setUtilityDeposit(Number(e.target.value))} className="w-full px-3 py-2 border border-line rounded-lg" />
              </label>
              <p className="text-xs text-ink-muted">
                {t('Example, 4-person room:')} {formatVnd(Math.round(((prices.ROOM_4 ?? 0) * percent) / 100))} + {formatVnd(utilityDeposit)} ={' '}
                <strong className="text-ink">{formatVnd(Math.round(((prices.ROOM_4 ?? 0) * percent) / 100) + utilityDeposit)}</strong>
              </p>
            </div>
          </SectionCard>
          <SectionCard title={<span className="flex items-center gap-2"><History className="w-4 h-4" /> {t('Change history')}</span>} noPadding>
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
