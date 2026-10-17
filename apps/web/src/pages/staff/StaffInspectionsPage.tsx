import { Plus } from 'lucide-react';
import { AppButton } from '@shared-ui/components/AppButton';

export function StaffInspectionsPage() {
  const inspections = [
    { id: '1', room: 'A204', date: '15/10/2026', type: 'Định kỳ', result: 'Đạt chuẩn vệ sinh & an toàn PCCC', points: 100 },
    { id: '2', room: 'B101', date: '14/10/2026', type: 'Đột xuất', result: 'Phát hiện bếp điện từ cấm nấu nướng', points: 70 },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-[#1A365D]">Lịch Kiểm Tra & Thanh Tra Phòng</h1>
          <p className="text-xs text-slate-500 mt-1">Giám sát vệ sinh, an toàn PCCC và các thiết bị cấm theo nội quy KTX</p>
        </div>
        <AppButton size="sm" leftIcon={<Plus className="w-4 h-4" />}>
          Lập biên bản mới
        </AppButton>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs divide-y divide-slate-100 text-xs">
        {inspections.map((ins) => (
          <div key={ins.id} className="p-4 flex items-center justify-between">
            <div>
              <div className="font-bold text-slate-800">Phòng {ins.room} ({ins.type})</div>
              <div className="text-slate-500 mt-0.5">Kết luận: {ins.result}</div>
              <div className="text-[11px] text-slate-400 mt-0.5">Ngày kiểm tra: {ins.date}</div>
            </div>
            <div className="text-right">
              <span className={`font-bold px-2.5 py-1 rounded-lg ${ins.points >= 80 ? 'bg-emerald-50 text-emerald-700' : 'bg-rose-50 text-rose-700'}`}>
                {ins.points} / 100 điểm
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
