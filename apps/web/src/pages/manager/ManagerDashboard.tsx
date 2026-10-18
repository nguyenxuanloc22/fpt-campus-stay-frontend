// ──────────────────────────────────────────────────────────────
//  ManagerDashboard.tsx — Tổng quan Trưởng ban KTX (bố cục tham khảo FAP,
//  cùng khung với Tổng quan sinh viên). Nút “Trung tâm phê duyệt” mở
//  ManagerPortal để ra quyết định ngay trên trang.
// ──────────────────────────────────────────────────────────────

import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  ArrowLeft,
  ArrowLeftRight,
  BarChart3,
  Bell,
  Building2,
  CheckSquare,
  Layers,
  Mail,
  ReceiptText,
  ShieldCheck,
  UserCircle,
  Wallet,
  Wrench,
  ListChecks,
} from 'lucide-react';
import { APP_ROUTES } from '@campusstay/constants';
import { useAuthStore } from '@features/auth';
import { SectionCard, ProgressBar } from '@shared-ui';
import { LatestNewsCard, QuickMenuCard, TaskListCard, WelcomeSection, type InfoTile, type QuickItem, type TaskItem } from '@features/dashboard';
import { ManagerPortal } from './ManagerPortal';
import {
  MANAGER_APPLICATIONS,
  MANAGER_ASSIGNMENT_PROPOSALS,
  MANAGER_ROOM_CHANGES,
  MANAGER_MAINTENANCE_SCHEDULES,
  MANAGER_GOVERNANCE_DATA,
} from './managerMockData';

const R = APP_ROUTES.MANAGER;
const OVERVIEW = MANAGER_GOVERNANCE_DATA.overview;

const QUICK: QuickItem[] = [
  { label: 'Phê duyệt đơn', to: R.APPROVALS, icon: CheckSquare, tone: 'bg-orange-100 text-orange-600' },
  { label: 'Duyệt xếp phòng', to: R.ASSIGNMENT_APPROVAL, icon: Layers, tone: 'bg-violet-100 text-violet-600' },
  { label: 'Báo cáo', to: R.REPORTS, icon: BarChart3, tone: 'bg-emerald-100 text-emerald-600' },
  { label: 'Thông báo chung', to: APP_ROUTES.COMMON.NOTIFICATIONS, icon: Bell, tone: 'bg-sky-100 text-sky-600' },
  { label: 'Hồ sơ', to: APP_ROUTES.COMMON.PROFILE, icon: UserCircle, tone: 'bg-slate-100 text-slate-600' },
];

/** Màu theo loại hạng mục chờ duyệt (CONVENTIONS §8.3: đổi phòng xanh trời, báo hỏng/bảo trì cam…). */
const KIND = {
  app: { label: 'Đơn đăng ký', tone: 'bg-orange-100 text-orange-700', dot: 'bg-[#F26F21]' },
  batch: { label: 'Xếp phòng', tone: 'bg-violet-100 text-violet-700', dot: 'bg-violet-500' },
  change: { label: 'Đổi phòng', tone: 'bg-sky-100 text-sky-700', dot: 'bg-sky-500' },
  schedule: { label: 'Lịch bảo trì', tone: 'bg-emerald-100 text-emerald-700', dot: 'bg-emerald-500' },
};

const QUEUE: TaskItem[] = [
  ...MANAGER_ASSIGNMENT_PROPOSALS.filter((b) => b.decision === 'PENDING').map((b) => ({
    id: b.batchCode,
    title: `${b.batchCode} — ${b.title}`,
    desc: `${b.totalAllocations} sinh viên · ${b.matchRate}% đúng nguyện vọng · ${b.resolvedConflicts} xung đột đã xử lý`,
    to: R.ASSIGNMENT_APPROVAL,
    cta: 'Ký duyệt',
    dot: KIND.batch.dot,
    badge: { label: KIND.batch.label, tone: KIND.batch.tone },
  })),
  ...MANAGER_APPLICATIONS.filter((a) => a.decision === 'PENDING').map((a) => ({
    id: a.code,
    title: `${a.studentName} (${a.studentId})`,
    desc: `${a.code} · ${a.flagDescription}`,
    to: R.APPROVALS,
    cta: 'Xem xét',
    dot: KIND.app.dot,
    badge: { label: KIND.app.label, tone: KIND.app.tone },
  })),
  ...MANAGER_ROOM_CHANGES.filter((c) => c.decision === 'PENDING').map((c) => ({
    id: c.id,
    title: `${c.studentA.room} ⇄ ${c.studentB?.room ?? '—'}`,
    desc: `${c.id} · ${c.studentA.name} và ${c.studentB?.name ?? '—'}`,
    to: R.APPROVALS,
    cta: 'Xem xét',
    dot: KIND.change.dot,
    badge: { label: KIND.change.label, tone: KIND.change.tone },
  })),
  ...MANAGER_MAINTENANCE_SCHEDULES.filter((s) => s.decision === 'PENDING').map((s) => ({
    id: s.id,
    title: s.title,
    desc: `${s.id} · ${s.executionWindow}`,
    to: R.APPROVALS,
    cta: 'Xem xét',
    dot: KIND.schedule.dot,
    badge: { label: KIND.schedule.label, tone: KIND.schedule.tone },
  })),
];

