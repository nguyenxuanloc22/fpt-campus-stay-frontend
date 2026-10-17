export function AdminAuditLogsPage() {
  const logs = [
    { id: '1', actor: 'admin@fpt.edu.vn', role: 'ADMIN', action: 'UPDATE_SEMESTER_CONFIG', target: 'Semester FALL2026', time: '15/10/2026 10:30', ip: '113.161.45.12' },
    { id: '2', actor: 'namh.mgr@fpt.edu.vn', role: 'MANAGER', action: 'APPROVE_BATCH_ALLOCATION', target: 'Batch Fall 2026', time: '15/10/2026 11:15', ip: '113.161.45.18' },
    { id: '3', actor: 'cuongtv.staff@fpt.edu.vn', role: 'STAFF', action: 'APPROVE_APPLICATION', target: 'Student SE170123', time: '15/10/2026 14:00', ip: '113.161.45.22' },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-[#1A365D]">Nhật Ký Hệ Thống (Audit Logs)</h1>
        <p className="text-xs text-slate-500 mt-1">Truy vết an ninh và lịch sử thay đổi dữ liệu phục vụ kiểm toán đồ án</p>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs divide-y divide-slate-100 text-xs">
        {logs.map((l) => (
          <div key={l.id} className="p-4 flex items-center justify-between">
            <div>
              <div className="font-bold text-slate-800">{l.action} ➔ {l.target}</div>
              <div className="text-slate-400 mt-0.5">Thực hiện bởi: <strong>{l.actor}</strong> ({l.role}) • IP: {l.ip}</div>
            </div>
            <span className="text-slate-400 font-mono text-[11px]">{l.time}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
