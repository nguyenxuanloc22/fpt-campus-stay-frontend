import { useMemo } from 'react';

interface VietQrCodeProps {
  /** Nội dung dùng để sinh hoa văn — ở bản thật là chuỗi EMVCo do Backend trả về. */
  value: string;
  size?: number;
}

const GRID = 25;

/**
 * Hiển thị mã VietQR. Khi chưa nối API, vẽ hoa văn tất định từ `value` để giao diện trông như thật
 * mà không cần thư viện QR; khi nối API, thay bằng ảnh `qrDataURL` do Backend trả về.
 */
export function VietQrCode({ value, size = 192 }: VietQrCodeProps) {
  const cells = useMemo(() => {
    let h = Array.from(value).reduce((a, c) => a * 31 + c.charCodeAt(0), 7) >>> 0;
    const out: boolean[] = [];
    for (let i = 0; i < GRID * GRID; i++) {
      h = (h * 1103515245 + 12345) >>> 0;
      out.push(((h >> 16) & 1) === 1);
    }
    return out;
  }, [value]);

  const isFinder = (x: number, y: number) =>
    (x < 7 && y < 7) || (x >= GRID - 7 && y < 7) || (x < 7 && y >= GRID - 7);
  const finderOn = (x: number, y: number) => {
    const fx = x >= GRID - 7 ? x - (GRID - 7) : x;
    const fy = y >= GRID - 7 ? y - (GRID - 7) : y;
    return fx === 0 || fx === 6 || fy === 0 || fy === 6 || (fx >= 2 && fx <= 4 && fy >= 2 && fy <= 4);
  };

  return (
    <svg
      viewBox={`0 0 ${GRID} ${GRID}`}
      width={size}
      height={size}
      shapeRendering="crispEdges"
      role="img"
      aria-label="Mã VietQR"
    >
      <rect width={GRID} height={GRID} fill="#fff" />
      {cells.map((on, i) => {
        const x = i % GRID;
        const y = Math.floor(i / GRID);
        const fill = isFinder(x, y) ? finderOn(x, y) : on;
        return fill ? <rect key={i} x={x} y={y} width={1} height={1} fill="#0f172a" /> : null;
      })}
    </svg>
  );
}
