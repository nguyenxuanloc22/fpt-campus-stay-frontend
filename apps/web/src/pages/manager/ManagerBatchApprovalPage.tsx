import { useState } from 'react';
import { CheckCircle2, Download } from 'lucide-react';
import { AppButton } from '@shared-ui/components/AppButton';

export function ManagerBatchApprovalPage() {
  const [isApproved, setIsApproved] = useState(false);

  const stats = {
    totalRequested: 350,
    successfullyAssigned: 340,
    roommateGroupSatisfaction: '96.8%',
    unassignedDueToCapacity: 10,
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-[#1A365D]">Duyệt Kết Quả Xếp Phòng Hàng Loạt</h1>
        <p className="text-xs text-slate-500 mt-1">
          Nghiệm thu kết quả chạy từ Thuật toán xếp phòng tự động (Auto-allocation Engine)
        </p>
      </div>

      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-5">
        <h3 className="text-sm font-bold text-slate-800">Thống kê kết quả phân phòng đợt 1 - Fall 2026</h3>
        
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
          <div className="p-3.5 bg-slate-50 rounded-xl border">
            <span className="text-slate-400 block">Tổng số đơn</span>
            <span className="text-xl font-bold text-slate-800">{stats.totalRequested}</span>
          </div>
          <div className="p-3.5 bg-emerald-50 rounded-xl border border-emerald-100">
            <span className="text-emerald-700 block">Đã xếp thành công</span>
            <span className="text-xl font-bold text-emerald-800">{stats.successfullyAssigned}</span>
          </div>
          <div className="p-3.5 bg-blue-50 rounded-xl border border-blue-100">
            <span className="text-blue-700 block">Đạt nguyện vọng bạn</span>
            <span className="text-xl font-bold text-blue-800">{stats.roommateGroupSatisfaction}</span>
          </div>
          <div className="p-3.5 bg-amber-50 rounded-xl border border-amber-100">
            <span className="text-amber-700 block">Chưa xếp (hết phòng)</span>
            <span className="text-xl font-bold text-amber-800">{stats.unassignedDueToCapacity}</span>
          </div>
        </div>

        {isApproved ? (
          <div className="p-4 bg-emerald-50 text-emerald-800 rounded-xl border border-emerald-200 text-xs flex items-center justify-between">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5 text-emerald-600" />
              <span>Đã phê duyệt và phát hành kết quả xếp phòng chính thức cho sinh viên.</span>
            </div>
            <AppButton variant="outline" size="sm" leftIcon={<Download className="w-4 h-4" />}>
              Xuất Excel
            </AppButton>
          </div>
        ) : (
          <div className="pt-4 border-t flex justify-end gap-3">
            <AppButton variant="outline" size="sm" leftIcon={<Download className="w-4 h-4" />}>
              Xem trước danh sách (PDF)
            </AppButton>
            <AppButton size="sm" onClick={() => setIsApproved(true)}>
              Ký duyệt & Áp dụng chính thức
            </AppButton>
          </div>
        )}
      </div>
    </div>
  );
}
