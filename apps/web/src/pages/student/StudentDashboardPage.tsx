import { Building2, Calendar, FileText, CreditCard, Wrench, ShieldCheck, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '@features/auth';
import { APP_ROUTES } from '@campusstay/constants';
import { StatusBadge } from '@shared-ui/components/StatusBadge';
import { AppButton } from '@shared-ui/components/AppButton';

export function StudentDashboardPage() {
  const navigate = useNavigate();
  const user = useAuthStore((state) => state.user);

  return (
    <div className="space-y-6">
      {/* Welcome Banner */}
      <div className="bg-gradient-to-r from-[#1A365D] to-[#2A4D7E] text-white p-6 md:p-8 rounded-2xl shadow-sm relative overflow-hidden">
        <div className="relative z-10 max-w-2xl">
          <span className="inline-block px-3 py-1 bg-white/10 text-orange-300 rounded-full text-xs font-semibold mb-3">
            Học kỳ Fall 2026 • FPT University Tân Uyên
          </span>
          <h1 className="text-2xl md:text-3xl font-bold mb-2">
            Xin chào, {user?.name}! 👋
          </h1>
          <p className="text-slate-200 text-sm leading-relaxed mb-6">
            Cổng thông tin ký túc xá FPT Tân Uyên. Theo dõi tình trạng phân phòng, nộp đơn gia hạn, tra cứu hóa đơn và gửi yêu cầu hỗ trợ trực tuyến.
          </p>
          <div className="flex flex-wrap gap-3">
            <AppButton
              onClick={() => navigate(APP_ROUTES.STUDENT.REGISTRATION)}
              rightIcon={<ArrowRight className="w-4 h-4" />}
            >
              Đăng ký phòng kỳ mới
            </AppButton>
            <AppButton
              variant="outline"
              className="bg-white/10 text-white border-white/20 hover:bg-white/20"
              onClick={() => navigate(APP_ROUTES.STUDENT.INVOICES)}
            >
              Hóa đơn & Thanh toán VietQR
            </AppButton>
          </div>
        </div>
      </div>

      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        <div className="bg-white p-5 rounded-xl border border-slate-200/80 shadow-xs">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-semibold text-slate-500 uppercase">Phòng hiện tại</span>
            <Building2 className="w-5 h-5 text-[#F26F21]" />
          </div>
          <div className="text-2xl font-bold text-slate-800 mb-1">Phòng A204</div>
          <div className="text-xs text-slate-500 flex items-center justify-between">
            <span>Tòa A (Nam) • Giường G1</span>
            <StatusBadge status="OCCUPIED" customLabel="Đang lưu trú" />
          </div>
        </div>

        <div className="bg-white p-5 rounded-xl border border-slate-200/80 shadow-xs">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-semibold text-slate-500 uppercase">Hợp đồng lưu trú</span>
            <FileText className="w-5 h-5 text-blue-600" />
          </div>
          <div className="text-2xl font-bold text-slate-800 mb-1">HD-KTX-0789</div>
          <div className="text-xs text-slate-500 flex items-center justify-between">
            <span>Hạn: 31/12/2026</span>
            <StatusBadge status="APPROVED" customLabel="Đã ký số" />
          </div>
        </div>

        <div className="bg-white p-5 rounded-xl border border-slate-200/80 shadow-xs">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-semibold text-slate-500 uppercase">Hóa đơn kỳ này</span>
            <CreditCard className="w-5 h-5 text-amber-500" />
          </div>
          <div className="text-2xl font-bold text-slate-800 mb-1">5.800.000 ₫</div>
          <div className="text-xs text-slate-500 flex items-center justify-between">
            <span>Hạn chót: 25/08/2026</span>
            <StatusBadge status="UNPAID" />
          </div>
        </div>
      </div>

      {/* Quick Action Grid */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs">
        <h2 className="text-base font-bold text-[#1A365D] mb-4">Lối tắt thao tác nhanh</h2>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <button
            type="button"
            onClick={() => navigate(APP_ROUTES.STUDENT.ROOMS)}
            className="p-4 rounded-xl border border-slate-100 bg-slate-50/50 hover:bg-[#FFF2EA] hover:border-orange-200 text-left transition group"
          >
            <Building2 className="w-6 h-6 text-[#F26F21] mb-2" />
            <div className="font-semibold text-xs text-slate-800">Sơ đồ phòng</div>
            <div className="text-[11px] text-slate-500">Xem tòa & tầng</div>
          </button>

          <button
            type="button"
            onClick={() => navigate(APP_ROUTES.STUDENT.ROOMMATES)}
            className="p-4 rounded-xl border border-slate-100 bg-slate-50/50 hover:bg-[#FFF2EA] hover:border-orange-200 text-left transition group"
          >
            <ShieldCheck className="w-6 h-6 text-[#1A365D] mb-2" />
            <div className="font-semibold text-xs text-slate-800">Bạn cùng phòng</div>
            <div className="text-[11px] text-slate-500">Ghép nhóm mã PIN</div>
          </button>

          <button
            type="button"
            onClick={() => navigate(APP_ROUTES.STUDENT.REQUESTS)}
            className="p-4 rounded-xl border border-slate-100 bg-slate-50/50 hover:bg-[#FFF2EA] hover:border-orange-200 text-left transition group"
          >
            <Wrench className="w-6 h-6 text-emerald-600 mb-2" />
            <div className="font-semibold text-xs text-slate-800">Báo hỏng đồ đạc</div>
            <div className="text-[11px] text-slate-500">Gửi ticket bảo trì</div>
          </button>

          <button
            type="button"
            onClick={() => navigate(APP_ROUTES.STUDENT.CHECKIN)}
            className="p-4 rounded-xl border border-slate-100 bg-slate-50/50 hover:bg-[#FFF2EA] hover:border-orange-200 text-left transition group"
          >
            <Calendar className="w-6 h-6 text-purple-600 mb-2" />
            <div className="font-semibold text-xs text-slate-800">Lịch Check-in</div>
            <div className="text-[11px] text-slate-500">Nhận & trả phòng</div>
          </button>
        </div>
      </div>
    </div>
  );
}
