// ──────────────────────────────────────────────────────────────
//  StaffDashboard.tsx — Tổng quan Cán bộ KTX.
//  Từ trên xuống: lời chào + ca làm việc → 2 hàng đợi (Cần thẩm định,
//  Việc tại quầy hôm nay) → giường trống theo tòa.
//  Nút “Bàn làm việc” mở StaffPortal để xử lý ngay trên trang.
// ──────────────────────────────────────────────────────────────

import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, ClipboardCheck, FileSearch, LayoutGrid, LogIn, Wrench } from 'lucide-react';
import { APP_ROUTES } from '@campusstay/constants';
import { useAuthStore } from '@features/auth';
import { AppButton, SectionCard, t } from '@shared-ui';
import { ActionList, CapacityList, Greeting, type ActionItem } from '@features/dashboard';
import { StaffPortal } from './StaffPortal';
import { STAFF_APPLICATIONS, STAFF_ASSIGNMENT_PROPOSAL, STAFF_MAINTENANCE_TASKS, STAFF_MANUAL_CHECKINS } from './staffMockData';
import { ACTION_ITEMS, BUILDINGS, STAFF_PROFILE } from './dashboardMockData';

const R = APP_ROUTES.STAFF;
const URGENCY_ORDER = { URGENT: 0, HIGH: 1, MEDIUM: 2 } as const;
const URGENCY_LABEL = { URGENT: t('Urgent'), HIGH: 'Cao', MEDIUM: t('Medium') } as const;
const LINK = 'min-h-touch inline-flex items-center text-body font-semibold text-brand-ink hover:underline';

export function StaffDashboard() {
  const navigate = useNavigate();
  const user = useAuthStore((state) => state.user);
  const [viewMode, setViewMode] = useState<'overview' | 'portal'>('overview');

  if (viewMode === 'portal') {
    return (
      <div className="space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <h1 className="text-page-title font-bold text-ink">{t('Operations workspace')}</h1>
          <AppButton variant="outline" leftIcon={<ArrowLeft className="w-4 h-4" />} onClick={() => setViewMode('overview')}>
            {t('Back to overview')}
          </AppButton>
        </div>
        <StaffPortal />
      </div>
    );
  }

  // ── Cần thẩm định: hồ sơ chờ Staff + đề xuất xếp phòng còn xung đột
  const openConflicts = STAFF_ASSIGNMENT_PROPOSAL.conflicts.filter((c) => !c.isResolved).length;
  const reviewQueue: ActionItem[] = [
    ...(STAFF_ASSIGNMENT_PROPOSAL.status === 'REVIEWING'
      ? [
          {
            id: STAFF_ASSIGNMENT_PROPOSAL.id,
            icon: LayoutGrid,
            title: t('Allocation proposal {0}', { 0: STAFF_ASSIGNMENT_PROPOSAL.batchCode }),
            meta: t('{0} students · {1}% preference match', { 0: STAFF_ASSIGNMENT_PROPOSAL.totalAllocations, 1: STAFF_ASSIGNMENT_PROPOSAL.matchRate }),
            badge: openConflicts ? { label: t('{0} conflicts', { 0: openConflicts }), tone: 'danger' as const } : { label: t('Ready to send'), tone: 'success' as const },
            action: { label: t('Adjust'), onClick: () => navigate(R.ASSIGNMENT), primary: true },
          },
        ]
      : []),
    ...STAFF_APPLICATIONS.filter((a) => a.status !== 'VERIFIED').map((a) => ({
      id: a.id,
      icon: FileSearch,
      title: `${a.studentName} · ${a.code}`,
      meta: a.flagReason,
      badge: a.status === 'ESCALATED' ? { label: t('Under reconciliation'), tone: 'info' as const } : { label: t('Awaiting review'), tone: 'pending' as const },
      action: { label: t('Review'), onClick: () => navigate(R.APPLICATIONS) },
    })),
  ];

  // ── Việc tại quầy hôm nay: check-in thủ công/muộn → kiểm tra phòng khi trả → bảo trì theo mức khẩn
  const checkoutInspection = ACTION_ITEMS.find((a) => a.route === R.CHECKIN_OUT);
  const deskQueue: ActionItem[] = [
    ...STAFF_MANUAL_CHECKINS.filter((c) => c.status !== 'COMPLETED').map((c) => ({
      id: c.id,
      icon: LogIn,
      title: `${t(c.checkinType)}: ${c.studentName}`,
      meta: `${c.assignedRoom} · ${c.scheduledTime}`,
      badge: { label: t('Waiting to check in'), tone: 'pending' as const },
      action: { label: 'Check-in', onClick: () => navigate(R.CHECKIN_OUT) },
    })),
    ...(checkoutInspection
      ? [
          {
            id: checkoutInspection.id,
            icon: ClipboardCheck,
            title: checkoutInspection.title,
            meta: checkoutInspection.subtitle,
            badge: { label: t('Awaiting verification'), tone: 'pending' as const },
            action: { label: t('Inspect'), onClick: () => navigate(R.CHECKIN_OUT) },
          },
        ]
      : []),
    ...[...STAFF_MAINTENANCE_TASKS]
      .filter((task) => task.status !== 'VERIFIED_DONE')
      .sort((a, b) => URGENCY_ORDER[a.urgency] - URGENCY_ORDER[b.urgency])
      .map((task) => ({
        id: task.id,
        icon: Wrench,
        title: t('Maintenance request {0} · {1}', { 0: task.ticketCode, 1: task.room }),
        meta: t('{0} · SLA remaining {1}', { 0: task.description, 1: task.slaRemaining }),
        badge: { label: URGENCY_LABEL[task.urgency], tone: task.urgency === 'URGENT' ? ('danger' as const) : ('pending' as const) },
        action: { label: t('Handle'), onClick: () => navigate(R.MAINTENANCE) },
      })),
  ];

  return (
    <div className="space-y-6">
      <Greeting
        name={user?.name}
        subtitle={t('Dormitory staff · Shift {0}', { 0: STAFF_PROFILE.shift })}
        actions={
          <AppButton variant="outline" onClick={() => setViewMode('portal')}>
            {t('Open workspace')}
          </AppButton>
        }
      />

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 items-start">
        <SectionCard title={t('Needs review')} subtitle={t('{0} items · applications and allocation proposals', { 0: reviewQueue.length })} actions={<Link to={R.APPLICATIONS} className={LINK}>{t('View all')}</Link>} noPadding>
          <ActionList items={reviewQueue} empty={{ title: t('No applications awaiting review'), description: t('New applications will appear here when students apply.') }} />
        </SectionCard>

        <SectionCard title={t('At the desk today')} subtitle={t('{0} items · check-in, room inspection, maintenance', { 0: deskQueue.length })} actions={<Link to={R.CHECKIN_OUT} className={LINK}>{t('View all')}</Link>} noPadding>
          <ActionList items={deskQueue} empty={{ title: t('Desk is clear'), description: t('No check-in appointments or maintenance requests to handle.') }} />
        </SectionCard>
      </div>

      <SectionCard title={t('Free beds by building')} actions={<Link to={R.INVENTORY} className={LINK}>{t('Rooms & beds')}</Link>}>
        <CapacityList
          showFree
          className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4"
          rows={BUILDINGS.map((b) => ({ name: t('Building {0}', { 0: b.code }), note: t(b.gender), used: b.used, total: b.beds, detail: t('{0} beds under maintenance', { 0: b.maintenance }) }))}
        />
      </SectionCard>
    </div>
  );
}
