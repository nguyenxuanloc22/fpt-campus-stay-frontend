// ──────────────────────────────────────────────────────────────
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
  gender: 'Nam' | 'Nữ';
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
  category: 'Máy lạnh' | 'Điện' | 'Cấp thoát nước' | 'Nội thất';
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
  checkinType: 'Thủ công tại quầy' | 'Check-in muộn';
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
    major: 'Kỹ thuật phần mềm',
    roomTypeRequested: '4 giường máy lạnh',
    submittedAt: '16/10/2026 18:02',
    status: 'PENDING_REVIEW',
    flagReason: 'Hồ sơ đào tạo cập nhật học lại — Đã đối chiếu quyết định số 1123/QĐ-FPTU hợp lệ',
    verificationChecks: [
      { label: 'Tư cách sinh viên chính quy xác thực', passed: true },
      { label: 'Không tồn đọng nghĩa vụ tài chính', passed: true },
      { label: 'Đã hoàn tất thanh toán giữ chỗ', passed: true },
      { label: 'Cam kết tuân thủ nội quy KTX', passed: true },
    ],
    documents: ['quyet-dinh-hoc-lai.pdf', 'xac-nhan-tai-chinh.pdf'],
  },
  {
    id: 'app-02',
    code: 'APP-SP27-004771',
    studentName: 'Mai Khánh Vy',
    studentId: 'SS190234',
    major: 'Digital Marketing',
    roomTypeRequested: '4 giường máy lạnh',
    submittedAt: '14/10/2026 21:47',
    status: 'PENDING_REVIEW',
    flagReason: 'Đề nghị ưu tiên tầng thấp có chứng nhận y tế chuyên khoa đính kèm',
    verificationChecks: [
      { label: 'Tư cách sinh viên chính quy xác thực', passed: true },
      { label: 'Chứng nhận y tế hợp lệ từ bệnh viện công', passed: true },
      { label: 'Không tồn đọng nghĩa vụ tài chính', passed: true },
      { label: 'Đã hoàn tất thanh toán giữ chỗ', passed: true },
    ],
    documents: ['giay-kham-benh-benh-vien.pdf'],
  },
  {
    id: 'app-03',
    code: 'APP-SP27-004760',
    studentName: 'Trương Gia Bảo',
    studentId: 'AI180990',
    major: 'Trí tuệ nhân tạo',
    roomTypeRequested: '2 giường tiêu chuẩn',
    submittedAt: '14/10/2026 10:12',
    status: 'ESCALATED',
    flagReason: 'Chênh lệch chỉ số công tơ điện kỳ trước đang xác minh với tổ kỹ thuật',
    verificationChecks: [
      { label: 'Tư cách sinh viên chính quy xác thực', passed: true },
      { label: 'Biên bản đối soát điện nước kỹ thuật đã lập', passed: true },
      { label: 'Đã hoàn tất thanh toán giữ chỗ', passed: true },
    ],
    documents: ['bien-ban-kiem-tra-cong-to.pdf'],
  },
];

