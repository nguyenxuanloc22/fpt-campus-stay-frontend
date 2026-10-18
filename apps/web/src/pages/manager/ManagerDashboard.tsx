// ──────────────────────────────────────────────────────────────
//  ManagerDashboard.tsx — Tổng quan Trưởng ban KTX.
//  Từ trên xuống: lời chào → 4 thẻ số liệu (màu theo ngưỡng) →
//  khối chính “Chờ phê duyệt” → công suất theo tòa.
//  Nút “Trung tâm phê duyệt” mở ManagerPortal để ra quyết định ngay trên trang.
// ──────────────────────────────────────────────────────────────

import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, ArrowLeftRight, CalendarClock, FileCheck2, LayoutGrid } from 'lucide-react';
import { APP_ROUTES } from '@campusstay/constants';
import { useAuthStore } from '@features/auth';
import { AppButton, SectionCard, type StatusTone } from '@shared-ui';
import { ActionList, CapacityList, Greeting, KpiCard, type ActionItem, type Kpi } from '@features/dashboard';
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
const LINK = 'min-h-touch inline-flex items-center text-body font-semibold text-brand-ink hover:underline';
const TYPE_BADGE = { label: '', tone: 'neutral' as StatusTone };

/** Đánh giá theo ngưỡng: cao hơn là tốt (good) hoặc thấp hơn là tốt (lowerIsBetter). */
const grade = (value: number, good: number, warn: number, lowerIsBetter = false): { label: string; tone: StatusTone } => {
  const ok = lowerIsBetter ? value <= good : value >= good;
  const soso = lowerIsBetter ? value <= warn : value >= warn;
  return ok ? { label: 'Đạt mục tiêu', tone: 'success' } : soso ? { label: 'Cần theo dõi', tone: 'pending' } : { label: 'Dưới ngưỡng', tone: 'danger' };
};

const KPIS: Kpi[] = [
  {
    label: 'Tỷ lệ lấp đầy',
    value: `${OVERVIEW.occupancyRate}%`,
    detail: `${OVERVIEW.occupiedBeds.toLocaleString('vi-VN')} / ${OVERVIEW.totalBeds.toLocaleString('vi-VN')} giường`,
    status: grade(OVERVIEW.occupancyRate, 85, 70),
    to: R.REPORTS,
  },
  {
    label: 'Tỷ lệ thu phí học kỳ',
    value: `${OVERVIEW.collectedPercentage}%`,
    detail: `Doanh thu ${OVERVIEW.revenueSemesterBillion} tỷ ₫`,
    status: grade(OVERVIEW.collectedPercentage, 95, 85),
    to: R.REPORTS,
  },
  {
    label: 'Hóa đơn quá hạn',
    value: `${OVERVIEW.overdueInvoicesCount}`,
    detail: 'hóa đơn chưa thanh toán sau hạn',
    status: grade(OVERVIEW.overdueInvoicesCount, 0, 20, true),
    to: R.REPORTS,
  },
  {
    label: 'Tuân thủ SLA bảo trì',
    value: `${OVERVIEW.slaComplianceRate}%`,
    detail: 'yêu cầu bảo trì xử lý đúng hạn',
    status: grade(OVERVIEW.slaComplianceRate, 95, 85),
    to: R.REPORTS,
  },
];

