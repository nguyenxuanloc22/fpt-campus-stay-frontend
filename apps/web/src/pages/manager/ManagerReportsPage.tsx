import { useState } from 'react';
import { Download, FileSpreadsheet, FileText, Building2, Users, Wallet, Wrench, CalendarRange, TrendingUp, Printer, Mail } from 'lucide-react';
import { PageHeader, StatCard, SectionCard, Tabs, BarChart, DonutChart, ProgressBar, AppButton, useToast, CHART_COLORS, t } from '@shared-ui';

type TabKey = 'capacity' | 'finance' | 'service';

const BUILDINGS = [
  { b: t('Building A'), gender: 'Female', rooms: 72, beds: 288, used: 271, revenue: 412 },
  { b: t('Building B'), gender: 'Male', rooms: 64, beds: 312, used: 298, revenue: 356 },
  { b: t('Building C'), gender: 'Female', rooms: 80, beds: 320, used: 276, revenue: 438 },
  { b: t('Building D'), gender: 'Male', rooms: 90, beds: 280, used: 230, revenue: 517 },
];

const SCHEDULED_REPORTS = [
  { name: t('Weekly capacity report'), freq: t('Monday 07:00'), to: t('Board of Rectors'), format: 'PDF' },
  { name: t('Overdue receivables'), freq: t('Daily 08:00'), to: t('Finance office'), format: 'Excel' },
  { name: t('Monthly maintenance summary'), freq: t('1st of every month'), to: t('Administration office'), format: 'PDF' },
];

