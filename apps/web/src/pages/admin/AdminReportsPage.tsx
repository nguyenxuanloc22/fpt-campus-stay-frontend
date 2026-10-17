import { useState } from 'react';
import { Download, FileSpreadsheet, FileText, Building2, Wallet, Repeat, TrendingUp, CalendarRange, Mail } from 'lucide-react';
import clsx from 'clsx';
import { PageHeader, StatCard, SectionCard, Tabs, BarChart, DonutChart, ProgressBar, AppButton, useToast } from '@shared-ui';

/**
 * Generate Occupancy, Revenue & Turnover Reports (Admin) + Forecast Occupancy Trends (System).
 * Doanh thu chỉ gồm phí phòng/giường và tiền cọc (Phiếu đăng ký); điện nước thuộc phần mở rộng.
 */

type TabKey = 'occupancy' | 'revenue' | 'turnover' | 'forecast';

const BUILDINGS = [
  { b: 'Tòa A (Nữ)', beds: 288, used: 271 },
  { b: 'Tòa B (Nam)', beds: 312, used: 298 },
  { b: 'Tòa C (Nữ)', beds: 320, used: 276 },
  { b: 'Tòa D (Nam)', beds: 280, used: 230 },
];

const TEMPLATES = [
  { name: 'Công suất theo tòa / loại phòng', tab: 'occupancy' as const, f: 'PDF' },
  { name: 'Danh sách sinh viên lưu trú', tab: 'occupancy' as const, f: 'Excel' },
  { name: 'Doanh thu phí phòng & tiền cọc', tab: 'revenue' as const, f: 'Excel' },
  { name: 'Tiền cọc bị giữ (no-show) & hoàn cọc', tab: 'revenue' as const, f: 'Excel' },
  { name: 'Luân chuyển: nhận / trả / đổi phòng', tab: 'turnover' as const, f: 'PDF' },
  { name: 'Dự báo công suất kỳ tới', tab: 'forecast' as const, f: 'PDF' },
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
        title="Báo cáo"
        description="Công suất, doanh thu, luân chuyển và dự báo — xuất theo kỳ học"
        actions={
          <>
            <select value={term} onChange={(e) => setTerm(e.target.value)} className="px-3 py-2 text-xs rounded-lg border border-slate-200 bg-white">
              <option value="FA26">Học kỳ Fall 2026</option>
              <option value="SU26">Học kỳ Summer 2026</option>
              <option value="SP26">Học kỳ Spring 2026</option>
              <option value="Y2026">Năm 2026</option>
            </select>
            <AppButton size="sm" leftIcon={<Download className="w-4 h-4" />} onClick={() => show('Đang tạo báo cáo tổng hợp (PDF)')}>Xuất tổng hợp</AppButton>
          </>
        }
      />

      <div className="grid grid-cols-2 xl:grid-cols-4 gap-4">
        <StatCard label="Công suất" value={`${((used / beds) * 100).toFixed(1)}%`} icon={Building2} tone="navy" hint={`${used.toLocaleString('vi-VN')}/${beds.toLocaleString('vi-VN')} giường`} />
        <StatCard label="Doanh thu phí phòng" value="5,18 tỷ ₫" icon={Wallet} tone="emerald" trend={{ value: '+8,1%', up: true }} />
        <StatCard label="Tỷ lệ luân chuyển" value="7,4%" icon={Repeat} tone="blue" hint="Đổi phòng + trả phòng sớm" />
        <StatCard label="Dự báo Spring 2027" value="94%" icon={TrendingUp} tone="orange" hint="Công suất dự kiến" />
      </div>

      <Tabs<TabKey>
        items={[
          { value: 'occupancy', label: 'Công suất' },
          { value: 'revenue', label: 'Doanh thu' },
          { value: 'turnover', label: 'Luân chuyển' },
          { value: 'forecast', label: 'Dự báo' },
        ]}
        value={tab}
        onChange={setTab}
      />

      {tab === 'occupancy' && (
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
          <SectionCard className="xl:col-span-2" title="Công suất theo tòa">
            <ul className="space-y-4 text-xs">
              {BUILDINGS.map((b) => {
                const pct = (b.used / b.beds) * 100;
                return (
                  <li key={b.b}>
                    <div className="flex justify-between mb-1"><span className="font-semibold text-slate-700">{b.b}</span><span>{b.used}/{b.beds} · <strong>{pct.toFixed(1)}%</strong></span></div>
                    <ProgressBar value={pct} tone={pct > 95 ? 'rose' : pct > 88 ? 'amber' : 'emerald'} size="md" />
                  </li>
                );
              })}
            </ul>
          </SectionCard>
          <SectionCard title="Theo loại phòng">
            <DonutChart
              size={130}
              centerValue={used.toLocaleString('vi-VN')}
              centerLabel="đang ở"
              segments={[
                { label: '4 giường máy lạnh', value: 668, color: '#F26F21' },
                { label: '6 giường', value: 249, color: '#1A365D' },
                { label: '4 giường quạt', value: 118, color: '#3B82F6' },
                { label: '2 giường', value: 40, color: '#10B981' },
              ]}
            />
          </SectionCard>
        </div>
      )}

      {tab === 'revenue' && (
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
          <SectionCard className="xl:col-span-2" title="Doanh thu theo tháng (triệu ₫)" subtitle="Phí phòng và tiền cọc — phải thu so với đã thu">
            <BarChart
              height={200}
              data={[
                { label: 'T7', value: 980, secondary: 960 },
                { label: 'T8', value: 2520, secondary: 2410 },
                { label: 'T9', value: 760, secondary: 742 },
                { label: 'T10', value: 920, secondary: 674 },
              ]}
              primaryLabel="Phải thu"
              secondaryLabel="Đã thu"
              formatValue={(v) => `${v.toLocaleString('vi-VN')} tr`}
            />
          </SectionCard>
          <SectionCard title="Tiền cọc">
            <ul className="space-y-2 text-xs">
              {[
                ['Đã thu (đăng ký Spring 2027)', '642 tr ₫'],
                ['Trừ vào phí phòng khi check-in', '512 tr ₫'],
                ['Hoàn cọc (hủy đơn, vòng 2)', '9,5 tr ₫'],
                ['Giữ lại do no-show', '6,0 tr ₫'],
              ].map(([k, v]) => (
                <li key={k} className="flex justify-between p-2.5 rounded-lg bg-slate-50"><span className="text-slate-600">{k}</span><span className="font-bold">{v}</span></li>
              ))}
            </ul>
          </SectionCard>
        </div>
      )}

      {tab === 'turnover' && (
        <SectionCard title="Luân chuyển trong kỳ Fall 2026">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-5 text-xs">
            {[
              ['Nhận phòng', '1.075'],
              ['Trả phòng sớm', '31'],
              ['Đổi / hoán đổi phòng', '49'],
              ['No-show', '12'],
            ].map(([k, v]) => (
              <div key={k} className="p-3 rounded-xl bg-slate-50"><div className="text-slate-400">{k}</div><div className="text-xl font-bold text-slate-800">{v}</div></div>
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
            primaryLabel="Đổi phòng"
            secondaryLabel="Trả phòng sớm"
          />
        </SectionCard>
      )}

      {tab === 'forecast' && (
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
          <SectionCard className="xl:col-span-2" title="Dự báo công suất (%)" subtitle="Hệ thống dự báo từ đơn đã nộp, tỷ lệ gia hạn và no-show các kỳ trước">
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
            <p className="text-[11px] text-slate-500 mt-2">* Giá trị dự báo. Fall 2027 dự kiến vượt 95% — cân nhắc mở thêm tầng 6 Tòa C.</p>
          </SectionCard>
          <SectionCard title="Giường trống dự kiến Spring 2027">
            <ul className="space-y-2 text-xs">
              {[
                ['4 giường máy lạnh', 38, 'emerald'],
                ['6 giường', 0, 'rose'],
                ['4 giường quạt', 19, 'emerald'],
                ['2 giường', 2, 'amber'],
              ].map(([k, v, t]) => (
                <li key={String(k)} className="flex justify-between p-2.5 rounded-lg bg-slate-50">
                  <span className="text-slate-600">{k}</span>
                  <span className={clsx('font-bold', t === 'rose' ? 'text-rose-600' : t === 'amber' ? 'text-amber-600' : 'text-emerald-600')}>{v}</span>
                </li>
              ))}
            </ul>
          </SectionCard>
        </div>
      )}

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        <SectionCard title="Xuất báo cáo">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {TEMPLATES.map((r) => (
              <button key={r.name} type="button" onClick={() => show(`Đang tạo “${r.name}” (${r.f})`)} className="p-3 rounded-xl border border-slate-200 hover:border-[#F26F21] text-left flex items-center gap-3">
                <div className="w-9 h-9 rounded-lg bg-[#EBF2FB] text-[#1A365D] flex items-center justify-center">{r.f === 'Excel' ? <FileSpreadsheet className="w-4 h-4" /> : <FileText className="w-4 h-4" />}</div>
                <div className="flex-1 text-xs"><div className="font-semibold text-slate-800">{r.name}</div><div className="text-slate-500">{r.f}</div></div>
                <Download className="w-4 h-4 text-slate-400" />
              </button>
            ))}
          </div>
        </SectionCard>
        <SectionCard title="Gửi báo cáo định kỳ" noPadding>
          <ul className="divide-y divide-slate-100">
            {[
              { n: 'Công suất tuần', f: 'Thứ Hai 07:00', to: 'Trưởng ban KTX' },
              { n: 'Doanh thu & công nợ tháng', f: 'Ngày 1 hằng tháng', to: 'Phòng Tài chính' },
              { n: 'Dự báo công suất kỳ tới', f: 'Trước khi mở cửa sổ đăng ký', to: 'Ban Giám hiệu' },
            ].map((r) => (
              <li key={r.n} className="px-5 py-3 flex items-center gap-3 text-xs">
                <Mail className="w-4 h-4 text-[#F26F21]" />
                <div className="flex-1"><div className="font-semibold text-slate-800">{r.n}</div><div className="text-slate-500 flex items-center gap-1"><CalendarRange className="w-3 h-3" />{r.f} · gửi {r.to}</div></div>
                <span className="text-[11px] font-semibold text-emerald-600">Đang bật</span>
              </li>
            ))}
          </ul>
        </SectionCard>
      </div>

      {toastNode}
    </div>
  );
}
