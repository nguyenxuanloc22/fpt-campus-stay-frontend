import { create } from 'zustand';
import { t } from '@shared-ui';

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
  { type: 'MAINTENANCE', title: t('Report broken equipment'), description: t('Equipment in your room is broken — choose it by asset ID'), handler: t('Dormitory staff · Maintenance team'), sla: t('2 – 72 hours depending on severity') },
  { type: 'ROOM_CHANGE', title: t('Room change / swap'), description: t('Swap with a specific student (enter student ID) or wait for system matching'), handler: t('Approved by the dormitory manager'), sla: t('During the room-change window') },
  { type: 'REFUND', title: t('Refund'), description: t('Deposit refund on check-out, duplicate payment, early contract termination'), handler: t('Dormitory staff · Finance office'), sla: t('15 working days') },
  { type: 'PAYMENT_EXTENSION', title: t('Payment deadline extension'), description: t('Request a later due date for room fees in case of hardship'), handler: t('Dormitory staff'), sla: t('2 working days') },
  { type: 'RESIDENCE_CONFIRMATION', title: t('Dormitory residence certificate'), description: t('For student loans, temporary residence registration, scholarship files'), handler: t('Dormitory staff'), sla: t('3 working days') },
  { type: 'OTHER', title: t('Other request'), description: t('Other requests to the Dormitory Management Board'), handler: t('Dormitory staff'), sla: t('3 working days') },
];

export const typeMeta = (t: ApplicationType) => APPLICATION_TYPES.find((m) => m.type === t)!;

export const STATE_LABEL: Record<ApplicationState, string> = {
  SUBMITTED: t('Submitted'),
  PROCESSING: t('Processing'),
  WAITING_PARTNER: t('Awaiting your response'),
  APPROVED: t('Approved'),
  COMPLETED: t('Completed'),
  REJECTED: t('Rejected'),
  CANCELLED: t('Cancelled'),
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
    title: t('Air conditioner leaking, not cooling'),
    detail: t('The air conditioner drips water onto bed G2 and does not cool at 18°C.'),
    fields: { [t('Equipment')]: t('A204-DH-01 · Air conditioner') },
    created: '15/10/2026 21:10',
    state: 'PROCESSING',
    timeline: [
      { time: '15/10 21:10', text: t('You submitted the request with 2 photos') },
      { time: '16/10 07:45', text: t('Staff received it, category: refrigeration') },
      { time: '16/10 14:00', text: t('Repair scheduled for 18/10 09:00 — technician Lê Văn Tài') },
    ],
  },
  {
    id: 'DT-10471',
    type: 'PAYMENT_EXTENSION',
    title: t('Extension request for Fall 2026 room fee — installment 2'),
    detail: t('My family\'s October salary is delayed; I would like 7 more days to pay.'),
    fields: { [t('Invoice')]: 'INV-2026-1012', [t('Requested due date')]: '31/10/2026' },
    created: '14/10/2026 10:20',
    state: 'APPROVED',
    timeline: [
      { time: '14/10 10:20', text: t('You submitted the request') },
      { time: '15/10 09:05', text: t('Staff approved: new due date 31/10/2026') },
    ],
  },
  {
    id: 'DT-10460',
    type: 'ROOM_CHANGE',
    title: t('Room swap with SE172211'),
    detail: t('I want to share a room with my classmate for group study.'),
    fields: { [t('Partner')]: 'Võ Thị Bảo Ngọc (SE172211) · A310-G2' },
    created: '12/10/2026 19:40',
    state: 'PROCESSING',
    timeline: [
      { time: '12/10 19:40', text: t('You submitted the request') },
      { time: '13/10 08:12', text: t('Võ Thị Bảo Ngọc agreed to the swap') },
      { time: '13/10 10:00', text: t('Forwarded to the dormitory manager for approval') },
    ],
  },
  {
    id: 'DT-10431',
    type: 'MAINTENANCE',
    title: t('Loose desk power socket'),
    detail: t('The power socket at desk G1 is loose; chargers keep disconnecting.'),
    fields: { [t('Equipment')]: t('A204-BH-01 · Personal desk #1'), [t('Severity')]: t('Normal') },
    created: '10/10/2026 20:15',
    state: 'APPROVED',
    timeline: [
      { time: '10/10 20:15', text: t('You submitted the request') },
      { time: '11/10 15:00', text: t('Socket replaced — waiting for your confirmation') },
    ],
  },
  {
    id: 'DT-10377',
    type: 'MAINTENANCE',
    title: t('Bathroom light bulb burned out'),
    detail: t('The bathroom LED light flickered and then went out.'),
    fields: { [t('Equipment')]: t('A204-WC-01 · Private bathroom') },
    created: '08/10/2026 19:02',
    state: 'COMPLETED',
    timeline: [
      { time: '08/10 19:02', text: t('You submitted the request') },
      { time: '09/10 10:30', text: t('Replaced with a 12W LED bulb') },
      { time: '09/10 20:00', text: t('You confirmed completion') },
    ],
  },
  {
    id: 'DT-10302',
    type: 'RESIDENCE_CONFIRMATION',
    title: t('Residence confirmation for a student loan'),
    detail: t('I need a certificate of dormitory residence for the policy bank.'),
    fields: { [t('Purpose')]: t('Policy bank student loan'), [t('Copies')]: '2' },
    created: '01/10/2026 08:30',
    state: 'COMPLETED',
    timeline: [
      { time: '01/10 08:30', text: t('You submitted the request') },
      { time: '03/10 15:00', text: t('Certificate ready — collect it at the Dormitory Office, Building A') },
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
        { ...app, id, created: t('Just now'), state: app.type === 'ROOM_CHANGE' && app.fields[t('Partner')] ? 'WAITING_PARTNER' : 'SUBMITTED', timeline: [{ time: t('Just now'), text: t('You submitted the request') }] },
        ...s.items,
      ],
    }));
    return id;
  },
  cancel: (id) =>
    set((s) => ({ items: s.items.map((a) => (a.id === id ? { ...a, state: 'CANCELLED', timeline: [...a.timeline, { time: t('Just now'), text: t('You cancelled the request') }] } : a)) })),
  confirmDone: (id) =>
    set((s) => ({ items: s.items.map((a) => (a.id === id ? { ...a, state: 'COMPLETED', timeline: [...a.timeline, { time: t('Just now'), text: t('You confirmed completion') }] } : a)) })),
}));
