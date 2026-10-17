import { RefreshCw } from 'lucide-react';
import { AppButton } from '@shared-ui/components/AppButton';

export function AdminIntegrationsPage() {
  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-[#1A365D]">Tích Hợp FPT SIS & Cổng Thanh Toán</h1>
        <p className="text-xs text-slate-500 mt-1">Quản lý kết nối API trường và Webhook thanh toán VietQR</p>
      </div>

      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-4 text-xs">
        <div className="p-4 bg-slate-50 rounded-xl flex items-center justify-between border">
          <div>
            <div className="font-bold text-slate-800 text-sm">FPT Student Information System (SIS API)</div>
            <div className="text-slate-400 mt-0.5">Đồng bộ hồ sơ sinh viên, thông tin lớp, phụ huynh và kỷ luật</div>
          </div>
          <span className="px-2.5 py-1 bg-emerald-100 text-emerald-800 font-bold rounded-lg text-xs">Đang kết nối</span>
        </div>

        <div className="p-4 bg-slate-50 rounded-xl flex items-center justify-between border">
          <div>
            <div className="font-bold text-slate-800 text-sm">Cổng Thanh Toán Tự Động VietQR NAPAS247</div>
            <div className="text-slate-400 mt-0.5">Tài khoản thụ hưởng KTX: MB Bank - 03456789999</div>
          </div>
          <span className="px-2.5 py-1 bg-emerald-100 text-emerald-800 font-bold rounded-lg text-xs">Đang kết nối</span>
        </div>

        <div className="pt-2 flex justify-end">
          <AppButton size="sm" variant="outline" leftIcon={<RefreshCw className="w-4 h-4" />}>
            Kiểm tra kết nối toàn bộ API
          </AppButton>
        </div>
      </div>
    </div>
  );
}
