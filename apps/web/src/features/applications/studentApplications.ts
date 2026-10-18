import { create } from 'zustand';

/**
 * Đơn từ của sinh viên — một nơi gửi nhiều loại đơn (giống mục Applications của FAP).
 * Mỗi loại đơn được chuyển tới đúng người xử lý theo docs/BUSINESS_FLOWS.md.
 */

export type ApplicationType = 'MAINTENANCE' | 'ROOM_CHANGE' | 'REFUND' | 'PAYMENT_EXTENSION' | 'RESIDENCE_CONFIRMATION' | 'OTHER';

export type ApplicationState = 'SUBMITTED' | 'PROCESSING' | 'WAITING_PARTNER' | 'APPROVED' | 'COMPLETED' | 'REJECTED' | 'CANCELLED';

export interface ApplicationTypeMeta {
  type: ApplicationType;
  title: string;
  description: string;
  handler: string;
  sla: string;
}

export const APPLICATION_TYPES: ApplicationTypeMeta[] = [
  { type: 'MAINTENANCE', title: 'Báo hỏng thiết bị', description: 'Thiết bị trong phòng bị hỏng — chọn theo mã tài sản', handler: 'Cán bộ KTX · Tổ kỹ thuật', sla: '2 – 72 giờ tùy mức độ' },
  { type: 'ROOM_CHANGE', title: 'Đổi / hoán đổi phòng', description: 'Hoán đổi với bạn cụ thể (nhập MSSV) hoặc chờ hệ thống ghép', handler: 'Trưởng ban KTX duyệt', sla: 'Trong đợt đổi phòng' },
  { type: 'REFUND', title: 'Hoàn tiền', description: 'Hoàn cọc khi trả phòng, thanh toán trùng, chấm dứt hợp đồng sớm', handler: 'Cán bộ KTX · Phòng Tài chính', sla: '15 ngày làm việc' },
  { type: 'PAYMENT_EXTENSION', title: 'Gia hạn thời hạn thanh toán', description: 'Xin lùi hạn đóng phí phòng khi có hoàn cảnh khó khăn', handler: 'Cán bộ KTX', sla: '2 ngày làm việc' },
  { type: 'RESIDENCE_CONFIRMATION', title: 'Giấy xác nhận cư trú KTX', description: 'Dùng cho vay vốn, tạm trú, hồ sơ học bổng', handler: 'Cán bộ KTX', sla: '3 ngày làm việc' },
  { type: 'OTHER', title: 'Đơn khác', description: 'Các đề nghị khác gửi Ban quản lý KTX', handler: 'Cán bộ KTX', sla: '3 ngày làm việc' },
];

export const typeMeta = (t: ApplicationType) => APPLICATION_TYPES.find((m) => m.type === t)!;

export const STATE_LABEL: Record<ApplicationState, string> = {
  SUBMITTED: 'Đã gửi',
  PROCESSING: 'Đang xử lý',
  WAITING_PARTNER: 'Chờ bạn phản hồi',
  APPROVED: 'Đã duyệt',
  COMPLETED: 'Hoàn tất',
  REJECTED: 'Bị từ chối',
  CANCELLED: 'Đã hủy',
};

export interface StudentApplication {
  id: string;
  type: ApplicationType;
  title: string;
  detail: string;
  /** Thông tin riêng của từng loại đơn, ví dụ mã tài sản, số tiền */
  fields: Record<string, string>;
  created: string;
  state: ApplicationState;
  timeline: { time: string; text: string }[];
}

