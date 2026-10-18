import { usePreferences } from '../preferences/preferences.store';

/**
 * Dịch giao diện. Chuỗi gốc trong code là tiếng Anh; bản tiếng Việt nằm ở `i18n/vi/*`.
 *
 *   t('Overview')                        → "Tổng quan" khi chọn tiếng Việt
 *   t('{n} days left', { n: 3 })         → "Còn 3 ngày"
 *
 * Ngôn ngữ được đọc một lần lúc tải trang (đổi ngôn ngữ sẽ tải lại trang). main.tsx gọi `loadDictionary()`
 * trước khi nạp ứng dụng, nên `t` dùng được ở mọi nơi: trong component, hằng số cấp module và dữ liệu mẫu.
 * Từ điển tiếng Việt là một chunk riêng — người dùng tiếng Anh không phải tải. Chuỗi chưa dịch giữ nguyên tiếng Anh.
 */
const LANG = usePreferences.getState().lang;
let DICT: Record<string, string> = {};

/** Khi phát triển ở chế độ tiếng Việt: gom chuỗi chưa dịch vào window.__i18nMissing để bổ sung từ điển. */
const missing = import.meta.env.DEV ? new Set<string>() : null;
if (missing) (window as unknown as { __i18nMissing: Set<string> }).__i18nMissing = missing;

export const currentLang = () => LANG;

/** Nạp từ điển của ngôn ngữ hiện tại (gọi một lần trước khi render ứng dụng). */
export async function loadDictionary() {
  if (LANG === 'vi') DICT = (await import('./vi')).VI;
  document.documentElement.lang = LANG;
}

export function t(text: string, vars?: Record<string, string | number | null | undefined>): string {
  let base = text;
  if (LANG === 'vi') {
    const vi = DICT[text];
    if (vi !== undefined) base = vi;
    else missing?.add(text);
  }
  if (!vars) return base;
  return base.replace(/\{(\w+)\}/g, (m, k: string) => (k in vars ? String(vars[k] ?? '') : m));
}
