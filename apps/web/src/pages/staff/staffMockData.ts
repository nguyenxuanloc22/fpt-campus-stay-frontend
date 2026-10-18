
import { t } from '@shared-ui';// ──────────────────────────────────────────────────────────────
//  staffMockData.ts — Staff Operational Portal Mock Data
//  Strongly-typed data structures for all 5 core operational use cases:
//  1. Review Dormitory Applications
//  2. Update Room & Bed Status
//  3. Review/Adjust Room Assignment Proposals
//  4. Handle Maintenance Requests & Inspections
//  5. Process Manual/Late Check-In & Room Condition Handover
// ──────────────────────────────────────────────────────────────

export interface ApplicationReviewItem {
  id: string;
  code: string;
  studentName: string;
  studentId: string;
  major: string;
  roomTypeRequested: string;
  submittedAt: string;
  status: 'PENDING_REVIEW' | 'VERIFIED' | 'ESCALATED';
  flagReason?: string;
  verificationChecks: {
    label: string;
    passed: boolean;
  }[];
  documents: string[];
}

export interface BedDetail {
  bedId: string;
  bedCode: string;
  status: 'AVAILABLE' | 'OCCUPIED' | 'MAINTENANCE' | 'RESERVED';
  occupant?: {
    name: string;
    studentId: string;
  };
}

export interface RoomInventoryCard {
  roomNumber: string;
  building: string;
  floor: number;
  gender: 'Male' | 'Female';
  roomType: string;
  beds: BedDetail[];
}

export interface AssignmentConflict {
  id: string;
  studentName: string;
  studentId: string;
  issue: string;
  proposedResolution: string;
  isResolved: boolean;
}

export interface AssignmentProposalBatch {
  id: string;
  batchCode: string;
  title: string;
  semester: string;
  totalAllocations: number;
  matchRate: number;
  conflicts: AssignmentConflict[];
  status: 'REVIEWING' | 'RESOLVED_READY' | 'SUBMITTED_TO_MANAGER';
}

export interface MaintenanceInspectionItem {
  id: string;
  ticketCode: string;
  room: string;
  building: string;
  category: 'Air conditioning' | 'Electrical' | 'Plumbing' | 'Furniture';
  description: string;
  reportedBy: string;
  reportedAt: string;
  urgency: 'URGENT' | 'HIGH' | 'MEDIUM';
  status: 'PENDING' | 'IN_PROGRESS' | 'VERIFIED_DONE';
  assignedTech: string;
  slaRemaining: string;
}

export interface ManualCheckinItem {
  id: string;
  studentName: string;
  studentId: string;
  assignedRoom: string;
  bedCode: string;
  checkinType: 'Walk-in at the desk' | 'Late check-in';
  scheduledTime: string;
  status: 'WAITING' | 'CONDITION_VERIFIED' | 'COMPLETED';
  inventoryItems: {
    name: string;
    checked: boolean;
  }[];
}

/* ────────── 1. Applications Review Queue ────────── */
export const STAFF_APPLICATIONS: ApplicationReviewItem[] = [
  {
    id: 'app-01',
    code: 'APP-SP27-004809',
    studentName: 'Đỗ Minh Quân',
    studentId: 'SE190455',
    major: t('Software Engineering'),
    roomTypeRequested: t('4-bed air-conditioned'),
    submittedAt: '16/10/2026 18:02',
    status: 'PENDING_REVIEW',
    flagReason: t('Academic record updated for repeat study — Decision 1123/QĐ-FPTU verified as valid'),
    verificationChecks: [
      { label: t('Full-time student status verified'), passed: true },
      { label: t('No outstanding financial obligations'), passed: true },
      { label: t('Holding payment completed'), passed: true },
      { label: t('Committed to the dormitory rules'), passed: true },
    ],
    documents: ['quyet-dinh-hoc-lai.pdf', 'xac-nhan-tai-chinh.pdf'],
  },
  {
    id: 'app-02',
    code: 'APP-SP27-004771',
    studentName: 'Mai Khánh Vy',
    studentId: 'SS190234',
    major: 'Digital Marketing',
    roomTypeRequested: t('4-bed air-conditioned'),
    submittedAt: '14/10/2026 21:47',
    status: 'PENDING_REVIEW',
    flagReason: t('Requests a lower floor with an attached specialist medical certificate'),
    verificationChecks: [
      { label: t('Full-time student status verified'), passed: true },
      { label: t('Valid medical certificate from a public hospital'), passed: true },
      { label: t('No outstanding financial obligations'), passed: true },
      { label: t('Holding payment completed'), passed: true },
    ],
    documents: ['giay-kham-benh-benh-vien.pdf'],
  },
  {
    id: 'app-03',
    code: 'APP-SP27-004760',
    studentName: 'Trương Gia Bảo',
    studentId: 'AI180990',
    major: t('Artificial Intelligence'),
    roomTypeRequested: t('2-bed standard'),
    submittedAt: '14/10/2026 10:12',
    status: 'ESCALATED',
    flagReason: t('Last term\'s electricity meter discrepancy under verification with the maintenance team'),
    verificationChecks: [
      { label: t('Full-time student status verified'), passed: true },
      { label: t('Utility reconciliation record prepared by the maintenance team'), passed: true },
      { label: t('Holding payment completed'), passed: true },
    ],
    documents: ['bien-ban-kiem-tra-cong-to.pdf'],
  },
];

