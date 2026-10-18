import { t } from '../i18n/t';
/** 1200000 → "1.200.000 ₫" */
export const formatVnd = (value: number) => `${value.toLocaleString('vi-VN')} ₫`;

/** Đếm ngược mm:ss từ số giây còn lại. */
export const formatCountdown = (seconds: number) => {
  const s = Math.max(0, Math.floor(seconds));
  return `${String(Math.floor(s / 60)).padStart(2, '0')}:${String(s % 60).padStart(2, '0')}`;
};

/** Che bớt số điện thoại theo CONVENTIONS §4.1: 0901234567 → 0901 *** 567 */
export const maskPhone = (phone: string) => {
  const digits = phone.replace(/\D/g, '');
  return digits.length < 7 ? phone : `${digits.slice(0, 4)} *** ${digits.slice(-3)}`;
};

/** Số ngày còn lại tới hạn "dd/mm/yyyy" (âm nếu đã quá hạn) — chỉ dùng để hiển thị. */
export const daysUntil = (ddmmyyyy: string, today = new Date()) => {
  const [d, m, y] = ddmmyyyy.split('/').map(Number);
  if (!d || !m || !y) return 0;
  const due = new Date(y, m - 1, d).getTime();
  const start = new Date(today.getFullYear(), today.getMonth(), today.getDate()).getTime();
  return Math.round((due - start) / 86_400_000);
};

/** 3 → "Còn 3 ngày", 0 → "Hạn hôm nay", -2 → "Quá hạn 2 ngày" */
export const formatDaysLeft = (days: number) => (days > 0 ? t('{0} days left', { 0: days }) : days === 0 ? t('Due today') : t('{0} days overdue', { 0: -days }));
