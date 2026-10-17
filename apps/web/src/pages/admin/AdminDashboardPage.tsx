import { useNavigate } from 'react-router-dom';
import {
  Server,
  Users,
  Database,
  Activity,
  Cpu,
  Link,
  ShieldCheck,
  AlertTriangle,
  CheckCircle2,
  Clock,
  Calendar,
  HardDrive,
  ArrowRight,
  XCircle,
} from 'lucide-react';
import clsx from 'clsx';
import { APP_ROUTES } from '@campusstay/constants';
import { StatCard, SectionCard, StatusBadge, ProgressBar, BarChart, Sparkline, AppButton, Avatar } from '@shared-ui';

const SERVICES = [
  { name: 'API Gateway', status: 'ok', latency: '42ms', uptime: '99.99%' },
  { name: 'Google OAuth (đăng nhập)', status: 'ok', latency: '118ms', uptime: '99.97%' },
  { name: 'Allocation Engine', status: 'ok', latency: '—', uptime: '100%' },
  { name: 'Payment Webhook (VietQR)', status: 'warn', latency: '860ms', uptime: '99.62%' },
  { name: 'SIS Sync Worker', status: 'ok', latency: '—', uptime: '99.91%' },
  { name: 'Notification Service', status: 'ok', latency: '75ms', uptime: '99.95%' },
  { name: 'PostgreSQL Primary', status: 'ok', latency: '4ms', uptime: '100%' },
  { name: 'Gmail API (email)', status: 'ok', latency: '210ms', uptime: '99.90%' },
];

const JOBS = [
  { name: 'SIS sync — danh sách sinh viên', time: '17/10 07:00', status: 'SUCCESS', dur: '3m 12s' },
  { name: 'Đối soát VietQR', time: '17/10 06:00', status: 'SUCCESS', dur: '48s' },
  { name: 'Allocation engine BR-SP27-02', time: '17/10 03:00', status: 'SUCCESS', dur: '2m 14s' },
  { name: 'Nhả giữ chỗ hết hạn & hủy đơn chưa cọc', time: '17/10 02:00', status: 'SUCCESS', dur: '6s' },
  { name: 'Đánh dấu hóa đơn quá hạn & gửi nhắc nhở', time: '17/10 01:00', status: 'SUCCESS', dur: '14s' },
];

const AUDIT = [
  { who: 'ThS. Hoàng Nam', action: 'Phê duyệt batch BR-FA26-04', when: '08:12' },
  { who: 'Quản trị viên', action: 'Cập nhật đơn giá điện 3.000 ₫/kWh', when: 'Hôm qua' },
  { who: 'Trần Văn Cường', action: 'Khóa phòng B105 (bảo trì)', when: 'Hôm qua' },
  { who: 'Quản trị viên', action: 'Thêm tài khoản staff lmkhoa@fpt.edu.vn', when: '15/10' },
];

