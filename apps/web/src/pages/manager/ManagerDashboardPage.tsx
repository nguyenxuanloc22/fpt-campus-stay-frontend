import { useNavigate } from 'react-router-dom';
import { APP_ROUTES } from '@campusstay/constants';
import { AppButton } from '@shared-ui/components/AppButton';

export function ManagerDashboardPage() {
  const navigate = useNavigate();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-[#1A365D]">Dashboard Trưởng Ban Ký Túc Xá (Manager)</h1>
        <p className="text-xs text-slate-500 mt-1">Giám sát tổng thể vận hành, phê duyệt ngoại lệ và nghiệm thu kết quả xếp phòng</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-xl border border-slate-200/80 shadow-xs">
          <div className="text-xs font-semibold text-slate-500 uppercase mb-2">Tỷ lệ lấp đầy</div>
          <div className="text-2xl font-bold text-slate-800">89.6%</div>
          <div className="text-[11px] text-emerald-600 mt-1">1.075 / 1.200 chỗ ở</div>
        </div>

        <div className="bg-white p-5 rounded-xl border border-slate-200/80 shadow-xs">
          <div className="text-xs font-semibold text-slate-500 uppercase mb-2">Đơn ngoại lệ chờ duyệt</div>
          <div className="text-2xl font-bold text-slate-800">3 đơn</div>
          <div className="text-[11px] text-purple-600 mt-1">Hồ sơ chính sách / khó khăn</div>
        </div>

        <div className="bg-white p-5 rounded-xl border border-slate-200/80 shadow-xs">
          <div className="text-xs font-semibold text-slate-500 uppercase mb-2">Doanh thu dự kiến Fall 2026</div>
          <div className="text-2xl font-bold text-slate-800">1.285 tỷ ₫</div>
          <div className="text-[11px] text-slate-500 mt-1">Đã thu: 92% qua VietQR</div>
        </div>

        <div className="bg-white p-5 rounded-xl border border-slate-200/80 shadow-xs">
          <div className="text-xs font-semibold text-slate-500 uppercase mb-2">SLA xử lý bảo trì</div>
          <div className="text-2xl font-bold text-slate-800">4.2 giờ</div>
          <div className="text-[11px] text-emerald-600 mt-1">Vượt mục tiêu SLA (&lt; 8h)</div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-3">
          <h2 className="text-sm font-bold text-[#1A365D]">Phê duyệt Kết quả Xếp phòng Hàng loạt</h2>
          <p className="text-xs text-slate-500 leading-relaxed">
            Thuật toán phân phòng tự động đã hoàn thành cho 340 sinh viên đợt 1 với tỷ lệ thỏa mãn nhóm bạn đạt 96.8%.
          </p>
          <AppButton size="sm" onClick={() => navigate(APP_ROUTES.MANAGER.BATCH_APPROVAL)}>
            Xem kết quả & Phê duyệt áp dụng
          </AppButton>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-3">
          <h2 className="text-sm font-bold text-[#1A365D]">Duyệt Hồ Sơ Ngoại Lệ</h2>
          <p className="text-xs text-slate-500 leading-relaxed">
            Xem xét 3 trường hợp sinh viên chưa đủ điều kiện tiêu chuẩn nhưng có hoàn cảnh hỗ trợ khẩn cấp.
          </p>
          <AppButton variant="outline" size="sm" onClick={() => navigate(APP_ROUTES.MANAGER.EXCEPTIONS)}>
            Thẩm định hồ sơ ngoại lệ
          </AppButton>
        </div>
      </div>
    </div>
  );
}
