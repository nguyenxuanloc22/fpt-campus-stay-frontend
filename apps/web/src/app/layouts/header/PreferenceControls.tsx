import { useState } from 'react';
import { Check, ChevronDown, Moon, Sun } from 'lucide-react';
import clsx from 'clsx';
import { t, usePreferences, type Lang } from '@shared-ui';
import { useDismiss } from './useDismiss';
import { FlagGB, FlagVN } from './Flags';

const LANGS: { value: Lang; label: string; Flag: typeof FlagVN }[] = [
  { value: 'en', label: 'English', Flag: FlagGB },
  { value: 'vi', label: 'Tiếng Việt', Flag: FlagVN },
];

/** Chọn ngôn ngữ Anh / Việt (tên ngôn ngữ luôn viết bằng chính ngôn ngữ đó). */
export function LanguageSwitcher() {
  const lang = usePreferences((s) => s.lang);
  const setLang = usePreferences((s) => s.setLang);
  const [open, setOpen] = useState(false);
  const ref = useDismiss<HTMLDivElement>(open, () => setOpen(false));
  const current = LANGS.find((l) => l.value === lang) ?? LANGS[0]!;

  return (
    <div className="relative" ref={ref}>
      <button
        type="button"
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-label={`${t('Language')}: ${current.label}`}
        onClick={() => setOpen((v) => !v)}
        className="flex items-center gap-2 min-h-touch px-2 rounded-control text-body text-ink-muted hover:bg-surface-sunken hover:text-ink"
      >
        <current.Flag className="w-5 h-auto rounded-sm shadow-card" />
        <span className="hidden md:inline">{current.label}</span>
        <ChevronDown className={clsx('w-4 h-4 transition-transform', open && 'rotate-180')} aria-hidden="true" />
      </button>
      {open && (
        <ul role="listbox" aria-label={t('Language')} className="absolute right-0 top-full mt-2 w-44 bg-surface rounded-card border border-line shadow-overlay py-1 z-40">
          {LANGS.map((l) => (
            <li key={l.value} role="option" aria-selected={l.value === lang}>
              <button
                type="button"
                lang={l.value}
                onClick={() => {
                  setOpen(false);
                  setLang(l.value);
                }}
                className="w-full min-h-touch px-3 flex items-center gap-3 text-body text-ink hover:bg-surface-muted"
              >
                <l.Flag className="w-5 h-auto rounded-sm" />
                <span className="flex-1 text-left">{l.label}</span>
                {l.value === lang && <Check className="w-4 h-4 text-brand-ink" aria-hidden="true" />}
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

/** Chuyển sáng / tối. */
export function ThemeToggle() {
  const theme = usePreferences((s) => s.theme);
  const toggle = usePreferences((s) => s.toggleTheme);
  const dark = theme === 'dark';
  return (
    <button
      type="button"
      onClick={toggle}
      aria-pressed={dark}
      aria-label={dark ? t('Switch to light mode') : t('Switch to dark mode')}
      title={dark ? t('Switch to light mode') : t('Switch to dark mode')}
      className="w-touch h-touch rounded-control inline-flex items-center justify-center text-ink-muted hover:bg-surface-sunken hover:text-ink"
    >
      {dark ? <Sun className="w-5 h-5" aria-hidden="true" /> : <Moon className="w-5 h-5" aria-hidden="true" />}
    </button>
  );
}
