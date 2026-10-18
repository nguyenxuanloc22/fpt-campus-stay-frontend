import clsx from 'clsx';
import { CHART_COLORS } from '../tokens/colors';

export interface BarDatum {
  label: string;
  value: number;
  secondary?: number;
}

interface BarChartProps {
  data: BarDatum[];
  height?: number;
  formatValue?: (v: number) => string;
  primaryLabel?: string;
  secondaryLabel?: string;
}

/** Dependency-free vertical bar chart (optionally paired bars). */
export function BarChart({ data, height = 180, formatValue = (v) => String(v), primaryLabel, secondaryLabel }: BarChartProps) {
  const max = Math.max(1, ...data.map((d) => Math.max(d.value, d.secondary ?? 0)));
  const hasSecondary = data.some((d) => d.secondary !== undefined);
  return (
    <div>
      <div className="flex items-end gap-2 sm:gap-3" style={{ height }}>
        {data.map((d) => (
          <div key={d.label} className="flex-1 h-full flex flex-col justify-end items-center group relative">
            <div className="absolute top-0 -translate-y-full hidden group-hover:block bg-ink text-surface text-label px-2 py-1 rounded whitespace-nowrap z-10">
              {d.label}: {formatValue(d.value)}
              {d.secondary !== undefined && ` / ${formatValue(d.secondary)}`}
            </div>
            <div className="w-full flex items-end justify-center gap-0.5 h-full">
              <div
                className="w-full max-w-7 bg-brand-ink rounded-t-md transition-opacity group-hover:opacity-80"
                style={{ height: `${(d.value / max) * 100}%` }}
              />
              {d.secondary !== undefined && (
                <div
                  className="w-full max-w-7 bg-ink/80 rounded-t-md transition-opacity group-hover:opacity-80"
                  style={{ height: `${(d.secondary / max) * 100}%` }}
                />
              )}
            </div>
          </div>
        ))}
      </div>
      <div className="flex gap-2 sm:gap-3 mt-2 border-t border-line pt-2">
        {data.map((d) => (
          <div key={d.label} className="flex-1 text-center text-label text-ink-muted truncate">
            {d.label}
          </div>
        ))}
      </div>
      {hasSecondary && (primaryLabel || secondaryLabel) && (
        <div className="flex items-center justify-center gap-4 mt-3 text-label text-ink-muted">
          <span className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-sm bg-brand-ink" />
            {primaryLabel}
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-sm bg-ink/80" />
            {secondaryLabel}
          </span>
        </div>
      )}
    </div>
  );
}

export interface DonutSegment {
  label: string;
  value: number;
  color: string;
}

interface DonutChartProps {
  segments: DonutSegment[];
  size?: number;
  centerLabel?: string;
  centerValue?: string;
}

export function DonutChart({ segments, size = 150, centerLabel, centerValue }: DonutChartProps) {
  const total = segments.reduce((s, x) => s + x.value, 0) || 1;
  const radius = 15.9155;
  let offset = 25;
  return (
    <div className="flex flex-col sm:flex-row items-center gap-5">
      <div className="relative shrink-0" style={{ width: size, height: size }}>
        <svg viewBox="0 0 42 42" className="w-full h-full">
          <circle cx="21" cy="21" r={radius} fill="transparent" stroke={CHART_COLORS.track} strokeWidth="5" />
          {segments.map((s) => {
            const pct = (s.value / total) * 100;
            const el = (
              <circle
                key={s.label}
                cx="21"
                cy="21"
                r={radius}
                fill="transparent"
                stroke={s.color}
                strokeWidth="5"
                strokeDasharray={`${pct} ${100 - pct}`}
                strokeDashoffset={offset}
              />
            );
            offset -= pct;
            return el;
          })}
        </svg>
        {(centerValue || centerLabel) && (
          <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
            {centerValue && <span className="text-lg font-bold text-ink leading-none">{centerValue}</span>}
            {centerLabel && <span className="text-label text-ink-muted mt-1">{centerLabel}</span>}
          </div>
        )}
      </div>
      <ul className="space-y-2 text-xs w-full">
        {segments.map((s) => (
          <li key={s.label} className="flex items-center justify-between gap-3">
            <span className="flex items-center gap-2 text-ink-muted">
              <span className="w-2.5 h-2.5 rounded-full" style={{ background: s.color }} />
              {s.label}
            </span>
            <span className="font-semibold text-ink">
              {s.value.toLocaleString('vi-VN')}{' '}
              <span className="text-ink-subtle font-normal">({Math.round((s.value / total) * 100)}%)</span>
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}

interface SparklineProps {
  points: number[];
  className?: string;
  color?: string;
}

export function Sparkline({ points, className, color = CHART_COLORS.brand }: SparklineProps) {
  const max = Math.max(...points);
  const min = Math.min(...points);
  const range = max - min || 1;
  const d = points
    .map((p, i) => `${(i / Math.max(1, points.length - 1)) * 100},${30 - ((p - min) / range) * 26 - 2}`)
    .join(' ');
  return (
    <svg viewBox="0 0 100 30" preserveAspectRatio="none" className={clsx('w-full h-8', className)}>
      <polyline points={d} fill="none" stroke={color} strokeWidth="2" vectorEffect="non-scaling-stroke" />
    </svg>
  );
}
