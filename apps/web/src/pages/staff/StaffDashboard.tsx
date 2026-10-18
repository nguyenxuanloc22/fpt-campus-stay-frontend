// ──────────────────────────────────────────────────────────────
//  StaffDashboard.tsx — Tổng quan Cán bộ KTX (bố cục tham khảo FAP,
//  cùng khung với Tổng quan sinh viên). Nút “Bàn làm việc” mở
//  StaffPortal để xử lý 5 nghiệp vụ vận hành ngay trên trang.
// ──────────────────────────────────────────────────────────────

import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  ArrowLeft,
  ArrowLeftRight,
  BedDouble,
  Boxes,
  CalendarCheck,
  Clock,
  FileText,
  Layers,
  LogIn,
  LogOut,
  Mail,
  Megaphone,
  Bell,
  UserCheck,
  Wrench,
  ListChecks,
} from 'lucide-react';
import clsx from 'clsx';
import { APP_ROUTES } from '@campusstay/constants';
import { useAuthStore } from '@features/auth';
import { SectionCard } from '@shared-ui';
import { LatestNewsCard, QuickMenuCard, TaskListCard, WelcomeSection, type InfoTile, type QuickItem, type TaskItem } from '@features/dashboard';
import { StaffPortal } from './StaffPortal';
import { STAFF_APPLICATIONS, STAFF_ROOMS, STAFF_MAINTENANCE_TASKS, STAFF_MANUAL_CHECKINS } from './staffMockData';
import { ACTION_ITEMS, RECENT_CHECKINS, STAFF_PROFILE, type TaskPriority } from './dashboardMockData';

const R = APP_ROUTES.STAFF;

const QUICK: QuickItem[] = [
  { label: 'Thẩm định đơn', to: R.APPLICATIONS, icon: FileText, tone: 'bg-orange-100 text-orange-600' },
  { label: 'Xếp phòng', to: R.ASSIGNMENT, icon: Layers, tone: 'bg-violet-100 text-violet-600' },
  { label: 'Đổi phòng', to: R.ROOM_CHANGES, icon: ArrowLeftRight, tone: 'bg-sky-100 text-sky-600' },
  { label: 'Bảo trì', to: R.MAINTENANCE, icon: Wrench, tone: 'bg-rose-100 text-rose-600' },
  { label: 'Check-in/out', to: R.CHECKIN_OUT, icon: CalendarCheck, tone: 'bg-emerald-100 text-emerald-600' },
  { label: 'Phòng & giường', to: R.INVENTORY, icon: Boxes, tone: 'bg-sky-100 text-sky-600' },
  { label: 'Gửi thông báo', to: R.BROADCAST, icon: Megaphone, tone: 'bg-orange-100 text-orange-600' },
  { label: 'Thông báo chung', to: APP_ROUTES.COMMON.NOTIFICATIONS, icon: Bell, tone: 'bg-violet-100 text-violet-600' },
];

const PRIORITY: Record<TaskPriority, { label: string; tone: string; dot: string }> = {
  URGENT: { label: 'Khẩn cấp', tone: 'bg-rose-100 text-rose-700', dot: 'bg-rose-500' },
  HIGH: { label: 'Cao', tone: 'bg-orange-100 text-orange-700', dot: 'bg-[#F26F21]' },
  MEDIUM: { label: 'Trung bình', tone: 'bg-sky-100 text-sky-700', dot: 'bg-sky-500' },
};

const TODO: TaskItem[] = ACTION_ITEMS.map((a) => ({
  id: a.id,
  title: a.title,
  desc: a.subtitle,
  to: a.route,
  cta: a.ctaLabel,
  dot: PRIORITY[a.priority].dot,
  badge: { label: PRIORITY[a.priority].label, tone: PRIORITY[a.priority].tone },
}));

