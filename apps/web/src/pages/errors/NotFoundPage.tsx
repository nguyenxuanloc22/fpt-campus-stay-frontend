import { Compass, ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { AppButton } from '@shared-ui/components/AppButton';

export function NotFoundPage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 px-4">
      <div className="max-w-md w-full text-center bg-white p-8 rounded-2xl shadow-sm border border-slate-200">
        <div className="w-16 h-16 bg-amber-50 text-[#F26F21] rounded-2xl flex items-center justify-center mx-auto mb-5">
          <Compass className="w-8 h-8" />
        </div>
        <h1 className="text-2xl font-bold text-slate-800 mb-2">404 - Không tìm thấy trang</h1>
        <p className="text-slate-600 text-sm mb-6">
          Đường dẫn bạn yêu cầu không tồn tại hoặc đã được chuyển sang địa chỉ mới.
        </p>
        <AppButton
          leftIcon={<ArrowLeft className="w-4 h-4" />}
          onClick={() => navigate('/')}
        >
          Về trang chính
        </AppButton>
      </div>
    </div>
  );
}