/* ────────── 2. Room & Bed Status Cards ────────── */
export const STAFF_ROOMS: RoomInventoryCard[] = [
  {
    roomNumber: 'A102',
    building: 'Tòa A',
    floor: 1,
    gender: 'Nữ',
    roomType: '4 giường máy lạnh',
    beds: [
      { bedId: 'b-01', bedCode: 'A102-G1', status: 'OCCUPIED', occupant: { name: 'Lê Thị Thu Thảo', studentId: 'SE180123' } },
      { bedId: 'b-02', bedCode: 'A102-G2', status: 'OCCUPIED', occupant: { name: 'Nguyễn Thảo My', studentId: 'SS190201' } },
      { bedId: 'b-03', bedCode: 'A102-G3', status: 'AVAILABLE' },
      { bedId: 'b-04', bedCode: 'A102-G4', status: 'MAINTENANCE' },
    ],
  },
  {
    roomNumber: 'B205',
    building: 'Tòa B',
    floor: 2,
    gender: 'Nam',
    roomType: '4 giường quạt',
    beds: [
      { bedId: 'b-05', bedCode: 'B205-G1', status: 'OCCUPIED', occupant: { name: 'Trần Minh Hoàng', studentId: 'SE190882' } },
      { bedId: 'b-06', bedCode: 'B205-G2', status: 'AVAILABLE' },
      { bedId: 'b-07', bedCode: 'B205-G3', status: 'RESERVED', occupant: { name: 'Đỗ Minh Quân', studentId: 'SE190455' } },
      { bedId: 'b-08', bedCode: 'B205-G4', status: 'AVAILABLE' },
    ],
  },
  {
    roomNumber: 'C304',
    building: 'Tòa C',
    floor: 3,
    gender: 'Nữ',
    roomType: '2 giường dịch vụ',
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
  title: 'Đề xuất phân bổ phòng KTX Học kỳ Spring 2027 (Đợt 1)',
  semester: 'Spring 2027',
  totalAllocations: 342,
  matchRate: 98.2,
  status: 'REVIEWING',
  conflicts: [
    {
      id: 'conf-1',
      studentName: 'Mai Khánh Vy (SS190234)',
      studentId: 'SS190234',
      issue: 'Hệ thống tự động xếp tầng 4 (C402) trong khi sinh viên có chỉ định y tế tầng thấp',
      proposedResolution: 'Chuyển sang giường A102-G3 (Tầng 1 Tòa A nữ)',
      isResolved: false,
    },
    {
      id: 'conf-2',
      studentName: 'Hồ Tấn Phát (SE170321) & Bùi Văn Hùng (SE170440)',
      studentId: 'SE170321',
      issue: 'Nguyện vọng cùng phòng hợp lệ nhưng bị chia tách sang 2 phòng khác nhau',
      proposedResolution: 'Đổi giường trống B205-G2 để ghép cùng B205-G1',
      isResolved: false,
    },
    {
      id: 'conf-3',
      studentName: 'Lê Hoàng Khang (AI190012)',
      studentId: 'AI190012',
      issue: 'Phòng B310 có 1 giường báo hỏng điều hòa đang chờ phụ tùng thay thế',
      proposedResolution: 'Tạm khóa giường B310-G4 và phân bổ sang B208-G2',
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
    building: 'Tòa D',
    category: 'Điện',
    description: 'Chập aptomat khu vực máy lạnh phòng D305, ngắt nguồn cục bộ',
    reportedBy: 'Võ Minh Nhật (SE180321)',
    reportedAt: '17/10/2026 14:15',
    urgency: 'URGENT',
    status: 'IN_PROGRESS',
    assignedTech: 'Nguyễn Văn Tâm (Kỹ thuật điện)',
    slaRemaining: '0.9 giờ (Khẩn cấp)',
  },
  {
    id: 'maint-02',
    ticketCode: 'TK-10488',
    room: 'B108',
    building: 'Tòa B',
    category: 'Cấp thoát nước',
    description: 'Rò rỉ van vòi sen phòng tắm, nước tràn ra sàn phòng vệ sinh',
    reportedBy: 'Đặng Quốc Huy (SE190012)',
    reportedAt: '17/10/2026 15:00',
    urgency: 'URGENT',
    status: 'PENDING',
    assignedTech: 'Lê Văn Tài (Kỹ thuật cấp thoát)',
    slaRemaining: '1.5 giờ',
  },
  {
    id: 'maint-03',
    ticketCode: 'TK-10472',
    room: 'A204',
    building: 'Tòa A',
    category: 'Nội thất',
    description: 'Bản lề tủ quần áo giường G2 bị lỏng, cửa không khép kín',
    reportedBy: 'Nguyễn Thị Mai Anh (SE171234)',
    reportedAt: '16/10/2026 09:30',
    urgency: 'MEDIUM',
    status: 'VERIFIED_DONE',
    assignedTech: 'Trần Quốc Thắng (Tổ mộc/nội thất)',
    slaRemaining: 'Đã hoàn thành',
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
    checkinType: 'Thủ công tại quầy',
    scheduledTime: 'Hôm nay · 08:30',
    status: 'WAITING',
    inventoryItems: [
      { name: 'Thẻ từ ra vào cửa phòng & thang máy', checked: true },
      { name: 'Chìa khóa tủ cá nhân số G2', checked: true },
      { name: 'Nệm & ga trải giường tiêu chuẩn KTX', checked: true },
      { name: 'Bàn ghế học tập không trầy xước', checked: false },
      { name: 'Thiết bị vệ sinh & điều hòa hoạt động tốt', checked: false },
    ],
  },
  {
    id: 'ci-02',
    studentName: 'Trương Gia Bảo',
    studentId: 'AI180990',
    assignedRoom: 'D402',
    bedCode: 'D402-G2',
    checkinType: 'Check-in muộn',
    scheduledTime: 'Hôm nay · 18:30',
    status: 'WAITING',
    inventoryItems: [
      { name: 'Thẻ từ ra vào cửa phòng & thang máy', checked: false },
      { name: 'Chìa khóa tủ cá nhân số G2', checked: false },
      { name: 'Nệm & ga trải giường tiêu chuẩn KTX', checked: false },
      { name: 'Bàn ghế học tập không trầy xước', checked: false },
      { name: 'Thiết bị vệ sinh & điều hòa hoạt động tốt', checked: false },
    ],
  },
];
