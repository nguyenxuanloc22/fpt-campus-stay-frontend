import { useMemo, useState } from 'react';
import {
  Building2,
  Users,
  Wind,
  Search,
  LayoutGrid,
  List,
  BedDouble,
  Wifi,
  Droplets,
  ShieldCheck,
  Zap,
  Sun,
  Bath,
  Refrigerator,
  MapPin,
  Info,
  Heart,
} from 'lucide-react';
import clsx from 'clsx';
import { useNavigate } from 'react-router-dom';
import { APP_ROUTES } from '@campusstay/constants';
import {
  StatusBadge,
  PageHeader,
  StatCard,
  SectionCard,
  Tabs,
  Modal,
  AppButton,
  ProgressBar,
  EmptyState,
  useToast,
} from '@shared-ui';

type BuildingCode = 'ALL' | 'A' | 'B' | 'C' | 'D';

interface Room {
  id: string;
  number: string;
  building: Exclude<BuildingCode, 'ALL'>;
  floor: number;
  capacity: number;
  occupied: number;
  hasAc: boolean;
  price: number;
  status: 'AVAILABLE' | 'OCCUPIED' | 'MAINTENANCE';
  area: number;
  view: string;
  privateBath: boolean;
}

const BUILDINGS: Record<Exclude<BuildingCode, 'ALL'>, { name: string; gender: string; floors: number; desc: string }> = {
  A: { name: 'Tòa A', gender: 'Nữ', floors: 6, desc: 'Gần cổng chính, căn tin và nhà thi đấu' },
  B: { name: 'Tòa B', gender: 'Nam', floors: 6, desc: 'Gần khu thể thao và bãi xe máy' },
  C: { name: 'Tòa C', gender: 'Nữ', floors: 8, desc: 'Tòa mới 2025, thang máy tốc độ cao' },
  D: { name: 'Tòa D', gender: 'Nam', floors: 8, desc: 'Phòng 2–4 giường cao cấp, view hồ' },
};

function generateRooms(): Room[] {
  const rooms: Room[] = [];
  const codes: Exclude<BuildingCode, 'ALL'>[] = ['A', 'B', 'C', 'D'];
  let id = 1;
  codes.forEach((b, bi) => {
    for (let floor = 1; floor <= 4; floor++) {
      for (let n = 1; n <= 6; n++) {
        const seed = (bi * 31 + floor * 7 + n * 13) % 17;
        const capacity = b === 'D' ? (n % 2 === 0 ? 2 : 4) : b === 'B' && n > 3 ? 6 : 4;
        const hasAc = !(b === 'B' && n > 3);
        const occupied = seed % (capacity + 1);
        const status: Room['status'] = seed === 16 ? 'MAINTENANCE' : occupied >= capacity ? 'OCCUPIED' : 'AVAILABLE';
        const price = capacity === 2 ? 2200000 : capacity === 6 ? 800000 : hasAc ? 1200000 : 950000;
        rooms.push({
          id: String(id++),
          number: `${b}${floor}0${n}`,
          building: b,
          floor,
          capacity,
          occupied: status === 'MAINTENANCE' ? 0 : occupied,
          hasAc,
          price,
          status,
          area: capacity === 2 ? 20 : capacity === 6 ? 36 : 28,
          view: n <= 3 ? 'Hướng hồ / sân' : 'Hướng đường nội bộ',
          privateBath: capacity <= 4,
        });
      }
    }
  });
  return rooms;
}

const ROOM_TYPES = [
  { name: 'Phòng 2 giường cao cấp', price: '2.200.000 ₫', beds: 2, perks: ['Máy lạnh', 'WC riêng', 'Tủ lạnh mini', 'Ban công'], building: 'Tòa D' },
  { name: 'Phòng 4 giường máy lạnh', price: '1.200.000 ₫', beds: 4, perks: ['Máy lạnh', 'WC riêng', 'Bình nóng lạnh'], building: 'Tòa A, C, D' },
  { name: 'Phòng 4 giường quạt', price: '950.000 ₫', beds: 4, perks: ['Quạt trần', 'WC riêng'], building: 'Tòa A' },
  { name: 'Phòng 6 giường tiêu chuẩn', price: '800.000 ₫', beds: 6, perks: ['Quạt trần', 'WC chung tầng'], building: 'Tòa B' },
];

