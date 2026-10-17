import { Check, X } from 'lucide-react';
import { StatusBadge } from '@shared-ui/components/StatusBadge';

export function StaffRoomTransfersPage() {
  const transfers = [
    {
      id: 'tf-01',
      student: 'Lê Hoàng Nam (SE170789)',
      currentRoom: 'Phòng B102 - Giường G4',
      targetRoom: 'Phòng A204 - Giường G2',
      reason: 'Muốn ở chung phòng với nhóm bạn cùng ngành SE',
      status: 'PENDING',
    },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-[#1A365D]">Tiếp Nhận Đổi / Chuyển Phòng</h1>
        <p className="text-xs text-slate-500 mt-1">Xử lý nguyện vọng chuyển phòng, chuyển giường giữa kỳ của sinh viên</p>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs p-6 space-y-4">
        {transfers.map((t) => (
          <div key={t.id} className="p-4 rounded-xl border border-slate-200 bg-slate-50/50 space-y-3">
            <div className="flex items-center justify-between">
              <span className="font-bold text-sm text-slate-800">{t.student}</span>
              <StatusBadge status={t.status} />
            </div>
            <div className="text-xs text-slate-600 flex items-center gap-3">
              <span className="p-1.5 bg-white border rounded">Hiện tại: {t.currentRoom}</span>
              <span>➔</span>
              <span className="p-1.5 bg-orange-50 border border-orange-200 text-[#F26F21] rounded font-semibold">
                Đích: {t.targetRoom}
              </span>
            </div>
            <p className="text-xs text-slate-500">Lý do: {t.reason}</p>
            <div className="flex gap-2 pt-2 border-t justify-end">
              <button className="px-3 py-1 bg-emerald-50 text-emerald-700 hover:bg-emerald-100 rounded-lg text-xs font-semibold flex items-center gap-1">
                <Check className="w-3.5 h-3.5" /> Chấp thuận chuyển
              </button>
              <button className="px-3 py-1 bg-rose-50 text-rose-700 hover:bg-rose-100 rounded-lg text-xs font-semibold flex items-center gap-1">
                <X className="w-3.5 h-3.5" /> Từ chối
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
