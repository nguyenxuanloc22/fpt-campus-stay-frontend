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
  CalendarRange,
  HardDrive,
  ArrowRight,
  XCircle,
  Scale,
  Tags,
  BarChart3,
} from 'lucide-react';
import clsx from 'clsx';
import { APP_ROUTES } from '@campusstay/constants';
import { useAuthStore } from '@features/auth';
import { SectionCard, StatusBadge, ProgressBar, Sparkline, AppButton, Avatar } from '@shared-ui';
import { LatestNewsCard, QuickMenuCard, WelcomeSection, type InfoTile, type QuickItem } from '@features/dashboard';

/** Tổng quan Quản trị viên — cùng khung với Tổng quan sinh viên: thẻ chào, tin mới nhất, menu nhanh, giám sát hệ thống. */

const R = APP_ROUTES.ADMIN;

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

const RESOURCES = [
  { l: 'CPU (8 vCPU)', v: 34, icon: Cpu, p: [22, 28, 31, 40, 36, 34] },
  { l: 'RAM (32 GB)', v: 61, icon: Server, p: [55, 58, 60, 62, 61, 61] },
  { l: 'Database connections', v: 42, icon: Database, p: [30, 35, 44, 50, 46, 42] },
];

const QUICK: QuickItem[] = [
  { label: 'Học kỳ', to: R.SEMESTERS, icon: CalendarRange, tone: 'bg-orange-100 text-orange-600' },
  { label: 'Quy tắc', to: R.RULES, icon: Scale, tone: 'bg-violet-100 text-violet-600' },
  { label: 'Bảng giá', to: R.PRICING, icon: Tags, tone: 'bg-emerald-100 text-emerald-600' },
  { label: 'Engine xếp phòng', to: R.ALLOCATION_ENGINE, icon: Cpu, tone: 'bg-sky-100 text-sky-600' },
  { label: 'Tích hợp', to: R.INTEGRATIONS, icon: Link, tone: 'bg-sky-100 text-sky-600' },
  { label: 'Người dùng', to: R.USERS, icon: Users, tone: 'bg-orange-100 text-orange-600' },
  { label: 'Báo cáo', to: R.REPORTS, icon: BarChart3, tone: 'bg-emerald-100 text-emerald-600' },
  { label: 'Audit logs', to: R.AUDIT_LOGS, icon: ShieldCheck, tone: 'bg-violet-100 text-violet-600' },
];

const SERVICE_STATE = {
  ok: { label: 'Hoạt động', icon: CheckCircle2, iconTone: 'text-emerald-500', badge: 'bg-emerald-50 text-emerald-700' },
  warn: { label: 'Chậm', icon: AlertTriangle, iconTone: 'text-amber-500', badge: 'bg-amber-50 text-amber-700' },
  down: { label: 'Mất kết nối', icon: XCircle, iconTone: 'text-rose-500', badge: 'bg-rose-50 text-rose-700' },
} as const;