const formatVnd = (v: number) => `${v.toLocaleString('vi-VN')} ₫`;

export function StudentRoomsPage() {
  const navigate = useNavigate();
  const { show, toastNode } = useToast();
  const allRooms = useMemo(generateRooms, []);
  const [building, setBuilding] = useState<BuildingCode>('ALL');
  const [roomTypeFilter, setRoomTypeFilter] = useState('ALL');
  const [floorFilter, setFloorFilter] = useState('ALL');
  const [onlyAvailable, setOnlyAvailable] = useState(false);
  const [query, setQuery] = useState('');
  const [view, setView] = useState<'grid' | 'map'>('grid');
  const [selected, setSelected] = useState<Room | null>(null);
  const [favorites, setFavorites] = useState<string[]>(['A204']);

  const filtered = allRooms.filter((r) => {
    if (building !== 'ALL' && r.building !== building) return false;
    if (roomTypeFilter === 'AC' && !r.hasAc) return false;
    if (roomTypeFilter === 'STANDARD' && r.hasAc) return false;
    if (roomTypeFilter === 'VIP' && r.capacity !== 2) return false;
    if (floorFilter !== 'ALL' && r.floor !== Number(floorFilter)) return false;
    if (onlyAvailable && r.status !== 'AVAILABLE') return false;
    if (query && !r.number.toLowerCase().includes(query.toLowerCase())) return false;
    return true;
  });

  const totalBeds = allRooms.reduce((s, r) => s + r.capacity, 0);
  const usedBeds = allRooms.reduce((s, r) => s + r.occupied, 0);
  const availableRooms = allRooms.filter((r) => r.status === 'AVAILABLE').length;

  const toggleFavorite = (num: string) => {
    setFavorites((f) => (f.includes(num) ? f.filter((x) => x !== num) : [...f, num]));
  };

  const buildingTabs = [
    { value: 'ALL' as const, label: 'Tất cả tòa', count: allRooms.length },
    ...(['A', 'B', 'C', 'D'] as const).map((b) => ({
      value: b,
      label: `${BUILDINGS[b].name} (${BUILDINGS[b].gender})`,
      count: allRooms.filter((r) => r.building === b && r.status === 'AVAILABLE').length,
    })),
  ];

  const floors = Array.from(new Set(filtered.map((r) => `${r.building}-${r.floor}`)));

  return (
    <div className="space-y-6">
      <PageHeader
        title="Danh Mục Phòng & Tòa Nhà"
        description="Sơ đồ và tình trạng giường trống ký túc xá FPT Tân Uyên • Cập nhật lúc 08:15 hôm nay"
        actions={
          <AppButton size="sm" onClick={() => navigate(APP_ROUTES.STUDENT.REGISTRATION)}>
            Đăng ký phòng
          </AppButton>
        }
      />

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard label="Tổng số phòng" value={allRooms.length} icon={Building2} tone="navy" hint="4 tòa • 96 phòng mẫu" />
        <StatCard label="Phòng còn trống" value={availableRooms} icon={BedDouble} tone="emerald" hint="Có ít nhất 1 giường" />
        <StatCard label="Giường đã sử dụng" value={`${usedBeds}/${totalBeds}`} icon={Users} tone="orange" hint={`Lấp đầy ${Math.round((usedBeds / totalBeds) * 100)}%`} />
        <StatCard label="Phòng đang bảo trì" value={allRooms.filter((r) => r.status === 'MAINTENANCE').length} icon={Info} tone="rose" hint="Dự kiến xong trong 7 ngày" />
      </div>

      <Tabs items={buildingTabs} value={building} onChange={setBuilding} />

      {building !== 'ALL' && (
        <div className="flex flex-col md:flex-row md:items-center gap-4 p-4 rounded-xl bg-[#EBF2FB] border border-blue-100">
          <div className="w-12 h-12 rounded-xl bg-[#1A365D] text-white flex items-center justify-center font-bold text-lg">
            {building}
          </div>
          <div className="flex-1">
            <div className="text-sm font-bold text-[#1A365D]">
              {BUILDINGS[building].name} — Khu {BUILDINGS[building].gender}
            </div>
            <div className="text-xs text-slate-600 flex items-center gap-1 mt-0.5">
              <MapPin className="w-3 h-3" /> {BUILDINGS[building].desc} • {BUILDINGS[building].floors} tầng
            </div>
          </div>
          <div className="w-full md:w-56">
            {(() => {
              const br = allRooms.filter((r) => r.building === building);
              const cap = br.reduce((s, r) => s + r.capacity, 0);
              const occ = br.reduce((s, r) => s + r.occupied, 0);
              return (
                <>
                  <div className="flex justify-between text-[11px] text-slate-600 mb-1">
                    <span>Tỷ lệ lấp đầy</span>
                    <span className="font-semibold">{Math.round((occ / cap) * 100)}%</span>
                  </div>
                  <ProgressBar value={occ} max={cap} tone="navy" size="md" />
                </>
              );
            })()}
          </div>
        </div>
      )}

      {/* Filters */}
      <div className="bg-white p-4 rounded-xl border border-slate-200/80 flex flex-col lg:flex-row lg:items-center gap-3">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Tìm số phòng, ví dụ A204..."
            className="w-full pl-9 pr-3 py-2 text-xs rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-orange-200"
          />
        </div>
        <div className="flex flex-wrap gap-2 items-center">
          <select
            value={roomTypeFilter}
            onChange={(e) => setRoomTypeFilter(e.target.value)}
            className="px-3 py-2 text-xs rounded-lg border border-slate-200 bg-white"
          >
            <option value="ALL">Tất cả loại phòng</option>
            <option value="AC">Phòng điều hòa</option>
            <option value="STANDARD">Phòng tiêu chuẩn (quạt)</option>
            <option value="VIP">Phòng 2 giường cao cấp</option>
          </select>
          <select
            value={floorFilter}
            onChange={(e) => setFloorFilter(e.target.value)}
            className="px-3 py-2 text-xs rounded-lg border border-slate-200 bg-white"
          >
            <option value="ALL">Mọi tầng</option>
            {[1, 2, 3, 4].map((f) => (
              <option key={f} value={f}>
                Tầng {f}
              </option>
            ))}
          </select>
          <label className="flex items-center gap-2 text-xs text-slate-600 px-2">
            <input type="checkbox" checked={onlyAvailable} onChange={(e) => setOnlyAvailable(e.target.checked)} className="accent-[#F26F21]" />
            Chỉ phòng còn trống
          </label>
          <div className="flex bg-slate-100 rounded-lg p-0.5">
            <button
              type="button"
              onClick={() => setView('grid')}
              className={clsx('p-1.5 rounded-md', view === 'grid' ? 'bg-white shadow-xs text-[#F26F21]' : 'text-slate-500')}
              aria-label="Dạng lưới"
            >
              <LayoutGrid className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={() => setView('map')}
              className={clsx('p-1.5 rounded-md', view === 'map' ? 'bg-white shadow-xs text-[#F26F21]' : 'text-slate-500')}
              aria-label="Sơ đồ tầng"
            >
              <List className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      <div className="text-xs text-slate-500">
        Hiển thị <strong className="text-slate-800">{filtered.length}</strong> phòng phù hợp
      </div>

      {filtered.length === 0 ? (
        <EmptyState title="Không tìm thấy phòng" description="Thử bỏ bớt bộ lọc hoặc chọn tòa nhà khác." />
      ) : view === 'grid' ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
          {filtered.slice(0, 24).map((room) => (
            <div
              key={room.id}
              className="bg-white rounded-xl border border-slate-200/80 p-5 shadow-xs hover:border-[#F26F21] hover:shadow-sm transition group"
            >
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <span className="text-lg font-bold text-slate-800">{room.number}</span>
                  {room.capacity === 2 && (
                    <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-amber-100 text-amber-700">VIP</span>
                  )}
                </div>
                <div className="flex items-center gap-2">
                  <button type="button" onClick={() => toggleFavorite(room.number)} aria-label="Yêu thích">
                    <Heart
                      className={clsx('w-4 h-4', favorites.includes(room.number) ? 'fill-rose-500 text-rose-500' : 'text-slate-300')}
                    />
                  </button>
                  <StatusBadge status={room.status} />
                </div>
              </div>

              <div className="text-xs text-slate-500 space-y-1.5 mb-4">
                <div className="flex items-center gap-1.5">
                  <Building2 className="w-3.5 h-3.5 text-slate-400" />
                  <span>
                    {BUILDINGS[room.building].name} ({BUILDINGS[room.building].gender}) • Tầng {room.floor} • {room.area}m²
                  </span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Users className="w-3.5 h-3.5 text-slate-400" />
                  <span>
                    Đã ở {room.occupied}/{room.capacity} giường
                  </span>
                </div>
                {room.hasAc ? (
                  <div className="flex items-center gap-1.5 text-blue-600 font-medium">
                    <Wind className="w-3.5 h-3.5" />
                    <span>Trang bị máy lạnh Inverter</span>
                  </div>
                ) : (
                  <div className="flex items-center gap-1.5 text-slate-500">
                    <Sun className="w-3.5 h-3.5" />
                    <span>Quạt trần • thoáng mát tự nhiên</span>
                  </div>
                )}
              </div>

              <div className="flex gap-1 mb-4">
                {Array.from({ length: room.capacity }).map((_, i) => (
                  <div
                    key={i}
                    className={clsx(
                      'flex-1 h-2 rounded-full',
                      room.status === 'MAINTENANCE' ? 'bg-rose-200' : i < room.occupied ? 'bg-slate-400' : 'bg-emerald-400'
                    )}
                  />
                ))}
              </div>

              <div className="pt-3 border-t flex items-center justify-between">
                <div>
                  <span className="text-[11px] text-slate-400 block">Đơn giá / tháng</span>
                  <span className="text-sm font-bold text-[#F26F21]">{formatVnd(room.price)}</span>
                </div>
                <button
                  type="button"
                  onClick={() => setSelected(room)}
                  className="text-xs font-semibold px-2.5 py-1 bg-slate-100 rounded-lg group-hover:bg-[#FFF2EA] group-hover:text-[#F26F21] transition"
                >
                  Xem chi tiết
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <SectionCard title="Sơ đồ tầng" subtitle="Nhấp vào ô phòng để xem chi tiết">
          <div className="flex flex-wrap gap-4 text-[11px] text-slate-600 mb-4">
            <span className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded bg-emerald-100 border border-emerald-300" /> Còn trống
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded bg-slate-200 border border-slate-300" /> Đã đầy
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded bg-rose-100 border border-rose-300" /> Bảo trì
            </span>
          </div>
          <div className="space-y-4">
            {floors.map((key) => {
              const [b, f] = key.split('-');
              const floorRooms = filtered.filter((r) => r.building === b && r.floor === Number(f));
              return (
                <div key={key} className="flex flex-col sm:flex-row sm:items-center gap-3">
                  <div className="w-28 shrink-0 text-xs font-bold text-[#1A365D]">
                    Tòa {b} • Tầng {f}
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {floorRooms.map((r) => (
                      <button
                        key={r.id}
                        type="button"
                        onClick={() => setSelected(r)}
                        className={clsx(
                          'w-20 py-2 rounded-lg border text-center transition hover:ring-2 hover:ring-orange-200',
                          r.status === 'AVAILABLE' && 'bg-emerald-50 border-emerald-300',
                          r.status === 'OCCUPIED' && 'bg-slate-100 border-slate-300',
                          r.status === 'MAINTENANCE' && 'bg-rose-50 border-rose-300'
                        )}
                      >
                        <div className="text-xs font-bold text-slate-800">{r.number}</div>
                        <div className="text-[10px] text-slate-500">
                          {r.capacity - r.occupied} trống
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </SectionCard>
      )}

      {/* Room type comparison */}
      <SectionCard title="So sánh loại phòng" subtitle="Bảng giá áp dụng học kỳ Fall 2026 (chưa gồm điện nước)">
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
          {ROOM_TYPES.map((t, i) => (
            <div
              key={t.name}
              className={clsx(
                'rounded-xl border p-4 flex flex-col',
                i === 1 ? 'border-[#F26F21] bg-orange-50/40' : 'border-slate-200'
              )}
            >
              {i === 1 && (
                <span className="self-start text-[10px] font-bold uppercase px-2 py-0.5 rounded-full bg-[#F26F21] text-white mb-2">
                  Phổ biến nhất
                </span>
              )}
              <div className="text-sm font-bold text-slate-800">{t.name}</div>
              <div className="text-[11px] text-slate-500 mb-3">{t.building}</div>
              <div className="text-xl font-bold text-[#F26F21]">
                {t.price}
                <span className="text-xs font-medium text-slate-500"> /tháng</span>
              </div>
              <ul className="mt-3 space-y-1.5 text-xs text-slate-600 flex-1">
                <li className="flex items-center gap-2">
                  <BedDouble className="w-3.5 h-3.5 text-slate-400" /> {t.beds} giường / phòng
                </li>
                {t.perks.map((p) => (
                  <li key={p} className="flex items-center gap-2">
                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" /> {p}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </SectionCard>

      {/* Room detail modal */}
      <Modal
        open={!!selected}
        onClose={() => setSelected(null)}
        size="lg"
        title={selected ? `Phòng ${selected.number}` : ''}
        subtitle={selected ? `${BUILDINGS[selected.building].name} (${BUILDINGS[selected.building].gender}) • Tầng ${selected.floor}` : ''}
        footer={
          <>
            <AppButton variant="outline" onClick={() => setSelected(null)}>
              Đóng
            </AppButton>
            <AppButton
              disabled={selected?.status !== 'AVAILABLE'}
              onClick={() => {
                show(`Đã thêm ${selected?.number} vào danh sách nguyện vọng đăng ký`);
                setSelected(null);
              }}
            >
              Chọn làm nguyện vọng
            </AppButton>
          </>
        }
      >
        {selected && (
          <div className="space-y-5">
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
              <div className="p-3 rounded-lg bg-slate-50">
                <div className="text-slate-400">Trạng thái</div>
                <div className="mt-1">
                  <StatusBadge status={selected.status} />
                </div>
              </div>
              <div className="p-3 rounded-lg bg-slate-50">
                <div className="text-slate-400">Diện tích</div>
                <div className="font-bold text-slate-800 mt-1">{selected.area} m²</div>
              </div>
              <div className="p-3 rounded-lg bg-slate-50">
                <div className="text-slate-400">Hướng</div>
                <div className="font-bold text-slate-800 mt-1">{selected.view}</div>
              </div>
              <div className="p-3 rounded-lg bg-slate-50">
                <div className="text-slate-400">Đơn giá</div>
                <div className="font-bold text-[#F26F21] mt-1">{formatVnd(selected.price)}</div>
              </div>
            </div>

            <div>
              <div className="text-xs font-bold text-slate-700 mb-2">Sơ đồ giường</div>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {Array.from({ length: selected.capacity }).map((_, i) => {
                  const taken = i < selected.occupied;
                  return (
                    <div
                      key={i}
                      className={clsx(
                        'p-3 rounded-lg border text-xs flex items-center gap-2',
                        taken ? 'bg-slate-50 border-slate-200 text-slate-500' : 'bg-emerald-50 border-emerald-200 text-emerald-800'
                      )}
                    >
                      <BedDouble className="w-4 h-4" />
                      <div>
                        <div className="font-bold">Giường G{i + 1}</div>
                        <div className="text-[11px]">{taken ? 'Đã có người ở' : 'Còn trống'}</div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            <div>
              <div className="text-xs font-bold text-slate-700 mb-2">Tiện nghi trong phòng</div>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 text-xs text-slate-600">
                {[
                  { icon: selected.hasAc ? Wind : Sun, label: selected.hasAc ? 'Máy lạnh Inverter' : 'Quạt trần' },
                  { icon: Wifi, label: 'Wi-Fi 6 tốc độ cao' },
                  { icon: Bath, label: selected.privateBath ? 'WC riêng trong phòng' : 'WC chung tầng' },
                  { icon: Droplets, label: 'Bình nước nóng' },
                  { icon: Zap, label: 'Công tơ điện riêng' },
                  { icon: Refrigerator, label: selected.capacity === 2 ? 'Tủ lạnh mini' : 'Tủ đồ cá nhân có khóa' },
                ].map((a) => (
                  <div key={a.label} className="flex items-center gap-2 p-2 rounded-lg bg-slate-50">
                    <a.icon className="w-3.5 h-3.5 text-[#1A365D]" /> {a.label}
                  </div>
                ))}
              </div>
            </div>

            <div className="p-3 rounded-lg bg-blue-50 text-blue-800 text-[11px] leading-relaxed">
              Giá phòng chưa bao gồm điện (3.000 ₫/kWh) và nước (15.000 ₫/m³). Tiền cọc tài sản 500.000 ₫ được hoàn lại
              khi trả phòng nếu không có hư hỏng.
            </div>
          </div>
        )}
      </Modal>

      {toastNode}
    </div>
  );
}
