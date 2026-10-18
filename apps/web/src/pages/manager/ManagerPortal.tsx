// ──────────────────────────────────────────────────────────────
//  ManagerPortal.tsx — CampusStay FPT Manager Governance Portal
//  Enterprise UI for governance and approval duties:
//  1. Approve/Reject Dormitory Applications
//  2. Review/Approve Room Assignment Proposals
//  3. Approve/Reject Room Change Requests
//  4. Approve Maintenance Schedules
//  5. Monitor Occupancy & Reports
// ──────────────────────────────────────────────────────────────

import { useState } from 'react';
import {
  FileText,
  Layers,
  ArrowLeftRight,
  CalendarClock,
  BarChart3,
  CheckCircle2,
  XCircle,
  ShieldCheck,
} from 'lucide-react';
import clsx from 'clsx';
import {
  MANAGER_APPLICATIONS,
  MANAGER_ASSIGNMENT_PROPOSALS,
  MANAGER_ROOM_CHANGES,
  MANAGER_MAINTENANCE_SCHEDULES,
  type ManagerAppApproval,
  type ManagerBatchAssignment,
  type ManagerRoomChange,
  type ManagerMaintenanceSchedule,
} from './managerMockData';
import { ManagerReportsTab } from './ManagerReportsTab';

type ManagerTab = 'applications' | 'assignments' | 'roomChanges' | 'schedules' | 'reports';