export function ManagerDashboard() {
  const navigate = useNavigate();
  const user = useAuthStore((state) => state.user);
  const [viewMode, setViewMode] = useState<'overview' | 'portal'>('overview');

  if (viewMode === 'portal') {
    return (
      <div className="space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-3 bg-white px-5 py-3 rounded-2xl border border-slate-200/80 shadow-sm">
          <h1 className="flex items-center gap-2 text-sm font-extrabold text-slate-900">
            <span className="w-1 h-4 rounded-full bg-gradient-to-b from-[#F26F21] to-amber-400" />
            Trung tâm phê duyệt
          </h1>
          <button type="button" onClick={() => setViewMode('overview')} className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-200 text-xs font-bold text-slate-600 hover:border-orange-300 hover:text-[#F26F21]">
            <ArrowLeft className="w-3.5 h-3.5" /> Về tổng quan
          </button>
        </div>
        <ManagerPortal />
      </div>
    );
  }

  const tiles: InfoTile[] = [
    { label: 'Tỷ lệ lấp đầy', value: `${OVERVIEW.occupancyRate}% · ${OVERVIEW.occupiedBeds}/${OVERVIEW.totalBeds} giường`, icon: Building2, tone: 'bg-orange-50 text-orange-600' },
    { label: 'Doanh thu học kỳ', value: `${OVERVIEW.revenueSemesterBillion} tỷ ₫ · ${OVERVIEW.collectedPercentage}% đã thu`, icon: Wallet, tone: 'bg-emerald-50 text-emerald-600' },
    { label: 'Chờ phê duyệt', value: `${QUEUE.length} hạng mục`, icon: ShieldCheck, tone: 'bg-violet-50 text-violet-600' },
    { label: 'Tuân thủ SLA bảo trì', value: `${OVERVIEW.slaComplianceRate}%`, icon: Wrench, tone: 'bg-sky-50 text-sky-600' },
    { label: 'Hóa đơn quá hạn', value: `${OVERVIEW.overdueInvoicesCount} hóa đơn`, icon: ReceiptText, tone: 'bg-rose-50 text-rose-600' },
    { label: 'Email', value: user?.email ?? '—', icon: Mail, tone: 'bg-slate-100 text-slate-600' },
  ];

  return (
    <div className="space-y-6">
      <WelcomeSection
        name={user?.name}
        subtitle="Trưởng ban KTX · Học kỳ Fall 2026 · KTX FPT Tân Uyên"
        actions={[
          { label: `Phê duyệt (${QUEUE.length})`, onClick: () => setViewMode('portal') },
          { label: 'Báo cáo', onClick: () => navigate(R.REPORTS) },
        ]}
        tiles={tiles}
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
        <div className="lg:col-span-2 space-y-6">
          <LatestNewsCard />
          <TaskListCard
            title="Hàng đợi phê duyệt"
            items={QUEUE}
            emptyText="Không còn hạng mục nào chờ phê duyệt."
            footer={{ label: 'Mở trung tâm phê duyệt', icon: ListChecks, onClick: () => setViewMode('portal') }}
          />
        </div>

        <div className="space-y-6">
          <QuickMenuCard items={QUICK} />

          <SectionCard
            title="Công suất theo tòa"
            actions={
              <button type="button" onClick={() => navigate(R.REPORTS)} className="text-xs font-bold text-[#F26F21] hover:underline">
                Báo cáo
              </button>
            }
          >
            <div className="space-y-4">
              {MANAGER_GOVERNANCE_DATA.buildings.map((b) => (
                <div key={b.code}>
                  <div className="flex items-center justify-between mb-1 text-xs">
                    <span className="font-bold text-slate-800">{b.name} <span className="font-medium text-slate-400">· {b.gender}</span></span>
                    <span className="font-bold text-slate-700">{b.occupancyRate}%</span>
                  </div>
                  <ProgressBar value={b.occupancyRate} tone={b.occupancyRate >= 90 ? 'orange' : 'emerald'} />
                  <div className="mt-1 text-[11px] text-slate-500">
                    {b.occupiedBeds}/{b.totalBeds} giường · {b.maintenanceBeds} đang bảo trì
                  </div>
                </div>
              ))}
            </div>
          </SectionCard>

          <SectionCard title="Theo loại hạng mục" noPadding>
            <ul className="divide-y divide-slate-100">
              {[
                { ...KIND.batch, icon: Layers, count: MANAGER_ASSIGNMENT_PROPOSALS.filter((b) => b.decision === 'PENDING').length, to: R.ASSIGNMENT_APPROVAL },
                { ...KIND.app, icon: CheckSquare, count: MANAGER_APPLICATIONS.filter((a) => a.decision === 'PENDING').length, to: R.APPROVALS },
                { ...KIND.change, icon: ArrowLeftRight, count: MANAGER_ROOM_CHANGES.filter((c) => c.decision === 'PENDING').length, to: R.APPROVALS },
                { ...KIND.schedule, icon: Wrench, count: MANAGER_MAINTENANCE_SCHEDULES.filter((s) => s.decision === 'PENDING').length, to: R.APPROVALS },
              ].map((k) => (
                <li key={k.label}>
                  <button type="button" onClick={() => navigate(k.to)} className="w-full px-5 py-3 flex items-center gap-3 text-left hover:bg-slate-50">
                    <span className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${k.tone}`}>
                      <k.icon className="w-4 h-4" />
                    </span>
                    <span className="flex-1 text-sm font-semibold text-slate-700">{k.label}</span>
                    <span className="text-sm font-extrabold text-slate-900">{k.count}</span>
                  </button>
                </li>
              ))}
            </ul>
          </SectionCard>
        </div>
      </div>
    </div>
  );
}
