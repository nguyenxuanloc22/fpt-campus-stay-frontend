// ──────────────────────────────────────────────────────────────
//  ManagerDashboard.tsx — CampusStay FPT Manager Dashboard
//  Production-ready governance dashboard with standardized UI,
//  uniform action buttons (px-4 py-2 rounded-lg), zero cluttered tables,
//  and seamless access to the 5 governance & approval domains.
// ──────────────────────────────────────────────────────────────

import { useState } from 'react';
import {
  ShieldAlert,
  Building2,
  Wallet,
  Wrench,
  Layers,
  ArrowRight,
  ArrowLeftRight,
  CalendarClock,
  BarChart3,
  CheckSquare,
} from 'lucide-react';
import clsx from 'clsx';
import { ManagerPortal } from './ManagerPortal';
import {
  MANAGER_APPLICATIONS,
  MANAGER_ASSIGNMENT_PROPOSALS,
  MANAGER_ROOM_CHANGES,
  MANAGER_MAINTENANCE_SCHEDULES,
  MANAGER_GOVERNANCE_DATA,
} from './managerMockData';

export function ManagerDashboard() {
  const [viewMode, setViewMode] = useState<'overview' | 'portal'>('overview');

  const pendingApps = MANAGER_APPLICATIONS.filter((a) => a.decision === 'PENDING').length;
  const pendingBatches = MANAGER_ASSIGNMENT_PROPOSALS.filter((b) => b.decision === 'PENDING').length;
  const pendingChanges = MANAGER_ROOM_CHANGES.filter((r) => r.decision === 'PENDING').length;
  const pendingSchedules = MANAGER_MAINTENANCE_SCHEDULES.filter((s) => s.decision === 'PENDING').length;
  const totalPendingDecisions = pendingApps + pendingBatches + pendingChanges + pendingSchedules;

  return (
    <div className="space-y-6">
      {/* ── Governance Header Switcher ── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs">
        <div>
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-[#1A365D]" />
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
              CampusStay FPT • Ban Quản Lý Ký Túc Xá
            </span>
          </div>
          <h1 className="text-xl font-bold text-[#1A365D] mt-0.5">
            Trưởng Ban KTX — Governance & Approvals Portal
          </h1>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setViewMode('overview')}
            className={clsx(
              'px-4 py-2 rounded-lg font-medium text-xs sm:text-sm transition-all',
              viewMode === 'overview'
                ? 'bg-[#1A365D] text-white shadow-xs'
                : 'border border-slate-200 bg-white hover:bg-slate-50 text-slate-700'
            )}
          >
            Tổng quan quản trị
          </button>
          <button
            type="button"
            onClick={() => setViewMode('portal')}
            className={clsx(
              'px-4 py-2 rounded-lg font-medium text-xs sm:text-sm transition-all inline-flex items-center gap-1.5',
              viewMode === 'portal'
                ? 'bg-[#F26522] text-white shadow-xs'
                : 'border border-slate-200 bg-white hover:bg-slate-50 text-slate-700'
            )}
          >
            Trung tâm phê duyệt ({totalPendingDecisions})
          </button>
        </div>
      </div>

      {viewMode === 'portal' ? (
        <ManagerPortal />
      ) : (
        <div className="space-y-6">
          {/* ── 4 Top Governance Metrics ── */}
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
            <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs">
              <div className="flex items-start justify-between">
                <div>
                  <div className="text-xs font-semibold text-slate-500 uppercase tracking-wide">
                    Tỷ lệ lấp đầy KTX
                  </div>
                  <div className="text-2xl font-bold text-[#1A365D] mt-1">
                    {MANAGER_GOVERNANCE_DATA.overview.occupancyRate}%
                  </div>
                  <p className="text-[11px] text-emerald-600 mt-1 font-medium">
                    {MANAGER_GOVERNANCE_DATA.overview.occupiedBeds} / {MANAGER_GOVERNANCE_DATA.overview.totalBeds} giường
                  </p>
                </div>
                <div className="w-10 h-10 rounded-xl bg-blue-50 text-[#1A365D] flex items-center justify-center shrink-0">
                  <Building2 className="w-5 h-5" />
                </div>
              </div>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs">
              <div className="flex items-start justify-between">
                <div>
                  <div className="text-xs font-semibold text-slate-500 uppercase tracking-wide">
                    Doanh thu học kỳ
                  </div>
                  <div className="text-2xl font-bold text-slate-900 mt-1">
                    {MANAGER_GOVERNANCE_DATA.overview.revenueSemesterBillion} tỷ ₫
                  </div>
                  <p className="text-[11px] text-emerald-600 mt-1 font-medium">
                    {MANAGER_GOVERNANCE_DATA.overview.collectedPercentage}% đã thu
                  </p>
                </div>
                <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
                  <Wallet className="w-5 h-5" />
                </div>
              </div>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs">
              <div className="flex items-start justify-between">
                <div>
                  <div className="text-xs font-semibold text-slate-500 uppercase tracking-wide">
                    Tuân thủ SLA bảo trì
                  </div>
                  <div className="text-2xl font-bold text-slate-900 mt-1">
                    {MANAGER_GOVERNANCE_DATA.overview.slaComplianceRate}%
                  </div>
                  <p className="text-[11px] text-slate-500 mt-1 font-medium">
                    Đúng hạn cam kết kỹ thuật
                  </p>
                </div>
                <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center shrink-0">
                  <Wrench className="w-5 h-5" />
                </div>
              </div>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs">
              <div className="flex items-start justify-between">
                <div>
                  <div className="text-xs font-semibold text-slate-500 uppercase tracking-wide">
                    Hạng mục chờ phê duyệt
                  </div>
                  <div className="text-2xl font-bold text-[#F26522] mt-1">
                    {totalPendingDecisions} mục
                  </div>
                  <p className="text-[11px] text-orange-600 mt-1 font-medium">
                    {pendingBatches} đề xuất xếp phòng · {pendingApps} đơn · {pendingChanges} đổi phòng
                  </p>
                </div>
                <div className="w-10 h-10 rounded-xl bg-orange-50 text-[#F26522] flex items-center justify-center shrink-0">
                  <ShieldAlert className="w-5 h-5" />
                </div>
              </div>
            </div>
          </div>

          {/* ── 5 Core Governance Hub Cards ── */}
          <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-xs">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="text-base font-bold text-[#1A365D]">
                  5 Quyết Định & Thẩm Quyền Quản Trị (Governance & Approvals)
                </h2>
                <p className="text-xs text-slate-500 mt-0.5">
                  Xử lý dứt điểm các thẩm quyền phê duyệt dành riêng cho Trưởng ban KTX
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {/* 1. Approve/Reject Dormitory Applications */}
              <div className="p-4 rounded-xl border border-slate-200/90 hover:border-slate-300 bg-slate-50/50 flex flex-col justify-between gap-3">
                <div className="space-y-1.5">
                  <div className="w-8 h-8 rounded-lg bg-orange-100 text-[#F26522] flex items-center justify-center">
                    <CheckSquare className="w-4 h-4" />
                  </div>
                  <h3 className="text-sm font-bold text-slate-800">1. Phê duyệt đơn đăng ký KTX</h3>
                  <p className="text-xs text-slate-500 leading-relaxed">
                    Xem xét các hồ sơ đặc thù có xác nhận từ Staff để ra quyết định chấp thuận hoặc từ chối.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setViewMode('portal')}
                  className="bg-[#F26522] hover:bg-[#d95314] text-white px-4 py-2 rounded-lg font-medium text-xs sm:text-sm transition-colors inline-flex items-center justify-center gap-1.5 shadow-sm w-full"
                >
                  Xử lý {pendingApps} đơn đang chờ
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>

              {/* 2. Review/Approve Room Assignment Proposals */}
              <div className="p-4 rounded-xl border border-slate-200/90 hover:border-slate-300 bg-slate-50/50 flex flex-col justify-between gap-3">
                <div className="space-y-1.5">
                  <div className="w-8 h-8 rounded-lg bg-blue-100 text-[#1A365D] flex items-center justify-center">
                    <Layers className="w-4 h-4" />
                  </div>
                  <h3 className="text-sm font-bold text-slate-800">2. Phê duyệt kết quả phân bổ phòng</h3>
                  <p className="text-xs text-slate-500 leading-relaxed">
                    Ký duyệt đợt xếp phòng tự động để hệ thống chính thức kích hoạt hợp đồng và cổng thu phí đợt 2.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setViewMode('portal')}
                  className="bg-[#F26522] hover:bg-[#d95314] text-white px-4 py-2 rounded-lg font-medium text-xs sm:text-sm transition-colors inline-flex items-center justify-center gap-1.5 shadow-sm w-full"
                >
                  Ký duyệt đề xuất BR-SP27-02
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>

              {/* 3. Approve/Reject Room Change Requests */}
              <div className="p-4 rounded-xl border border-slate-200/90 hover:border-slate-300 bg-slate-50/50 flex flex-col justify-between gap-3">
                <div className="space-y-1.5">
                  <div className="w-8 h-8 rounded-lg bg-purple-100 text-purple-700 flex items-center justify-center">
                    <ArrowLeftRight className="w-4 h-4" />
                  </div>
                  <h3 className="text-sm font-bold text-slate-800">3. Phê duyệt đổi & hoán đổi phòng</h3>
                  <p className="text-xs text-slate-500 leading-relaxed">
                    Thẩm định sự thỏa thuận giữa các bên sinh viên và quyết định chấp thuận điều chuyển phòng.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setViewMode('portal')}
                  className="border border-slate-200 bg-white hover:bg-slate-50 hover:border-slate-300 text-slate-700 px-4 py-2 rounded-lg font-medium text-xs sm:text-sm transition-colors inline-flex items-center justify-center gap-1.5 w-full"
                >
                  Xem {pendingChanges} yêu cầu đổi phòng
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>

              {/* 4. Approve Maintenance Schedules */}
              <div className="p-4 rounded-xl border border-slate-200/90 hover:border-slate-300 bg-slate-50/50 flex flex-col justify-between gap-3">
                <div className="space-y-1.5">
                  <div className="w-8 h-8 rounded-lg bg-amber-100 text-amber-800 flex items-center justify-center">
                    <CalendarClock className="w-4 h-4" />
                  </div>
                  <h3 className="text-sm font-bold text-slate-800">4. Phê duyệt lịch bảo trì định kỳ</h3>
                  <p className="text-xs text-slate-500 leading-relaxed">
                    Xem xét lịch bảo dưỡng hệ thống điều hòa, điện nước diện rộng để bảo đảm an toàn sinh hoạt.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setViewMode('portal')}
                  className="border border-slate-200 bg-white hover:bg-slate-50 hover:border-slate-300 text-slate-700 px-4 py-2 rounded-lg font-medium text-xs sm:text-sm transition-colors inline-flex items-center justify-center gap-1.5 w-full"
                >
                  Xem {pendingSchedules} lịch bảo dưỡng
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>

              {/* 5. Monitor Occupancy & Reports */}
              <div className="p-4 rounded-xl border border-slate-200/90 hover:border-slate-300 bg-slate-50/50 flex flex-col justify-between gap-3">
                <div className="space-y-1.5">
                  <div className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-800 flex items-center justify-center">
                    <BarChart3 className="w-4 h-4" />
                  </div>
                  <h3 className="text-sm font-bold text-slate-800">5. Giám sát công suất & Báo cáo</h3>
                  <p className="text-xs text-slate-500 leading-relaxed">
                    Theo dõi tỷ lệ lấp đầy theo tòa nhà, dòng tiền thanh toán và các chỉ số đo lường dịch vụ.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setViewMode('portal')}
                  className="border border-slate-200 bg-white hover:bg-slate-50 hover:border-slate-300 text-slate-700 px-4 py-2 rounded-lg font-medium text-xs sm:text-sm transition-colors inline-flex items-center justify-center gap-1.5 w-full"
                >
                  Mở báo cáo công suất tòa nhà
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
