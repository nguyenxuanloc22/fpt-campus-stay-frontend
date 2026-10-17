// ──────────────────────────────────────────────────────────────
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
  kind: 'HOÁN ĐỔI PHÒNG' | 'CHUYỂN PHÒNG ĐƠN';
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
  gender: 'Nam' | 'Nữ';
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
    major: 'Kỹ thuật phần mềm',
    roomType: '4 giường máy lạnh',
    flagDescription: 'Hồ sơ đào tạo cập nhật sinh viên học lại — Quyết định 1123/QĐ-FPTU hợp lệ',
    staffRecommendation: 'Hồ sơ đầy đủ tính pháp lý, đã kiểm tra nhân thân. Đề xuất chấp thuận nhập phòng.',
    reviewedByStaff: 'Trần Văn Cường (Cán bộ KTX)',
    documents: ['quyet-dinh-hoc-lai.pdf', 'xac-nhan-tai-chinh.pdf'],
    decision: 'PENDING',
  },
  {
    code: 'APP-SP27-004771',
    studentName: 'Mai Khánh Vy',
    studentId: 'SS190234',
    major: 'Digital Marketing',
    roomType: '4 giường máy lạnh (Tầng thấp)',
    flagDescription: 'Đề nghị phân bổ tầng 1 có chỉ định điều trị y khoa đính kèm',
    staffRecommendation: 'Đã đối chiếu chứng nhận y tế từ bệnh viện đa khoa, đủ điều kiện ưu tiên phòng A102.',
    reviewedByStaff: 'Lê Minh Khoa (Cán bộ KTX)',
    documents: ['chi-dinh-bac-si.pdf'],
    decision: 'PENDING',
  },
  {
    code: 'APP-SP27-004760',
    studentName: 'Trương Gia Bảo',
    studentId: 'AI180990',
    major: 'Trí tuệ nhân tạo',
    roomType: '2 giường tiêu chuẩn',
    flagDescription: 'Biên bản đối soát điện nước kỳ trước đã lập, chênh lệch do công tơ đo kiểm',
    staffRecommendation: 'Tổ kỹ thuật đã lập biên bản hiệu chỉnh công nợ thực tế. Đề xuất phê duyệt giữ phòng.',
    reviewedByStaff: 'Trần Văn Cường (Cán bộ KTX)',
    documents: ['bien-ban-kiem-tra-cong-to.pdf'],
    decision: 'PENDING',
  },
];

/* ────────── 2. Room Assignment Proposal Batches ────────── */
export const MANAGER_ASSIGNMENT_PROPOSALS: ManagerBatchAssignment[] = [
  {
    batchCode: 'BR-SP27-02',
    title: 'Đề xuất phân bổ phòng KTX Học kỳ Spring 2027 (Đợt 1)',
    semester: 'Spring 2027',
    reviewedByStaff: 'Trần Văn Cường & Nguyễn Thu Hà',
    totalAllocations: 342,
    matchRate: 98.2,
    resolvedConflicts: 6,
    remainingExceptions: 0,
    decision: 'PENDING',
    highlights: [
      'Phân bổ 342 sinh viên đạt 98.2% đúng nguyện vọng tòa nhà & loại phòng',
      'Đã giải quyết toàn bộ 6 xung đột phân phòng đặc thù',
      'Khi phê duyệt: Hệ thống tự động phát hành hợp đồng điện tử & mở cổng thanh toán đợt 2',
    ],
  },
];

/* ────────── 3. Room Change Requests ────────── */
export const MANAGER_ROOM_CHANGES: ManagerRoomChange[] = [
  {
    id: 'RC-2026-0231',
    kind: 'HOÁN ĐỔI PHÒNG',
    studentA: { name: 'Nguyễn Thị Mai Anh', studentId: 'SE171234', room: 'A204-G1' },
    studentB: { name: 'Võ Thị Bảo Ngọc', studentId: 'SS180112', room: 'A310-G2' },
    reason: 'Hai sinh viên thỏa thuận đổi phòng để tiện sinh hoạt học nhóm cùng chuyên ngành.',
    staffVerificationNote: 'Đã kiểm tra xác nhận điện tử từ cả hai phía, không phát sinh chênh lệch đơn giá phòng.',
    warnings: [],
    decision: 'PENDING',
  },
  {
    id: 'RC-2026-0229',
    kind: 'HOÁN ĐỔI PHÒNG',
    studentA: { name: 'Đỗ Minh Quân', studentId: 'SE190455', room: 'B210-G4' },
    studentB: { name: 'Lý Gia Huy', studentId: 'SE180421', room: 'B105-G1' },
    reason: 'Đổi phòng về tầng 1 tiện chăm sóc sức khỏe.',
    staffVerificationNote: 'Sinh viên Lý Gia Huy đã thanh toán dứt điểm hóa đơn tiện ích kỳ trước.',
    warnings: ['Đã xác minh hoàn tất thanh toán nợ cũ'],
    decision: 'PENDING',
  },
];

/* ────────── 4. Periodic Maintenance Schedules ────────── */
export const MANAGER_MAINTENANCE_SCHEDULES: ManagerMaintenanceSchedule[] = [
  {
    id: 'PMS-2026-11',
    title: 'Bảo dưỡng định kỳ toàn bộ hệ thống điều hòa nhiệt độ Tòa C',
    scope: 'Tòa C · 80 phòng lưu trú & khu vực sinh hoạt chung',
    executionWindow: '04/11 – 08/11/2026 · Khung giờ 08:30 – 11:30',
    recurrence: 'Định kỳ học kỳ',
    studentImpactNotice: 'Kỹ thuật viên vào phòng theo ca 30 phút/phòng, thông báo trước 48h cho sinh viên',
    proposer: 'Lê Văn Tài (Phó ban Kỹ thuật KTX)',
    decision: 'PENDING',
  },
  {
    id: 'PMS-2026-12',
    title: 'Kiểm định an toàn hệ thống bình nước nóng trung tâm Tòa B & Tòa D',
    scope: 'Tòa B (64 phòng) & Tòa D (90 phòng)',
    executionWindow: '15/11/2026 · Khung giờ 13:30 – 16:30',
    recurrence: 'Định kỳ hằng quý',
    studentImpactNotice: 'Tạm ngắt hệ thống nước nóng trong 60 phút, nước sinh hoạt vẫn vận hành bình thường',
    proposer: 'Nguyễn Thành Đạt (Tổ trưởng Vận hành Thiết bị)',
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
    { code: 'A', name: 'Tòa A', gender: 'Nữ', totalBeds: 288, occupiedBeds: 271, maintenanceBeds: 4, occupancyRate: 94.1, revenueMillionVnd: 4120 },
    { code: 'B', name: 'Tòa B', gender: 'Nam', totalBeds: 312, occupiedBeds: 298, maintenanceBeds: 6, occupancyRate: 95.5, revenueMillionVnd: 4470 },
    { code: 'C', name: 'Tòa C', gender: 'Nữ', totalBeds: 320, occupiedBeds: 276, maintenanceBeds: 2, occupancyRate: 86.3, revenueMillionVnd: 4380 },
    { code: 'D', name: 'Tòa D', gender: 'Nam', totalBeds: 280, occupiedBeds: 230, maintenanceBeds: 3, occupancyRate: 82.1, revenueMillionVnd: 4260 },
  ],
};
