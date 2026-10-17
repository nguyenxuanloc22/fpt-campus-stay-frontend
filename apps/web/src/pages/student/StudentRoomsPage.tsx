import { useState } from 'react';
import { Building2, Users, Wind } from 'lucide-react';
import { StatusBadge } from '@shared-ui/components/StatusBadge';

export function StudentRoomsPage() {
  const [selectedBuilding, setSelectedBuilding] = useState('ALL');
  const [roomTypeFilter, setRoomTypeFilter] = useState('ALL');

  const rooms = [
    { id: '1', number: 'A201', building: 'Tòa A', floor: 2, type: '4 Giường (Máy lạnh)', beds: '4/4', price: '1.200.000 ₫', status: 'OCCUPIED', hasAc: true },
    { id: '2', number: 'A202', building: 'Tòa A', floor: 2, type: '4 Giường (Máy lạnh)', beds: '2/4', price: '1.200.000 ₫', status: 'AVAILABLE', hasAc: true },
    { id: '3', number: 'A204', building: 'Tòa A', floor: 2, type: '4 Giường (Máy lạnh)', beds: '3/4', price: '1.200.000 ₫', status: 'AVAILABLE', hasAc: true },
    { id: '4', number: 'B101', building: 'Tòa B', floor: 1, type: '6 Giường (Tiêu chuẩn)', beds: '6/6', price: '800.000 ₫', status: 'OCCUPIED', hasAc: false },
    { id: '5', number: 'B102', building: 'Tòa B', floor: 1, type: '6 Giường (Tiêu chuẩn)', beds: '4/6', price: '800.000 ₫', status: 'AVAILABLE', hasAc: false },
    { id: '6', number: 'C301', building: 'Tòa C', floor: 3, type: '4 Giường (Máy lạnh)', beds: '1/4', price: '1.200.000 ₫', status: 'AVAILABLE', hasAc: true },
  ];

  const filtered = rooms.filter((r) => {
    if (selectedBuilding !== 'ALL' && !r.building.includes(selectedBuilding)) return false;
    if (roomTypeFilter === 'AC' && !r.hasAc) return false;
    if (roomTypeFilter === 'STANDARD' && r.hasAc) return false;
    return true;
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-[#1A365D]">Danh Mục Phòng & Tòa Nhà</h1>
          <p className="text-xs text-slate-500 mt-1">Sơ đồ và tình trạng giường trống ký túc xá FPT Tân Uyên</p>
        </div>

        {/* Filters */}
        <div className="flex gap-2">
          <select
            value={selectedBuilding}
            onChange={(e) => setSelectedBuilding(e.target.value)}
            className="px-3 py-1.5 text-xs rounded-lg border border-slate-300 bg-white"
          >
            <option value="ALL">Tất cả tòa</option>
            <option value="Tòa A">Tòa A (Nam)</option>
            <option value="Tòa B">Tòa B (Nam)</option>
            <option value="Tòa C">Tòa C (Nữ)</option>
          </select>

          <select
            value={roomTypeFilter}
            onChange={(e) => setRoomTypeFilter(e.target.value)}
            className="px-3 py-1.5 text-xs rounded-lg border border-slate-300 bg-white"
          >
            <option value="ALL">Tất cả loại phòng</option>
            <option value="AC">Phòng điều hòa</option>
            <option value="STANDARD">Phòng tiêu chuẩn</option>
          </select>
        </div>
      </div>

      {/* Room Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {filtered.map((room) => (
          <div
            key={room.id}
            className="bg-white rounded-xl border border-slate-200/80 p-5 shadow-xs hover:border-[#F26F21] transition group"
          >
            <div className="flex items-center justify-between mb-3">
              <span className="text-lg font-bold text-slate-800">{room.number}</span>
              <StatusBadge status={room.status} />
            </div>

            <div className="text-xs text-slate-500 space-y-1.5 mb-4">
              <div className="flex items-center gap-1.5">
                <Building2 className="w-3.5 h-3.5 text-slate-400" />
                <span>{room.building} • Tầng {room.floor}</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Users className="w-3.5 h-3.5 text-slate-400" />
                <span>Số lượng giường: {room.beds}</span>
              </div>
              {room.hasAc && (
                <div className="flex items-center gap-1.5 text-blue-600 font-medium">
                  <Wind className="w-3.5 h-3.5" />
                  <span>Trang bị máy lạnh Inverter</span>
                </div>
              )}
            </div>

            <div className="pt-3 border-t flex items-center justify-between">
              <div>
                <span className="text-[11px] text-slate-400 block">Đơn giá</span>
                <span className="text-sm font-bold text-[#F26F21]">{room.price}</span>
              </div>
              <span className="text-xs font-semibold px-2.5 py-1 bg-slate-100 rounded-lg group-hover:bg-[#FFF2EA] group-hover:text-[#F26F21] transition">
                Xem chi tiết
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