export function AdminDashboardPage() {
  const navigate = useNavigate();

  return (
    <div className="space-y-6">
      <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-[#1A365D]">Trung Tâm Quản Trị Hệ Thống</h1>
          <p className="text-xs text-slate-500 mt-1">CampusStay v2.3.1 • Môi trường Production • Máy chủ FPT Cloud HCM</p>
        </div>
        <div className="flex items-center gap-2 text-xs">
          <span className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-amber-50 text-amber-700 font-semibold border border-amber-200">
            <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse" /> 1 dịch vụ phản hồi chậm
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        <StatCard label="Người dùng hoạt động" value="1.142" icon={Users} tone="navy" hint="1.075 SV • 52 staff • 15 quản lý" />
        <StatCard label="Request / phút" value="386" icon={Activity} tone="orange" trend={{ value: '+18%', up: true }} hint="đỉnh lúc 21:00" />
        <StatCard label="Uptime 30 ngày" value="99.94%" icon={Server} tone="emerald" hint="SLA cam kết 99.9%" />
        <StatCard label="Dung lượng lưu trữ" value="412 / 1.000 GB" icon={HardDrive} tone="blue" hint="Hợp đồng PDF, ảnh minh chứng" />
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        <div className="xl:col-span-2 space-y-6">
          <SectionCard title="Tình trạng dịch vụ" subtitle="Health-check mỗi 30 giây" noPadding>
            <div className="grid grid-cols-1 md:grid-cols-2">
              {SERVICES.map((s, i) => (
                <div key={s.name} className={clsx('px-5 py-3 flex items-center gap-3 border-slate-100', i % 2 === 0 && 'md:border-r', 'border-b')}>
                  {s.status === 'ok' ? <CheckCircle2 className="w-4 h-4 text-emerald-500" /> : s.status === 'warn' ? <AlertTriangle className="w-4 h-4 text-amber-500" /> : <XCircle className="w-4 h-4 text-rose-500" />}
                  <div className="flex-1 min-w-0">
                    <div className="text-xs font-semibold text-slate-800 truncate">{s.name}</div>
                    <div className="text-[11px] text-slate-500">Uptime {s.uptime} • {s.latency}</div>
                  </div>
                  <span className={clsx('text-[10px] font-bold px-2 py-0.5 rounded-full', s.status === 'ok' ? 'bg-emerald-50 text-emerald-700' : s.status === 'warn' ? 'bg-amber-50 text-amber-700' : 'bg-rose-50 text-rose-700')}>
                    {s.status === 'ok' ? 'Hoạt động' : s.status === 'warn' ? 'Chậm' : 'Mất kết nối'}
                  </span>
                </div>
              ))}
            </div>
          </SectionCard>

          <SectionCard title="Lưu lượng truy cập 24 giờ" subtitle="Số request (nghìn) theo khung giờ">
            <BarChart
              height={180}
              data={[
                { label: '0h', value: 4 }, { label: '3h', value: 1 }, { label: '6h', value: 6 }, { label: '9h', value: 18 },
                { label: '12h', value: 22 }, { label: '15h', value: 17 }, { label: '18h', value: 24 }, { label: '21h', value: 31 },
              ]}
              formatValue={(v) => `${v}k req`}
            />
          </SectionCard>

          <SectionCard
            title="Tác vụ tự động gần đây (actor System)"
            actions={<button type="button" onClick={() => navigate(APP_ROUTES.ADMIN.ALLOCATION_ENGINE)} className="text-[11px] font-semibold text-[#F26F21] hover:underline">Xem tất cả</button>}
            noPadding
          >
            <table className="w-full text-xs">
              <tbody className="divide-y divide-slate-100">
                {JOBS.map((j) => (
                  <tr key={j.name}>
                    <td className="px-5 py-3 font-semibold text-slate-800">{j.name}</td>
                    <td className="px-5 py-3 text-slate-500">{j.time}</td>
                    <td className="px-5 py-3 text-slate-500">{j.dur}</td>
                    <td className="px-5 py-3 text-right"><StatusBadge status={j.status} /></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </SectionCard>
        </div>

        <div className="space-y-6">
          <SectionCard title="Tài nguyên máy chủ">
            <div className="space-y-4 text-xs">
              {[
                { l: 'CPU (8 vCPU)', v: 34, icon: Cpu, p: [22, 28, 31, 40, 36, 34] },
                { l: 'RAM (32 GB)', v: 61, icon: Server, p: [55, 58, 60, 62, 61, 61] },
                { l: 'Database connections', v: 42, icon: Database, p: [30, 35, 44, 50, 46, 42] },
              ].map((r) => (
                <div key={r.l}>
                  <div className="flex items-center justify-between mb-1">
                    <span className="flex items-center gap-1.5 text-slate-600"><r.icon className="w-3.5 h-3.5" /> {r.l}</span>
                    <span className="font-bold">{r.v}%</span>
                  </div>
                  <ProgressBar value={r.v} tone={r.v > 80 ? 'rose' : r.v > 60 ? 'amber' : 'emerald'} />
                  <Sparkline points={r.p} className="h-6 mt-1" color="#94a3b8" />
                </div>
              ))}
            </div>
          </SectionCard>

          <SectionCard title="Học kỳ đang vận hành">
            <div className="flex items-center gap-3 p-3 rounded-xl bg-[#EBF2FB]">
              <Calendar className="w-8 h-8 text-[#1A365D]" />
              <div className="text-xs">
                <div className="font-bold text-[#1A365D]">Fall 2026</div>
                <div className="text-slate-600">01/09 – 31/12/2026 • Tuần 7/16</div>
              </div>
            </div>
            <div className="flex items-center gap-3 p-3 rounded-xl bg-orange-50 mt-2">
              <Clock className="w-8 h-8 text-[#F26F21]" />
              <div className="text-xs">
                <div className="font-bold text-[#F26F21]">Spring 2027 — đang mở đăng ký</div>
                <div className="text-slate-600">14/10 – 15/11/2026 • 1.284 đơn</div>
              </div>
            </div>
            <AppButton size="sm" variant="outline" className="w-full mt-3" rightIcon={<ArrowRight className="w-3.5 h-3.5" />} onClick={() => navigate(APP_ROUTES.ADMIN.SEMESTERS)}>Cấu hình kỳ học</AppButton>
          </SectionCard>

          <SectionCard title="Hoạt động quản trị" noPadding>
            <ul className="divide-y divide-slate-100">
              {AUDIT.map((a) => (
                <li key={a.action} className="px-5 py-3 flex items-start gap-2.5">
                  <Avatar name={a.who} size="xs" className="mt-0.5" />
                  <div className="text-xs">
                    <div className="text-slate-800"><span className="font-semibold">{a.who}</span> — {a.action}</div>
                    <div className="text-[11px] text-slate-400">{a.when}</div>
                  </div>
                </li>
              ))}
            </ul>
          </SectionCard>

          <div className="grid grid-cols-2 gap-2">
            {[
              { l: 'Engine', icon: Cpu, to: APP_ROUTES.ADMIN.ALLOCATION_ENGINE },
              { l: 'Tích hợp', icon: Link, to: APP_ROUTES.ADMIN.INTEGRATIONS },
              { l: 'Người dùng', icon: Users, to: APP_ROUTES.ADMIN.USERS },
              { l: 'Audit logs', icon: ShieldCheck, to: APP_ROUTES.ADMIN.AUDIT_LOGS },
            ].map((q) => (
              <button key={q.l} type="button" onClick={() => navigate(q.to)} className="p-3 rounded-xl bg-white border border-slate-200 hover:border-[#F26F21] text-xs font-semibold text-slate-700 flex items-center gap-2">
                <q.icon className="w-4 h-4 text-[#1A365D]" /> {q.l}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
