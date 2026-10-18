import type { RoomTypeId } from './roomCatalog';

/**
 * Hình minh họa mặt bằng phòng (vẽ SVG, không phụ thuộc ảnh ngoài).
 * Thể hiện số giường, bàn học, cửa sổ và khu vệ sinh của từng loại phòng.
 */
export function RoomTypeIllustration({ type, className }: { type: RoomTypeId; className?: string }) {
  const beds = type === 'ROOM_2' ? 2 : type === 'ROOM_4' ? 4 : 6;
  const bunk = type !== 'ROOM_2';
  const cols = beds / (bunk ? 2 : 1);
  const bedW = 46;
  const gap = cols === 1 ? 0 : (200 - cols * bedW) / (cols - 1);

  return (
    <svg viewBox="0 0 240 150" className={className} role="img" aria-label={`Mặt bằng phòng ${beds} người`}>
      <rect x="0" y="0" width="240" height="150" rx="14" fill="var(--color-surface-muted)" />
      <rect x="10" y="10" width="220" height="130" rx="10" fill="var(--color-surface)" stroke="var(--color-line-strong)" strokeWidth="2" />
      {/* Cửa sổ */}
      <rect x="80" y="7" width="80" height="6" rx="3" fill="var(--color-info-soft)" />
      {/* Khu vệ sinh */}
      <rect x="182" y="96" width="44" height="40" rx="6" fill="var(--color-surface-sunken)" stroke="var(--color-line-strong)" />
      <text x="204" y="120" textAnchor="middle" fontSize="9" fill="var(--color-ink-muted)" fontFamily="sans-serif">WC</text>
      {/* Cửa ra vào */}
      <path d="M20 140 v-18 a18 18 0 0 1 18 18" fill="none" stroke="var(--color-ink-subtle)" strokeWidth="1.5" />
      {/* Giường */}
      {Array.from({ length: cols }).map((_, i) => {
        const x = 20 + i * (bedW + gap);
        return (
          <g key={i}>
            <rect x={x} y="22" width={bedW} height="62" rx="6" fill="var(--color-brand-soft)" stroke="var(--color-brand)" strokeWidth="1.5" />
            <rect x={x + 6} y="27" width={bedW - 12} height="12" rx="4" fill="var(--color-line-strong)" />
            {bunk && <text x={x + bedW / 2} y="66" textAnchor="middle" fontSize="8" fill="var(--color-brand-ink)" fontFamily="sans-serif">×2</text>}
          </g>
        );
      })}
      {/* Bàn học */}
      {Array.from({ length: type === 'ROOM_6' ? 3 : 2 }).map((_, i) => (
        <rect key={i} x={30 + i * 50} y="100" width="40" height="18" rx="3" fill="var(--color-line)" />
      ))}
    </svg>
  );
}
