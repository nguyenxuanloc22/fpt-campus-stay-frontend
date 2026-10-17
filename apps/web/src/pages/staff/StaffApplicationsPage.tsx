import { useState } from 'react';
import { Check, X } from 'lucide-react';
import { StatusBadge } from '@shared-ui/components/StatusBadge';

export function StaffApplicationsPage() {
  const [filter, setFilter] = useState('ALL');

  const [applications, setApplications] = useState([
    { id: 'app-01', name: 'Nguyễn Xuân Lộc', mssv: 'SE170123', type: 'Phòng 4 Giường (Máy lạnh)', score: 85.5, status: 'APPROVED', reason: 'Hộ khẩu > 50km, tân sinh viên' },
    { id: 'app-02', name: 'Trần Văn Hoàng', mssv: 'SE170888', type: 'Phòng 4 Giường (Máy lạnh)', score: 62.0, status: 'SUBMITTED', reason: 'Hộ khẩu TP.HCM (42km)' },
    { id: 'app-03', name: 'Lê Minh Thảo', mssv: 'IA180222', type: 'Phòng 6 Giường (Tiêu chuẩn)', score: 45.0, status: 'EXCEPTION_PENDING', reason: 'Khoảng cách gần, xin miễn giảm do gia cảnh' },
  ]);

  const handleAction = (id: string, newStatus: string) => {
    setApplications(applications.map((a) => (a.id === id ? { ...a, status: newStatus } : a)));
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-[#1A365D]">Thẩm Định Đơn Đăng Ký KTX</h1>
          <p className="text-xs text-slate-500 mt-1">Duyệt hoặc từ chối hồ sơ sinh viên dựa trên điểm ưu tiên và chỉ tiêu phòng</p>
        </div>
        <select
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          className="px-3 py-1.5 text-xs font-semibold rounded-lg border border-slate-300 bg-white"
        >
          <option value="ALL">Tất cả trạng thái</option>
          <option value="SUBMITTED">Chờ duyệt</option>
          <option value="APPROVED">Đã duyệt</option>
          <option value="EXCEPTION_PENDING">Chờ duyệt ngoại lệ</option>
        </select>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 border-b text-slate-500 font-semibold uppercase">
              <tr>
                <th className="p-4">Sinh viên</th>
                <th className="p-4">Loại phòng</th>
                <th className="p-4">Điểm ưu tiên</th>
                <th className="p-4">Ghi chú điều kiện</th>
                <th className="p-4">Trạng thái</th>
                <th className="p-4 text-right">Thao tác</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {applications.map((a) => (
                <tr key={a.id} className="hover:bg-slate-50/50 transition">
                  <td className="p-4">
                    <div className="font-bold text-slate-800">{a.name}</div>
                    <div className="text-[11px] text-slate-400">{a.mssv}</div>
                  </td>
                  <td className="p-4 text-slate-600 font-medium">{a.type}</td>
                  <td className="p-4">
                    <span className="font-bold text-[#F26F21]">{a.score}</span> / 100
                  </td>
                  <td className="p-4 text-slate-500 max-w-xs">{a.reason}</td>
                  <td className="p-4">
                    <StatusBadge status={a.status} />
                  </td>
                  <td className="p-4 text-right">
                    {a.status === 'SUBMITTED' ? (
                      <div className="flex gap-1.5 justify-end">
                        <button
                          onClick={() => handleAction(a.id, 'APPROVED')}
                          className="px-2.5 py-1 bg-emerald-50 text-emerald-700 hover:bg-emerald-100 rounded-lg font-semibold flex items-center gap-1"
                        >
                          <Check className="w-3.5 h-3.5" /> Duyệt
                        </button>
                        <button
                          onClick={() => handleAction(a.id, 'REJECTED')}
                          className="px-2.5 py-1 bg-rose-50 text-rose-700 hover:bg-rose-100 rounded-lg font-semibold flex items-center gap-1"
                        >
                          <X className="w-3.5 h-3.5" /> Từ chối
                        </button>
                      </div>
                    ) : (
                      <span className="text-[11px] text-slate-400">Đã xử lý</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
