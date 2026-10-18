
import { t } from '@shared-ui';/**
 * Danh mục loại phòng & cấu hình phí — dữ liệu mẫu, khi nối API sẽ lấy từ cấu hình của Quản trị viên
 * (trang “Loại phòng & giá”). KTX Tân Uyên chỉ có 3 loại phòng: 2, 4 và 6 người.
 */

export type RoomTypeId = 'ROOM_2' | 'ROOM_4' | 'ROOM_6';

export interface Amenity {
  /** Mã thiết bị — ghép với mã phòng thành ID tài sản, ví dụ A204-DH-01 */
  code: string;
  name: string;
  /** Số lượng trong mỗi phòng */
  qty: number;
}

export interface RoomType {
  id: RoomTypeId;
  name: string;
  capacity: 2 | 4 | 6;
  pricePerTerm: number;
  description: string;
  /** Chỉ phòng 2 người được chọn bạn cùng phòng; phòng 4 và 6 người do hệ thống xếp. */
  canChooseRoommate: boolean;
  availability: 'AVAILABLE' | 'LIMITED' | 'FULL';
  amenities: Amenity[];
}

export const ROOM_TYPES: RoomType[] = [
  {
    id: 'ROOM_2',
    name: t('2-person room'),
    capacity: 2,
    pricePerTerm: 8500000,
    description: t('Private space for students who need a quiet place to study.'),
    canChooseRoommate: true,
    availability: 'LIMITED',
    amenities: [
      { code: 'GI', name: t('Single bed'), qty: 2 },
      { code: 'BH', name: t('Personal desk'), qty: 2 },
      { code: 'TU', name: t('Lockable wardrobe'), qty: 2 },
      { code: 'DH', name: t('Two-way air conditioner'), qty: 1 },
      { code: 'TL', name: t('Mini fridge'), qty: 1 },
      { code: 'NL', name: t('Water heater'), qty: 1 },
      { code: 'WC', name: t('Private bathroom'), qty: 1 },
      { code: 'WF', name: t('In-room Wi-Fi'), qty: 1 },
    ],
  },
  {
    id: 'ROOM_4',
    name: t('4-person room'),
    capacity: 4,
    pricePerTerm: 5200000,
    description: t('The popular choice, balancing cost and comfort.'),
    canChooseRoommate: false,
    availability: 'AVAILABLE',
    amenities: [
      { code: 'GT', name: t('Bunk bed'), qty: 2 },
      { code: 'BH', name: t('Personal desk'), qty: 4 },
      { code: 'TU', name: t('Lockable wardrobe'), qty: 4 },
      { code: 'DH', name: t('Air conditioner'), qty: 1 },
      { code: 'NL', name: t('Water heater'), qty: 1 },
      { code: 'WC', name: t('Private bathroom'), qty: 1 },
      { code: 'WF', name: 'Wi-Fi', qty: 1 },
    ],
  },
  {
    id: 'ROOM_6',
    name: t('6-person room'),
    capacity: 6,
    pricePerTerm: 3600000,
    description: t('Budget-friendly, spacious and airy.'),
    canChooseRoommate: false,
    availability: 'AVAILABLE',
    amenities: [
      { code: 'GT', name: t('Bunk bed'), qty: 3 },
      { code: 'BH', name: t('Personal desk'), qty: 6 },
      { code: 'TU', name: t('Lockable wardrobe'), qty: 6 },
      { code: 'QT', name: t('Ceiling fan'), qty: 2 },
      { code: 'NL', name: t('Water heater'), qty: 1 },
      { code: 'WC', name: t('Private bathroom'), qty: 1 },
      { code: 'WF', name: 'Wi-Fi', qty: 1 },
    ],
  },
];

/** Cấu hình tiền cọc do Quản trị viên thiết lập */
export const DEPOSIT_CONFIG = {
  /** % phí phòng của kỳ đầu tiên */
  percent: 20,
  /** Cọc điện nước cố định */
  utilityDeposit: 500000,
};

export const roomTypeById = (id: RoomTypeId) => ROOM_TYPES.find((r) => r.id === id)!;

export interface Asset {
  id: string;
  name: string;
  code: string;
}

/** Sinh danh sách tài sản có ID của một phòng, ví dụ A204-DH-01. */
export function assetsForRoom(roomCode: string, typeId: RoomTypeId): Asset[] {
  return roomTypeById(typeId).amenities.flatMap((a) =>
    Array.from({ length: a.qty }, (_, i) => ({
      id: `${roomCode}-${a.code}-${String(i + 1).padStart(2, '0')}`,
      name: a.qty > 1 ? `${a.name} #${i + 1}` : a.name,
      code: a.code,
    }))
  );
}

/** Kỳ học FPTU: 3 kỳ mỗi năm (Spring, Summer, Fall). Sinh viên được lưu trú tối đa đến kỳ 9. */
export const MAX_SEMESTER = 9;
const SEASONS = ['Spring', 'Summer', 'Fall'] as const;

export interface StayTerm {
  semester: number;
  label: string;
}

/** Danh sách kỳ có thể lưu trú, bắt đầu từ kỳ đăng ký kế tiếp đến kỳ 9 của sinh viên. */
export function stayTermsFrom(startSemester: number, startSeason: (typeof SEASONS)[number], startYear: number): StayTerm[] {
  const terms: StayTerm[] = [];
  let seasonIdx = SEASONS.indexOf(startSeason);
  let year = startYear;
  for (let s = startSemester; s <= MAX_SEMESTER; s++) {
    terms.push({ semester: s, label: `${SEASONS[seasonIdx]} ${year}` });
    seasonIdx = (seasonIdx + 1) % 3;
    if (seasonIdx === 0) year++;
  }
  return terms;
}
