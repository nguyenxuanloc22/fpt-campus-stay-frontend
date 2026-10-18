import { useState } from 'react';
import { Download, FileSpreadsheet, FileText, Building2, Wallet, Repeat, TrendingUp, CalendarRange, Mail } from 'lucide-react';
import clsx from 'clsx';
import { PageHeader, StatCard, SectionCard, Tabs, BarChart, DonutChart, ProgressBar, AppButton, useToast, CHART_COLORS, t } from '@shared-ui';

/**
 * Generate Occupancy, Revenue & Turnover Reports (Admin) + Forecast Occupancy Trends (System).
 * Doanh thu chỉ gồm phí phòng/giường và tiền cọc (Phiếu đăng ký); điện nước thuộc phần mở rộng.
 */

type TabKey = 'occupancy' | 'revenue' | 'turnover' | 'forecast';

const BUILDINGS = [
  { b: t('Building A (Female)'), beds: 288, used: 271 },
  { b: t('Building B (Male)'), beds: 312, used: 298 },
  { b: t('Building C (Female)'), beds: 320, used: 276 },
  { b: t('Building D (Male)'), beds: 280, used: 230 },
];

const TEMPLATES = [
  { name: t('Capacity by building / room type'), tab: 'occupancy' as const, f: 'PDF' },
  { name: t('Resident student list'), tab: 'occupancy' as const, f: 'Excel' },
  { name: t('Room fee & deposit revenue'), tab: 'revenue' as const, f: 'Excel' },
  { name: t('Forfeited deposits (no-show) & refunds'), tab: 'revenue' as const, f: 'Excel' },
  { name: t('Turnover: check-ins / check-outs / room changes'), tab: 'turnover' as const, f: 'PDF' },
  { name: t('Next term capacity forecast'), tab: 'forecast' as const, f: 'PDF' },
];

