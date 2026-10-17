import { ShieldAlert, ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { AppButton } from '@shared-ui/components/AppButton';
import { APP_ROUTES } from '@campusstay/constants';

export function ForbiddenPage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 px-4">
      <div className="max-w-md w-full text-center bg-white p-8 rounded-2xl shadow-sm border border-slate-200">
        <div className="w-16 h-16 bg-rose-50 text-rose-600 rounded-2xl flex items-center justify-center mx-auto mb-5">
          <ShieldAlert className="w-8 h-8" />
        </div>
        <h1 className="text-2xl font-bold text-slate-800 mb-2">403 - Truy cập bị từ chối</h1>
        <p className="text-slate-600 text-sm mb-6">
          Tài khoản của bạn không có quyền hạn cần thiết để truy cập chức năng này trên hệ thống CampusStay FPT.
        </p>
        <div className="flex gap-3 justify-center">
          <AppButton
            variant="outline"
            leftIcon={<ArrowLeft className="w-4 h-4" />}
            onClick={() => navigate(-1)}
          >
            Quay lại
          </AppButton>
          <AppButton onClick={() => navigate(APP_ROUTES.STUDENT.DASHBOARD)}>
            Về trang chủ
          </AppButton>
        </div>
      </div>
    </div>
  );
}
