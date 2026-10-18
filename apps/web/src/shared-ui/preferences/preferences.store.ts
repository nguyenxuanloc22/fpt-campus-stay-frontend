import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export type Lang = 'en' | 'vi';
export type Theme = 'light' | 'dark';

interface PreferencesState {
  lang: Lang;
  theme: Theme;
  /** Đổi ngôn ngữ: lưu lựa chọn rồi tải lại trang để mọi chuỗi (kể cả dữ liệu mẫu cấp module) được dịch lại. */
  setLang: (lang: Lang) => void;
  setTheme: (theme: Theme) => void;
  toggleTheme: () => void;
}

export const PREFERENCES_KEY = 'campusstay_preferences';

const systemTheme = (): Theme => {
  try {
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  } catch {
    return 'light';
  }
};

/** Tùy chọn hiển thị của người dùng (ngôn ngữ, sáng/tối), lưu ở localStorage. Mặc định: tiếng Anh, theo hệ điều hành. */
export const usePreferences = create<PreferencesState>()(
  persist(
    (set, get) => ({
      lang: 'en',
      theme: systemTheme(),
      setLang: (lang) => {
        if (lang === get().lang) return;
        set({ lang });
        window.location.reload();
      },
      setTheme: (theme) => set({ theme }),
      toggleTheme: () => set({ theme: get().theme === 'dark' ? 'light' : 'dark' }),
    }),
    { name: PREFERENCES_KEY }
  )
);
