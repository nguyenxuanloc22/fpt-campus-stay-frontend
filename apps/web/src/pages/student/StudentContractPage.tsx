import { CheckCircle2, Download } from 'lucide-react';
import { StatusBadge } from '@shared-ui/components/StatusBadge';
import { AppButton } from '@shared-ui/components/AppButton';

export function StudentContractPage() {
  const isSigned = true;

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-[#1A365D]">Hợp Đồng Lưu Trú Ký Túc Xá</h1>
          <p className="text-xs text-slate-500 mt-1">Số: HD-KTX-2026-0789 • Học kỳ Fall 2026</p>
        </div>
        <StatusBadge status={isSigned ? 'APPROVED' : 'PENDING'} customLabel={isSigned ? 'Đã ký số' : 'Chờ ký'} />
      </div>

      <div className="bg-white rounded-2xl border border-slate-200/80 p-6 md:p-8 shadow-xs space-y-6">
        <div className="border-b pb-4 text-center">
          <h2 className="text-base font-bold text-slate-800 uppercase tracking-wide">
            CỘNG HÒA XÃ HỘI CHỦ NGHĨA VIỆT NAM
          </h2>
          <p className="text-xs text-slate-500">Độc lập - Tự do - Hạnh phúc</p>
          <h3 className="text-sm font-bold text-[#1A365D] mt-3 uppercase">
            HỢP ĐỒNG THUÊ CHỖ LƯU TRÚ KÝ TÚC XÁ ĐẠI HỌC FPT TÂN UYÊN
          </h3>
        </div>

        <div className="text-xs text-slate-600 space-y-3 leading-relaxed">
          <p><strong>BÊN CHO THUÊ (BÊN A):</strong> Ban Quản lý Ký túc xá Đại học FPT Phân hiệu Bình Dương (Tân Uyên).</p>
          <p><strong>BÊN THUÊ (BÊN B):</strong> Sinh viên <strong>Nguyễn Xuân Lộc</strong> - MSSV: <strong>SE170123</strong>.</p>
          <div className="p-3.5 bg-slate-50 rounded-xl space-y-1.5 border border-slate-100">
            <div>• Vị trí chỉ định: <strong>Phòng A204 - Giường G1 (Tòa A Nam Tân Uyên)</strong></div>
            <div>• Thời hạn hợp đồng: <strong>01/09/2026 đến 31/12/2026</strong> (4 tháng)</div>
            <div>• Đơn giá thuê phòng: <strong>1.200.000 ₫ / tháng</strong> (Đã gồm chi phí cơ bản)</div>
            <div>• Tiền cọc cơ sở vật chất: <strong>1.000.000 ₫</strong> (Hoàn lại khi nghiệm thu trả phòng)</div>
          </div>
          <p>Bên B cam kết tuân thủ 100% nội quy an toàn PCCC, không sử dụng chất cấm, không nấu nướng trong phòng ngủ và thanh toán đầy đủ các khoản phí đúng thời hạn quy định.</p>
        </div>

        <div className="pt-4 border-t flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2 text-xs text-emerald-700 bg-emerald-50 px-3 py-1.5 rounded-lg border border-emerald-200">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            <span>Ký điện tử bởi Nguyễn Xuân Lộc (OTP xác thực lúc 14:20:00 15/08/2026)</span>
          </div>
          <AppButton
            variant="outline"
            size="sm"
            leftIcon={<Download className="w-4 h-4" />}
            onClick={() => alert('Đang tải file PDF hợp đồng có chữ ký số')}
          >
            Tải bản PDF
          </AppButton>
        </div>
      </div>
    </div>
  );
}
