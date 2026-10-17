import { Download } from 'lucide-react';
import { AppButton } from '@shared-ui/components/AppButton';

export function AdminFinancePage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-[#1A365D]">Báo Cáo Tài Chính & Đối Soát Ngân Hàng</h1>
          <p className="text-xs text-slate-500 mt-1">Dữ liệu dòng tiền thanh toán VietQR và đối soát sao kê MB Bank</p>
        </div>
        <AppButton size="sm" variant="outline" leftIcon={<Download className="w-4 h-4" />}>
          Xuất báo cáo kế toán (Excel)
        </AppButton>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
        <div className="p-5 bg-white rounded-xl border border-slate-200">
          <span className="text-slate-400 block mb-1">Tổng tiền phòng dự thu</span>
          <span className="text-2xl font-bold text-slate-800">1.254.000.000 ₫</span>
        </div>
        <div className="p-5 bg-white rounded-xl border border-slate-200">
          <span className="text-slate-400 block mb-1">Thực thu qua VietQR</span>
          <span className="text-2xl font-bold text-emerald-600">1.153.680.000 ₫ (92%)</span>
        </div>
        <div className="p-5 bg-white rounded-xl border border-slate-200">
          <span className="text-slate-400 block mb-1">Công nợ chưa thanh toán</span>
          <span className="text-2xl font-bold text-rose-600">100.320.000 ₫ (8%)</span>
        </div>
      </div>
    </div>
  );
}