export function ManagerDashboard() {
  const navigate = useNavigate();
  const user = useAuthStore((state) => state.user);
  const [viewMode, setViewMode] = useState<'overview' | 'portal'>('overview');

  if (viewMode === 'portal') {
    return (
      <div className="space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <h1 className="text-page-title font-bold text-ink">Trung tâm phê duyệt</h1>
          <AppButton variant="outline" leftIcon={<ArrowLeft className="w-4 h-4" />} onClick={() => setViewMode('overview')}>
            Về tổng quan
          </AppButton>
        </div>
        <ManagerPortal />
      </div>
    );
  }

  // Duyệt / Từ chối mở màn hình xem xét của hạng mục đó — quyết định cuối cùng được xác nhận tại đó.
  const review = (to: string) => ({
    action: { label: 'Duyệt', onClick: () => navigate(to) },
    secondaryAction: { label: 'Từ chối', onClick: () => navigate(to) },
  });

  const queue: ActionItem[] = [
    ...MANAGER_APPLICATIONS.filter((a) => a.decision === 'PENDING').map((a) => ({
      id: a.code,
      icon: FileCheck2,
      title: `Hồ sơ đăng ký: ${a.studentName} (${a.studentId})`,
      meta: `Gửi bởi ${a.reviewedByStaff} · ${a.flagDescription}`,
      badge: { ...TYPE_BADGE, label: 'Hồ sơ đăng ký' },
      ...review(R.APPROVALS),
    })),
    ...MANAGER_ASSIGNMENT_PROPOSALS.filter((b) => b.decision === 'PENDING').map((b) => ({
      id: b.batchCode,
      icon: LayoutGrid,
      title: `Đề xuất xếp phòng ${b.batchCode}`,
      meta: `Gửi bởi ${b.reviewedByStaff} · ${b.totalAllocations} sinh viên · ${b.matchRate}% đúng nguyện vọng`,
      badge: b.remainingExceptions ? { label: `${b.remainingExceptions} ngoại lệ`, tone: 'danger' as const } : { ...TYPE_BADGE, label: 'Xếp phòng' },
      ...review(R.ASSIGNMENT_APPROVAL),
    })),
    ...MANAGER_ROOM_CHANGES.filter((c) => c.decision === 'PENDING').map((c) => ({
      id: c.id,
      icon: ArrowLeftRight,
      title: `Đổi phòng: ${c.studentA.room} ⇄ ${c.studentB?.room ?? c.targetRoom ?? '—'}`,
      meta: `Gửi bởi ${c.studentA.name} · ${c.reason}`,
      badge: { ...TYPE_BADGE, label: 'Đổi phòng' },
      ...review(R.APPROVALS),
    })),
    ...MANAGER_MAINTENANCE_SCHEDULES.filter((s) => s.decision === 'PENDING').map((s) => ({
      id: s.id,
      icon: CalendarClock,
      title: `Lịch bảo trì: ${s.title}`,
      meta: `Gửi bởi ${s.proposer} · ${s.executionWindow}`,
      badge: { ...TYPE_BADGE, label: 'Lịch bảo trì định kỳ' },
      ...review(R.APPROVALS),
    })),
  ];

  return (
    <div className="space-y-6">
      <Greeting
        name={user?.name}
        actions={
          <AppButton variant="outline" onClick={() => setViewMode('portal')}>
            Mở trung tâm phê duyệt
          </AppButton>
        }
      />

      <ul className="grid grid-cols-2 xl:grid-cols-4 gap-3 sm:gap-4">
        {KPIS.map((k) => (
          <li key={k.label}>
            <KpiCard kpi={k} />
          </li>
        ))}
      </ul>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
        <SectionCard
          className="lg:col-span-2"
          title="Chờ phê duyệt"
          subtitle={`${queue.length} hạng mục đã qua Cán bộ KTX thẩm định`}
          actions={<Link to={R.APPROVALS} className={LINK}>Xem tất cả</Link>}
          noPadding
        >
          <ActionList items={queue} empty={{ title: 'Không còn hạng mục chờ duyệt', description: 'Hồ sơ, đề xuất xếp phòng, đổi phòng và lịch bảo trì mới sẽ hiện ở đây.' }} />
        </SectionCard>

        <SectionCard title="Công suất theo tòa" actions={<Link to={R.REPORTS} className={LINK}>Báo cáo</Link>}>
          <CapacityList
            rows={MANAGER_GOVERNANCE_DATA.buildings.map((b) => ({
              name: b.name,
              note: b.gender,
              used: b.occupiedBeds,
              total: b.totalBeds,
              detail: `${b.maintenanceBeds} giường đang bảo trì`,
            }))}
          />
        </SectionCard>
      </div>
    </div>
  );
}
