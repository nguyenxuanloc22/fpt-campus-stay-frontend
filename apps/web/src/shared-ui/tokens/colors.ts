/**
 * Token màu cho code JS (fill/stroke của biểu đồ SVG). Giá trị thật nằm ở `src/index.css` (@theme) —
 * ở đây chỉ tham chiếu CSS variable để không có nguồn thứ hai.
 */
export const CHART_COLORS = {
  brand: 'var(--color-chart-1)',
  blue: 'var(--color-chart-2)',
  green: 'var(--color-chart-3)',
  amber: 'var(--color-chart-4)',
  red: 'var(--color-chart-5)',
  neutral: 'var(--color-chart-6)',
  track: 'var(--color-chart-track)',
} as const;

export const TOKEN_COLORS = {
  ink: 'var(--color-ink)',
  inkSubtle: 'var(--color-ink-subtle)',
  line: 'var(--color-line)',
  lineStrong: 'var(--color-line-strong)',
  surface: 'var(--color-surface)',
  surfaceSunken: 'var(--color-surface-sunken)',
  brand: 'var(--color-brand)',
  brandInk: 'var(--color-brand-ink)',
  brandSoft: 'var(--color-brand-soft)',
} as const;
