// ──────────────────────────────────────────────────────────────
//  StaffPortal.tsx — CampusStay FPT Staff Operational Portal
//  Enterprise UI for operational execution across all 5 core duties:
//  1. Review Dormitory Applications
//  2. Update Room & Bed Status
//  3. Review/Adjust Room Assignment Proposals
//  4. Handle Maintenance Requests & Inspections
//  5. Process Manual/Late Check-In & Room Condition Handover
// ──────────────────────────────────────────────────────────────

import { useState } from 'react';
import {
  FileText,
  Bed,
  Layers,
  Wrench,
  UserCheck,
  CheckCircle2,
  Send,
  Clock,
  MapPin,
  ShieldCheck,
  CheckSquare,
} from 'lucide-react';
import clsx from 'clsx';
import {
  STAFF_APPLICATIONS,
  STAFF_ROOMS,
  STAFF_ASSIGNMENT_PROPOSAL,
  STAFF_MAINTENANCE_TASKS,
  STAFF_MANUAL_CHECKINS,
  type ApplicationReviewItem,
  type MaintenanceInspectionItem,
} from './staffMockData';
import { StaffCheckinTab } from './StaffCheckinTab';

type StaffTab = 'applications' | 'rooms' | 'assignment' | 'maintenance' | 'checkin';

