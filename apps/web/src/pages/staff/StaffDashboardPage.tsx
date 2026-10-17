import { CheckSquare, Wrench, CalendarCheck, Layers, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { APP_ROUTES } from '@campusstay/constants';
import { AppButton } from '@shared-ui/components/AppButton';

export function StaffDashboardPage() {
  const navigate = useNavigate();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-[#1A365D]">Bàn Làm Việc Cán Bộ Ký Túc Xá (Staff)</h1>
        <p className="text-xs text-slate-500 mt-1">Quản lý tồn kho phòng, thẩm định đơn đăng ký và điều phối dịch vụ</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-xl border border-slate-200/80 shadow-xs">
          <div className="flex items-center justify-between text-xs font-semibold text-slate-500 uppercase mb-2">
            <span>Đơn chờ duyệt</span>
            <CheckSquare className="w-4 h-4 text-amber-500" />
          </div>
          <div className="text-2xl font-bold text-slate-800">18 đơn</div>
          <div className="text-[11px] text-amber-600 mt-1">Cần thẩm định trong 24h</div>
        </div>

        <div className="bg-white p-5 rounded-xl border border-slate-200/80 shadow-xs">
          <div className="flex items-center justify-between text-xs font-semibold text-slate-500 uppercase mb-2">
            <span>Ticket bảo trì</span>
            <Wrench className="w-4 h-4 text-blue-500" />
          </div>
          <div className="text-2xl font-bold text-slate-800">5 ticket</div>
          <div className="text-[11px] text-blue-600 mt-1">2 sự cố máy lạnh cần thợ</div>
        </div>

        <div className="bg-white p-5 rounded-xl border border-slate-200/80 shadow-xs">
          <div className="flex items-center justify-between text-xs font-semibold text-slate-500 uppercase mb-2">
            <span>Check-in hôm nay</span>
            <CalendarCheck className="w-4 h-4 text-purple-500" />
          </div>
          <div className="text-2xl font-bold text-slate-800">12 sinh viên</div>
          <div className="text-[11px] text-slate-500 mt-1">Lịch hẹn từ 08:30 - 16:30</div>
        </div>

        <div className="bg-white p-5 rounded-xl border border-slate-200/80 shadow-xs">
          <div className="flex items-center justify-between text-xs font-semibold text-slate-500 uppercase mb-2">
            <span>Giường trống khả dụng</span>
            <Layers className="w-4 h-4 text-emerald-500" />
          </div>
          <div className="text-2xl font-bold text-slate-800">125 / 1.200</div>
          <div className="text-[11px] text-emerald-600 mt-1">Tỷ lệ lấp đầy: 89.6%</div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs">
          <h2 className="text-sm font-bold text-[#1A365D] mb-3">Tác vụ khẩn cấp cần giải quyết</h2>
          <div className="space-y-2.5 text-xs">
            <div className="p-3 bg-slate-50 rounded-xl flex items-center justify-between">
              <div>
                <span className="font-bold text-slate-800 block">Duyệt 18 hồ sơ sinh viên K20 nộp bổ sung</span>
                <span className="text-slate-400">Đợt xét tuyển đợt 2 Fall 2026</span>
              </div>
              <AppButton size="sm" onClick={() => navigate(APP_ROUTES.STAFF.APPLICATIONS)}>
                Xử lý
              </AppButton>
            </div>
            <div className="p-3 bg-slate-50 rounded-xl flex items-center justify-between">
              <div>
                <span className="font-bold text-slate-800 block">Kiểm tra bàn giao phòng A204 (Check-in)</span>
                <span className="text-slate-400">Lịch hẹn 09:30 sáng nay</span>
              </div>
              <AppButton size="sm" variant="outline" onClick={() => navigate(APP_ROUTES.STAFF.CHECKIN_OUT)}>
                Mở biên bản
              </AppButton>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs">
          <h2 className="text-sm font-bold text-[#1A365D] mb-3">Thông báo vận hành KTX</h2>
          <p className="text-xs text-slate-500 leading-relaxed mb-4">
            Gửi thông báo nhắc nhở nội quy, lịch cắt điện nước sửa chữa hoặc cảnh báo an toàn tới toàn bộ sinh viên hoặc từng phòng cụ thể.
          </p>
          <AppButton
            variant="secondary"
            size="sm"
            onClick={() => navigate(APP_ROUTES.STAFF.BROADCAST)}
            rightIcon={<ArrowRight className="w-4 h-4" />}
          >
            Soạn thông báo phát loa / in-app
          </AppButton>
        </div>
      </div>
    </div>
  );
}
