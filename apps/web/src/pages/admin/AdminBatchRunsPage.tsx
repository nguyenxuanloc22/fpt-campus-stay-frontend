export function AdminBatchRunsPage() {
  const batchRuns = [
    { id: 'batch-01', semester: 'Fall 2026', time: '15/08/2026 10:00', duration: '2.4s', processed: 350, assigned: 340, status: 'Hoàn tất' },
    { id: 'batch-02', semester: 'Summer 2026', time: '20/04/2026 14:15', duration: '1.8s', processed: 280, assigned: 280, status: 'Hoàn tất' },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-[#1A365D]">Nhật Ký Chạy Batch Xếp Phòng Tự Động</h1>
        <p className="text-xs text-slate-500 mt-1">Lịch sử và hiệu năng của các phiên chạy thuật toán phân bổ chỗ ở</p>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs divide-y divide-slate-100 text-xs">
        {batchRuns.map((b) => (
          <div key={b.id} className="p-4 flex items-center justify-between">
            <div>
              <div className="font-bold text-slate-800 text-sm">Batch: {b.semester} ({b.id})</div>
              <div className="text-slate-400 mt-0.5">Xử lý {b.processed} hồ sơ • Thời gian chạy: {b.duration}</div>
            </div>
            <div className="text-right">
              <span className="font-bold text-emerald-600 block">{b.assigned}/{b.processed} thành công</span>
              <span className="text-[11px] text-slate-400">{b.time}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
