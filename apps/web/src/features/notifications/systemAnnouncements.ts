/**
 * Thông báo hệ thống (Thông báo chung) — do Quản trị viên cấu hình hoặc Ban quản lý KTX gửi.
 * Thông báo có `important: true` được ghim và hiện thành popup ngay sau khi đăng nhập.
 */

export type AnnouncementCategory = 'DORM' | 'MAINTENANCE' | 'FINANCE' | 'SYSTEM';

export interface Announcement {
  id: string;
  category: AnnouncementCategory;
  title: string;
  body: string;
  source: string;
  date: string;
  important?: boolean;
}

export const ANNOUNCEMENT_CATEGORY_LABEL: Record<AnnouncementCategory, string> = {
  DORM: 'Thông tin KTX',
  MAINTENANCE: 'Bảo trì',
  FINANCE: 'Thông báo tài chính',
  SYSTEM: 'Hệ thống',
};

/** Màu nhấn theo danh mục (badge, chip lọc) — nền cam trắng, mỗi danh mục một sắc nhẹ. */
export const ANNOUNCEMENT_CATEGORY_TONE: Record<AnnouncementCategory, string> = {
  DORM: 'bg-orange-100 text-orange-700',
  MAINTENANCE: 'bg-sky-100 text-sky-700',
  FINANCE: 'bg-emerald-100 text-emerald-700',
  SYSTEM: 'bg-violet-100 text-violet-700',
};

export const ANNOUNCEMENTS: Announcement[] = [
  {
    id: 'n1',
    category: 'DORM',
    important: true,
    title: 'THÔNG BÁO: Mở cửa sổ đăng ký lưu trú học kỳ Spring 2027',
    body:
      'Kính gửi các bạn sinh viên,\n\nBan Quản lý KTX thông báo mở cổng đăng ký lưu trú học kỳ Spring 2027 từ 14/10/2026 đến 15/11/2026.\n' +
      'Sinh viên đăng ký tại mục “Đăng ký lưu trú”, chọn loại phòng và đóng tiền cọc qua VietQR để giữ chỗ.\n' +
      'Sinh viên đang ở được ưu tiên giữ phòng cũ nếu đăng ký trước ngày 01/11/2026.\n\n' +
      'Trân trọng,\nBan Quản lý Ký túc xá FPT University Tân Uyên',
    source: 'Ban Quản lý KTX',
    date: '14/10/2026 08:00',
  },
  {
    id: 'n2',
    category: 'MAINTENANCE',
    title: 'Tạm ngưng cấp nước Tòa A ngày 19/10/2026',
    body: 'Vệ sinh bồn chứa định kỳ từ 08:00 đến 14:00. Sinh viên Tòa A vui lòng chủ động dự trữ nước.',
    source: 'Ban Quản lý KTX',
    date: '16/10/2026 14:00',
  },
  {
    id: 'n3',
    category: 'FINANCE',
    title: 'Hạn thanh toán phí phòng Fall 2026 — đợt 2',
    body: 'Hạn thanh toán ngày 24/10/2026 qua VietQR. Sinh viên gặp khó khăn có thể gửi “Đơn gia hạn thanh toán” tại mục Đơn từ trước hạn ít nhất 3 ngày.',
    source: 'Ban Quản lý KTX',
    date: '15/10/2026 09:00',
  },
  {
    id: 'n4',
    category: 'MAINTENANCE',
    title: 'Nâng cấp Wi-Fi toàn khu KTX đêm 21/10',
    body: 'Mạng gián đoạn từ 22:00 ngày 21/10 đến 06:00 ngày 22/10 để lắp đặt thiết bị mới.',
    source: 'Ban Quản lý KTX',
    date: '12/10/2026 10:00',
  },
  {
    id: 'n5',
    category: 'SYSTEM',
    title: 'Cập nhật bảng giá phòng học kỳ Spring 2027',
    body: 'Phòng 2 người 8.500.000 ₫/kỳ, phòng 4 người 5.200.000 ₫/kỳ, phòng 6 người 3.600.000 ₫/kỳ. Tiền cọc 20% phí kỳ đầu cộng 500.000 ₫ cọc điện nước.',
    source: 'Quản trị hệ thống',
    date: '10/10/2026 09:00',
  },
  {
    id: 'n6',
    category: 'DORM',
    title: 'Nhắc nhở giờ giới nghiêm và đăng ký khách thăm',
    body: 'Giờ giới nghiêm 23:00. Khách thăm đăng ký tại quầy bảo vệ, xuất trình CCCD và rời KTX trước 21:00.',
    source: 'Ban Quản lý KTX',
    date: '10/10/2026 15:30',
  },
  {
    id: 'n7',
    category: 'SYSTEM',
    title: 'Bảo trì hệ thống CampusStay 02:00 – 03:00 ngày 20/10',
    body: 'Hệ thống tạm ngưng để nâng cấp. Thanh toán VietQR trong thời gian này sẽ được đối soát lại sau khi hoạt động trở lại.',
    source: 'Quản trị hệ thống',
    date: '09/10/2026 17:00',
  },
];
