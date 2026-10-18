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
import { t } from '@shared-ui';

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
        ? t('Application {0} approved. The system creates the contract and notifies the student automatically.', { 0: code })
        : t('Application {0} rejected. The decision and reason were saved to the change log.', { 0: code })
    );
  };

  const handleAppBatch = (batchCode: string, decision: 'APPROVED' | 'REJECTED') => {
    setBatches((prev) =>
      prev.map((b) => (b.batchCode === batchCode ? { ...b, decision } : b))
    );
    showToast(
      decision === 'APPROVED'
        ? t('Allocation batch {0} approved. Electronic contracts have been issued in bulk.', { 0: batchCode })
        : t('Allocation batch {0} returned to staff for review.', { 0: batchCode })
    );
  };

  const handleAppRoomChange = (id: string, decision: 'APPROVED' | 'REJECTED') => {
    setRoomChanges((prev) =>
      prev.map((r) => (r.id === id ? { ...r, decision } : r))
    );
    showToast(
      decision === 'APPROVED'
        ? t('Room change {0} approved. Bed and room data have been updated.', { 0: id })
        : t('Room change {0} rejected.', { 0: id })
    );
  };

  const handleAppSchedule = (id: string, decision: 'APPROVED' | 'REJECTED') => {
    setSchedules((prev) =>
      prev.map((s) => (s.id === id ? { ...s, decision } : s))
    );
    showToast(
      decision === 'APPROVED'
        ? t('Maintenance schedule {0} approved. Students in affected rooms have been notified.', { 0: id })
        : t('Maintenance schedule {0} returned.', { 0: id })
    );
  };

  const pendingAppsCount = applications.filter((a) => a.decision === 'PENDING').length;
  const pendingBatchesCount = batches.filter((b) => b.decision === 'PENDING').length;
  const pendingChangesCount = roomChanges.filter((r) => r.decision === 'PENDING').length;
  const pendingSchedulesCount = schedules.filter((s) => s.decision === 'PENDING').length;

  return (
    <div className="space-y-6">
      {/* ── Governance Header ── */}
      <div className="bg-surface rounded-2xl border border-line/80 p-5 shadow-xs">
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
                  {t('Head of the Dormitory Management Board')}
                </span>
              </div>
              <p className="text-xs text-ink-muted mt-1">
                {t('FPT University HCMC / Tan Uyen • Authority: applications, allocation, room changes & maintenance schedules')}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <div className="px-3 py-1.5 rounded-lg bg-surface-muted border border-line text-xs text-ink-muted font-medium">
              {t('Authority mode:')} <strong className="text-ink">Governance & Approvals</strong>
            </div>
          </div>
        </div>
      </div>

      {/* ── 5 Core Governance Navigation Tabs ── */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
        {[
          { key: 'applications' as ManagerTab, label: t('Dormitory applications'), icon: FileText, count: pendingAppsCount },
          { key: 'assignments' as ManagerTab, label: t('Allocation proposals'), icon: Layers, count: pendingBatchesCount },
          { key: 'roomChanges' as ManagerTab, label: t('Room changes'), icon: ArrowLeftRight, count: pendingChangesCount },
          { key: 'schedules' as ManagerTab, label: t('Periodic maintenance schedules'), icon: CalendarClock, count: pendingSchedulesCount },
          { key: 'reports' as ManagerTab, label: t('Capacity monitoring & reports'), icon: BarChart3, count: 0 },
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

      {/* 1. Approve/Reject Dormitory Applications */}
      {activeTab === 'applications' && (
        <div className="space-y-4">
          <div>
            <h2 className="text-base font-bold text-ink">{t('Dormitory application approval')}</h2>
            <p className="text-xs text-ink-muted mt-0.5">
              {t('Special cases reviewed and recommended by staff — decisions update contracts and notifications automatically')}
            </p>
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
                      {t('Recommended room type:')} <strong className="text-ink">{app.roomType}</strong>
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
                      ? t('Approved')
                      : app.decision === 'REJECTED'
                      ? t('Rejected')
                      : t('Awaiting decision')}
                  </span>
                </div>

                {/* Flag & Staff Recommendation */}
                <div className="space-y-2 text-xs">
                  <div className="p-3 rounded-xl bg-surface-muted border border-line/80 text-ink">
                    <span className="font-bold text-ink">{t('Reconciliation notes:')} </span>
                    {app.flagDescription}
                  </div>
                  <div className="p-3 rounded-xl bg-blue-50/60 border border-blue-200/70 text-blue-900">
                    <span className="font-bold text-blue-950">{t('Staff recommendation (')}{app.reviewedByStaff}): </span>
                    {app.staffRecommendation}
                  </div>
                </div>

                {/* Documents & Action Buttons */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-3 border-t border-line">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-xs text-ink-subtle font-medium">{t('Attachments:')}</span>
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
                          className="border border-line bg-surface hover:bg-surface-muted hover:border-line-strong text-ink px-4 py-2 rounded-lg font-medium text-xs sm:text-sm transition-colors inline-flex items-center justify-center gap-1.5"
                        >
                          <XCircle className="w-4 h-4 text-rose-600" />
                          {t('Reject')}
                        </button>
                        <button
                          type="button"
                          onClick={() => handleAppApplication(app.code, 'APPROVED')}
                          className="bg-brand-fill hover:bg-brand-fill-hover text-white px-4 py-2 rounded-lg font-medium text-xs sm:text-sm transition-colors inline-flex items-center justify-center gap-1.5 shadow-sm"
                        >
                          <CheckCircle2 className="w-4 h-4" />
                          {t('Approve')}
                        </button>
                      </>
                    ) : (
                      <span className="text-xs font-semibold text-ink-muted">
                        {t('Recorded in the administrative change log')}
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
            <h2 className="text-base font-bold text-ink">{t('Allocation proposal approval (batch run)')}</h2>
            <p className="text-xs text-ink-muted mt-0.5">
              {t('Sign off automatic allocation results after staff have reviewed and resolved exceptions')}
            </p>
          </div>

          <div className="space-y-4">
            {batches.map((b) => (
              <div
                key={b.batchCode}
                className="bg-surface rounded-2xl border border-line/80 p-5 shadow-xs space-y-4"
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
                      {t('Semester:')} <strong>{b.semester}</strong> {t('• Technical review by:')} <strong>{b.reviewedByStaff}</strong>
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
                      ? t('Approved for release')
                      : b.decision === 'REJECTED'
                      ? t('Adjustment requested')
                      : t('Awaiting manager approval')}
                  </span>
                </div>

                {/* Key Metrics Grid */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
                  <div className="p-3 rounded-xl bg-surface-muted border border-line/70">
                    <div className="text-ink-subtle font-medium">{t('Total placements')}</div>
                    <div className="text-lg font-bold text-ink mt-0.5">{b.totalAllocations} {t('students')}</div>
                  </div>
                  <div className="p-3 rounded-xl bg-emerald-50/60 border border-emerald-200/70">
                    <div className="text-emerald-700 font-medium">{t('Preference match rate')}</div>
                    <div className="text-lg font-bold text-emerald-800 mt-0.5">{b.matchRate}%</div>
                  </div>
                  <div className="p-3 rounded-xl bg-blue-50/60 border border-blue-200/70">
                    <div className="text-blue-700 font-medium">{t('Conflicts resolved')}</div>
                    <div className="text-lg font-bold text-blue-800 mt-0.5">{b.resolvedConflicts} {t('cases')}</div>
                  </div>
                  <div className="p-3 rounded-xl bg-purple-50/60 border border-purple-200/70">
                    <div className="text-purple-700 font-medium">{t('Open exceptions')}</div>
                    <div className="text-lg font-bold text-purple-800 mt-0.5">{b.remainingExceptions}</div>
                  </div>
                </div>

                {/* Highlight Points */}
                <div className="p-3.5 rounded-xl bg-surface-muted border border-line text-xs text-ink space-y-1">
                  {b.highlights.map((h, idx) => (
                    <div key={idx} className="flex items-center gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-brand-fill shrink-0" />
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
                        className="border border-line bg-surface hover:bg-surface-muted hover:border-line-strong text-ink px-4 py-2 rounded-lg font-medium text-xs sm:text-sm transition-colors inline-flex items-center justify-center gap-1.5"
                      >
                        {t('Ask staff to review again')}
                      </button>
                      <button
                        type="button"
                        onClick={() => handleAppBatch(b.batchCode, 'APPROVED')}
                        className="bg-brand-fill hover:bg-brand-fill-hover text-white px-4 py-2 rounded-lg font-medium text-xs sm:text-sm transition-colors inline-flex items-center justify-center gap-1.5 shadow-sm"
                      >
                        <CheckCircle2 className="w-4 h-4" />
                        {t('Approve & issue electronic contracts')}
                      </button>
                    </>
                  ) : (
                    <span className="text-xs font-semibold text-emerald-700 flex items-center gap-1">
                      <CheckCircle2 className="w-4 h-4" /> {t('Allocation batch sign-off completed')}
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
            <h2 className="text-base font-bold text-ink">{t('Dormitory room change & swap approval')}</h2>
            <p className="text-xs text-ink-muted mt-0.5">
              {t('Verify the agreement between the students and approve the system update')}
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {roomChanges.map((change) => (
              <div
                key={change.id}
                className="bg-surface rounded-2xl border border-line/80 p-5 shadow-xs space-y-4"
              >
                <div className="flex items-center justify-between">
                  <span className="font-mono text-xs font-bold text-ink bg-surface-sunken px-2 py-0.5 rounded">
                    {change.id} • {t(change.kind)}
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
                    {change.decision === 'APPROVED' ? t('Approved') : change.decision === 'REJECTED' ? t('Reject') : t('Awaiting approval')}
                  </span>
                </div>

                {/* Transfer Diagram */}
                <div className="flex items-center gap-2 text-xs">
                  <div className="flex-1 p-3 rounded-xl bg-surface-muted border border-line/80">
                    <div className="font-bold text-ink">{change.studentA.name}</div>
                    <div className="text-ink-muted">{change.studentA.studentId}</div>
                    <div className="text-blue-700 font-semibold mt-1">{t('Current room:')} {change.studentA.room}</div>
                  </div>

                  <div className="shrink-0 w-8 h-8 rounded-full bg-purple-50 text-purple-600 flex items-center justify-center">
                    <ArrowLeftRight className="w-4 h-4" />
                  </div>

                  <div className="flex-1 p-3 rounded-xl bg-surface-muted border border-line/80">
                    {change.studentB ? (
                      <>
                        <div className="font-bold text-ink">{change.studentB.name}</div>
                        <div className="text-ink-muted">{change.studentB.studentId}</div>
                        <div className="text-blue-700 font-semibold mt-1">{t('Current room:')} {change.studentB.room}</div>
                      </>
                    ) : (
                      <>
                        <div className="font-bold text-ink">{t('Destination room')}</div>
                        <div className="text-blue-700 font-semibold mt-1">{change.targetRoom}</div>
                      </>
                    )}
                  </div>
                </div>

                <div className="text-xs text-ink-muted">
                  <strong>{t('Student\'s reason:')}</strong> {change.reason}
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
                        className="border border-line bg-surface hover:bg-surface-muted hover:border-line-strong text-ink px-4 py-2 rounded-lg font-medium text-xs sm:text-sm transition-colors inline-flex items-center justify-center gap-1.5"
                      >
                        {t('Reject')}
                      </button>
                      <button
                        type="button"
                        onClick={() => handleAppRoomChange(change.id, 'APPROVED')}
                        className="bg-brand-fill hover:bg-brand-fill-hover text-white px-4 py-2 rounded-lg font-medium text-xs sm:text-sm transition-colors inline-flex items-center justify-center gap-1.5 shadow-sm"
                      >
                        <CheckCircle2 className="w-4 h-4" />
                        {t('Approve room change')}
                      </button>
                    </>
                  ) : (
                    <span className="text-xs font-semibold text-ink-muted">{t('System updated')}</span>
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
            <h2 className="text-base font-bold text-ink">{t('Periodic maintenance schedule approval')}</h2>
            <p className="text-xs text-ink-muted mt-0.5">
              {t('Approve building-wide maintenance plans while minimizing disruption to students')}
            </p>
          </div>

          <div className="grid grid-cols-1 gap-4">
            {schedules.map((item) => (
              <div
                key={item.id}
                className="bg-surface rounded-2xl border border-line/80 p-5 shadow-xs space-y-3"
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
                      {t('Scope:')} <strong className="text-ink">{item.scope}</strong> {t('• Cycle:')} {item.recurrence}
                    </div>
                    <div className="text-xs text-blue-700 font-medium mt-0.5">
                      {t('Work window:')} {item.executionWindow}
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
                    {item.decision === 'APPROVED' ? t('Schedule approved') : item.decision === 'REJECTED' ? t('Reject') : t('Awaiting approval')}
                  </span>
                </div>

                <div className="p-3 rounded-xl bg-amber-50 border border-amber-200 text-xs text-amber-900 leading-relaxed">
                  <strong>{t('Impact notice:')}</strong> {item.studentImpactNotice}
                </div>

                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-3 border-t border-line text-xs">
                  <span className="text-ink-muted">{t('Proposed by:')} <strong className="text-ink">{item.proposer}</strong></span>

                  <div className="flex items-center gap-2">
                    {item.decision === 'PENDING' ? (
                      <>
                        <button
                          type="button"
                          onClick={() => handleAppSchedule(item.id, 'REJECTED')}
                          className="border border-line bg-surface hover:bg-surface-muted hover:border-line-strong text-ink px-4 py-2 rounded-lg font-medium text-xs sm:text-sm transition-colors inline-flex items-center justify-center gap-1.5"
                        >
                          {t('Return for adjustment')}
                        </button>
                        <button
                          type="button"
                          onClick={() => handleAppSchedule(item.id, 'APPROVED')}
                          className="bg-brand-fill hover:bg-brand-fill-hover text-white px-4 py-2 rounded-lg font-medium text-xs sm:text-sm transition-colors inline-flex items-center justify-center gap-1.5 shadow-sm"
                        >
                          <CheckCircle2 className="w-4 h-4" />
                          {t('Approve schedule & notify')}
                        </button>
                      </>
                    ) : (
                      <span className="text-xs font-semibold text-emerald-700 flex items-center gap-1">
                        <CheckCircle2 className="w-4 h-4" /> {t('Schedule added to the dispatch system')}
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