export function ManagerReportsPage() {
  const { show, toastNode } = useToast();
  const [tab, setTab] = useState<TabKey>('capacity');
  const [term, setTerm] = useState('FA26');

  const totalBeds = BUILDINGS.reduce((s, b) => s + b.beds, 0);
  const usedBeds = BUILDINGS.reduce((s, b) => s + b.used, 0);

  return (
    <div className="space-y-6">
      <PageHeader
        title={t('Reports & statistics')}
        description={t('Occupancy, finance and service quality of the dormitory')}
        actions={
          <>
            <select aria-label={t('Semester')} value={term} onChange={(e) => setTerm(e.target.value)} className="px-3 py-2 text-xs rounded-lg border border-line bg-surface">
              <option value="FA26">{t('Fall 2026 semester')}</option>
              <option value="SU26">{t('Summer 2026 semester')}</option>
              <option value="SP26">{t('Spring 2026 semester')}</option>
              <option value="Y2026">{t('Full year 2026')}</option>
            </select>
            <AppButton size="sm" variant="outline" leftIcon={<Printer className="w-4 h-4" />} onClick={() => window.print()}>In</AppButton>
            <AppButton size="sm" leftIcon={<Download className="w-4 h-4" />} onClick={() => show(t('Exporting the summary report (PDF)'))}>{t('Export reports')}</AppButton>
          </>
        }
      />

      <div className="grid grid-cols-2 xl:grid-cols-4 gap-4">
        <StatCard label={t('Occupancy')} value={`${((usedBeds / totalBeds) * 100).toFixed(1)}%`} icon={Building2} tone="navy" trend={{ value: t('+3.4% vs FA25'), up: true }} />
        <StatCard label={t('Residents')} value={usedBeds.toLocaleString('vi-VN')} icon={Users} tone="orange" hint={t('/{0} beds', { 0: totalBeds.toLocaleString('vi-VN') })} />
        <StatCard label={t('Semester revenue')} value={t('17.23 billion ₫')} icon={Wallet} tone="emerald" trend={{ value: '+8.1%', up: true }} />
        <StatCard label={t('Maintenance requests handled')} value="1.482" icon={Wrench} tone="blue" hint={t('96.1% within SLA')} />
      </div>

      <Tabs<TabKey>
        items={[
          { value: 'capacity', label: t('Capacity') },
          { value: 'finance', label: t('Finance') },
          { value: 'service', label: t('Services & maintenance') },
        ]}
        value={tab}
        onChange={setTab}
      />

      {tab === 'capacity' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
            <SectionCard title={t('Monthly occupancy (%)')} className="xl:col-span-2">
              <BarChart
                height={200}
                data={[
                  { label: 'T1', value: 89, secondary: 86 },
                  { label: 'T2', value: 91, secondary: 88 },
                  { label: 'T3', value: 92, secondary: 89 },
                  { label: 'T4', value: 90, secondary: 87 },
                  { label: 'T5', value: 71, secondary: 66 },
                  { label: 'T6', value: 58, secondary: 55 },
                  { label: 'T7', value: 62, secondary: 60 },
                  { label: 'T8', value: 88, secondary: 82 },
                  { label: 'T9', value: 94, secondary: 89 },
                  { label: 'T10', value: 91, secondary: 88 },
                ]}
                primaryLabel="2026"
                secondaryLabel="2025"
                formatValue={(v) => `${v}%`}
              />
            </SectionCard>
            <SectionCard title={t('Room type mix')}>
              <DonutChart
                size={130}
                centerValue="1.200"
                centerLabel={t('beds')}
                segments={[
                  { label: t('4-bed air-conditioned'), value: 720, color: CHART_COLORS.brand },
                  { label: t('6-bed standard'), value: 264, color: CHART_COLORS.neutral },
                  { label: t('4-bed with fan'), value: 144, color: CHART_COLORS.blue },
                  { label: t('2-bed VIP'), value: 72, color: CHART_COLORS.green },
                ]}
              />
            </SectionCard>
          </div>
          <SectionCard title={t('Details by building')} noPadding>
            <div className="overflow-x-auto">
              <table className="w-full text-xs">
                <thead className="bg-surface-muted text-ink-muted">
                  <tr>
                    <th className="text-left font-semibold px-5 py-3">{t('Building')}</th>
                    <th className="text-right font-semibold px-5 py-3">{t('Rooms')}</th>
                    <th className="text-right font-semibold px-5 py-3">{t('Beds')}</th>
                    <th className="text-right font-semibold px-5 py-3">{t('Occupied')}</th>
                    <th className="text-left font-semibold px-5 py-3 w-48">{t('Rate')}</th>
                    <th className="text-right font-semibold px-5 py-3">Doanh thu (tr ₫)</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-line">
                  {BUILDINGS.map((b) => {
                    const pct = (b.used / b.beds) * 100;
                    return (
                      <tr key={b.b}>
                        <td className="px-5 py-3 font-bold text-ink">{b.b} <span className="font-normal text-ink-muted">({t(b.gender)})</span></td>
                        <td className="px-5 py-3 text-right">{b.rooms}</td>
                        <td className="px-5 py-3 text-right">{b.beds}</td>
                        <td className="px-5 py-3 text-right font-semibold">{b.used}</td>
                        <td className="px-5 py-3"><div className="flex items-center gap-2"><ProgressBar value={pct} tone={pct > 95 ? 'rose' : pct > 88 ? 'amber' : 'emerald'} /><span className="font-semibold w-12">{pct.toFixed(1)}%</span></div></td>
                        <td className="px-5 py-3 text-right font-semibold">{b.revenue.toLocaleString('vi-VN')}</td>
                      </tr>
                    );
                  })}
                  <tr className="bg-surface-muted font-bold">
                    <td className="px-5 py-3">{t('Total')}</td>
                    <td className="px-5 py-3 text-right">{BUILDINGS.reduce((s, b) => s + b.rooms, 0)}</td>
                    <td className="px-5 py-3 text-right">{totalBeds}</td>
                    <td className="px-5 py-3 text-right">{usedBeds}</td>
                    <td className="px-5 py-3">{((usedBeds / totalBeds) * 100).toFixed(1)}%</td>
                    <td className="px-5 py-3 text-right">{BUILDINGS.reduce((s, b) => s + b.revenue, 0).toLocaleString('vi-VN')}</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </SectionCard>
        </div>
      )}

      {tab === 'finance' && (
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
          <SectionCard title={t('Revenue by source (million ₫)')} className="xl:col-span-2">
            <BarChart
              height={200}
              data={[
                { label: t('Accommodation fees'), value: 14200 },
                { label: t('Utilities'), value: 1860 },
                { label: t('Laundry'), value: 420 },
                { label: t('Fines'), value: 96 },
                { label: t('Parking'), value: 654 },
              ]}
              formatValue={(v) => `${v.toLocaleString('vi-VN')} tr`}
            />
          </SectionCard>
          <SectionCard title={t('Receivables status')}>
            <DonutChart
              size={130}
              centerValue="96.8%"
              centerLabel={t('collected')}
              segments={[
                { label: t('Collected'), value: 16680, color: CHART_COLORS.green },
                { label: t('Not yet due'), value: 362, color: CHART_COLORS.blue },
                { label: t('Overdue < 30 days'), value: 156, color: CHART_COLORS.amber },
                { label: t('Overdue > 30 days'), value: 28, color: CHART_COLORS.red },
              ]}
            />
          </SectionCard>
          <SectionCard title={t('Payment channels')} className="xl:col-span-3">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {[
                ['VietQR', 78, 'emerald'],
                [t('ATM card / NAPAS'), 12, 'blue'],
                [t('E-wallet'), 7, 'orange'],
                [t('Cash at the desk'), 3, 'navy'],
              ].map(([l, v, t]) => (
                <div key={String(l)} className="p-4 rounded-xl bg-surface-muted">
                  <div className="text-xs text-ink-muted">{l}</div>
                  <div className="text-xl font-bold text-ink my-1">{v}%</div>
                  <ProgressBar value={Number(v)} tone={t as 'emerald'} />
                </div>
              ))}
            </div>
          </SectionCard>
        </div>
      )}

      {tab === 'service' && (
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
          <SectionCard title={t('Maintenance requests per week')} className="xl:col-span-2">
            <BarChart
              height={200}
              data={[
                { label: 'T1', value: 72, secondary: 70 },
                { label: 'T2', value: 95, secondary: 90 },
                { label: 'T3', value: 81, secondary: 84 },
                { label: 'T4', value: 64, secondary: 66 },
                { label: 'T5', value: 58, secondary: 57 },
                { label: 'T6', value: 66, secondary: 62 },
                { label: 'T7', value: 70, secondary: 69 },
              ]}
              primaryLabel={t('Received')}
              secondaryLabel={t('Completed')}
            />
          </SectionCard>
          <SectionCard title={t('Satisfaction')}>
            <div className="text-center mb-4">
              <div className="text-4xl font-bold text-ink">4.6</div>
              <div className="text-xs text-ink-muted">{t('/ 5 — 1.204 ratings')}</div>
            </div>
            <ul className="space-y-2 text-xs">
              {[
                [5, 68],
                [4, 22],
                [3, 6],
                [2, 3],
                [1, 1],
              ].map(([s, p]) => (
                <li key={s} className="flex items-center gap-2">
                  <span className="w-6 text-ink-muted">{s}★</span>
                  <ProgressBar value={p!} tone="amber" />
                  <span className="w-8 text-right text-ink-muted">{p}%</span>
                </li>
              ))}
            </ul>
          </SectionCard>
        </div>
      )}

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        <SectionCard title={t('Report templates')}>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {[
              { n: t('Resident student list'), icon: Users, f: 'Excel' },
              { n: t('Capacity by building'), icon: Building2, f: 'PDF' },
              { n: t('Income & expense report'), icon: Wallet, f: 'Excel' },
              { n: t('Overdue receivables'), icon: TrendingUp, f: 'Excel' },
              { n: t('Maintenance summary'), icon: Wrench, f: 'PDF' },
              { n: t('Residence changes'), icon: CalendarRange, f: 'PDF' },
            ].map((r) => (
              <button key={r.n} type="button" onClick={() => show(t('Generating "{0}" ({1})', { 0: r.n, 1: r.f }))} className="p-3 rounded-xl border border-line hover:border-brand text-left flex items-center gap-3">
                <div className="w-9 h-9 rounded-lg bg-surface-sunken text-ink flex items-center justify-center"><r.icon className="w-4 h-4" /></div>
                <div className="flex-1">
                  <div className="text-xs font-semibold text-ink">{r.n}</div>
                  <div className="text-label text-ink-muted flex items-center gap-1">{r.f === 'Excel' ? <FileSpreadsheet className="w-3 h-3" /> : <FileText className="w-3 h-3" />}{r.f}</div>
                </div>
                <Download className="w-4 h-4 text-ink-subtle" />
              </button>
            ))}
          </div>
        </SectionCard>
        <SectionCard title={t('Automatic scheduled reports')} noPadding>
          <ul className="divide-y divide-line">
            {SCHEDULED_REPORTS.map((r) => (
              <li key={r.name} className="px-5 py-3 flex items-center gap-3">
                <Mail className="w-4 h-4 text-brand-ink" />
                <div className="flex-1 text-xs">
                  <div className="font-semibold text-ink">{r.name}</div>
                  <div className="text-ink-muted">{r.freq} {t('• sent to')} {r.to} • {r.format}</div>
                </div>
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
