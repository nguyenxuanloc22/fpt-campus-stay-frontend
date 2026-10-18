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
import { AppButton, SectionCard, type StatusTone, t } from '@shared-ui';
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
  return ok ? { label: t('On target'), tone: 'success' } : soso ? { label: t('Needs monitoring'), tone: 'pending' } : { label: t('Below threshold'), tone: 'danger' };
};

const KPIS: Kpi[] = [
  {
    label: t('Occupancy rate'),
    value: `${OVERVIEW.occupancyRate}%`,
    detail: t('{0} / {1} beds', { 0: OVERVIEW.occupiedBeds.toLocaleString('vi-VN'), 1: OVERVIEW.totalBeds.toLocaleString('vi-VN') }),
    status: grade(OVERVIEW.occupancyRate, 85, 70),
    to: R.REPORTS,
  },
  {
    label: t('Term fee collection rate'),
    value: `${OVERVIEW.collectedPercentage}%`,
    detail: t('Revenue {0} billion ₫', { 0: OVERVIEW.revenueSemesterBillion }),
    status: grade(OVERVIEW.collectedPercentage, 95, 85),
    to: R.REPORTS,
  },
  {
    label: t('Overdue invoices'),
    value: `${OVERVIEW.overdueInvoicesCount}`,
    detail: t('invoices unpaid after the due date'),
    status: grade(OVERVIEW.overdueInvoicesCount, 0, 20, true),
    to: R.REPORTS,
  },
  {
    label: t('Maintenance SLA compliance'),
    value: `${OVERVIEW.slaComplianceRate}%`,
    detail: t('maintenance requests resolved on time'),
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
          <h1 className="text-page-title font-bold text-ink">{t('Approval center')}</h1>
          <AppButton variant="outline" leftIcon={<ArrowLeft className="w-4 h-4" />} onClick={() => setViewMode('overview')}>
            {t('Back to overview')}
          </AppButton>
        </div>
        <ManagerPortal />
      </div>
    );
  }

  // Duyệt / Từ chối mở màn hình xem xét của hạng mục đó — quyết định cuối cùng được xác nhận tại đó.
  const review = (to: string) => ({
    action: { label: t('Approve'), onClick: () => navigate(to) },
    secondaryAction: { label: t('Reject'), onClick: () => navigate(to) },
  });

  const queue: ActionItem[] = [
    ...MANAGER_APPLICATIONS.filter((a) => a.decision === 'PENDING').map((a) => ({
      id: a.code,
      icon: FileCheck2,
      title: t('Application: {0} ({1})', { 0: a.studentName, 1: a.studentId }),
      meta: t('Sent by {0} · {1}', { 0: a.reviewedByStaff, 1: a.flagDescription }),
      badge: { ...TYPE_BADGE, label: t('Application') },
      ...review(R.APPROVALS),
    })),
    ...MANAGER_ASSIGNMENT_PROPOSALS.filter((b) => b.decision === 'PENDING').map((b) => ({
      id: b.batchCode,
      icon: LayoutGrid,
      title: t('Allocation proposal {0}', { 0: b.batchCode }),
      meta: t('Sent by {0} · {1} students · {2}% preference match', { 0: b.reviewedByStaff, 1: b.totalAllocations, 2: b.matchRate }),
      badge: b.remainingExceptions ? { label: t('{0} exceptions', { 0: b.remainingExceptions }), tone: 'danger' as const } : { ...TYPE_BADGE, label: t('Allocation') },
      ...review(R.ASSIGNMENT_APPROVAL),
    })),
    ...MANAGER_ROOM_CHANGES.filter((c) => c.decision === 'PENDING').map((c) => ({
      id: c.id,
      icon: ArrowLeftRight,
      title: t('Room change: {0} ⇄ {1}', { 0: c.studentA.room, 1: c.studentB?.room ?? c.targetRoom ?? '—' }),
      meta: t('Sent by {0} · {1}', { 0: c.studentA.name, 1: c.reason }),
      badge: { ...TYPE_BADGE, label: t('Room changes') },
      ...review(R.APPROVALS),
    })),
    ...MANAGER_MAINTENANCE_SCHEDULES.filter((s) => s.decision === 'PENDING').map((s) => ({
      id: s.id,
      icon: CalendarClock,
      title: t('Maintenance schedule: {0}', { 0: s.title }),
      meta: t('Sent by {0} · {1}', { 0: s.proposer, 1: s.executionWindow }),
      badge: { ...TYPE_BADGE, label: t('Periodic maintenance schedules') },
      ...review(R.APPROVALS),
    })),
  ];

  return (
    <div className="space-y-6">
      <Greeting
        name={user?.name}
        actions={
          <AppButton variant="outline" onClick={() => setViewMode('portal')}>
            {t('Open approval center')}
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
          title={t('Awaiting approval')}
          subtitle={t('{0} items reviewed by dormitory staff', { 0: queue.length })}
          actions={<Link to={R.APPROVALS} className={LINK}>{t('View all')}</Link>}
          noPadding
        >
          <ActionList items={queue} empty={{ title: t('Nothing awaiting approval'), description: t('New applications, allocation proposals, room changes and maintenance schedules will appear here.') }} />
        </SectionCard>

        <SectionCard title={t('Capacity by building')} actions={<Link to={R.REPORTS} className={LINK}>{t('Reports')}</Link>}>
          <CapacityList
            rows={MANAGER_GOVERNANCE_DATA.buildings.map((b) => ({
              name: b.name,
              note: t(b.gender),
              used: b.occupiedBeds,
              total: b.totalBeds,
              detail: t('{0} beds under maintenance', { 0: b.maintenanceBeds }),
            }))}
          />
        </SectionCard>
      </div>
    </div>
  );
}
