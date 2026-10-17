export function ManagerStaffPerformancePage() {
  const staffMembers = [
    { name: 'Trần Văn Cường', role: 'Cán bộ Quản lý Tòa A', reviewedApps: 142, resolvedTickets: 38, avgSla: '3.5 giờ', score: '98/100' },
    { name: 'Nguyễn Thị Mai', role: 'Cán bộ Quản lý Tòa C', reviewedApps: 120, resolvedTickets: 29, avgSla: '4.1 giờ', score: '95/100' },
    { name: 'Phạm Đức Thắng', role: 'Kỹ thuật viên KTX', reviewedApps: 0, resolvedTickets: 54, avgSla: '2.8 giờ', score: '99/100' },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-[#1A365D]">Giám Sát Hiệu Suất Cán Bộ (Staff Performance)</h1>
        <p className="text-xs text-slate-500 mt-1">Đánh giá thời gian phản hồi, SLA xử lý ticket và mức độ hài lòng của cư dân</p>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs divide-y divide-slate-100 text-xs">
        {staffMembers.map((s, i) => (
          <div key={i} className="p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center font-bold text-[#1A365D]">
                {s.name.charAt(0)}
              </div>
              <div>
                <div className="font-bold text-sm text-slate-800">{s.name}</div>
                <div className="text-slate-400">{s.role}</div>
              </div>
            </div>

            <div className="flex items-center gap-6">
              <div>
                <span className="text-slate-400 block text-[11px]">Đơn duyệt</span>
                <span className="font-bold text-slate-700">{s.reviewedApps} đơn</span>
              </div>
              <div>
                <span className="text-slate-400 block text-[11px]">Ticket giải quyết</span>
                <span className="font-bold text-slate-700">{s.resolvedTickets}</span>
              </div>
              <div>
                <span className="text-slate-400 block text-[11px]">SLA phản hồi</span>
                <span className="font-bold text-emerald-600">{s.avgSla}</span>
              </div>
              <div className="text-right">
                <span className="text-slate-400 block text-[11px]">Điểm KPI</span>
                <span className="font-bold text-[#F26F21] text-sm">{s.score}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