/* ────────── 2. Room & Bed Status Cards ────────── */
export const STAFF_ROOMS: RoomInventoryCard[] = [
  {
    roomNumber: 'A102',
    building: t('Building A'),
    floor: 1,
    gender: 'Female',
    roomType: t('4-bed air-conditioned'),
    beds: [
      { bedId: 'b-01', bedCode: 'A102-G1', status: 'OCCUPIED', occupant: { name: 'Lê Thị Thu Thảo', studentId: 'SE180123' } },
      { bedId: 'b-02', bedCode: 'A102-G2', status: 'OCCUPIED', occupant: { name: 'Nguyễn Thảo My', studentId: 'SS190201' } },
      { bedId: 'b-03', bedCode: 'A102-G3', status: 'AVAILABLE' },
      { bedId: 'b-04', bedCode: 'A102-G4', status: 'MAINTENANCE' },
    ],
  },
  {
    roomNumber: 'B205',
    building: t('Building B'),
    floor: 2,
    gender: 'Male',
    roomType: t('4-bed with fan'),
    beds: [
      { bedId: 'b-05', bedCode: 'B205-G1', status: 'OCCUPIED', occupant: { name: 'Trần Minh Hoàng', studentId: 'SE190882' } },
      { bedId: 'b-06', bedCode: 'B205-G2', status: 'AVAILABLE' },
      { bedId: 'b-07', bedCode: 'B205-G3', status: 'RESERVED', occupant: { name: 'Đỗ Minh Quân', studentId: 'SE190455' } },
      { bedId: 'b-08', bedCode: 'B205-G4', status: 'AVAILABLE' },
    ],
  },
  {
    roomNumber: 'C304',
    building: t('Building C'),
    floor: 3,
    gender: 'Female',
    roomType: t('2-bed service room'),
    beds: [
      { bedId: 'b-09', bedCode: 'C304-G1', status: 'OCCUPIED', occupant: { name: 'Phan Thùy Dung', studentId: 'GD190087' } },
      { bedId: 'b-10', bedCode: 'C304-G2', status: 'AVAILABLE' },
    ],
  },
];

/* ────────── 3. Assignment Proposal & Conflicts ────────── */
export const STAFF_ASSIGNMENT_PROPOSAL: AssignmentProposalBatch = {
  id: 'batch-sp27-02',
  batchCode: 'BR-SP27-02',
  title: t('Spring 2027 dormitory allocation proposal (Round 1)'),
  semester: 'Spring 2027',
  totalAllocations: 342,
  matchRate: 98.2,
  status: 'REVIEWING',
  conflicts: [
    {
      id: 'conf-1',
      studentName: 'Mai Khánh Vy (SS190234)',
      studentId: 'SS190234',
      issue: t('The system placed the student on floor 4 (C402) although they have a medical referral for a lower floor'),
      proposedResolution: t('Move to bed A102-G3 (floor 1, Building A, female)'),
      isResolved: false,
    },
    {
      id: 'conf-2',
      studentName: 'Hồ Tấn Phát (SE170321) & Bùi Văn Hùng (SE170440)',
      studentId: 'SE170321',
      issue: t('Valid roommate request, but the pair was split into 2 different rooms'),
      proposedResolution: t('Swap to free bed B205-G2 to join B205-G1'),
      isResolved: false,
    },
    {
      id: 'conf-3',
      studentName: 'Lê Hoàng Khang (AI190012)',
      studentId: 'AI190012',
      issue: t('Room B310 has 1 bed with a broken air conditioner waiting for spare parts'),
      proposedResolution: t('Temporarily lock bed B310-G4 and allocate to B208-G2'),
      isResolved: true,
    },
  ],
};