export function AdminDashboardPage() {
  const navigate = useNavigate();
  const user = useAuthStore((state) => state.user);
  const slowServices = SERVICES.filter((s) => s.status !== 'ok').length;

  const tiles: InfoTile[] = [
    { label: 'Người dùng hoạt động', value: '1.142 · 1.075 SV, 52 staff', icon: Users, tone: 'bg-orange-50 text-orange-600' },
    { label: 'Request / phút', value: '386 · đỉnh lúc 21:00', icon: Activity, tone: 'bg-sky-50 text-sky-600' },
    { label: 'Uptime 30 ngày', value: '99.94% · SLA 99.9%', icon: Server, tone: 'bg-emerald-50 text-emerald-600' },
    { label: 'Dung lượng lưu trữ', value: '412 / 1.000 GB', icon: HardDrive, tone: 'bg-violet-50 text-violet-600' },
    { label: 'Cảnh báo dịch vụ', value: slowServices ? `${slowServices} dịch vụ phản hồi chậm` : 'Tất cả ổn định', icon: AlertTriangle, tone: 'bg-rose-50 text-rose-600' },
    { label: 'Phiên bản', value: 'CampusStay v2.3.1 · Production', icon: Database, tone: 'bg-slate-100 text-slate-600' },
  ];

  return (
    <div className="space-y-6">
      <WelcomeSection
        name={user?.name}
        subtitle="Quản trị hệ thống · Máy chủ FPT Cloud HCM"
        actions={[
          { label: 'Người dùng', onClick: () => navigate(R.USERS) },
          { label: 'Audit logs', onClick: () => navigate(R.AUDIT_LOGS) },
        ]}
        tiles={tiles}
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
        <div className="lg:col-span-2 space-y-6">
          <LatestNewsCard />

          <SectionCard title="Tình trạng dịch vụ" subtitle="Health-check mỗi 30 giây" noPadding>
            <div className="grid grid-cols-1 md:grid-cols-2">
              {SERVICES.map((s, i) => {
                const st = SERVICE_STATE[s.status as keyof typeof SERVICE_STATE];
                return (
                  <div key={s.name} className={clsx('px-5 py-3 flex items-center gap-3 border-b border-slate-100', i % 2 === 0 && 'md:border-r')}>
                    <st.icon className={clsx('w-4 h-4 shrink-0', st.iconTone)} />
                    <div className="flex-1 min-w-0">
                      <div className="text-xs font-semibold text-slate-800 truncate">{s.name}</div>
                      <div className="text-[11px] text-slate-500">Uptime {s.uptime} · {s.latency}</div>
                    </div>
                    <span className={clsx('text-[10px] font-bold px-2 py-0.5 rounded-full', st.badge)}>{st.label}</span>
                  </div>
                );
              })}
            </div>
          </SectionCard>

          <SectionCard
            title="Tác vụ tự động gần đây"
            subtitle="Actor System"
            actions={
              <button type="button" onClick={() => navigate(R.ALLOCATION_ENGINE)} className="text-xs font-bold text-[#F26F21] hover:underline">
                Xem tất cả
              </button>
            }
            noPadding
          >
            <div className="overflow-x-auto">
              <table className="w-full text-xs">
                <tbody className="divide-y divide-slate-100">
                  {JOBS.map((j) => (
                    <tr key={j.name} className="hover:bg-slate-50">
                      <td className="px-5 py-3 font-semibold text-slate-800">{j.name}</td>
                      <td className="px-5 py-3 text-slate-500 whitespace-nowrap">{j.time}</td>
                      <td className="px-5 py-3 text-slate-500 whitespace-nowrap">{j.dur}</td>
                      <td className="px-5 py-3 text-right"><StatusBadge status={j.status} /></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </SectionCard>
        </div>

        <div className="space-y-6">
          <QuickMenuCard items={QUICK} />

          <SectionCard title="Học kỳ đang vận hành">
            <div className="space-y-2">
              <div className="flex items-center gap-3 p-3 rounded-xl bg-sky-50">
                <span className="w-9 h-9 rounded-xl bg-white text-sky-600 flex items-center justify-center shrink-0"><Calendar className="w-4 h-4" /></span>
                <div className="text-xs">
                  <div className="font-bold text-slate-800">Fall 2026</div>
                  <div className="text-slate-500">01/09 – 31/12/2026 · Tuần 7/16</div>
                </div>
              </div>
              <div className="flex items-center gap-3 p-3 rounded-xl bg-orange-50">
                <span className="w-9 h-9 rounded-xl bg-white text-[#F26F21] flex items-center justify-center shrink-0"><Clock className="w-4 h-4" /></span>
                <div className="text-xs">
                  <div className="font-bold text-[#C2410C]">Spring 2027 — đang mở đăng ký</div>
                  <div className="text-slate-500">14/10 – 15/11/2026 · 1.284 đơn</div>
                </div>
              </div>
            </div>
            <AppButton size="sm" variant="outline" className="w-full mt-3" rightIcon={<ArrowRight className="w-3.5 h-3.5" />} onClick={() => navigate(R.SEMESTERS)}>
              Cấu hình kỳ học
            </AppButton>
          </SectionCard>

          <SectionCard title="Tài nguyên máy chủ">
            <div className="space-y-4 text-xs">
              {RESOURCES.map((r) => (
                <div key={r.l}>
                  <div className="flex items-center justify-between mb-1">
                    <span className="flex items-center gap-1.5 text-slate-600"><r.icon className="w-3.5 h-3.5" /> {r.l}</span>
                    <span className="font-bold text-slate-800">{r.v}%</span>
                  </div>
                  <ProgressBar value={r.v} tone={r.v > 80 ? 'rose' : r.v > 60 ? 'amber' : 'emerald'} />
                  <Sparkline points={r.p} className="h-6 mt-1" color="#94a3b8" />
                </div>
              ))}
            </div>
          </SectionCard>

          <SectionCard
            title="Hoạt động quản trị"
            actions={
              <button type="button" onClick={() => navigate(R.AUDIT_LOGS)} className="text-xs font-bold text-[#F26F21] hover:underline">
                Xem tất cả
              </button>
            }
            noPadding
          >
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
        </div>
      </div>
    </div>
  );
}
