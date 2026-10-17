import React, { useState } from 'react';
import { CheckCircle2, Sparkles, Send } from 'lucide-react';
import { AppButton } from '@shared-ui/components/AppButton';

export function StudentRegistrationPage() {
  const [step, setStep] = useState(1);
  const [roomType, setRoomType] = useState('PREMIUM_AIRCON_4');
  const [building, setBuilding] = useState('DOM-A');
  const [agreed, setAgreed] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitted(true);
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-[#1A365D]">Đăng ký Phòng Ký Túc Xá</h1>
        <p className="text-slate-500 text-xs mt-1">
          Học kỳ Fall 2026 • Cổng đăng ký mở từ 01/08/2026 đến 25/08/2026
        </p>
      </div>

      {/* Step Indicator */}
      <div className="grid grid-cols-3 gap-2 bg-white p-3 rounded-xl border border-slate-200">
        <div className={`p-2.5 rounded-lg text-center text-xs font-semibold ${step >= 1 ? 'bg-[#FFF2EA] text-[#F26F21]' : 'text-slate-400'}`}>
          1. Kiểm tra điều kiện
        </div>
        <div className={`p-2.5 rounded-lg text-center text-xs font-semibold ${step >= 2 ? 'bg-[#FFF2EA] text-[#F26F21]' : 'text-slate-400'}`}>
          2. Chọn loại phòng & tòa
        </div>
        <div className={`p-2.5 rounded-lg text-center text-xs font-semibold ${step >= 3 ? 'bg-[#FFF2EA] text-[#F26F21]' : 'text-slate-400'}`}>
          3. Xác nhận & Nộp đơn
        </div>
      </div>

      {step === 1 && (
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-4">
          <div className="flex items-center gap-3 p-4 bg-emerald-50 rounded-xl border border-emerald-200 text-emerald-800">
            <CheckCircle2 className="w-6 h-6 shrink-0 text-emerald-600" />
            <div>
              <div className="font-bold text-sm">Đủ điều kiện xét duyệt KTX</div>
              <div className="text-xs text-emerald-700">Điểm ưu tiên tính toán: 85.5 / 100 điểm</div>
            </div>
          </div>
          <div className="space-y-2 text-xs text-slate-600">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-[#F26F21]" />
              <span>Hộ khẩu cách trường &gt; 50km (Ưu tiên vùng xa FPT Tân Uyên)</span>
            </div>
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-[#F26F21]" />
              <span>Không vi phạm kỷ luật nội quy ký túc xá kỳ trước</span>
            </div>
          </div>
          <div className="pt-4 border-t flex justify-end">
            <AppButton onClick={() => setStep(2)}>Tiếp tục bước 2</AppButton>
          </div>
        </div>
      )}

      {step === 2 && (
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-5">
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-2">Chọn Loại Phòng</label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setRoomType('PREMIUM_AIRCON_4')}
                className={`p-4 rounded-xl border text-left transition ${roomType === 'PREMIUM_AIRCON_4' ? 'border-[#F26F21] bg-[#FFF2EA]/40' : 'border-slate-200'}`}
              >
                <div className="font-bold text-sm text-slate-800">Phòng 4 Giường (Điều hòa)</div>
                <div className="text-xs text-[#F26F21] font-semibold mt-1">1.200.000 ₫ / tháng</div>
                <div className="text-[11px] text-slate-500 mt-1">Bao gồm điều hòa, WC khép kín, bình nóng lạnh</div>
              </button>
              <button
                type="button"
                onClick={() => setRoomType('STANDARD_6')}
                className={`p-4 rounded-xl border text-left transition ${roomType === 'STANDARD_6' ? 'border-[#F26F21] bg-[#FFF2EA]/40' : 'border-slate-200'}`}
              >
                <div className="font-bold text-sm text-slate-800">Phòng 6 Giường (Tiêu chuẩn)</div>
                <div className="text-xs text-[#F26F21] font-semibold mt-1">800.000 ₫ / tháng</div>
                <div className="text-[11px] text-slate-500 mt-1">Quạt trần, WC khép kín, bàn học cá nhân</div>
              </button>
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-2">Tòa nhà mong muốn</label>
            <select
              value={building}
              onChange={(e) => setBuilding(e.target.value)}
              className="w-full px-3 py-2 text-sm rounded-lg border border-slate-300"
            >
              <option value="DOM-A">Tòa A (Khu Nam Tân Uyên)</option>
              <option value="DOM-B">Tòa B (Khu Nam Tân Uyên)</option>
              <option value="DOM-C">Tòa C (Khu Nữ Tân Uyên)</option>
            </select>
          </div>

          <div className="pt-4 border-t flex justify-between">
            <AppButton variant="outline" onClick={() => setStep(1)}>Quay lại</AppButton>
            <AppButton onClick={() => setStep(3)}>Tiếp tục bước 3</AppButton>
          </div>
        </div>
      )}

      {step === 3 && (
        <form onSubmit={handleSubmit} className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-4">
          <div className="p-4 bg-slate-50 rounded-xl space-y-2 text-xs">
            <div className="flex justify-between"><span className="text-slate-500">Kỳ học:</span><span className="font-semibold">Fall 2026</span></div>
            <div className="flex justify-between"><span className="text-slate-500">Loại phòng:</span><span className="font-semibold">{roomType}</span></div>
            <div className="flex justify-between"><span className="text-slate-500">Tòa đăng ký:</span><span className="font-semibold">{building}</span></div>
          </div>

          <label className="flex items-start gap-2.5 cursor-pointer text-xs text-slate-700">
            <input
              type="checkbox"
              checked={agreed}
              onChange={(e) => setAgreed(e.target.checked)}
              className="mt-0.5 rounded text-[#F26F21] focus:ring-[#F26F21]"
              required
            />
            <span>Tôi cam kết thực hiện đúng quy chế nội trú ký túc xá và đóng tiền phòng đúng thời hạn.</span>
          </label>

          {isSubmitted && (
            <div className="p-3 bg-emerald-50 text-emerald-700 rounded-lg text-xs font-medium">
              🎉 Đơn đăng ký của bạn đã được gửi thành công! Cán bộ KTX sẽ thẩm định trong vòng 24h.
            </div>
          )}

          <div className="pt-4 border-t flex justify-between">
            <AppButton variant="outline" onClick={() => setStep(2)}>Quay lại</AppButton>
            <AppButton type="submit" disabled={!agreed} leftIcon={<Send className="w-4 h-4" />}>
              Nộp đơn đăng ký
            </AppButton>
          </div>
        </form>
      )}
    </div>
  );
}