const INITIAL: StudentApplication[] = [
  {
    id: 'DT-10482',
    type: 'MAINTENANCE',
    title: 'Máy lạnh chảy nước, không mát',
    detail: 'Máy lạnh chảy nước xuống giường G2, bật 18°C không mát.',
    fields: { 'Thiết bị': 'A204-DH-01 · Điều hòa' },
    created: '15/10/2026 21:10',
    state: 'PROCESSING',
    timeline: [
      { time: '15/10 21:10', text: 'Bạn gửi đơn kèm 2 ảnh' },
      { time: '16/10 07:45', text: 'Cán bộ tiếp nhận, phân loại: điện lạnh' },
      { time: '16/10 14:00', text: 'Đã lên lịch sửa 18/10 09:00 — KTV Lê Văn Tài' },
    ],
  },
  {
    id: 'DT-10471',
    type: 'PAYMENT_EXTENSION',
    title: 'Xin gia hạn phí phòng Fall 2026 — đợt 2',
    detail: 'Gia đình chậm nhận lương tháng 10, xin lùi hạn thanh toán thêm 7 ngày.',
    fields: { 'Hóa đơn': 'INV-2026-1012', 'Hạn mong muốn': '31/10/2026' },
    created: '14/10/2026 10:20',
    state: 'APPROVED',
    timeline: [
      { time: '14/10 10:20', text: 'Bạn gửi đơn' },
      { time: '15/10 09:05', text: 'Cán bộ duyệt: hạn mới 31/10/2026' },
    ],
  },
  {
    id: 'DT-10460',
    type: 'ROOM_CHANGE',
    title: 'Hoán đổi phòng với SE172211',
    detail: 'Muốn ở cùng phòng với bạn cùng lớp để học nhóm.',
    fields: { 'Đối tác': 'Võ Thị Bảo Ngọc (SE172211) · A310-G2' },
    created: '12/10/2026 19:40',
    state: 'PROCESSING',
    timeline: [
      { time: '12/10 19:40', text: 'Bạn gửi đơn' },
      { time: '13/10 08:12', text: 'Võ Thị Bảo Ngọc đã đồng ý hoán đổi' },
      { time: '13/10 10:00', text: 'Chuyển Trưởng ban KTX phê duyệt' },
    ],
  },
  {
    id: 'DT-10431',
    type: 'MAINTENANCE',
    title: 'Ổ cắm bàn học lỏng',
    detail: 'Ổ cắm bàn học G1 lỏng, cắm sạc hay bị ngắt.',
    fields: { 'Thiết bị': 'A204-BH-01 · Bàn học cá nhân #1', 'Mức độ': 'Bình thường' },
    created: '10/10/2026 20:15',
    state: 'APPROVED',
    timeline: [
      { time: '10/10 20:15', text: 'Bạn gửi đơn' },
      { time: '11/10 15:00', text: 'Đã thay ổ cắm mới — chờ bạn xác nhận' },
    ],
  },
  {
    id: 'DT-10377',
    type: 'MAINTENANCE',
    title: 'Bóng đèn nhà tắm bị cháy',
    detail: 'Đèn LED nhà tắm chập chờn rồi tắt hẳn.',
    fields: { 'Thiết bị': 'A204-WC-01 · Nhà vệ sinh khép kín' },
    created: '08/10/2026 19:02',
    state: 'COMPLETED',
    timeline: [
      { time: '08/10 19:02', text: 'Bạn gửi đơn' },
      { time: '09/10 10:30', text: 'Đã thay bóng LED 12W' },
      { time: '09/10 20:00', text: 'Bạn xác nhận hoàn tất' },
    ],
  },
  {
    id: 'DT-10302',
    type: 'RESIDENCE_CONFIRMATION',
    title: 'Xác nhận cư trú để vay vốn sinh viên',
    detail: 'Cần giấy xác nhận đang ở KTX nộp ngân hàng chính sách.',
    fields: { 'Mục đích': 'Vay vốn ngân hàng chính sách', 'Số bản': '2' },
    created: '01/10/2026 08:30',
    state: 'COMPLETED',
    timeline: [
      { time: '01/10 08:30', text: 'Bạn gửi đơn' },
      { time: '03/10 15:00', text: 'Đã có giấy xác nhận — nhận tại Văn phòng KTX Tòa A' },
    ],
  },
];

interface ApplicationsState {
  items: StudentApplication[];
  submit: (app: Omit<StudentApplication, 'id' | 'created' | 'state' | 'timeline'>) => string;
  cancel: (id: string) => void;
  confirmDone: (id: string) => void;
}

let seq = 10500;

export const useStudentApplications = create<ApplicationsState>((set) => ({
  items: INITIAL,
  submit: (app) => {
    const id = `DT-${seq++}`;
    set((s) => ({
      items: [
        { ...app, id, created: 'Vừa xong', state: app.type === 'ROOM_CHANGE' && app.fields['Đối tác'] ? 'WAITING_PARTNER' : 'SUBMITTED', timeline: [{ time: 'Vừa xong', text: 'Bạn gửi đơn' }] },
        ...s.items,
      ],
    }));
    return id;
  },
  cancel: (id) =>
    set((s) => ({ items: s.items.map((a) => (a.id === id ? { ...a, state: 'CANCELLED', timeline: [...a.timeline, { time: 'Vừa xong', text: 'Bạn đã hủy đơn' }] } : a)) })),
  confirmDone: (id) =>
    set((s) => ({ items: s.items.map((a) => (a.id === id ? { ...a, state: 'COMPLETED', timeline: [...a.timeline, { time: 'Vừa xong', text: 'Bạn xác nhận hoàn tất' }] } : a)) })),
}));