export function ManagerPortal() {
  const [activeTab, setActiveTab] = useState<ManagerTab>('applications');
  const [applications, setApplications] = useState<ManagerAppApproval[]>(MANAGER_APPLICATIONS);
  const [batches, setBatches] = useState<ManagerBatchAssignment[]>(MANAGER_ASSIGNMENT_PROPOSALS);
  const [roomChanges, setRoomChanges] = useState<ManagerRoomChange[]>(MANAGER_ROOM_CHANGES);
  const [schedules, setSchedules] = useState<ManagerMaintenanceSchedule[]>(MANAGER_MAINTENANCE_SCHEDULES);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  // Approval Handlers
  const handleAppApplication = (code: string, decision: 'APPROVED' | 'REJECTED') => {
    setApplications((prev) =>
      prev.map((app) => (app.code === code ? { ...app, decision } : app))
    );
    showToast(
      decision === 'APPROVED'
        ? `Đã phê duyệt hồ sơ ${code}. Hệ thống tự động tạo hợp đồng và gửi thông báo cho sinh viên.`
        : `Đã từ chối hồ sơ ${code}. Quyết định và lý do đã được lưu vào nhật ký kiểm toán.`
    );
  };

  const handleAppBatch = (batchCode: string, decision: 'APPROVED' | 'REJECTED') => {
    setBatches((prev) =>
      prev.map((b) => (b.batchCode === batchCode ? { ...b, decision } : b))
    );
    showToast(
      decision === 'APPROVED'
        ? `Đã phê duyệt đợt xếp phòng ${batchCode}. Hợp đồng điện tử đã được phát hành hàng loạt.`
        : `Đã hoàn trả đợt xếp phòng ${batchCode} cho Staff để rà soát lại.`
    );
  };

  const handleAppRoomChange = (id: string, decision: 'APPROVED' | 'REJECTED') => {
    setRoomChanges((prev) =>
      prev.map((r) => (r.id === id ? { ...r, decision } : r))
    );
    showToast(
      decision === 'APPROVED'
        ? `Đã phê duyệt yêu cầu đổi phòng ${id}. Dữ liệu giường và phòng đã được cập nhật.`
        : `Đã từ chối yêu cầu đổi phòng ${id}.`
    );
  };

  const handleAppSchedule = (id: string, decision: 'APPROVED' | 'REJECTED') => {
    setSchedules((prev) =>
      prev.map((s) => (s.id === id ? { ...s, decision } : s))
    );
    showToast(
      decision === 'APPROVED'
        ? `Đã phê duyệt lịch bảo trì ${id}. Thông báo đã được gửi đến sinh viên các phòng bị ảnh hưởng.`
        : `Đã hoàn trả lịch bảo trì ${id}.`
    );
  };

  const pendingAppsCount = applications.filter((a) => a.decision === 'PENDING').length;
  const pendingBatchesCount = batches.filter((b) => b.decision === 'PENDING').length;
  const pendingChangesCount = roomChanges.filter((r) => r.decision === 'PENDING').length;
  const pendingSchedulesCount = schedules.filter((s) => s.decision === 'PENDING').length;

  return (
    <div className="space-y-6">
      {/* ── Governance Header ── */}
      <div className="bg-white rounded-2xl border border-line/80 p-5 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3.5">
            <div className="w-12 h-12 rounded-xl bg-blue-100 text-ink font-bold text-base flex items-center justify-center shrink-0">
              HN
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h1 className="text-xl font-bold text-ink">ThS. Hoàng Nam</h1>
                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-blue-50 text-blue-700 text-xs font-semibold border border-blue-200">
                  <ShieldCheck className="w-3.5 h-3.5 text-blue-600" />
                  Trưởng Ban Quản lý KTX
                </span>
              </div>
              <p className="text-xs text-ink-muted mt-1">
                FPT University HCMC / Tân Uyên • Thẩm quyền: Phê duyệt hồ sơ, xếp phòng, đổi phòng & lịch kỹ thuật
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <div className="px-3 py-1.5 rounded-lg bg-surface-muted border border-line text-xs text-ink-muted font-medium">
              Chế độ thẩm quyền: <strong className="text-ink">Governance & Approvals</strong>
            </div>
          </div>
        </div>
      </div>

      {/* ── 5 Core Governance Navigation Tabs ── */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
        {[
          { key: 'applications' as ManagerTab, label: 'Duyệt đơn đăng ký KTX', icon: FileText, count: pendingAppsCount },
          { key: 'assignments' as ManagerTab, label: 'Duyệt phân bổ xếp phòng', icon: Layers, count: pendingBatchesCount },
          { key: 'roomChanges' as ManagerTab, label: 'Duyệt đổi phòng', icon: ArrowLeftRight, count: pendingChangesCount },
          { key: 'schedules' as ManagerTab, label: 'Duyệt lịch bảo trì định kỳ', icon: CalendarClock, count: pendingSchedulesCount },
          { key: 'reports' as ManagerTab, label: 'Giám sát công suất & Báo cáo', icon: BarChart3, count: 0 },
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
                  ? 'bg-ink text-white border-ink shadow-xs'
                  : 'bg-white text-ink-muted border-line/80 hover:bg-surface-muted hover:text-ink'
              )}
            >
              <Icon className={clsx('w-4 h-4', isActive ? 'text-orange-400' : 'text-ink-subtle')} />
              <span>{tab.label}</span>
              {tab.count > 0 && (
                <span
                  className={clsx(
                    'px-2 py-0.5 rounded-full text-label font-bold',
                    isActive ? 'bg-brand-ink text-white' : 'bg-surface-sunken text-ink'
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

      {/* 1. Approve/Reject Dormitory Applications */}
      {activeTab === 'applications' && (
        <div className="space-y-4">
          <div>
            <h2 className="text-base font-bold text-ink">Phê Duyệt Đơn Đăng Ký Ký Túc Xá</h2>
            <p className="text-xs text-ink-muted mt-0.5">
              Các hồ sơ có trường hợp đặc thù đã qua Staff rà soát đề xuất — Quyết định sẽ tự động cập nhật hợp đồng và thông báo
            </p>
          </div>

          <div className="grid grid-cols-1 gap-4">
            {applications.map((app) => (
              <div
                key={app.code}
                className="bg-white rounded-2xl border border-line/80 p-5 shadow-xs hover:border-line-strong transition-all space-y-4"
              >
                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
                  <div>
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-mono text-xs font-bold text-ink bg-surface-sunken px-2 py-0.5 rounded">
                        {app.code}
                      </span>
                      <h3 className="text-sm font-bold text-ink">{app.studentName}</h3>
                      <span className="text-xs text-ink-muted">MSSV: {app.studentId}</span>
                      <span className="text-xs text-ink-subtle">•</span>
                      <span className="text-xs text-ink-muted">{app.major}</span>
                    </div>
                    <div className="text-xs text-ink-muted mt-1">
                      Loại phòng đề xuất: <strong className="text-ink">{app.roomType}</strong>
                    </div>
                  </div>

                  <span
                    className={clsx(
                      'px-2.5 py-1 rounded-full text-xs font-semibold shrink-0',
                      app.decision === 'APPROVED'
                        ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                        : app.decision === 'REJECTED'
                        ? 'bg-rose-50 text-rose-700 border border-rose-200'
                        : 'bg-amber-50 text-amber-700 border border-amber-200'
                    )}
                  >
                    {app.decision === 'APPROVED'
                      ? 'Đã phê duyệt'
                      : app.decision === 'REJECTED'
                      ? 'Đã từ chối'
                      : 'Chờ quyết định'}
                  </span>
                </div>

                {/* Flag & Staff Recommendation */}
                <div className="space-y-2 text-xs">
                  <div className="p-3 rounded-xl bg-surface-muted border border-line/80 text-ink">
                    <span className="font-bold text-ink">Nội dung đối soát: </span>
                    {app.flagDescription}
                  </div>
                  <div className="p-3 rounded-xl bg-blue-50/60 border border-blue-200/70 text-blue-900">
                    <span className="font-bold text-blue-950">Ý kiến đề xuất từ Staff ({app.reviewedByStaff}): </span>
                    {app.staffRecommendation}
                  </div>
                </div>

                {/* Documents & Action Buttons */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-3 border-t border-line">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-xs text-ink-subtle font-medium">Hồ sơ đính kèm:</span>
                    {app.documents.map((doc, idx) => (
                      <span
                        key={idx}
                        className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-surface-sunken hover:bg-line text-ink text-xs font-mono transition-colors"
                      >
                        <FileText className="w-3.5 h-3.5 text-ink-muted" />
                        {doc}
                      </span>
                    ))}
                  </div>

                  <div className="flex items-center gap-2 self-end sm:self-auto">
                    {app.decision === 'PENDING' ? (
                      <>
                        <button
                          type="button"
                          onClick={() => handleAppApplication(app.code, 'REJECTED')}
                          className="border border-line bg-white hover:bg-surface-muted hover:border-line-strong text-ink px-4 py-2 rounded-lg font-medium text-xs sm:text-sm transition-colors inline-flex items-center justify-center gap-1.5"
                        >
                          <XCircle className="w-4 h-4 text-rose-600" />
                          Từ chối
                        </button>
                        <button
                          type="button"
                          onClick={() => handleAppApplication(app.code, 'APPROVED')}
                          className="bg-brand-ink hover:bg-brand-ink-hover text-white px-4 py-2 rounded-lg font-medium text-xs sm:text-sm transition-colors inline-flex items-center justify-center gap-1.5 shadow-sm"
                        >
                          <CheckCircle2 className="w-4 h-4" />
                          Phê duyệt
                        </button>
                      </>
                    ) : (
                      <span className="text-xs font-semibold text-ink-muted">
                        Đã ghi nhận nhật ký kiểm toán quản trị
                      </span>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 2. Review/Approve Room Assignment Proposals */}
      {activeTab === 'assignments' && (
        <div className="space-y-4">
          <div>
            <h2 className="text-base font-bold text-ink">Phê Duyệt Đề Xuất Phân Bổ Phòng (Batch Run)</h2>
            <p className="text-xs text-ink-muted mt-0.5">
              Ký duyệt kết quả phân bổ phòng tự động sau khi Staff đã rà soát và xử lý các ngoại lệ
            </p>
          </div>

          <div className="space-y-4">
            {batches.map((b) => (
              <div
                key={b.batchCode}
                className="bg-white rounded-2xl border border-line/80 p-5 shadow-xs space-y-4"
              >
                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-xs font-bold text-brand-ink bg-orange-50 px-2 py-0.5 rounded">
                        {b.batchCode}
                      </span>
                      <h3 className="text-base font-bold text-ink">{b.title}</h3>
                    </div>
                    <p className="text-xs text-ink-muted mt-1">
                      Học kỳ: <strong>{b.semester}</strong> • Rà soát kỹ thuật bởi: <strong>{b.reviewedByStaff}</strong>
                    </p>
                  </div>

                  <span
                    className={clsx(
                      'px-2.5 py-1 rounded-full text-xs font-semibold shrink-0',
                      b.decision === 'APPROVED'
                        ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                        : b.decision === 'REJECTED'
                        ? 'bg-rose-50 text-rose-700 border border-rose-200'
                        : 'bg-amber-50 text-amber-700 border border-amber-200'
                    )}
                  >
                    {b.decision === 'APPROVED'
                      ? 'Đã phê duyệt phát hành'
                      : b.decision === 'REJECTED'
                      ? 'Yêu cầu điều chỉnh'
                      : 'Chờ Manager phê duyệt'}
                  </span>
                </div>

                {/* Key Metrics Grid */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
                  <div className="p-3 rounded-xl bg-surface-muted border border-line/70">
                    <div className="text-ink-subtle font-medium">Tổng chỗ phân bổ</div>
                    <div className="text-lg font-bold text-ink mt-0.5">{b.totalAllocations} sinh viên</div>
                  </div>
                  <div className="p-3 rounded-xl bg-emerald-50/60 border border-emerald-200/70">
                    <div className="text-emerald-700 font-medium">Tỷ lệ đúng nguyện vọng</div>
                    <div className="text-lg font-bold text-emerald-800 mt-0.5">{b.matchRate}%</div>
                  </div>
                  <div className="p-3 rounded-xl bg-blue-50/60 border border-blue-200/70">
                    <div className="text-blue-700 font-medium">Xung đột đã giải quyết</div>
                    <div className="text-lg font-bold text-blue-800 mt-0.5">{b.resolvedConflicts} trường hợp</div>
                  </div>
                  <div className="p-3 rounded-xl bg-purple-50/60 border border-purple-200/70">
                    <div className="text-purple-700 font-medium">Ngoại lệ tồn đọng</div>
                    <div className="text-lg font-bold text-purple-800 mt-0.5">{b.remainingExceptions}</div>
                  </div>
                </div>

                {/* Highlight Points */}
                <div className="p-3.5 rounded-xl bg-surface-muted border border-line text-xs text-ink space-y-1">
                  {b.highlights.map((h, idx) => (
                    <div key={idx} className="flex items-center gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-brand-ink shrink-0" />
                      <span>{h}</span>
                    </div>
                  ))}
                </div>

                <div className="flex items-center justify-end gap-2 pt-3 border-t border-line">
                  {b.decision === 'PENDING' ? (
                    <>
                      <button
                        type="button"
                        onClick={() => handleAppBatch(b.batchCode, 'REJECTED')}
                        className="border border-line bg-white hover:bg-surface-muted hover:border-line-strong text-ink px-4 py-2 rounded-lg font-medium text-xs sm:text-sm transition-colors inline-flex items-center justify-center gap-1.5"
                      >
                        Yêu cầu Staff rà soát lại
                      </button>
                      <button
                        type="button"
                        onClick={() => handleAppBatch(b.batchCode, 'APPROVED')}
                        className="bg-brand-ink hover:bg-brand-ink-hover text-white px-4 py-2 rounded-lg font-medium text-xs sm:text-sm transition-colors inline-flex items-center justify-center gap-1.5 shadow-sm"
                      >
                        <CheckCircle2 className="w-4 h-4" />
                        Phê duyệt & Phát hành hợp đồng điện tử
                      </button>
                    </>
                  ) : (
                    <span className="text-xs font-semibold text-emerald-700 flex items-center gap-1">
                      <CheckCircle2 className="w-4 h-4" /> Đã hoàn tất ký duyệt đợt xếp phòng
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 3. Approve/Reject Room Change Requests */}
      {activeTab === 'roomChanges' && (
        <div className="space-y-4">
          <div>
            <h2 className="text-base font-bold text-ink">Phê Duyệt Đổi & Hoán Đổi Phòng KTX</h2>
            <p className="text-xs text-ink-muted mt-0.5">
              Xác thực tính hợp lệ giữa các bên sinh viên thỏa thuận và phê duyệt cập nhật hệ thống
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {roomChanges.map((change) => (
              <div
                key={change.id}
                className="bg-white rounded-2xl border border-line/80 p-5 shadow-xs space-y-4"
              >
                <div className="flex items-center justify-between">
                  <span className="font-mono text-xs font-bold text-ink bg-surface-sunken px-2 py-0.5 rounded">
                    {change.id} • {change.kind}
                  </span>
                  <span
                    className={clsx(
                      'px-2.5 py-1 rounded-full text-xs font-semibold',
                      change.decision === 'APPROVED'
                        ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                        : change.decision === 'REJECTED'
                        ? 'bg-rose-50 text-rose-700 border border-rose-200'
                        : 'bg-amber-50 text-amber-700 border border-amber-200'
                    )}
                  >
                    {change.decision === 'APPROVED' ? 'Đã duyệt' : change.decision === 'REJECTED' ? 'Từ chối' : 'Chờ duyệt'}
                  </span>
                </div>

                {/* Transfer Diagram */}
                <div className="flex items-center gap-2 text-xs">
                  <div className="flex-1 p-3 rounded-xl bg-surface-muted border border-line/80">
                    <div className="font-bold text-ink">{change.studentA.name}</div>
                    <div className="text-ink-muted">{change.studentA.studentId}</div>
                    <div className="text-blue-700 font-semibold mt-1">Phòng hiện tại: {change.studentA.room}</div>
                  </div>

                  <div className="shrink-0 w-8 h-8 rounded-full bg-purple-50 text-purple-600 flex items-center justify-center">
                    <ArrowLeftRight className="w-4 h-4" />
                  </div>

                  <div className="flex-1 p-3 rounded-xl bg-surface-muted border border-line/80">
                    {change.studentB ? (
                      <>
                        <div className="font-bold text-ink">{change.studentB.name}</div>
                        <div className="text-ink-muted">{change.studentB.studentId}</div>
                        <div className="text-blue-700 font-semibold mt-1">Phòng hiện tại: {change.studentB.room}</div>
                      </>
                    ) : (
                      <>
                        <div className="font-bold text-ink">Phòng chuyển đến</div>
                        <div className="text-blue-700 font-semibold mt-1">{change.targetRoom}</div>
                      </>
                    )}
                  </div>
                </div>

                <div className="text-xs text-ink-muted">
                  <strong>Lý do sinh viên:</strong> {change.reason}
                </div>

                <div className="p-2.5 rounded-lg bg-emerald-50 border border-emerald-200 text-xs text-emerald-900 flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>{change.staffVerificationNote}</span>
                </div>

                <div className="flex items-center justify-end gap-2 pt-3 border-t border-line">
                  {change.decision === 'PENDING' ? (
                    <>
                      <button
                        type="button"
                        onClick={() => handleAppRoomChange(change.id, 'REJECTED')}
                        className="border border-line bg-white hover:bg-surface-muted hover:border-line-strong text-ink px-4 py-2 rounded-lg font-medium text-xs sm:text-sm transition-colors inline-flex items-center justify-center gap-1.5"
                      >
                        Từ chối
                      </button>
                      <button
                        type="button"
                        onClick={() => handleAppRoomChange(change.id, 'APPROVED')}
                        className="bg-brand-ink hover:bg-brand-ink-hover text-white px-4 py-2 rounded-lg font-medium text-xs sm:text-sm transition-colors inline-flex items-center justify-center gap-1.5 shadow-sm"
                      >
                        <CheckCircle2 className="w-4 h-4" />
                        Phê duyệt đổi phòng
                      </button>
                    </>
                  ) : (
                    <span className="text-xs font-semibold text-ink-muted">Đã cập nhật hệ thống</span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 4. Approve Maintenance Schedules */}
      {activeTab === 'schedules' && (
        <div className="space-y-4">
          <div>
            <h2 className="text-base font-bold text-ink">Phê Duyệt Lịch Bảo Trì Kỹ Thuật Định Kỳ</h2>
            <p className="text-xs text-ink-muted mt-0.5">
              Phê duyệt kế hoạch can thiệp kỹ thuật quy mô tòa nhà nhằm giảm thiểu ảnh hưởng sinh hoạt của sinh viên
            </p>
          </div>

          <div className="grid grid-cols-1 gap-4">
            {schedules.map((item) => (
              <div
                key={item.id}
                className="bg-white rounded-2xl border border-line/80 p-5 shadow-xs space-y-3"
              >
                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-xs font-bold text-ink bg-surface-sunken px-2 py-0.5 rounded">
                        {item.id}
                      </span>
                      <h3 className="text-sm font-bold text-ink">{item.title}</h3>
                    </div>
                    <div className="text-xs text-ink-muted mt-1">
                      Phạm vi: <strong className="text-ink">{item.scope}</strong> • Chu kỳ: {item.recurrence}
                    </div>
                    <div className="text-xs text-blue-700 font-medium mt-0.5">
                      Thời gian thi công: {item.executionWindow}
                    </div>
                  </div>

                  <span
                    className={clsx(
                      'px-2.5 py-1 rounded-full text-xs font-semibold shrink-0',
                      item.decision === 'APPROVED'
                        ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                        : item.decision === 'REJECTED'
                        ? 'bg-rose-50 text-rose-700 border border-rose-200'
                        : 'bg-amber-50 text-amber-700 border border-amber-200'
                    )}
                  >
                    {item.decision === 'APPROVED' ? 'Đã duyệt lịch' : item.decision === 'REJECTED' ? 'Từ chối' : 'Chờ phê duyệt'}
                  </span>
                </div>

                <div className="p-3 rounded-xl bg-amber-50 border border-amber-200 text-xs text-amber-900 leading-relaxed">
                  <strong>Thông báo ảnh hưởng:</strong> {item.studentImpactNotice}
                </div>

                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-3 border-t border-line text-xs">
                  <span className="text-ink-muted">Đề xuất bởi: <strong className="text-ink">{item.proposer}</strong></span>

                  <div className="flex items-center gap-2">
                    {item.decision === 'PENDING' ? (
                      <>
                        <button
                          type="button"
                          onClick={() => handleAppSchedule(item.id, 'REJECTED')}
                          className="border border-line bg-white hover:bg-surface-muted hover:border-line-strong text-ink px-4 py-2 rounded-lg font-medium text-xs sm:text-sm transition-colors inline-flex items-center justify-center gap-1.5"
                        >
                          Hoàn trả điều chỉnh
                        </button>
                        <button
                          type="button"
                          onClick={() => handleAppSchedule(item.id, 'APPROVED')}
                          className="bg-brand-ink hover:bg-brand-ink-hover text-white px-4 py-2 rounded-lg font-medium text-xs sm:text-sm transition-colors inline-flex items-center justify-center gap-1.5 shadow-sm"
                        >
                          <CheckCircle2 className="w-4 h-4" />
                          Phê duyệt lịch & Phát thông báo
                        </button>
                      </>
                    ) : (
                      <span className="text-xs font-semibold text-emerald-700 flex items-center gap-1">
                        <CheckCircle2 className="w-4 h-4" /> Lịch đã đưa vào hệ thống điều phối
                      </span>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 5. Monitor Occupancy & Reports */}
      {activeTab === 'reports' && <ManagerReportsTab />}

      {/* ── Toast Notification ── */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-ink text-white px-5 py-3 rounded-xl shadow-lg text-xs sm:text-sm flex items-center gap-2.5 border border-white/10 animate-fade-in">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}
    </div>
  );
}