export function StaffDashboard() {
  const navigate = useNavigate();
  const user = useAuthStore((state) => state.user);
  const [viewMode, setViewMode] = useState<'overview' | 'portal'>('overview');

  const totalBeds = STAFF_ROOMS.reduce((acc, r) => acc + r.beds.length, 0);
  const availableBeds = STAFF_ROOMS.reduce((acc, r) => acc + r.beds.filter((b) => b.status === 'AVAILABLE').length, 0);
  const pendingApps = STAFF_APPLICATIONS.filter((a) => a.status === 'PENDING_REVIEW').length;
  const activeTickets = STAFF_MAINTENANCE_TASKS.filter((t) => t.status !== 'VERIFIED_DONE').length;
  const pendingCheckins = STAFF_MANUAL_CHECKINS.filter((c) => c.status !== 'COMPLETED').length;

  if (viewMode === 'portal') {
    return (
      <div className="space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-3 bg-white px-5 py-3 rounded-2xl border border-slate-200/80 shadow-sm">
          <h1 className="flex items-center gap-2 text-sm font-extrabold text-slate-900">
            <span className="w-1 h-4 rounded-full bg-gradient-to-b from-[#F26F21] to-amber-400" />
            Bàn làm việc vận hành
          </h1>
          <button type="button" onClick={() => setViewMode('overview')} className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-200 text-xs font-bold text-slate-600 hover:border-orange-300 hover:text-[#F26F21]">
            <ArrowLeft className="w-3.5 h-3.5" /> Về tổng quan
          </button>
        </div>
        <StaffPortal />
      </div>
    );
  }

  const tiles: InfoTile[] = [
    { label: 'Đơn chờ thẩm định', value: `${pendingApps} đơn`, icon: FileText, tone: 'bg-orange-50 text-orange-600' },
    { label: 'Ticket bảo trì mở', value: `${activeTickets} ticket`, icon: Wrench, tone: 'bg-rose-50 text-rose-600' },
    { label: 'Check-in tại quầy', value: `${pendingCheckins} sinh viên chờ`, icon: UserCheck, tone: 'bg-violet-50 text-violet-600' },
    { label: 'Giường trống sẵn sàng', value: `${availableBeds} / ${totalBeds} giường`, icon: BedDouble, tone: 'bg-emerald-50 text-emerald-600' },
    { label: 'Email', value: user?.email ?? '—', icon: Mail, tone: 'bg-sky-50 text-sky-600' },
    { label: 'Ca làm việc', value: STAFF_PROFILE.shift, icon: Clock, tone: 'bg-slate-100 text-slate-600' },
  ];

  return (
    <div className="space-y-6">
      <WelcomeSection
        name={user?.name}
        subtitle="Cán bộ KTX · Học kỳ Fall 2026 · KTX FPT Tân Uyên"
        actions={[
          { label: 'Bàn làm việc', onClick: () => setViewMode('portal') },
          { label: 'Gửi thông báo', onClick: () => navigate(R.BROADCAST) },
        ]}
        tiles={tiles}
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
        <div className="lg:col-span-2 space-y-6">
          <LatestNewsCard />
          <TaskListCard title="Việc cần xử lý" items={TODO} footer={{ label: 'Mở bàn làm việc vận hành', icon: ListChecks, onClick: () => setViewMode('portal') }} />
        </div>

        <div className="space-y-6">
          <QuickMenuCard items={QUICK} />

          <SectionCard
            title="Check-in/out hôm nay"
            actions={
              <button type="button" onClick={() => navigate(R.CHECKIN_OUT)} className="text-xs font-bold text-[#F26F21] hover:underline">
                Xem tất cả
              </button>
            }
            noPadding
          >
            <ul className="divide-y divide-slate-100">
              {RECENT_CHECKINS.map((c) => (
                <li key={`${c.studentId}-${c.time}`} className="px-5 py-3 flex items-center gap-3">
                  <span className={clsx('w-9 h-9 rounded-xl flex items-center justify-center shrink-0', c.type === 'IN' ? 'bg-emerald-50 text-emerald-600' : 'bg-sky-50 text-sky-600')}>
                    {c.type === 'IN' ? <LogIn className="w-4 h-4" /> : <LogOut className="w-4 h-4" />}
                  </span>
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-semibold text-slate-800 truncate">{c.name}</div>
                    <div className="text-xs text-slate-500">{c.studentId} · {c.room}</div>
                  </div>
                  <div className="text-right shrink-0">
                    <div className="text-xs font-bold text-slate-700">{c.time}</div>
                    <div className={clsx('text-[10px] font-bold', c.type === 'IN' ? 'text-emerald-600' : 'text-sky-600')}>{c.type === 'IN' ? 'Nhận phòng' : 'Trả phòng'}</div>
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
