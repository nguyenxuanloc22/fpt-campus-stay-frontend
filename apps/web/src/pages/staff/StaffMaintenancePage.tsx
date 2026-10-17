import { StatusBadge } from '@shared-ui/components/StatusBadge';

export function StaffMaintenancePage() {
  const tickets = [
    { id: '1', title: 'Điều hòa phòng A204 không lạnh', room: 'A204', category: 'Máy lạnh', tech: 'Chú Ba', status: 'IN_PROGRESS' },
    { id: '2', title: 'Bóng đèn huỳnh quang phòng B102 chớp', room: 'B102', category: 'Điện', tech: 'Anh Nam', status: 'PENDING' },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-[#1A365D]">Điều Phối & Xử Lý Bảo Trì</h1>
        <p className="text-xs text-slate-500 mt-1">Tiếp nhận phản ánh hỏng hóc, gán kỹ thuật viên và đóng ticket</p>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs divide-y divide-slate-100 text-xs">
        {tickets.map((t) => (
          <div key={t.id} className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <div className="font-bold text-slate-800 text-sm">{t.title}</div>
              <div className="text-slate-500 mt-0.5">Phòng: <strong>{t.room}</strong> • Danh mục: {t.category}</div>
              <div className="text-[11px] text-slate-400 mt-0.5">Kỹ thuật phụ trách: <strong>{t.tech}</strong></div>
            </div>
            <div className="flex items-center gap-3">
              <StatusBadge status={t.status} />
              <button className="px-3 py-1 bg-emerald-50 text-emerald-700 hover:bg-emerald-100 rounded-lg font-semibold">
                Nghiệm thu hoàn tất
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
