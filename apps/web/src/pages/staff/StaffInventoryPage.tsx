import { useState } from 'react';
import { Building } from 'lucide-react';
import { StatusBadge } from '@shared-ui/components/StatusBadge';

export function StaffInventoryPage() {
  const [selectedBuilding, setSelectedBuilding] = useState('DOM-A');

  const beds = [
    { id: '1', room: 'A201', bed: 'G1', status: 'OCCUPIED', student: 'Trần Văn An (SE170111)' },
    { id: '2', room: 'A201', bed: 'G2', status: 'OCCUPIED', student: 'Lê Hoàng Tuấn (SE170222)' },
    { id: '3', room: 'A201', bed: 'G3', status: 'AVAILABLE', student: null },
    { id: '4', room: 'A201', bed: 'G4', status: 'MAINTENANCE', student: 'Khóa sửa khung giường' },
    { id: '5', room: 'A204', bed: 'G1', status: 'OCCUPIED', student: 'Nguyễn Xuân Lộc (SE170123)' },
    { id: '6', room: 'A204', bed: 'G2', status: 'AVAILABLE', student: null },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-[#1A365D]">Tồn Kho Phòng & Giường KTX</h1>
          <p className="text-xs text-slate-500 mt-1">Cây sơ đồ Tòa → Tầng → Phòng → Giường và trạng thái cư dân</p>
        </div>
        <select
          value={selectedBuilding}
          onChange={(e) => setSelectedBuilding(e.target.value)}
          className="px-3 py-1.5 text-xs font-semibold rounded-lg border border-slate-300 bg-white"
        >
          <option value="DOM-A">Tòa A (Nam Tân Uyên)</option>
          <option value="DOM-B">Tòa B (Nam Tân Uyên)</option>
          <option value="DOM-C">Tòa C (Nữ Tân Uyên)</option>
        </select>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-xs">
        <h3 className="text-sm font-bold text-slate-800 mb-4 flex items-center gap-2">
          <Building className="w-4 h-4 text-[#F26F21]" />
          <span>Danh sách giường tầng 2 - Tòa A</span>
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {beds.map((b) => (
            <div key={b.id} className="p-4 rounded-xl border border-slate-200 bg-slate-50/50 flex flex-col justify-between space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-bold text-sm text-slate-800">Phòng {b.room} - Giường {b.bed}</span>
                <StatusBadge status={b.status} />
              </div>
              <div className="text-xs text-slate-500">
                {b.student ? (
                  <span>👤 {b.student}</span>
                ) : (
                  <span className="text-emerald-600 font-semibold">Giường trống - Sẵn sàng bố trí</span>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
