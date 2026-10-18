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
import { AppButton, SectionCard } from '@shared-ui';
import { ActionList, CapacityList, Greeting, type ActionItem } from '@features/dashboard';
import { StaffPortal } from './StaffPortal';
import { STAFF_APPLICATIONS, STAFF_ASSIGNMENT_PROPOSAL, STAFF_MAINTENANCE_TASKS, STAFF_MANUAL_CHECKINS } from './staffMockData';
import { ACTION_ITEMS, BUILDINGS, STAFF_PROFILE } from './dashboardMockData';

const R = APP_ROUTES.STAFF;
const URGENCY_ORDER = { URGENT: 0, HIGH: 1, MEDIUM: 2 } as const;
const URGENCY_LABEL = { URGENT: 'Khẩn cấp', HIGH: 'Cao', MEDIUM: 'Trung bình' } as const;
const LINK = 'min-h-touch inline-flex items-center text-body font-semibold text-brand-ink hover:underline';

export function StaffDashboard() {
  const navigate = useNavigate();
  const user = useAuthStore((state) => state.user);
  const [viewMode, setViewMode] = useState<'overview' | 'portal'>('overview');

  if (viewMode === 'portal') {
    return (
      <div className="space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <h1 className="text-page-title font-bold text-ink">Bàn làm việc vận hành</h1>
          <AppButton variant="outline" leftIcon={<ArrowLeft className="w-4 h-4" />} onClick={() => setViewMode('overview')}>
            Về tổng quan
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
            title: `Đề xuất xếp phòng ${STAFF_ASSIGNMENT_PROPOSAL.batchCode}`,
            meta: `${STAFF_ASSIGNMENT_PROPOSAL.totalAllocations} sinh viên · ${STAFF_ASSIGNMENT_PROPOSAL.matchRate}% đúng nguyện vọng`,
            badge: openConflicts ? { label: `${openConflicts} xung đột`, tone: 'danger' as const } : { label: 'Sẵn sàng gửi', tone: 'success' as const },
            action: { label: 'Điều chỉnh', onClick: () => navigate(R.ASSIGNMENT), primary: true },
          },
        ]
      : []),
    ...STAFF_APPLICATIONS.filter((a) => a.status !== 'VERIFIED').map((a) => ({
      id: a.id,
      icon: FileSearch,
      title: `${a.studentName} · ${a.code}`,
      meta: a.flagReason,
      badge: a.status === 'ESCALATED' ? { label: 'Đang đối soát', tone: 'info' as const } : { label: 'Chờ thẩm định', tone: 'pending' as const },
      action: { label: 'Thẩm định', onClick: () => navigate(R.APPLICATIONS) },
    })),
  ];

  // ── Việc tại quầy hôm nay: check-in thủ công/muộn → kiểm tra phòng khi trả → bảo trì theo mức khẩn
  const checkoutInspection = ACTION_ITEMS.find((a) => a.route === R.CHECKIN_OUT);
  const deskQueue: ActionItem[] = [
    ...STAFF_MANUAL_CHECKINS.filter((c) => c.status !== 'COMPLETED').map((c) => ({
      id: c.id,
      icon: LogIn,
      title: `${c.checkinType}: ${c.studentName}`,
      meta: `${c.assignedRoom} · ${c.scheduledTime}`,
      badge: { label: 'Chờ nhận phòng', tone: 'pending' as const },
      action: { label: 'Check-in', onClick: () => navigate(R.CHECKIN_OUT) },
    })),
    ...(checkoutInspection
      ? [
          {
            id: checkoutInspection.id,
            icon: ClipboardCheck,
            title: checkoutInspection.title,
            meta: checkoutInspection.subtitle,
            badge: { label: 'Chờ xác minh', tone: 'pending' as const },
            action: { label: 'Kiểm tra', onClick: () => navigate(R.CHECKIN_OUT) },
          },
        ]
      : []),
    ...[...STAFF_MAINTENANCE_TASKS]
      .filter((t) => t.status !== 'VERIFIED_DONE')
      .sort((a, b) => URGENCY_ORDER[a.urgency] - URGENCY_ORDER[b.urgency])
      .map((t) => ({
        id: t.id,
        icon: Wrench,
        title: `Yêu cầu bảo trì ${t.ticketCode} · ${t.room}`,
        meta: `${t.description} · SLA còn ${t.slaRemaining}`,
        badge: { label: URGENCY_LABEL[t.urgency], tone: t.urgency === 'URGENT' ? ('danger' as const) : ('pending' as const) },
        action: { label: 'Xử lý', onClick: () => navigate(R.MAINTENANCE) },
      })),
  ];

  return (
    <div className="space-y-6">
      <Greeting
        name={user?.name}
        subtitle={`Cán bộ KTX · Ca làm việc ${STAFF_PROFILE.shift}`}
        actions={
          <AppButton variant="outline" onClick={() => setViewMode('portal')}>
            Mở bàn làm việc
          </AppButton>
        }
      />

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 items-start">
        <SectionCard title="Cần thẩm định" subtitle={`${reviewQueue.length} việc · hồ sơ và đề xuất xếp phòng`} actions={<Link to={R.APPLICATIONS} className={LINK}>Xem tất cả</Link>} noPadding>
          <ActionList items={reviewQueue} empty={{ title: 'Không còn hồ sơ chờ thẩm định', description: 'Hồ sơ mới sẽ hiện ở đây khi sinh viên nộp đơn.' }} />
        </SectionCard>

        <SectionCard title="Việc tại quầy hôm nay" subtitle={`${deskQueue.length} việc · check-in, kiểm tra phòng, bảo trì`} actions={<Link to={R.CHECKIN_OUT} className={LINK}>Xem tất cả</Link>} noPadding>
          <ActionList items={deskQueue} empty={{ title: 'Quầy đang trống', description: 'Chưa có sinh viên hẹn check-in hay yêu cầu bảo trì cần xử lý.' }} />
        </SectionCard>
      </div>

      <SectionCard title="Giường trống theo tòa" actions={<Link to={R.INVENTORY} className={LINK}>Phòng & giường</Link>}>
        <CapacityList
          showFree
          className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4"
          rows={BUILDINGS.map((b) => ({ name: `Tòa ${b.code}`, note: b.gender, used: b.used, total: b.beds, detail: `${b.maintenance} giường đang bảo trì` }))}
        />
      </SectionCard>
    </div>
  );
}