export function AdminReportsPage() {
  const { show, toastNode } = useToast();
  const [tab, setTab] = useState<TabKey>('occupancy');
  const [term, setTerm] = useState('FA26');

  const beds = BUILDINGS.reduce((s, b) => s + b.beds, 0);
  const used = BUILDINGS.reduce((s, b) => s + b.used, 0);

  return (
    <div className="space-y-6">
      <PageHeader
        title={t('Reports')}
        description={t('Capacity, revenue, turnover and forecasts — exported per semester')}
        actions={
          <>
            <select value={term} onChange={(e) => setTerm(e.target.value)} className="px-3 py-2 text-xs rounded-lg border border-line bg-surface">
              <option value="FA26">{t('Fall 2026 semester')}</option>
              <option value="SU26">{t('Summer 2026 semester')}</option>
              <option value="SP26">{t('Spring 2026 semester')}</option>
              <option value="Y2026">{t('Year 2026')}</option>
            </select>
            <AppButton size="sm" leftIcon={<Download className="w-4 h-4" />} onClick={() => show(t('Generating the summary report (PDF)'))}>{t('Export summary')}</AppButton>
          </>
        }
      />

      <div className="grid grid-cols-2 xl:grid-cols-4 gap-4">
        <StatCard label={t('Capacity')} value={`${((used / beds) * 100).toFixed(1)}%`} icon={Building2} tone="navy" hint={t('{0}/{1} beds', { 0: used.toLocaleString('vi-VN'), 1: beds.toLocaleString('vi-VN') })} />
        <StatCard label={t('Room fee revenue')} value={t('5.18 billion ₫')} icon={Wallet} tone="emerald" trend={{ value: '+8,1%', up: true }} />
        <StatCard label={t('Turnover rate')} value="7,4%" icon={Repeat} tone="blue" hint={t('Room changes + early check-outs')} />
        <StatCard label={t('Spring 2027 forecast')} value="94%" icon={TrendingUp} tone="orange" hint={t('Projected capacity')} />
      </div>

      <Tabs<TabKey>
        items={[
          { value: 'occupancy', label: t('Capacity') },
          { value: 'revenue', label: 'Doanh thu' },
          { value: 'turnover', label: t('Turnover') },
          { value: 'forecast', label: t('Forecast') },
        ]}
        value={tab}
        onChange={setTab}
      />

      {tab === 'occupancy' && (
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
          <SectionCard className="xl:col-span-2" title={t('Capacity by building')}>
            <ul className="space-y-4 text-xs">
              {BUILDINGS.map((b) => {
                const pct = (b.used / b.beds) * 100;
                return (
                  <li key={b.b}>
                    <div className="flex justify-between mb-1"><span className="font-semibold text-ink">{b.b}</span><span>{b.used}/{b.beds} · <strong>{pct.toFixed(1)}%</strong></span></div>
                    <ProgressBar value={pct} tone={pct > 95 ? 'rose' : pct > 88 ? 'amber' : 'emerald'} size="md" />
                  </li>
                );
              })}
            </ul>
          </SectionCard>
          <SectionCard title={t('By room type')}>
            <DonutChart
              size={130}
              centerValue={used.toLocaleString('vi-VN')}
              centerLabel={t('occupied')}
              segments={[
                { label: t('4-bed air-conditioned'), value: 668, color: CHART_COLORS.brand },
                { label: t('6-bed'), value: 249, color: CHART_COLORS.neutral },
                { label: t('4-bed with fan'), value: 118, color: CHART_COLORS.blue },
                { label: t('2-bed'), value: 40, color: CHART_COLORS.green },
              ]}
            />
          </SectionCard>
        </div>
      )}

      {tab === 'revenue' && (
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
          <SectionCard className="xl:col-span-2" title={t('Monthly revenue (million ₫)')} subtitle={t('Room fees and deposits — billed vs. collected')}>
            <BarChart
              height={200}
              data={[
                { label: 'T7', value: 980, secondary: 960 },
                { label: 'T8', value: 2520, secondary: 2410 },
                { label: 'T9', value: 760, secondary: 742 },
                { label: 'T10', value: 920, secondary: 674 },
              ]}
              primaryLabel={t('Billed')}
              secondaryLabel={t('Collected')}
              formatValue={(v) => `${v.toLocaleString('vi-VN')} tr`}
            />
          </SectionCard>
          <SectionCard title={t('Deposits')}>
            <ul className="space-y-2 text-xs">
              {[
                [t('Collected (Spring 2027 registration)'), '642 tr ₫'],
                [t('Deducted from the room fee at check-in'), '512 tr ₫'],
                [t('Refunded (cancellations, round 2)'), '9,5 tr ₫'],
                [t('Forfeited due to no-show'), '6,0 tr ₫'],
              ].map(([k, v]) => (
                <li key={k} className="flex justify-between p-2.5 rounded-lg bg-surface-muted"><span className="text-ink-muted">{k}</span><span className="font-bold">{v}</span></li>
              ))}
            </ul>
          </SectionCard>
        </div>
      )}

      {tab === 'turnover' && (
        <SectionCard title={t('Turnover in Fall 2026')}>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-5 text-xs">
            {[
              [t('Check-ins'), '1.075'],
              [t('Early check-outs'), '31'],
              [t('Room change / swap'), '49'],
              ['No-show', '12'],
            ].map(([k, v]) => (
              <div key={k} className="p-3 rounded-xl bg-surface-muted"><div className="text-ink-subtle">{k}</div><div className="text-xl font-bold text-ink">{v}</div></div>
            ))}
          </div>
          <BarChart
            height={160}
            data={[
              { label: 'T9', value: 21, secondary: 8 },
              { label: 'T10', value: 28, secondary: 11 },
              { label: 'T11', value: 9, secondary: 6 },
              { label: 'T12', value: 4, secondary: 6 },
            ]}
            primaryLabel={t('Room changes')}
            secondaryLabel={t('Early check-outs')}
          />
        </SectionCard>
      )}

      {tab === 'forecast' && (
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
          <SectionCard className="xl:col-span-2" title={t('Capacity forecast (%)')} subtitle={t('Forecast from submitted applications, renewal rates and no-shows of previous terms')}>
            <BarChart
              height={200}
              data={[
                { label: 'SP26', value: 88 },
                { label: 'SU26', value: 61 },
                { label: 'FA26', value: 89 },
                { label: 'SP27*', value: 94 },
                { label: 'SU27*', value: 64 },
                { label: 'FA27*', value: 97 },
              ]}
              formatValue={(v) => `${v}%`}
            />
            <p className="text-label text-ink-muted mt-2">{t('* Forecast values. Fall 2027 is expected to exceed 95% — consider opening floor 6 of Building C.')}</p>
          </SectionCard>
          <SectionCard title={t('Projected free beds, Spring 2027')}>
            <ul className="space-y-2 text-xs">
              {[
                [t('4-bed air-conditioned'), 38, 'emerald'],
                [t('6-bed'), 0, 'rose'],
                [t('4-bed with fan'), 19, 'emerald'],
                [t('2-bed'), 2, 'amber'],
              ].map(([k, v, t]) => (
                <li key={String(k)} className="flex justify-between p-2.5 rounded-lg bg-surface-muted">
                  <span className="text-ink-muted">{k}</span>
                  <span className={clsx('font-bold', t === 'rose' ? 'text-rose-600' : t === 'amber' ? 'text-amber-600' : 'text-emerald-600')}>{v}</span>
                </li>
              ))}
            </ul>
          </SectionCard>
        </div>
      )}

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        <SectionCard title={t('Export reports')}>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {TEMPLATES.map((r) => (
              <button key={r.name} type="button" onClick={() => show(t('Generating “{0}” ({1})', { 0: r.name, 1: r.f }))} className="p-3 rounded-xl border border-line hover:border-brand text-left flex items-center gap-3">
                <div className="w-9 h-9 rounded-lg bg-surface-sunken text-ink flex items-center justify-center">{r.f === 'Excel' ? <FileSpreadsheet className="w-4 h-4" /> : <FileText className="w-4 h-4" />}</div>
                <div className="flex-1 text-xs"><div className="font-semibold text-ink">{r.name}</div><div className="text-ink-muted">{r.f}</div></div>
                <Download className="w-4 h-4 text-ink-subtle" />
              </button>
            ))}
          </div>
        </SectionCard>
        <SectionCard title={t('Scheduled reports')} noPadding>
          <ul className="divide-y divide-line">
            {[
              { n: t('Weekly capacity'), f: t('Monday 07:00'), to: t('Dormitory Manager') },
              { n: t('Monthly revenue & receivables'), f: t('1st of every month'), to: t('Finance office') },
              { n: t('Next term capacity forecast'), f: t('Before the registration window opens'), to: t('Board of Rectors') },
            ].map((r) => (
              <li key={r.n} className="px-5 py-3 flex items-center gap-3 text-xs">
                <Mail className="w-4 h-4 text-brand-ink" />
                <div className="flex-1"><div className="font-semibold text-ink">{r.n}</div><div className="text-ink-muted flex items-center gap-1"><CalendarRange className="w-3 h-3" />{r.f} {t('· sent to')} {r.to}</div></div>
                <span className="text-label font-semibold text-emerald-600">{t('On')}</span>
              </li>
            ))}
          </ul>
        </SectionCard>
      </div>

      {toastNode}
    </div>
  );
}
