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
