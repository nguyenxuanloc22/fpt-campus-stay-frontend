import { useState } from 'react';
import { Check, X } from 'lucide-react';
import { StatusBadge } from '@shared-ui/components/StatusBadge';

export function ManagerExceptionsPage() {
  const [exceptions, setExceptions] = useState([
    {
      id: 'exp-01',
      student: 'Lê Minh Thảo (IA180222)',
      reason: 'Hộ khẩu TP.HCM (42km), nhưng thuộc diện gia đình chính sách thương binh.',
      request: 'Đặc cách duyệt phòng 6 giường tiêu chuẩn',
      status: 'EXCEPTION_PENDING',
    },
    {
      id: 'exp-02',
      student: 'Nguyễn Văn Đạt (SE160333)',
      reason: 'Sinh viên năm cuối làm đồ án tốt nghiệp cần lưu trú thêm 1 kỳ tại trường.',
      request: 'Gia hạn thêm 1 kỳ học',
      status: 'EXCEPTION_PENDING',
    },
  ]);

  const handleAction = (id: string, approved: boolean) => {
    setExceptions(exceptions.map((e) => (e.id === id ? { ...e, status: approved ? 'APPROVED' : 'REJECTED' } : e)));
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-[#1A365D]">Phê Duyệt Đơn Ngoại Lệ (Manager Approval)</h1>
        <p className="text-xs text-slate-500 mt-1">
          Dành riêng cho Trưởng ban KTX: Phê duyệt các ca hoàn cảnh đặc biệt ngoài tiêu chuẩn tự động
        </p>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs divide-y divide-slate-100 text-xs">
        {exceptions.map((ex) => (
          <div key={ex.id} className="p-5 space-y-3">
            <div className="flex items-center justify-between">
              <span className="font-bold text-sm text-slate-800">{ex.student}</span>
              <StatusBadge status={ex.status} />
            </div>
            <div className="p-3 bg-slate-50 rounded-xl space-y-1">
              <div><strong>Hoàn cảnh:</strong> {ex.reason}</div>
              <div><strong>Đề xuất:</strong> {ex.request}</div>
            </div>
            {ex.status === 'EXCEPTION_PENDING' && (
              <div className="flex justify-end gap-2 pt-2">
                <button
                  onClick={() => handleAction(ex.id, true)}
                  className="px-3 py-1.5 bg-emerald-600 text-white hover:bg-emerald-700 rounded-lg font-semibold flex items-center gap-1 shadow-xs"
                >
                  <Check className="w-3.5 h-3.5" /> Phê duyệt đặc cách
                </button>
                <button
                  onClick={() => handleAction(ex.id, false)}
                  className="px-3 py-1.5 bg-rose-50 text-rose-700 hover:bg-rose-100 rounded-lg font-semibold flex items-center gap-1"
                >
                  <X className="w-3.5 h-3.5" /> Bác bỏ
                </button>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
