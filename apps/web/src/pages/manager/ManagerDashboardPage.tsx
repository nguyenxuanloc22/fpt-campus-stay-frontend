import { useNavigate } from 'react-router-dom';
import {
  ShieldAlert,
  CheckSquare,
  BarChart3,
  Building2,
  Wallet,
  Users,
  Wrench,
  TrendingUp,
  ArrowRight,
  AlertTriangle,
  Download,
} from 'lucide-react';
import clsx from 'clsx';
import { APP_ROUTES } from '@campusstay/constants';
import { useAuthStore } from '@features/auth';
import {
  AppButton,
  StatCard,
  SectionCard,
  BarChart,
  DonutChart,
  ProgressBar,
  StatusBadge,
  Sparkline,
} from '@shared-ui';

const OCCUPANCY_TREND = [
  { label: 'T5', value: 71 },
  { label: 'T6', value: 58 },
  { label: 'T7', value: 62 },
  { label: 'T8', value: 88 },
  { label: 'T9', value: 94 },
  { label: 'T10', value: 91 },
];

const REVENUE = [
  { label: 'T5', value: 1.42, secondary: 1.38 },
  { label: 'T6', value: 1.05, secondary: 1.01 },
  { label: 'T7', value: 1.12, secondary: 1.1 },
  { label: 'T8', value: 6.85, secondary: 6.4 },
  { label: 'T9', value: 1.86, secondary: 1.72 },
  { label: 'T10', value: 1.79, secondary: 1.31 },
];

const PENDING = [
  { type: 'Xếp phòng', title: 'Đề xuất BR-SP27-02: 342 phân bổ vòng 1 (Staff đã rà soát)', when: '2 giờ trước', route: APP_ROUTES.MANAGER.ASSIGNMENT_APPROVAL, priority: 'HIGH' },
  { type: 'Đơn đăng ký', title: '3 đơn đăng ký Staff chuyển lên', when: '5 giờ trước', route: APP_ROUTES.MANAGER.APPROVALS, priority: 'HIGH' },
  { type: 'Đổi phòng', title: '2 yêu cầu hoán đổi phòng', when: 'Hôm qua', route: APP_ROUTES.MANAGER.APPROVALS, priority: 'MEDIUM' },
  { type: 'Bảo trì', title: '2 lịch bảo trì định kỳ chờ duyệt', when: 'Hôm qua', route: APP_ROUTES.MANAGER.APPROVALS, priority: 'LOW' },
];

