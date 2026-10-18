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
import { t } from '@shared-ui';

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
    showToast(t('Application {0} confirmed as valid. It is eligible for the allocation round.', { 0: code }));
  };

  const handleEscalateApplication = (code: string) => {
    setApplications((prev) =>
      prev.map((app) => (app.code === code ? { ...app, status: 'ESCALATED' } : app))
    );
    showToast(t('Application {0} escalated to the manager for approval.', { 0: code }));
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
    showToast(t('Bed status updated in room {0}.', { 0: roomNum }));
  };

  const handleResolveConflict = (conflictId: string) => {
    setAssignment((prev) => ({
      ...prev,
      conflicts: prev.conflicts.map((c) =>
        c.id === conflictId ? { ...c, isResolved: true } : c
      ),
    }));
    showToast(t('Allocation conflict resolution recorded.'));
  };

  const handleForwardProposalToManager = () => {
    setAssignment((prev) => ({ ...prev, status: 'SUBMITTED_TO_MANAGER' }));
    showToast(t('The full allocation proposal BR-SP27-02 has been sent to the manager for approval.'));
  };

  const handleProgressMaintenance = (id: string) => {
    setMaintenanceTasks((prev) =>
      prev.map((m) => {
        if (m.id !== id) return m;
        const nextStatus = m.status === 'PENDING' ? 'IN_PROGRESS' : 'VERIFIED_DONE';
        return { ...m, status: nextStatus };
      })
    );
    showToast(t('Maintenance request progress updated.'));
  };

  const handleCompleteCheckin = (id: string) => {
    setCheckins((prev) =>
      prev.map((c) => (c.id === id ? { ...c, status: 'COMPLETED' } : c))
    );
    showToast(t('Room condition verified and keys/key card handed over to the student.'));
  };

  return (
    <div className="space-y-6">
      {/* ── Operational Header & Profile ── */}
      <div className="bg-surface rounded-2xl border border-line/80 p-5 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3.5">
            <div className="w-12 h-12 rounded-xl bg-orange-100 text-brand-ink font-bold text-base flex items-center justify-center shrink-0">
              VC
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h1 className="text-xl font-bold text-ink">Trần Văn Cường</h1>
                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 text-xs font-semibold border border-emerald-200">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                  {t('Dormitory operations staff')}
                </span>
              </div>
              <div className="flex items-center gap-4 text-xs text-ink-muted mt-1 flex-wrap">
                <span className="flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5 text-ink-subtle" />
                  {t('FPT University HCMC / Tan Uyen')}
                </span>
                <span className="text-ink-subtle">|</span>
                <span className="flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5 text-ink-subtle" />
                  {t('Shift: 07:30 – 17:00')}
                </span>
                <span className="text-ink-subtle">|</span>
                <span className="capitalize">{new Date().toLocaleDateString('vi-VN', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}</span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <div className="px-3 py-1.5 rounded-lg bg-surface-muted border border-line text-xs text-ink-muted font-medium">
              {t('Work mode:')} <strong className="text-ink">Operational Staff</strong>
            </div>
          </div>
        </div>
      </div>

      {/* ── 5 Core Operational Navigation Tabs ── */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
        {[
          { key: 'applications' as StaffTab, label: t('Application review'), icon: FileText, count: applications.filter((a) => a.status === 'PENDING_REVIEW').length },
          { key: 'rooms' as StaffTab, label: t('Room & bed status'), icon: Bed, count: rooms.length },
          { key: 'assignment' as StaffTab, label: t('Allocation review'), icon: Layers, count: assignment.conflicts.filter((c) => !c.isResolved).length },
          { key: 'maintenance' as StaffTab, label: t('Maintenance & inspection'), icon: Wrench, count: maintenanceTasks.filter((m) => m.status !== 'VERIFIED_DONE').length },
          { key: 'checkin' as StaffTab, label: t('Check-in & handover'), icon: UserCheck, count: checkins.filter((c) => c.status !== 'COMPLETED').length },
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
                  : 'bg-surface text-ink-muted border-line/80 hover:bg-surface-muted hover:text-ink'
              )}
            >
              <Icon className={clsx('w-4 h-4', isActive ? 'text-orange-400' : 'text-ink-subtle')} />
              <span>{tab.label}</span>
              {tab.count > 0 && (
                <span
                  className={clsx(
                    'px-2 py-0.5 rounded-full text-label font-bold',
                    isActive ? 'bg-brand-fill text-white' : 'bg-surface-sunken text-ink'
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
              <h2 className="text-base font-bold text-ink">{t('Applications awaiting review')}</h2>
              <p className="text-xs text-ink-muted mt-0.5">
                {t('Review applications with notes or special priority requests before allocation')}
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-4">
            {applications.map((app) => (
              <div
                key={app.code}
                className="bg-surface rounded-2xl border border-line/80 p-5 shadow-xs hover:border-line-strong transition-all space-y-4"
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
                      {t('Requested room type:')} <strong className="text-ink">{app.roomTypeRequested}</strong> {t('• Submitted:')} {app.submittedAt}
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
                      ? t('Verified as valid')
                      : app.status === 'ESCALATED'
                      ? t('Escalated to manager')
                      : t('Needs review')}
                  </span>
                </div>

                {app.flagReason && (
                  <div className="p-3 rounded-xl bg-amber-50 border border-amber-200/70 text-xs text-amber-900 leading-relaxed">
                    <strong>{t('Points to review:')}</strong> {app.flagReason}
                  </div>
                )}

                {/* Criteria Checks */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2 text-xs">
                  {app.verificationChecks.map((chk, i) => (
                    <div
                      key={i}
                      className="flex items-center gap-2 p-2 rounded-lg bg-surface-muted border border-line text-ink"
                    >
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                      <span className="truncate">{chk.label}</span>
                    </div>
                  ))}
                </div>

                {/* Documents & Action Buttons */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-3 border-t border-line">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-xs text-ink-subtle font-medium">{t('Supporting documents:')}</span>
                    {app.documents.map((doc, idx) => (
                      <span
                        key={idx}
                        className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-surface-sunken hover:bg-line text-ink text-xs font-mono cursor-pointer transition-colors"
                      >
                        <FileText className="w-3.5 h-3.5 text-ink-muted" />
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
                          className="border border-line bg-surface hover:bg-surface-muted hover:border-line-strong text-ink px-4 py-2 rounded-lg font-medium text-xs sm:text-sm transition-colors inline-flex items-center justify-center gap-1.5"
                        >
                          <Send className="w-3.5 h-3.5 text-purple-600" />
                          {t('Escalate to manager')}
                        </button>
                        <button
                          type="button"
                          onClick={() => handleVerifyApplication(app.code)}
                          className="bg-brand-fill hover:bg-brand-fill-hover text-white px-4 py-2 rounded-lg font-medium text-xs sm:text-sm transition-colors inline-flex items-center justify-center gap-1.5 shadow-sm"
                        >
                          <CheckCircle2 className="w-4 h-4" />
                          {t('Confirm as valid')}
                        </button>
                      </>
                    )}
                    {app.status === 'VERIFIED' && (
                      <span className="text-xs text-emerald-700 font-semibold flex items-center gap-1">
                        <CheckCircle2 className="w-4 h-4" /> {t('Ready for the allocation round')}
                      </span>
                    )}
                    {app.status === 'ESCALATED' && (
                      <span className="text-xs text-purple-700 font-semibold flex items-center gap-1">
                        <Clock className="w-4 h-4" /> {t('Waiting for the manager\'s decision')}
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
              <h2 className="text-base font-bold text-ink">{t('Room & bed status management')}</h2>
              <p className="text-xs text-ink-muted mt-0.5">
                {t('Quickly update usage, lock beds for maintenance or release beds ready for students')}
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
            {rooms.map((room) => (
              <div
                key={room.roomNumber}
                className="bg-surface rounded-2xl border border-line/80 p-5 shadow-xs space-y-4"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <div className="w-9 h-9 rounded-lg bg-ink text-white font-bold text-sm flex items-center justify-center">
                      {room.roomNumber}
                    </div>
                    <div>
                      <h3 className="text-sm font-bold text-ink">{room.building} {t('• Floor')} {room.floor}</h3>
                      <p className="text-xs text-ink-muted">{room.roomType} • {t('{0} zone', { 0: t(room.gender) })}</p>
                    </div>
                  </div>
                  <span className="text-xs font-semibold px-2 py-0.5 rounded bg-surface-sunken text-ink">
                    {room.beds.filter((b) => b.status === 'AVAILABLE').length}/{room.beds.length} {t('free')}
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
                          ? 'bg-surface-muted border-line/80'
                          : bed.status === 'MAINTENANCE'
                          ? 'bg-rose-50/50 border-rose-200'
                          : 'bg-amber-50/50 border-amber-200'
                      )}
                    >
                      <div className="min-w-0">
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-ink">{bed.bedCode}</span>
                          <span
                            className={clsx(
                              'text-label font-bold px-1.5 py-0.2 rounded',
                              bed.status === 'AVAILABLE'
                                ? 'bg-emerald-100 text-emerald-800'
                                : bed.status === 'OCCUPIED'
                                ? 'bg-line text-ink'
                                : bed.status === 'MAINTENANCE'
                                ? 'bg-rose-100 text-rose-800'
                                : 'bg-amber-100 text-amber-800'
                            )}
                          >
                            {bed.status === 'AVAILABLE'
                              ? t('Available')
                              : bed.status === 'OCCUPIED'
                              ? t('Occupied')
                              : bed.status === 'MAINTENANCE'
                              ? t('Maintenance')
                              : t('On hold')}
                          </span>
                        </div>
                        {bed.occupant && (
                          <p className="text-ink-muted truncate mt-0.5">
                            {bed.occupant.name} ({bed.occupant.studentId})
                          </p>
                        )}
                        {bed.status === 'AVAILABLE' && (
                          <p className="text-emerald-700 mt-0.5 font-medium">{t('Ready for a student')}</p>
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
                                ? 'border-emerald-300 bg-surface text-emerald-700 hover:bg-emerald-50'
                                : 'border-rose-200 bg-surface text-rose-700 hover:bg-rose-50'
                            )}
                          >
                            {bed.status === 'MAINTENANCE' ? t('Reopen bed') : t('Lock for maintenance')}
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
          <div className="bg-surface rounded-2xl border border-line/80 p-5 shadow-xs">
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-mono text-xs font-bold text-brand-ink bg-orange-50 px-2 py-0.5 rounded">
                    {assignment.batchCode}
                  </span>
                  <h2 className="text-base font-bold text-ink">{assignment.title}</h2>
                </div>
                <p className="text-xs text-ink-muted mt-1">
                  {t('Allocated')} <strong>{assignment.totalAllocations}</strong> {t('places • Preference match rate:')} <strong>{assignment.matchRate}%</strong>
                </p>
              </div>

              <div className="flex items-center gap-3">
                {assignment.status === 'SUBMITTED_TO_MANAGER' ? (
                  <span className="px-3 py-2 rounded-lg bg-purple-50 text-purple-700 text-xs font-semibold border border-purple-200 flex items-center gap-1.5">
                    <Clock className="w-4 h-4" /> {t('Sent to the manager for approval')}
                  </span>
                ) : (
                  <button
                    type="button"
                    onClick={handleForwardProposalToManager}
                    className="bg-brand-fill hover:bg-brand-fill-hover text-white px-4 py-2 rounded-lg font-medium text-xs sm:text-sm transition-colors inline-flex items-center justify-center gap-1.5 shadow-sm"
                  >
                    <Send className="w-4 h-4" />
                    {t('Send to the manager for approval')}
                  </button>
                )}
              </div>
            </div>
          </div>

          <div className="space-y-3">
            <h3 className="text-sm font-bold text-ink">{t('Conflicts needing staff adjustment')}</h3>
            {assignment.conflicts.map((conf) => (
              <div
                key={conf.id}
                className={clsx(
                  'bg-surface rounded-2xl border p-5 shadow-xs transition-all space-y-3',
                  conf.isResolved ? 'border-emerald-200 bg-emerald-50/20' : 'border-amber-200'
                )}
              >
                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-2">
                  <div>
                    <h4 className="text-sm font-bold text-ink">{conf.studentName}</h4>
                    <p className="text-xs text-amber-800 mt-1 font-medium">
                      <strong>{t('Issue:')}</strong> {conf.issue}
                    </p>
                  </div>
                  <span
                    className={clsx(
                      'px-2.5 py-1 rounded-full text-xs font-semibold shrink-0',
                      conf.isResolved ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
                    )}
                  >
                    {conf.isResolved ? t('Resolved') : t('Needs action')}
                  </span>
                </div>

                <div className="p-3 rounded-xl bg-surface-muted border border-line text-xs text-ink flex items-center justify-between gap-3">
                  <div>
                    <span className="font-semibold text-ink">{t('Proposed adjustment:')} </span>
                    {conf.proposedResolution}
                  </div>
                  {!conf.isResolved && (
                    <button
                      type="button"
                      onClick={() => handleResolveConflict(conf.id)}
                      className="border border-line bg-surface hover:bg-surface-muted hover:border-line-strong text-ink px-4 py-2 rounded-lg font-medium text-xs sm:text-sm transition-colors inline-flex items-center justify-center gap-1.5 shrink-0"
                    >
                      <CheckSquare className="w-4 h-4 text-brand-ink" />
                      {t('Apply adjustment')}
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
              <h2 className="text-base font-bold text-ink">{t('Maintenance & technical inspection queue')}</h2>
              <p className="text-xs text-ink-muted mt-0.5">
                {t('Dispatch technicians, track SLA deadlines and accept completed rooms')}
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-4">
            {maintenanceTasks.map((task) => (
              <div
                key={task.id}
                className={clsx(
                  'bg-surface rounded-2xl border p-5 shadow-xs space-y-3 transition-all',
                  task.urgency === 'URGENT' ? 'border-rose-200 border-l-4 border-l-rose-500' : 'border-line/80'
                )}
              >
                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
                  <div>
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-mono text-xs font-bold text-ink bg-surface-sunken px-2 py-0.5 rounded">
                        {task.ticketCode}
                      </span>
                      <span className="font-bold text-sm text-ink">
                        {task.building} {t('• Room')} {task.room}
                      </span>
                      <span className="text-xs px-2 py-0.5 rounded-full bg-blue-50 text-blue-700 font-semibold">
                        {t(task.category)}
                      </span>
                    </div>
                    <p className="text-xs text-ink font-medium mt-1.5">{task.description}</p>
                    <div className="text-label text-ink-subtle mt-1">
                      {t('Reported by:')} {task.reportedBy} {t('• Time:')} {task.reportedAt}
                    </div>
                  </div>

                  <div className="flex sm:flex-col items-end gap-1.5 shrink-0">
                    <span
                      className={clsx(
                        'px-2.5 py-0.5 rounded-full text-label font-bold',
                        task.urgency === 'URGENT'
                          ? 'bg-rose-100 text-rose-800'
                          : task.urgency === 'HIGH'
                          ? 'bg-amber-100 text-amber-800'
                          : 'bg-surface-sunken text-ink'
                      )}
                    >
                      {task.urgency === 'URGENT' ? t('Urgent') : task.urgency === 'HIGH' ? t('High priority') : t('Standard')}
                    </span>
                    <span className="text-label text-ink-muted font-medium">SLA: {task.slaRemaining}</span>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-3 border-t border-line text-xs">
                  <div className="flex items-center gap-2 text-ink-muted">
                    <Wrench className="w-3.5 h-3.5 text-ink-subtle" />
                    {t('Assigned technician:')} <strong className="text-ink">{task.assignedTech}</strong>
                  </div>

                  <div className="flex items-center gap-2">
                    {task.status === 'PENDING' && (
                      <button
                        type="button"
                        onClick={() => handleProgressMaintenance(task.id)}
                        className="bg-brand-fill hover:bg-brand-fill-hover text-white px-4 py-2 rounded-lg font-medium text-xs sm:text-sm transition-colors inline-flex items-center justify-center gap-1.5 shadow-sm"
                      >
                        {t('Receive & schedule')}
                      </button>
                    )}
                    {task.status === 'IN_PROGRESS' && (
                      <button
                        type="button"
                        onClick={() => handleProgressMaintenance(task.id)}
                        className="bg-ink hover:bg-ink-hover text-white px-4 py-2 rounded-lg font-medium text-xs sm:text-sm transition-colors inline-flex items-center justify-center gap-1.5 shadow-sm"
                      >
                        <ShieldCheck className="w-4 h-4" />
                        {t('Accept completion')}
                      </button>
                    )}
                    {task.status === 'VERIFIED_DONE' && (
                      <span className="text-xs text-emerald-700 font-semibold flex items-center gap-1">
                        <CheckCircle2 className="w-4 h-4" /> {t('Accepted & closed')}
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
        <div className="fixed bottom-6 right-6 z-50 bg-ink text-white px-5 py-3 rounded-xl shadow-lg text-xs sm:text-sm flex items-center gap-2.5 border border-white/10 animate-fade-in">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}
    </div>
  );
}
