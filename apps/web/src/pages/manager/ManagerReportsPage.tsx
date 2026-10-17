import { useState } from 'react';
import { Download, FileSpreadsheet, FileText, Building2, Users, Wallet, Wrench, CalendarRange, TrendingUp, Printer, Mail } from 'lucide-react';
import { PageHeader, StatCard, SectionCard, Tabs, BarChart, DonutChart, ProgressBar, AppButton, useToast } from '@shared-ui';

type TabKey = 'capacity' | 'finance' | 'service';

const BUILDINGS = [
  { b: 'Tòa A', gender: 'Nữ', rooms: 72, beds: 288, used: 271, revenue: 412 },
  { b: 'Tòa B', gender: 'Nam', rooms: 64, beds: 312, used: 298, revenue: 356 },
  { b: 'Tòa C', gender: 'Nữ', rooms: 80, beds: 320, used: 276, revenue: 438 },
  { b: 'Tòa D', gender: 'Nam', rooms: 90, beds: 280, used: 230, revenue: 517 },
];

const SCHEDULED_REPORTS = [
  { name: 'Báo cáo công suất tuần', freq: 'Thứ Hai 07:00', to: 'Ban giám hiệu', format: 'PDF' },
  { name: 'Công nợ quá hạn', freq: 'Hằng ngày 08:00', to: 'Phòng Tài chính', format: 'Excel' },
  { name: 'Tổng hợp bảo trì tháng', freq: 'Ngày 1 hàng tháng', to: 'Phòng Hành chính', format: 'PDF' },
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
        title="Báo Cáo & Thống Kê"
        description="Công suất lưu trú, tài chính và chất lượng dịch vụ KTX"
        actions={
          <>
            <select value={term} onChange={(e) => setTerm(e.target.value)} className="px-3 py-2 text-xs rounded-lg border border-slate-200 bg-white">
              <option value="FA26">Học kỳ Fall 2026</option>
              <option value="SU26">Học kỳ Summer 2026</option>
              <option value="SP26">Học kỳ Spring 2026</option>
              <option value="Y2026">Cả năm 2026</option>
            </select>
            <AppButton size="sm" variant="outline" leftIcon={<Printer className="w-4 h-4" />} onClick={() => window.print()}>In</AppButton>
            <AppButton size="sm" leftIcon={<Download className="w-4 h-4" />} onClick={() => show('Đang xuất báo cáo tổng hợp (PDF)')}>Xuất báo cáo</AppButton>
          </>
        }
      />

      <div className="grid grid-cols-2 xl:grid-cols-4 gap-4">
        <StatCard label="Công suất sử dụng" value={`${((usedBeds / totalBeds) * 100).toFixed(1)}%`} icon={Building2} tone="navy" trend={{ value: '+3.4% so với FA25', up: true }} />
        <StatCard label="Sinh viên lưu trú" value={usedBeds.toLocaleString('vi-VN')} icon={Users} tone="orange" hint={`/${totalBeds.toLocaleString('vi-VN')} giường`} />
        <StatCard label="Doanh thu học kỳ" value="17,23 tỷ ₫" icon={Wallet} tone="emerald" trend={{ value: '+8.1%', up: true }} />
        <StatCard label="Ticket đã xử lý" value="1.482" icon={Wrench} tone="blue" hint="96.1% đúng SLA" />
      </div>

      <Tabs<TabKey>
        items={[
          { value: 'capacity', label: 'Công suất' },
          { value: 'finance', label: 'Tài chính' },
          { value: 'service', label: 'Dịch vụ & bảo trì' },
        ]}
        value={tab}
        onChange={setTab}
      />

      {tab === 'capacity' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
            <SectionCard title="Lấp đầy theo tháng (%)" className="xl:col-span-2">
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
            <SectionCard title="Phân bổ loại phòng">
              <DonutChart
                size={130}
                centerValue="1.200"
                centerLabel="giường"
                segments={[
                  { label: '4 giường máy lạnh', value: 720, color: '#F26F21' },
                  { label: '6 giường tiêu chuẩn', value: 264, color: '#1A365D' },
                  { label: '4 giường quạt', value: 144, color: '#3B82F6' },
                  { label: '2 giường VIP', value: 72, color: '#10B981' },
                ]}
              />
            </SectionCard>
          </div>
          <SectionCard title="Chi tiết theo tòa nhà" noPadding>
            <div className="overflow-x-auto">
              <table className="w-full text-xs">
                <thead className="bg-slate-50 text-slate-500">
                  <tr>
                    <th className="text-left font-semibold px-5 py-3">Tòa</th>
                    <th className="text-right font-semibold px-5 py-3">Số phòng</th>
                    <th className="text-right font-semibold px-5 py-3">Số giường</th>
                    <th className="text-right font-semibold px-5 py-3">Đang ở</th>
                    <th className="text-left font-semibold px-5 py-3 w-48">Tỷ lệ</th>
                    <th className="text-right font-semibold px-5 py-3">Doanh thu (tr ₫)</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {BUILDINGS.map((b) => {
                    const pct = (b.used / b.beds) * 100;
                    return (
                      <tr key={b.b}>
                        <td className="px-5 py-3 font-bold text-slate-800">{b.b} <span className="font-normal text-slate-500">({b.gender})</span></td>
                        <td className="px-5 py-3 text-right">{b.rooms}</td>
                        <td className="px-5 py-3 text-right">{b.beds}</td>
                        <td className="px-5 py-3 text-right font-semibold">{b.used}</td>
                        <td className="px-5 py-3"><div className="flex items-center gap-2"><ProgressBar value={pct} tone={pct > 95 ? 'rose' : pct > 88 ? 'amber' : 'emerald'} /><span className="font-semibold w-12">{pct.toFixed(1)}%</span></div></td>
                        <td className="px-5 py-3 text-right font-semibold">{b.revenue.toLocaleString('vi-VN')}</td>
                      </tr>
                    );
                  })}
                  <tr className="bg-slate-50 font-bold">
                    <td className="px-5 py-3">Tổng cộng</td>
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
          <SectionCard title="Doanh thu theo nguồn (triệu ₫)" className="xl:col-span-2">
            <BarChart
              height={200}
              data={[
                { label: 'Phí lưu trú', value: 14200 },
                { label: 'Điện nước', value: 1860 },
                { label: 'Giặt sấy', value: 420 },
                { label: 'Phạt', value: 96 },
                { label: 'Gửi xe', value: 654 },
              ]}
              formatValue={(v) => `${v.toLocaleString('vi-VN')} tr`}
            />
          </SectionCard>
          <SectionCard title="Tình trạng công nợ">
            <DonutChart
              size={130}
              centerValue="96.8%"
              centerLabel="đã thu"
              segments={[
                { label: 'Đã thu', value: 16680, color: '#10B981' },
                { label: 'Chưa đến hạn', value: 362, color: '#3B82F6' },
                { label: 'Quá hạn < 30 ngày', value: 156, color: '#F59E0B' },
                { label: 'Quá hạn > 30 ngày', value: 28, color: '#F43F5E' },
              ]}
            />
          </SectionCard>
          <SectionCard title="Kênh thanh toán" className="xl:col-span-3">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {[
                ['VietQR', 78, 'emerald'],
                ['Thẻ ATM / NAPAS', 12, 'blue'],
                ['Ví điện tử', 7, 'orange'],
                ['Tiền mặt tại quầy', 3, 'navy'],
              ].map(([l, v, t]) => (
                <div key={String(l)} className="p-4 rounded-xl bg-slate-50">
                  <div className="text-xs text-slate-500">{l}</div>
                  <div className="text-xl font-bold text-slate-800 my-1">{v}%</div>
                  <ProgressBar value={Number(v)} tone={t as 'emerald'} />
                </div>
              ))}
            </div>
          </SectionCard>
        </div>
      )}

      {tab === 'service' && (
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
          <SectionCard title="Ticket theo tuần" className="xl:col-span-2">
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
              primaryLabel="Tiếp nhận"
              secondaryLabel="Hoàn thành"
            />
          </SectionCard>
          <SectionCard title="Mức độ hài lòng">
            <div className="text-center mb-4">
              <div className="text-4xl font-bold text-[#1A365D]">4.6</div>
              <div className="text-xs text-slate-500">/ 5 — 1.204 đánh giá</div>
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
                  <span className="w-6 text-slate-600">{s}★</span>
                  <ProgressBar value={p!} tone="amber" />
                  <span className="w-8 text-right text-slate-500">{p}%</span>
                </li>
              ))}
            </ul>
          </SectionCard>
        </div>
      )}

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        <SectionCard title="Mẫu báo cáo có sẵn">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {[
              { n: 'Danh sách SV lưu trú', icon: Users, f: 'Excel' },
              { n: 'Công suất theo tòa', icon: Building2, f: 'PDF' },
              { n: 'Báo cáo thu – chi', icon: Wallet, f: 'Excel' },
              { n: 'Công nợ quá hạn', icon: TrendingUp, f: 'Excel' },
              { n: 'Tổng hợp bảo trì', icon: Wrench, f: 'PDF' },
              { n: 'Biến động lưu trú', icon: CalendarRange, f: 'PDF' },
            ].map((r) => (
              <button key={r.n} type="button" onClick={() => show(`Đang tạo "${r.n}" (${r.f})`)} className="p-3 rounded-xl border border-slate-200 hover:border-[#F26F21] text-left flex items-center gap-3">
                <div className="w-9 h-9 rounded-lg bg-[#EBF2FB] text-[#1A365D] flex items-center justify-center"><r.icon className="w-4 h-4" /></div>
                <div className="flex-1">
                  <div className="text-xs font-semibold text-slate-800">{r.n}</div>
                  <div className="text-[11px] text-slate-500 flex items-center gap-1">{r.f === 'Excel' ? <FileSpreadsheet className="w-3 h-3" /> : <FileText className="w-3 h-3" />}{r.f}</div>
                </div>
                <Download className="w-4 h-4 text-slate-400" />
              </button>
            ))}
          </div>
        </SectionCard>
        <SectionCard title="Báo cáo định kỳ tự động" noPadding>
          <ul className="divide-y divide-slate-100">
            {SCHEDULED_REPORTS.map((r) => (
              <li key={r.name} className="px-5 py-3 flex items-center gap-3">
                <Mail className="w-4 h-4 text-[#F26F21]" />
                <div className="flex-1 text-xs">
                  <div className="font-semibold text-slate-800">{r.name}</div>
                  <div className="text-slate-500">{r.freq} • gửi {r.to} • {r.format}</div>
                </div>
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