export function ManagerDashboardPage() {
  const navigate = useNavigate();
  const user = useAuthStore((s) => s.user);

  return (
    <div className="space-y-6">
      <div className="bg-gradient-to-r from-[#1A365D] to-[#2A4D7E] text-white p-6 rounded-2xl relative overflow-hidden">
        <div className="absolute -right-10 -top-10 w-48 h-48 rounded-full bg-white/5" />
        <div className="relative flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div>
            <div className="text-xs text-orange-300 font-semibold">Trưởng Ban Quản lý KTX • FPT University Tân Uyên</div>
            <h1 className="text-2xl font-bold mt-1">Chào buổi sáng, {user?.name}</h1>
            <p className="text-sm text-slate-200 mt-1">Bạn có <strong className="text-white">4 hạng mục</strong> chờ phê duyệt và <strong className="text-white">2 cảnh báo vận hành</strong> hôm nay.</p>
          </div>
          <div className="flex gap-2">
            <AppButton size="sm" variant="outline" className="bg-white/10 text-white border-white/20 hover:bg-white/20" leftIcon={<Download className="w-4 h-4" />} onClick={() => navigate(APP_ROUTES.MANAGER.REPORTS)}>
              Báo cáo tuần
            </AppButton>
            <AppButton size="sm" onClick={() => navigate(APP_ROUTES.MANAGER.APPROVALS)} rightIcon={<ArrowRight className="w-4 h-4" />}>
              Xử lý phê duyệt
            </AppButton>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        <StatCard label="Tỷ lệ lấp đầy" value="91.3%" icon={Building2} tone="navy" trend={{ value: '+2.1%', up: true }} hint="1.075 / 1.200 giường" />
        <StatCard label="Doanh thu tháng 10" value="1,79 tỷ ₫" icon={Wallet} tone="emerald" trend={{ value: '73% đã thu', up: true }} />
        <StatCard label="Ticket tồn đọng" value="23" icon={Wrench} tone="amber" hint="2 vượt SLA" trend={{ value: '+4', up: false }} />
        <StatCard label="Chờ phê duyệt" value="8" icon={ShieldAlert} tone="orange" hint="1 đề xuất xếp phòng · 7 yêu cầu" />
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        <div className="xl:col-span-2 space-y-6">
          <SectionCard title="Doanh thu & thực thu (tỷ ₫)" subtitle="6 tháng gần nhất — tháng 8 gồm phí lưu trú học kỳ Fall">
            <BarChart data={REVENUE} height={200} primaryLabel="Phải thu" secondaryLabel="Đã thu" formatValue={(v) => `${v.toFixed(2)} tỷ`} />
          </SectionCard>

          <SectionCard title="Hạng mục chờ phê duyệt" noPadding>
            <ul className="divide-y divide-slate-100">
              {PENDING.map((p) => (
                <li key={p.title} className="px-5 py-3.5 flex items-center gap-3">
                  <div className={clsx('w-9 h-9 rounded-lg flex items-center justify-center', p.type === 'Xếp phòng' ? 'bg-blue-50 text-blue-600' : 'bg-purple-50 text-purple-600')}>
                    {p.type === 'Xếp phòng' ? <CheckSquare className="w-4 h-4" /> : <ShieldAlert className="w-4 h-4" />}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-xs font-semibold text-slate-800">{p.title}</div>
                    <div className="text-[11px] text-slate-500">{p.type} • {p.when}</div>
                  </div>
                  <StatusBadge status={p.priority} />
                  <AppButton size="sm" variant="outline" onClick={() => navigate(p.route)}>Xem</AppButton>
                </li>
              ))}
            </ul>
          </SectionCard>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <SectionCard title="Cơ cấu sinh viên lưu trú">
              <DonutChart
                size={120}
                centerValue="1.075"
                centerLabel="sinh viên"
                segments={[
                  { label: 'K19 (năm 1)', value: 462, color: '#F26F21' },
                  { label: 'K18 (năm 2)', value: 298, color: '#1A365D' },
                  { label: 'K17 (năm 3)', value: 201, color: '#3B82F6' },
                  { label: 'K16 trở về trước', value: 114, color: '#10B981' },
                ]}
              />
            </SectionCard>
            <SectionCard title="Tỷ lệ lấp đầy theo tháng (%)">
              <BarChart data={OCCUPANCY_TREND} height={140} formatValue={(v) => `${v}%`} />
            </SectionCard>
          </div>
        </div>

        <div className="space-y-6">
          <SectionCard title="Cảnh báo vận hành">
            <ul className="space-y-3">
              {[
                { t: 'Tòa B lấp đầy 95.5% — sắp hết chỗ cho nam', tone: 'rose' },
                { t: 'Công nợ quá hạn 37 SV, tổng 18,4 triệu ₫', tone: 'amber' },
                { t: 'Điện năng Tòa D tăng 22% so với tháng trước', tone: 'amber' },
              ].map((a) => (
                <li key={a.t} className={clsx('p-3 rounded-lg text-xs flex gap-2', a.tone === 'rose' ? 'bg-rose-50 text-rose-800' : 'bg-amber-50 text-amber-900')}>
                  <AlertTriangle className="w-4 h-4 shrink-0" /> {a.t}
                </li>
              ))}
            </ul>
          </SectionCard>

          <SectionCard title="Lấp đầy theo tòa">
            <ul className="space-y-3 text-xs">
              {[
                ['Tòa A (Nữ)', 94.1],
                ['Tòa B (Nam)', 95.5],
                ['Tòa C (Nữ)', 86.3],
                ['Tòa D (Nam)', 82.1],
              ].map(([b, v]) => (
                <li key={String(b)}>
                  <div className="flex justify-between mb-1"><span className="text-slate-600">{b}</span><span className="font-bold">{v}%</span></div>
                  <ProgressBar value={Number(v)} tone={Number(v) > 95 ? 'rose' : Number(v) > 90 ? 'amber' : 'emerald'} />
                </li>
              ))}
            </ul>
          </SectionCard>

          <SectionCard title="Tiến độ check-in Spring 2027">
            <div className="text-2xl font-bold text-slate-800">984 / 1.072</div>
            <div className="text-[11px] text-slate-500 mb-2">Sinh viên đã nhận phòng · 94% qua QR tự phục vụ</div>
            <ProgressBar value={984} max={1072} tone="emerald" size="md" />
            <p className="text-[11px] text-rose-600 mt-2">4 sinh viên có nguy cơ no-show — hết hạn lúc 20:00 hôm nay.</p>
          </SectionCard>

          <SectionCard title="Chỉ số nhanh">
            <div className="space-y-4">
              {[
                { l: 'Đơn đăng ký mới / ngày', v: '48', p: [22, 31, 28, 40, 36, 52, 48], icon: Users },
                { l: 'Ticket mới / ngày', v: '9', p: [12, 9, 14, 7, 10, 11, 9], icon: Wrench },
                { l: 'Thu VietQR / ngày (triệu)', v: '62', p: [40, 55, 48, 70, 66, 58, 62], icon: TrendingUp },
              ].map((k) => (
                <div key={k.l} className="flex items-center gap-3">
                  <k.icon className="w-4 h-4 text-[#1A365D]" />
                  <div className="flex-1">
                    <div className="text-[11px] text-slate-500">{k.l}</div>
                    <div className="text-sm font-bold text-slate-800">{k.v}</div>
                  </div>
                  <div className="w-24"><Sparkline points={k.p} /></div>
                </div>
              ))}
            </div>
            <div className="grid grid-cols-2 gap-2 mt-4">
              <AppButton size="sm" variant="outline" leftIcon={<BarChart3 className="w-3.5 h-3.5" />} onClick={() => navigate(APP_ROUTES.MANAGER.REPORTS)}>Báo cáo</AppButton>
              <AppButton size="sm" variant="outline" leftIcon={<ShieldAlert className="w-3.5 h-3.5" />} onClick={() => navigate(APP_ROUTES.MANAGER.APPROVALS)}>Phê duyệt</AppButton>
            </div>
          </SectionCard>
        </div>
      </div>
    </div>
  );
}
