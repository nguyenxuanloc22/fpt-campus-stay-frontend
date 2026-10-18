
import { t } from '@shared-ui';// ──────────────────────────────────────────────────────────────
//  managerMockData.ts — Manager Governance & Approvals Mock Data
//  Strongly-typed data structures for all 5 core governance use cases:
//  1. Approve/Reject Dormitory Applications
//  2. Review/Approve Room Assignment Proposals
//  3. Approve/Reject Room Change Requests
//  4. Approve Maintenance Schedules
//  5. Monitor Occupancy & Reports
// ──────────────────────────────────────────────────────────────

export interface ManagerAppApproval {
  code: string;
  studentName: string;
  studentId: string;
  major: string;
  roomType: string;
  flagDescription: string;
  staffRecommendation: string;
  reviewedByStaff: string;
  documents: string[];
  decision: 'PENDING' | 'APPROVED' | 'REJECTED';
}

export interface ManagerBatchAssignment {
  batchCode: string;
  title: string;
  semester: string;
  reviewedByStaff: string;
  totalAllocations: number;
  matchRate: number;
  resolvedConflicts: number;
  remainingExceptions: number;
  decision: 'PENDING' | 'APPROVED' | 'REJECTED';
  highlights: string[];
}

export interface ManagerRoomChange {
  id: string;
  kind: 'ROOM SWAP' | 'SINGLE TRANSFER';
  studentA: {
    name: string;
    studentId: string;
    room: string;
  };
  studentB?: {
    name: string;
    studentId: string;
    room: string;
  };
  targetRoom?: string;
  reason: string;
  staffVerificationNote: string;
  warnings: string[];
  decision: 'PENDING' | 'APPROVED' | 'REJECTED';
}

export interface ManagerMaintenanceSchedule {
  id: string;
  title: string;
  scope: string;
  executionWindow: string;
  recurrence: string;
  studentImpactNotice: string;
  proposer: string;
  decision: 'PENDING' | 'APPROVED' | 'REJECTED';
}

export interface ManagerBuildingKpi {
  code: string;
  name: string;
  gender: 'Male' | 'Female';
  totalBeds: number;
  occupiedBeds: number;
  maintenanceBeds: number;
  occupancyRate: number;
  revenueMillionVnd: number;
}

export interface ManagerGovernanceDashboard {
  overview: {
    totalBeds: number;
    occupiedBeds: number;
    availableBeds: number;
    occupancyRate: number;
    revenueSemesterBillion: number;
    collectedPercentage: number;
    overdueInvoicesCount: number;
    slaComplianceRate: number;
  };
  buildings: ManagerBuildingKpi[];
}

/* ────────── 1. Applications Awaiting Manager Governance ────────── */
export const MANAGER_APPLICATIONS: ManagerAppApproval[] = [
  {
    code: 'APP-SP27-004809',
    studentName: 'Đỗ Minh Quân',
    studentId: 'SE190455',
    major: t('Software Engineering'),
    roomType: t('4-bed air-conditioned'),
    flagDescription: t('Academic record updated for a repeating student — Decision 1123/QĐ-FPTU is valid'),
    staffRecommendation: t('Records complete and legally valid, identity checked. Recommend approving admission.'),
    reviewedByStaff: t('Trần Văn Cường (Dormitory staff)'),
    documents: ['quyet-dinh-hoc-lai.pdf', 'xac-nhan-tai-chinh.pdf'],
    decision: 'PENDING',
  },
  {
    code: 'APP-SP27-004771',
    studentName: 'Mai Khánh Vy',
    studentId: 'SS190234',
    major: 'Digital Marketing',
    roomType: t('4-bed air-conditioned (lower floor)'),
    flagDescription: t('Requests a floor-1 placement with an attached medical referral'),
    staffRecommendation: t('Medical certificate from the general hospital verified; eligible for priority room A102.'),
    reviewedByStaff: t('Lê Minh Khoa (Dormitory staff)'),
    documents: ['chi-dinh-bac-si.pdf'],
    decision: 'PENDING',
  },
  {
    code: 'APP-SP27-004760',
    studentName: 'Trương Gia Bảo',
    studentId: 'AI180990',
    major: t('Artificial Intelligence'),
    roomType: t('2-bed standard'),
    flagDescription: t('Utility reconciliation record for last term prepared; the difference came from meter testing'),
    staffRecommendation: t('The maintenance team adjusted the actual balance. Recommend approving room retention.'),
    reviewedByStaff: t('Trần Văn Cường (Dormitory staff)'),
    documents: ['bien-ban-kiem-tra-cong-to.pdf'],
    decision: 'PENDING',
  },
];

