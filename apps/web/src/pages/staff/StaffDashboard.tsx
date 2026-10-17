// ──────────────────────────────────────────────────────────────
//  StaffDashboard.tsx — CampusStay FPT Staff Dashboard
//  Production-ready operational dashboard with standardized UI,
//  uniform action buttons (px-4 py-2 rounded-lg), zero cluttered tables,
//  and seamless access to the 5 operational execution domains.
// ──────────────────────────────────────────────────────────────

import { useState } from 'react';
import {
  CheckSquare,
  Wrench,
  CalendarCheck,
  Bed,
  UserCheck,
  ArrowRight,
  FileText,
  Layers,
} from 'lucide-react';
import clsx from 'clsx';
import { StaffPortal } from './StaffPortal';
import {
  STAFF_APPLICATIONS,
  STAFF_ROOMS,
  STAFF_MAINTENANCE_TASKS,
  STAFF_MANUAL_CHECKINS,
} from './staffMockData';

export function StaffDashboard() {
  const [viewMode, setViewMode] = useState<'overview' | 'portal'>('overview');

  // Computed metrics
  const totalRooms = STAFF_ROOMS.length;
  const totalBeds = STAFF_ROOMS.reduce((acc, r) => acc + r.beds.length, 0);
  const availableBeds = STAFF_ROOMS.reduce(
    (acc, r) => acc + r.beds.filter((b) => b.status === 'AVAILABLE').length,
    0
  );
  const pendingApps = STAFF_APPLICATIONS.filter((a) => a.status === 'PENDING_REVIEW').length;
  const activeTickets = STAFF_MAINTENANCE_TASKS.filter((t) => t.status !== 'VERIFIED_DONE').length;
  const pendingCheckins = STAFF_MANUAL_CHECKINS.filter((c) => c.status !== 'COMPLETED').length;

  return (
    <div className="space-y-6">
      {/* ── Sub-navigation Header Switcher ── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs">
        <div>
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-[#F26522]" />
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
              CampusStay FPT • Bàn Làm Việc Vận Hành
            </span>
          </div>
          <h1 className="text-xl font-bold text-[#1A365D] mt-0.5">
            Cán Bộ Ký Túc Xá — Operational Portal
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
            Tổng quan chỉ số
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
            Tác vụ vận hành (5 Use Cases)
          </button>
        </div>
      </div>

      {viewMode === 'portal' ? (
        <StaffPortal />
      ) : (
        <div className="space-y-6">
          {/* ── 4 Top Stat Cards ── */}
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
            <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs">
              <div className="flex items-start justify-between">
                <div>
                  <div className="text-xs font-semibold text-slate-500 uppercase tracking-wide">
                    Đơn đăng ký chờ duyệt
                  </div>
                  <div className="text-2xl font-bold text-slate-900 mt-1">{pendingApps} đơn</div>
                  <p className="text-[11px] text-amber-600 mt-1 font-medium">
                    Cần rà soát hồ sơ đặc thù
                  </p>
                </div>
                <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center shrink-0">
                  <CheckSquare className="w-5 h-5" />
                </div>
              </div>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs">
              <div className="flex items-start justify-between">
                <div>
                  <div className="text-xs font-semibold text-slate-500 uppercase tracking-wide">
                    Ticket bảo trì mở
                  </div>
                  <div className="text-2xl font-bold text-slate-900 mt-1">{activeTickets} ticket</div>
                  <p className="text-[11px] text-rose-600 mt-1 font-medium">
                    1 sự cố điện khẩn cấp sắp vượt SLA
                  </p>
                </div>
                <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
                  <Wrench className="w-5 h-5" />
                </div>
              </div>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs">
              <div className="flex items-start justify-between">
                <div>
                  <div className="text-xs font-semibold text-slate-500 uppercase tracking-wide">
                    Check-in thủ công tại quầy
                  </div>
                  <div className="text-2xl font-bold text-slate-900 mt-1">{pendingCheckins} sinh viên</div>
                  <p className="text-[11px] text-purple-600 mt-1 font-medium">
                    Chờ đối soát biên bản bàn giao
                  </p>
                </div>
                <div className="w-10 h-10 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center shrink-0">
                  <CalendarCheck className="w-5 h-5" />
                </div>
              </div>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs">
              <div className="flex items-start justify-between">
                <div>
                  <div className="text-xs font-semibold text-slate-500 uppercase tracking-wide">
                    Giường trống sẵn sàng
                  </div>
                  <div className="text-2xl font-bold text-slate-900 mt-1">
                    {availableBeds} / {totalBeds} giường
                  </div>
                  <p className="text-[11px] text-emerald-600 mt-1 font-medium">
                    Đã nghiệm thu sẵn sàng nhận SV
                  </p>
                </div>
                <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
                  <Bed className="w-5 h-5" />
                </div>
              </div>
            </div>
          </div>

          {/* ── 5 Operational Execution Hub Cards ── */}
          <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-xs">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="text-base font-bold text-[#1A365D]">
                  5 Nhiệm Vụ Vận Hành Cốt Lõi (Operational Execution)
                </h2>
                <p className="text-xs text-slate-500 mt-0.5">
                  Thao tác trực tiếp theo quy trình phân công trách nhiệm KTX FPT
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {/* 1. Review Dormitory Applications */}
              <div className="p-4 rounded-xl border border-slate-200/90 hover:border-slate-300 bg-slate-50/50 flex flex-col justify-between gap-3">
                <div className="space-y-1.5">
                  <div className="w-8 h-8 rounded-lg bg-orange-100 text-[#F26522] flex items-center justify-center">
                    <FileText className="w-4 h-4" />
                  </div>
                  <h3 className="text-sm font-bold text-slate-800">1. Thẩm định hồ sơ đăng ký KTX</h3>
                  <p className="text-xs text-slate-500 leading-relaxed">
                    Kiểm tra hồ sơ sinh viên, chứng nhận ưu tiên, đối soát nghĩa vụ trước khi đưa vào thuật toán xếp phòng.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setViewMode('portal')}
                  className="bg-[#F26522] hover:bg-[#d95314] text-white px-4 py-2 rounded-lg font-medium text-xs sm:text-sm transition-colors inline-flex items-center justify-center gap-1.5 shadow-sm w-full"
                >
                  Rà soát {pendingApps} đơn cần xử lý
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>

              {/* 2. Update Room & Bed Status */}
              <div className="p-4 rounded-xl border border-slate-200/90 hover:border-slate-300 bg-slate-50/50 flex flex-col justify-between gap-3">
                <div className="space-y-1.5">
                  <div className="w-8 h-8 rounded-lg bg-blue-100 text-blue-700 flex items-center justify-center">
                    <Bed className="w-4 h-4" />
                  </div>
                  <h3 className="text-sm font-bold text-slate-800">2. Cập nhật trạng thái phòng & giường</h3>
                  <p className="text-xs text-slate-500 leading-relaxed">
                    Khóa giường bảo trì, mở giường khả dụng, giám sát tình trạng thực tế của từng tòa nhà.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setViewMode('portal')}
                  className="border border-slate-200 bg-white hover:bg-slate-50 hover:border-slate-300 text-slate-700 px-4 py-2 rounded-lg font-medium text-xs sm:text-sm transition-colors inline-flex items-center justify-center gap-1.5 w-full"
                >
                  Kiểm tra {totalRooms} phòng lưu trú
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>

              {/* 3. Review/Adjust Room Assignment Proposal */}
              <div className="p-4 rounded-xl border border-slate-200/90 hover:border-slate-300 bg-slate-50/50 flex flex-col justify-between gap-3">
                <div className="space-y-1.5">
                  <div className="w-8 h-8 rounded-lg bg-purple-100 text-purple-700 flex items-center justify-center">
                    <Layers className="w-4 h-4" />
                  </div>
                  <h3 className="text-sm font-bold text-slate-800">3. Rà soát & điều chỉnh xếp phòng</h3>
                  <p className="text-xs text-slate-500 leading-relaxed">
                    Xử lý các xung đột phân bổ do hệ thống cảnh báo (tầng thấp, bạn cùng phòng) trước khi chuyển Manager.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setViewMode('portal')}
                  className="bg-[#F26522] hover:bg-[#d95314] text-white px-4 py-2 rounded-lg font-medium text-xs sm:text-sm transition-colors inline-flex items-center justify-center gap-1.5 shadow-sm w-full"
                >
                  Điều chỉnh đề xuất BR-SP27-02
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>

              {/* 4. Handle Maintenance Requests & Inspections */}
              <div className="p-4 rounded-xl border border-slate-200/90 hover:border-slate-300 bg-slate-50/50 flex flex-col justify-between gap-3">
                <div className="space-y-1.5">
                  <div className="w-8 h-8 rounded-lg bg-rose-100 text-rose-700 flex items-center justify-center">
                    <Wrench className="w-4 h-4" />
                  </div>
                  <h3 className="text-sm font-bold text-slate-800">4. Tiếp nhận & điều phối bảo trì</h3>
                  <p className="text-xs text-slate-500 leading-relaxed">
                    Giao việc cho kỹ thuật viên điện, nước, điều hòa và thực hiện nghiệm thu bàn giao phòng.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setViewMode('portal')}
                  className="border border-slate-200 bg-white hover:bg-slate-50 hover:border-slate-300 text-slate-700 px-4 py-2 rounded-lg font-medium text-xs sm:text-sm transition-colors inline-flex items-center justify-center gap-1.5 w-full"
                >
                  Theo dõi {activeTickets} sự cố kỹ thuật
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>

              {/* 5. Process Manual/Late Check-In & Room-Condition Verify */}
              <div className="p-4 rounded-xl border border-slate-200/90 hover:border-slate-300 bg-slate-50/50 flex flex-col justify-between gap-3">
                <div className="space-y-1.5">
                  <div className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-700 flex items-center justify-center">
                    <UserCheck className="w-4 h-4" />
                  </div>
                  <h3 className="text-sm font-bold text-slate-800">5. Check-in & xác minh biên bản bàn giao</h3>
                  <p className="text-xs text-slate-500 leading-relaxed">
                    Xác minh danh tính sinh viên tại quầy, kiểm kê trang thiết bị và cấp phát thẻ từ ra vào.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setViewMode('portal')}
                  className="bg-[#F26522] hover:bg-[#d95314] text-white px-4 py-2 rounded-lg font-medium text-xs sm:text-sm transition-colors inline-flex items-center justify-center gap-1.5 shadow-sm w-full"
                >
                  Xác nhận nhận phòng tại quầy
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