export function StaffPortal() {
  const [activeTab, setActiveTab] = useState<StaffTab>('applications');
  const [applications, setApplications] = useState<ApplicationReviewItem[]>(STAFF_APPLICATIONS);
  const [rooms, setRooms] = useState(STAFF_ROOMS);
  const [assignment, setAssignment] = useState(STAFF_ASSIGNMENT_PROPOSAL);
  const [maintenanceTasks, setMaintenanceTasks] = useState<MaintenanceInspectionItem[]>(STAFF_MAINTENANCE_TASKS);
  const [checkins, setCheckins] = useState(STAFF_MANUAL_CHECKINS);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  // Handlers for Operational Actions
  const handleVerifyApplication = (code: string) => {
    setApplications((prev) =>
      prev.map((app) => (app.code === code ? { ...app, status: 'VERIFIED' } : app))
    );
    showToast(`Đã xác nhận hợp lệ hồ sơ ${code}. Đơn đủ điều kiện vào vòng phân bổ.`);
  };

  const handleEscalateApplication = (code: string) => {
    setApplications((prev) =>
      prev.map((app) => (app.code === code ? { ...app, status: 'ESCALATED' } : app))
    );
    showToast(`Đã chuyển hồ sơ ${code} lên Manager xem xét phê duyệt.`);
  };

  const handleToggleBedMaintenance = (roomNum: string, bedId: string) => {
    setRooms((prev) =>
      prev.map((r) => {
        if (r.roomNumber !== roomNum) return r;
        return {
          ...r,
          beds: r.beds.map((b) => {
            if (b.bedId !== bedId) return b;
            const newStatus = b.status === 'MAINTENANCE' ? 'AVAILABLE' : 'MAINTENANCE';
            return { ...b, status: newStatus };
          }),
        };
      })
    );
    showToast(`Đã cập nhật trạng thái giường tại phòng ${roomNum}.`);
  };

  const handleResolveConflict = (conflictId: string) => {
    setAssignment((prev) => ({
      ...prev,
      conflicts: prev.conflicts.map((c) =>
        c.id === conflictId ? { ...c, isResolved: true } : c
      ),
    }));
    showToast('Đã ghi nhận phương án điều chỉnh xung đột xếp phòng.');
  };

  const handleForwardProposalToManager = () => {
    setAssignment((prev) => ({ ...prev, status: 'SUBMITTED_TO_MANAGER' }));
    showToast('Đã gửi toàn bộ đề xuất xếp phòng BR-SP27-02 sang Manager để phê duyệt.');
  };

  const handleProgressMaintenance = (id: string) => {
    setMaintenanceTasks((prev) =>
      prev.map((m) => {
        if (m.id !== id) return m;
        const nextStatus = m.status === 'PENDING' ? 'IN_PROGRESS' : 'VERIFIED_DONE';
        return { ...m, status: nextStatus };
      })
    );
    showToast('Đã cập nhật tiến độ xử lý ticket bảo trì.');
  };

  const handleCompleteCheckin = (id: string) => {
    setCheckins((prev) =>
      prev.map((c) => (c.id === id ? { ...c, status: 'COMPLETED' } : c))
    );
    showToast('Đã hoàn tất xác thực tình trạng phòng và bàn giao chìa khóa/thẻ từ cho sinh viên.');
  };

  return (
    <div className="space-y-6">
      {/* ── Operational Header & Profile ── */}
      <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3.5">
            <div className="w-12 h-12 rounded-xl bg-orange-100 text-[#F26522] font-bold text-base flex items-center justify-center shrink-0">
              VC
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h1 className="text-xl font-bold text-[#1A365D]">Trần Văn Cường</h1>
                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 text-xs font-semibold border border-emerald-200">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                  Cán bộ Vận hành KTX
                </span>
              </div>
              <div className="flex items-center gap-4 text-xs text-slate-500 mt-1 flex-wrap">
                <span className="flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5 text-slate-400" />
                  FPT University HCMC / Tân Uyên
                </span>
                <span className="text-slate-300">|</span>
                <span className="flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5 text-slate-400" />
                  Ca trực: 07:30 – 17:00
                </span>
                <span className="text-slate-300">|</span>
                <span className="capitalize">{new Date().toLocaleDateString('vi-VN', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}</span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <div className="px-3 py-1.5 rounded-lg bg-slate-50 border border-slate-200 text-xs text-slate-600 font-medium">
              Chế độ tác nghiệp: <strong className="text-slate-800">Operational Staff</strong>
            </div>
          </div>
        </div>
      </div>

      {/* ── 5 Core Operational Navigation Tabs ── */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
        {[
          { key: 'applications' as StaffTab, label: 'Thẩm định hồ sơ', icon: FileText, count: applications.filter((a) => a.status === 'PENDING_REVIEW').length },
          { key: 'rooms' as StaffTab, label: 'Trạng thái phòng & giường', icon: Bed, count: rooms.length },
          { key: 'assignment' as StaffTab, label: 'Rà soát phân bổ phòng', icon: Layers, count: assignment.conflicts.filter((c) => !c.isResolved).length },
          { key: 'maintenance' as StaffTab, label: 'Bảo trì & Kiểm tra', icon: Wrench, count: maintenanceTasks.filter((m) => m.status !== 'VERIFIED_DONE').length },
          { key: 'checkin' as StaffTab, label: 'Check-in & Bàn giao', icon: UserCheck, count: checkins.filter((c) => c.status !== 'COMPLETED').length },
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.key;
          return (
            <button
              key={tab.key}
              type="button"
              onClick={() => setActiveTab(tab.key)}
              className={clsx(
                'flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition-all whitespace-nowrap shrink-0 border',
                isActive
                  ? 'bg-[#1A365D] text-white border-[#1A365D] shadow-xs'
                  : 'bg-white text-slate-600 border-slate-200/80 hover:bg-slate-50 hover:text-slate-900'
              )}
            >
              <Icon className={clsx('w-4 h-4', isActive ? 'text-orange-400' : 'text-slate-400')} />
              <span>{tab.label}</span>
              {tab.count > 0 && (
                <span
                  className={clsx(
                    'px-2 py-0.5 rounded-full text-[11px] font-bold',
                    isActive ? 'bg-[#F26522] text-white' : 'bg-slate-100 text-slate-700'
                  )}
                >
                  {tab.count}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* ── Tab Content ── */}

      {/* 1. Review Dormitory Applications */}
      {activeTab === 'applications' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-base font-bold text-[#1A365D]">Hồ Sơ Đăng Ký Chờ Thẩm Định</h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Rà soát các hồ sơ có ghi chú hoặc đề nghị ưu tiên đặc thù trước khi chuyển vào xếp phòng
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-4">
            {applications.map((app) => (
              <div
                key={app.code}
                className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-xs hover:border-slate-300 transition-all space-y-4"
              >
                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
                  <div>
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-mono text-xs font-bold text-[#1A365D] bg-slate-100 px-2 py-0.5 rounded">
                        {app.code}
                      </span>
                      <h3 className="text-sm font-bold text-slate-900">{app.studentName}</h3>
                      <span className="text-xs text-slate-500">MSSV: {app.studentId}</span>
                      <span className="text-xs text-slate-400">•</span>
                      <span className="text-xs text-slate-600">{app.major}</span>
                    </div>
                    <div className="text-xs text-slate-500 mt-1">
                      Loại phòng đăng ký: <strong className="text-slate-700">{app.roomTypeRequested}</strong> • Nộp lúc: {app.submittedAt}
                    </div>
                  </div>

                  <span
                    className={clsx(
                      'px-2.5 py-1 rounded-full text-xs font-semibold shrink-0',
                      app.status === 'VERIFIED'
                        ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                        : app.status === 'ESCALATED'
                        ? 'bg-purple-50 text-purple-700 border border-purple-200'
                        : 'bg-amber-50 text-amber-700 border border-amber-200'
                    )}
                  >
                    {app.status === 'VERIFIED'
                      ? 'Đã thẩm định hợp lệ'
                      : app.status === 'ESCALATED'
                      ? 'Đã chuyển Manager'
                      : 'Cần thẩm định'}
                  </span>
                </div>

                {app.flagReason && (
                  <div className="p-3 rounded-xl bg-amber-50 border border-amber-200/70 text-xs text-amber-900 leading-relaxed">
                    <strong>Nội dung cần thẩm định:</strong> {app.flagReason}
                  </div>
                )}

                {/* Criteria Checks */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2 text-xs">
                  {app.verificationChecks.map((chk, i) => (
                    <div
                      key={i}
                      className="flex items-center gap-2 p-2 rounded-lg bg-slate-50 border border-slate-100 text-slate-700"
                    >
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                      <span className="truncate">{chk.label}</span>
                    </div>
                  ))}
                </div>

                {/* Documents & Action Buttons */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-3 border-t border-slate-100">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-xs text-slate-400 font-medium">Tài liệu minh chứng:</span>
                    {app.documents.map((doc, idx) => (
                      <span
                        key={idx}
                        className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-mono cursor-pointer transition-colors"
                      >
                        <FileText className="w-3.5 h-3.5 text-slate-500" />
                        {doc}
                      </span>
                    ))}
                  </div>

                  <div className="flex items-center gap-2 self-end sm:self-auto">
                    {app.status === 'PENDING_REVIEW' && (
                      <>
                        <button
                          type="button"
                          onClick={() => handleEscalateApplication(app.code)}
                          className="border border-slate-200 bg-white hover:bg-slate-50 hover:border-slate-300 text-slate-700 px-4 py-2 rounded-lg font-medium text-xs sm:text-sm transition-colors inline-flex items-center justify-center gap-1.5"
                        >
                          <Send className="w-3.5 h-3.5 text-purple-600" />
                          Chuyển Manager
                        </button>
                        <button
                          type="button"
                          onClick={() => handleVerifyApplication(app.code)}
                          className="bg-[#F26522] hover:bg-[#d95314] text-white px-4 py-2 rounded-lg font-medium text-xs sm:text-sm transition-colors inline-flex items-center justify-center gap-1.5 shadow-sm"
                        >
                          <CheckCircle2 className="w-4 h-4" />
                          Xác nhận hợp lệ
                        </button>
                      </>
                    )}
                    {app.status === 'VERIFIED' && (
                      <span className="text-xs text-emerald-700 font-semibold flex items-center gap-1">
                        <CheckCircle2 className="w-4 h-4" /> Sẵn sàng cho đợt xếp phòng
                      </span>
                    )}
                    {app.status === 'ESCALATED' && (
                      <span className="text-xs text-purple-700 font-semibold flex items-center gap-1">
                        <Clock className="w-4 h-4" /> Đang chờ quyết định từ Trưởng ban
                      </span>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 2. Update Room & Bed Status */}
      {activeTab === 'rooms' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-base font-bold text-[#1A365D]">Quản Lý Trạng Thái Phòng & Giường</h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Cập nhật nhanh tình trạng sử dụng, khóa giường bảo trì hoặc giải phóng giường sẵn sàng đón sinh viên
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
            {rooms.map((room) => (
              <div
                key={room.roomNumber}
                className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-xs space-y-4"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <div className="w-9 h-9 rounded-lg bg-[#1A365D] text-white font-bold text-sm flex items-center justify-center">
                      {room.roomNumber}
                    </div>
                    <div>
                      <h3 className="text-sm font-bold text-slate-900">{room.building} • Tầng {room.floor}</h3>
                      <p className="text-xs text-slate-500">{room.roomType} • Khu {room.gender}</p>
                    </div>
                  </div>
                  <span className="text-xs font-semibold px-2 py-0.5 rounded bg-slate-100 text-slate-700">
                    {room.beds.filter((b) => b.status === 'AVAILABLE').length}/{room.beds.length} trống
                  </span>
                </div>

                <div className="space-y-2.5 pt-2">
                  {room.beds.map((bed) => (
                    <div
                      key={bed.bedId}
                      className={clsx(
                        'p-3 rounded-xl border flex items-center justify-between gap-3 text-xs transition-colors',
                        bed.status === 'AVAILABLE'
                          ? 'bg-emerald-50/40 border-emerald-200/80'
                          : bed.status === 'OCCUPIED'
                          ? 'bg-slate-50 border-slate-200/80'
                          : bed.status === 'MAINTENANCE'
                          ? 'bg-rose-50/50 border-rose-200'
                          : 'bg-amber-50/50 border-amber-200'
                      )}
                    >
                      <div className="min-w-0">
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-slate-800">{bed.bedCode}</span>
                          <span
                            className={clsx(
                              'text-[10px] font-bold px-1.5 py-0.2 rounded',
                              bed.status === 'AVAILABLE'
                                ? 'bg-emerald-100 text-emerald-800'
                                : bed.status === 'OCCUPIED'
                                ? 'bg-slate-200 text-slate-700'
                                : bed.status === 'MAINTENANCE'
                                ? 'bg-rose-100 text-rose-800'
                                : 'bg-amber-100 text-amber-800'
                            )}
                          >
                            {bed.status === 'AVAILABLE'
                              ? 'Còn trống'
                              : bed.status === 'OCCUPIED'
                              ? 'Đang ở'
                              : bed.status === 'MAINTENANCE'
                              ? 'Bảo trì'
                              : 'Đang giữ chỗ'}
                          </span>
                        </div>
                        {bed.occupant && (
                          <p className="text-slate-500 truncate mt-0.5">
                            {bed.occupant.name} ({bed.occupant.studentId})
                          </p>
                        )}
                        {bed.status === 'AVAILABLE' && (
                          <p className="text-emerald-700 mt-0.5 font-medium">Sẵn sàng tiếp nhận sinh viên</p>
                        )}
                      </div>

                      <div className="shrink-0">
                        {bed.status !== 'OCCUPIED' && (
                          <button
                            type="button"
                            onClick={() => handleToggleBedMaintenance(room.roomNumber, bed.bedId)}
                            className={clsx(
                              'px-3 py-1.5 rounded-lg text-xs font-medium border transition-colors',
                              bed.status === 'MAINTENANCE'
                                ? 'border-emerald-300 bg-white text-emerald-700 hover:bg-emerald-50'
                                : 'border-rose-200 bg-white text-rose-700 hover:bg-rose-50'
                            )}
                          >
                            {bed.status === 'MAINTENANCE' ? 'Mở lại giường' : 'Khóa bảo trì'}
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 3. Review/Adjust Room Assignment Proposal */}
      {activeTab === 'assignment' && (
        <div className="space-y-4">
          <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-xs">
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-mono text-xs font-bold text-[#F26522] bg-orange-50 px-2 py-0.5 rounded">
                    {assignment.batchCode}
                  </span>
                  <h2 className="text-base font-bold text-[#1A365D]">{assignment.title}</h2>
                </div>
                <p className="text-xs text-slate-500 mt-1">
                  Đã phân bổ <strong>{assignment.totalAllocations}</strong> chỗ ở • Tỷ lệ đáp ứng nguyện vọng: <strong>{assignment.matchRate}%</strong>
                </p>
              </div>

              <div className="flex items-center gap-3">
                {assignment.status === 'SUBMITTED_TO_MANAGER' ? (
                  <span className="px-3 py-2 rounded-lg bg-purple-50 text-purple-700 text-xs font-semibold border border-purple-200 flex items-center gap-1.5">
                    <Clock className="w-4 h-4" /> Đã gửi Manager phê duyệt
                  </span>
                ) : (
                  <button
                    type="button"
                    onClick={handleForwardProposalToManager}
                    className="bg-[#F26522] hover:bg-[#d95314] text-white px-4 py-2 rounded-lg font-medium text-xs sm:text-sm transition-colors inline-flex items-center justify-center gap-1.5 shadow-sm"
                  >
                    <Send className="w-4 h-4" />
                    Chuyển Manager phê duyệt
                  </button>
                )}
              </div>
            </div>
          </div>

          <div className="space-y-3">
            <h3 className="text-sm font-bold text-[#1A365D]">Danh sách xung đột cần cán bộ điều chỉnh</h3>
            {assignment.conflicts.map((conf) => (
              <div
                key={conf.id}
                className={clsx(
                  'bg-white rounded-2xl border p-5 shadow-xs transition-all space-y-3',
                  conf.isResolved ? 'border-emerald-200 bg-emerald-50/20' : 'border-amber-200'
                )}
              >
                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-2">
                  <div>
                    <h4 className="text-sm font-bold text-slate-800">{conf.studentName}</h4>
                    <p className="text-xs text-amber-800 mt-1 font-medium">
                      <strong>Vấn đề:</strong> {conf.issue}
                    </p>
                  </div>
                  <span
                    className={clsx(
                      'px-2.5 py-1 rounded-full text-xs font-semibold shrink-0',
                      conf.isResolved ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
                    )}
                  >
                    {conf.isResolved ? 'Đã giải quyết' : 'Cần xử lý'}
                  </span>
                </div>

                <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-700 flex items-center justify-between gap-3">
                  <div>
                    <span className="font-semibold text-slate-800">Phương án điều chỉnh đề xuất: </span>
                    {conf.proposedResolution}
                  </div>
                  {!conf.isResolved && (
                    <button
                      type="button"
                      onClick={() => handleResolveConflict(conf.id)}
                      className="border border-slate-200 bg-white hover:bg-slate-50 hover:border-slate-300 text-slate-700 px-4 py-2 rounded-lg font-medium text-xs sm:text-sm transition-colors inline-flex items-center justify-center gap-1.5 shrink-0"
                    >
                      <CheckSquare className="w-4 h-4 text-[#F26522]" />
                      Áp dụng điều chỉnh
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 4. Handle Maintenance Requests & Inspections */}
      {activeTab === 'maintenance' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-base font-bold text-[#1A365D]">Hàng Đợi Xử Lý Bảo Trì & Kiểm Tra Kỹ Thuật</h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Điều phối kỹ thuật viên, theo dõi thời hạn cam kết SLA và nghiệm thu phòng
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-4">
            {maintenanceTasks.map((task) => (
              <div
                key={task.id}
                className={clsx(
                  'bg-white rounded-2xl border p-5 shadow-xs space-y-3 transition-all',
                  task.urgency === 'URGENT' ? 'border-rose-200 border-l-4 border-l-rose-500' : 'border-slate-200/80'
                )}
              >
                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
                  <div>
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-mono text-xs font-bold text-[#1A365D] bg-slate-100 px-2 py-0.5 rounded">
                        {task.ticketCode}
                      </span>
                      <span className="font-bold text-sm text-slate-900">
                        {task.building} • Phòng {task.room}
                      </span>
                      <span className="text-xs px-2 py-0.5 rounded-full bg-blue-50 text-blue-700 font-semibold">
                        {task.category}
                      </span>
                    </div>
                    <p className="text-xs text-slate-700 font-medium mt-1.5">{task.description}</p>
                    <div className="text-[11px] text-slate-400 mt-1">
                      Báo bởi: {task.reportedBy} • Thời điểm: {task.reportedAt}
                    </div>
                  </div>

                  <div className="flex sm:flex-col items-end gap-1.5 shrink-0">
                    <span
                      className={clsx(
                        'px-2.5 py-0.5 rounded-full text-[11px] font-bold',
                        task.urgency === 'URGENT'
                          ? 'bg-rose-100 text-rose-800'
                          : task.urgency === 'HIGH'
                          ? 'bg-amber-100 text-amber-800'
                          : 'bg-slate-100 text-slate-700'
                      )}
                    >
                      {task.urgency === 'URGENT' ? 'Khẩn cấp' : task.urgency === 'HIGH' ? 'Ưu tiên cao' : 'Tiêu chuẩn'}
                    </span>
                    <span className="text-[11px] text-slate-500 font-medium">SLA: {task.slaRemaining}</span>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-3 border-t border-slate-100 text-xs">
                  <div className="flex items-center gap-2 text-slate-600">
                    <Wrench className="w-3.5 h-3.5 text-slate-400" />
                    Kỹ thuật viên phụ trách: <strong className="text-slate-800">{task.assignedTech}</strong>
                  </div>

                  <div className="flex items-center gap-2">
                    {task.status === 'PENDING' && (
                      <button
                        type="button"
                        onClick={() => handleProgressMaintenance(task.id)}
                        className="bg-[#F26522] hover:bg-[#d95314] text-white px-4 py-2 rounded-lg font-medium text-xs sm:text-sm transition-colors inline-flex items-center justify-center gap-1.5 shadow-sm"
                      >
                        Tiếp nhận & Lên lịch
                      </button>
                    )}
                    {task.status === 'IN_PROGRESS' && (
                      <button
                        type="button"
                        onClick={() => handleProgressMaintenance(task.id)}
                        className="bg-[#1A365D] hover:bg-[#0f2341] text-white px-4 py-2 rounded-lg font-medium text-xs sm:text-sm transition-colors inline-flex items-center justify-center gap-1.5 shadow-sm"
                      >
                        <ShieldCheck className="w-4 h-4" />
                        Nghiệm thu hoàn thành
                      </button>
                    )}
                    {task.status === 'VERIFIED_DONE' && (
                      <span className="text-xs text-emerald-700 font-semibold flex items-center gap-1">
                        <CheckCircle2 className="w-4 h-4" /> Đã nghiệm thu & đóng ticket
                      </span>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 5. Process Manual/Late Check-In & Room-Condition Verify */}
      {activeTab === 'checkin' && <StaffCheckinTab checkins={checkins} onComplete={handleCompleteCheckin} />}

      {/* ── Toast Notification ── */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-[#1A365D] text-white px-5 py-3 rounded-xl shadow-lg text-xs sm:text-sm flex items-center gap-2.5 border border-white/10 animate-fade-in">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}
    </div>
  );
}