/* ────────── 2. Room Assignment Proposal Batches ────────── */
export const MANAGER_ASSIGNMENT_PROPOSALS: ManagerBatchAssignment[] = [
  {
    batchCode: 'BR-SP27-02',
    title: t('Spring 2027 dormitory allocation proposal (Round 1)'),
    semester: 'Spring 2027',
    reviewedByStaff: 'Trần Văn Cường & Nguyễn Thu Hà',
    totalAllocations: 342,
    matchRate: 98.2,
    resolvedConflicts: 6,
    remainingExceptions: 0,
    decision: 'PENDING',
    highlights: [
      t('342 students allocated, 98.2% matching building & room type preference'),
      t('All 6 special allocation conflicts resolved'),
      t('On approval: the system issues electronic contracts & opens the installment 2 payment portal'),
    ],
  },
];

/* ────────── 3. Room Change Requests ────────── */
export const MANAGER_ROOM_CHANGES: ManagerRoomChange[] = [
  {
    id: 'RC-2026-0231',
    kind: 'ROOM SWAP',
    studentA: { name: 'Nguyễn Thị Mai Anh', studentId: 'SE171234', room: 'A204-G1' },
    studentB: { name: 'Võ Thị Bảo Ngọc', studentId: 'SS180112', room: 'A310-G2' },
    reason: t('The two students agreed to swap rooms to study together in the same major.'),
    staffVerificationNote: t('Electronic confirmations from both sides verified; no room price difference.'),
    warnings: [],
    decision: 'PENDING',
  },
  {
    id: 'RC-2026-0229',
    kind: 'ROOM SWAP',
    studentA: { name: 'Đỗ Minh Quân', studentId: 'SE190455', room: 'B210-G4' },
    studentB: { name: 'Lý Gia Huy', studentId: 'SE180421', room: 'B105-G1' },
    reason: t('Move to floor 1 for health care convenience.'),
    staffVerificationNote: t('Student Lý Gia Huy has fully paid last term\'s utility bill.'),
    warnings: [t('Payment of previous debt verified')],
    decision: 'PENDING',
  },
];

/* ────────── 4. Periodic Maintenance Schedules ────────── */
export const MANAGER_MAINTENANCE_SCHEDULES: ManagerMaintenanceSchedule[] = [
  {
    id: 'PMS-2026-11',
    title: t('Periodic maintenance of the entire air-conditioning system, Building C'),
    scope: t('Building C · 80 residential rooms & common areas'),
    executionWindow: t('04/11 – 08/11/2026 · 08:30 – 11:30'),
    recurrence: t('Every semester'),
    studentImpactNotice: t('Technicians enter rooms in 30-minute slots; students notified 48 hours in advance'),
    proposer: t('Lê Văn Tài (Deputy head of dormitory maintenance)'),
    decision: 'PENDING',
  },
  {
    id: 'PMS-2026-12',
    title: t('Safety inspection of the central water heater system, Buildings B & D'),
    scope: t('Building B (64 rooms) & Building D (90 rooms)'),
    executionWindow: t('15/11/2026 · 13:30 – 16:30'),
    recurrence: t('Every quarter'),
    studentImpactNotice: t('Hot water off for 60 minutes; regular water supply unaffected'),
    proposer: t('Nguyễn Thành Đạt (Equipment operations team lead)'),
    decision: 'PENDING',
  },
];

/* ────────── 5. Governance KPIs & Occupancy Monitoring ────────── */
export const MANAGER_GOVERNANCE_DATA: ManagerGovernanceDashboard = {
  overview: {
    totalBeds: 1200,
    occupiedBeds: 1075,
    availableBeds: 125,
    occupancyRate: 89.6,
    revenueSemesterBillion: 17.23,
    collectedPercentage: 94.2,
    overdueInvoicesCount: 14,
    slaComplianceRate: 96.4,
  },
  buildings: [
    { code: 'A', name: t('Building A'), gender: 'Female', totalBeds: 288, occupiedBeds: 271, maintenanceBeds: 4, occupancyRate: 94.1, revenueMillionVnd: 4120 },
    { code: 'B', name: t('Building B'), gender: 'Male', totalBeds: 312, occupiedBeds: 298, maintenanceBeds: 6, occupancyRate: 95.5, revenueMillionVnd: 4470 },
    { code: 'C', name: t('Building C'), gender: 'Female', totalBeds: 320, occupiedBeds: 276, maintenanceBeds: 2, occupancyRate: 86.3, revenueMillionVnd: 4380 },
    { code: 'D', name: t('Building D'), gender: 'Male', totalBeds: 280, occupiedBeds: 230, maintenanceBeds: 3, occupancyRate: 82.1, revenueMillionVnd: 4260 },
  ],
};
