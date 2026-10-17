import { useState } from 'react';
import { QrCode, Copy, Check } from 'lucide-react';
import { StatusBadge } from '@shared-ui/components/StatusBadge';
import { AppButton } from '@shared-ui/components/AppButton';

export function StudentInvoicesPage() {
  const [showQrModal, setShowQrModal] = useState(false);
  const [copied, setCopied] = useState(false);

  const qrData = {
    accountNo: '03456789999',
    bankName: 'MB Bank (Quân Đội)',
    accountName: 'FPT UNIVERSITY CAMPUSSTAY',
    amount: '5.800.000 ₫',
    content: 'CSFP INV-FALL26-001 SE170123',
    qrImage: 'https://api.vietqr.io/image/970422-0901234567-compact2.png?amount=5800000&addInfo=CSFP%20INV001&accountName=FPT%20CAMPUSSTAY',
  };

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-[#1A365D]">Hóa Đơn & Thanh Toán VietQR</h1>
        <p className="text-xs text-slate-500 mt-1">Danh sách khoản thu và cổng thanh toán tự động VietQR chuẩn NAPAS247</p>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden">
        <div className="p-6 border-b flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="font-bold text-base text-slate-800">Tiền phòng Fall 2026 (Phòng A204 - Giường G1)</span>
              <StatusBadge status="UNPAID" />
            </div>
            <div className="text-xs text-slate-500">Mã hóa đơn: INV-FALL26-001 • Hạn thanh toán: 25/08/2026</div>
          </div>
          <div className="text-right">
            <div className="text-xs text-slate-400">Tổng thanh toán</div>
            <div className="text-xl font-black text-[#F26F21]">5.800.000 ₫</div>
          </div>
        </div>

        <div className="p-6 bg-slate-50/50 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="text-xs text-slate-600">
            <div>• Tiền phòng (4 tháng x 1.200.000 ₫): <strong>4.800.000 ₫</strong></div>
            <div>• Tiền cọc cơ sở vật chất (hoàn lại): <strong>1.000.000 ₫</strong></div>
          </div>
          <AppButton
            onClick={() => setShowQrModal(true)}
            leftIcon={<QrCode className="w-4 h-4" />}
          >
            Mở mã VietQR thanh toán
          </AppButton>
        </div>
      </div>

      {/* VietQR Modal */}
      {showQrModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl max-w-sm w-full p-6 text-center shadow-2xl space-y-4">
            <h3 className="font-bold text-base text-slate-800">Quét mã VietQR để thanh toán</h3>
            <div className="bg-white p-3 rounded-xl border border-slate-200 shadow-inner flex justify-center">
              <img
                src={qrData.qrImage}
                alt="VietQR FPT CampusStay"
                className="w-56 h-auto object-contain rounded-lg"
              />
            </div>
            <div className="text-xs text-slate-600 text-left bg-slate-50 p-3 rounded-xl space-y-1.5">
              <div className="flex justify-between">
                <span className="text-slate-400">Ngân hàng:</span>
                <span className="font-semibold">{qrData.bankName}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Số tài khoản:</span>
                <span className="font-mono font-bold text-slate-800">{qrData.accountNo}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Nội dung:</span>
                <span className="font-mono font-bold text-[#F26F21]">{qrData.content}</span>
              </div>
            </div>
            <div className="flex gap-2">
              <AppButton
                variant="outline"
                className="flex-1"
                size="sm"
                onClick={() => handleCopy(qrData.content)}
                leftIcon={copied ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
              >
                {copied ? 'Đã chép cú pháp' : 'Chép cú pháp'}
              </AppButton>
              <AppButton variant="secondary" size="sm" onClick={() => setShowQrModal(false)}>
                Đóng
              </AppButton>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
