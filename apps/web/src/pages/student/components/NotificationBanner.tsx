import { Megaphone, ChevronRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { APP_ROUTES } from '@campusstay/constants';

export function NotificationBanner() {
  const navigate = useNavigate();

  return (
    <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-r from-amber-50 via-orange-50 to-orange-100/60 border border-orange-200/80 shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
      <div className="flex items-center gap-3.5">
        <div className="w-11 h-11 rounded-2xl bg-[#F26F21] text-white flex items-center justify-center shrink-0 shadow-sm shadow-orange-500/20">
          <Megaphone className="w-5 h-5" />
        </div>
        <div>
          <h3 className="font-bold text-sm text-slate-900 leading-tight">
            Đợt đăng ký Ký túc xá học kỳ Fall 2026 đang mở!
          </h3>
          <p className="text-xs text-slate-600 mt-1">
            Thời gian: 12/09 – 20/09/2026 • Chọn khu nhà, loại phòng và đặt cọc trực tuyến.
          </p>
        </div>
      </div>

      <button
        type="button"
        onClick={() => navigate(APP_ROUTES.STUDENT.REGISTRATION)}
        className="px-5 py-2.5 rounded-xl bg-[#F26F21] hover:bg-[#D95A12] text-white text-xs font-bold transition shadow-xs flex items-center gap-1.5 shrink-0"
      >
        <span>Đăng ký KTX ngay</span>
        <ChevronRight className="w-3.5 h-3.5" />
      </button>
    </div>
  );
}