/* ────────── 4. Maintenance Requests & Inspections ────────── */
export const STAFF_MAINTENANCE_TASKS: MaintenanceInspectionItem[] = [
  {
    id: 'maint-01',
    ticketCode: 'TK-10499',
    room: 'D305',
    building: t('Building D'),
    category: 'Electrical',
    description: t('Circuit breaker tripped in the air-conditioning area of room D305, local power cut'),
    reportedBy: 'Võ Minh Nhật (SE180321)',
    reportedAt: '17/10/2026 14:15',
    urgency: 'URGENT',
    status: 'IN_PROGRESS',
    assignedTech: t('Nguyễn Văn Tâm (Electrical)'),
    slaRemaining: t('0.9 hours (urgent)'),
  },
  {
    id: 'maint-02',
    ticketCode: 'TK-10488',
    room: 'B108',
    building: t('Building B'),
    category: 'Plumbing',
    description: t('Shower valve leaking, water overflowing onto the bathroom floor'),
    reportedBy: 'Đặng Quốc Huy (SE190012)',
    reportedAt: '17/10/2026 15:00',
    urgency: 'URGENT',
    status: 'PENDING',
    assignedTech: t('Lê Văn Tài (Plumbing)'),
    slaRemaining: t('1.5 hours'),
  },
  {
    id: 'maint-03',
    ticketCode: 'TK-10472',
    room: 'A204',
    building: t('Building A'),
    category: 'Furniture',
    description: t('Wardrobe hinge at bed G2 loose, door does not close'),
    reportedBy: 'Nguyễn Thị Mai Anh (SE171234)',
    reportedAt: '16/10/2026 09:30',
    urgency: 'MEDIUM',
    status: 'VERIFIED_DONE',
    assignedTech: t('Trần Quốc Thắng (Carpentry/furniture)'),
    slaRemaining: t('Completed'),
  },
];

/* ────────── 5. Manual & Late Check-in Operations ────────── */
export const STAFF_MANUAL_CHECKINS: ManualCheckinItem[] = [
  {
    id: 'ci-01',
    studentName: 'Lê Thị Hồng Nhung',
    studentId: 'SE190112',
    assignedRoom: 'C305',
    bedCode: 'C305-G2',
    checkinType: 'Walk-in at the desk',
    scheduledTime: t('Today · 08:30'),
    status: 'WAITING',
    inventoryItems: [
      { name: t('Key card for the room door & elevator'), checked: true },
      { name: t('Personal locker key no. G2'), checked: true },
      { name: t('Standard dormitory mattress & bed sheets'), checked: true },
      { name: t('Desk and chair without scratches'), checked: false },
      { name: t('Bathroom fixtures & air conditioner working well'), checked: false },
    ],
  },
  {
    id: 'ci-02',
    studentName: 'Trương Gia Bảo',
    studentId: 'AI180990',
    assignedRoom: 'D402',
    bedCode: 'D402-G2',
    checkinType: 'Late check-in',
    scheduledTime: t('Today · 18:30'),
    status: 'WAITING',
    inventoryItems: [
      { name: t('Key card for the room door & elevator'), checked: false },
      { name: t('Personal locker key no. G2'), checked: false },
      { name: t('Standard dormitory mattress & bed sheets'), checked: false },
      { name: t('Desk and chair without scratches'), checked: false },
      { name: t('Bathroom fixtures & air conditioner working well'), checked: false },
    ],
  },
];
