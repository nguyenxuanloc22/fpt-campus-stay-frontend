import { Wifi, ShieldCheck, Shirt, BookOpen, Coffee, Dumbbell } from 'lucide-react';

export function HomeFeaturesSection() {
  const steps = [
    { num: '01', title: 'Đăng ký trực tuyến', desc: 'Chọn học kỳ và loại phòng ưu tiên trong 2 phút.' },
    { num: '02', title: 'Ghép Roommate mã PIN', desc: 'Chia sẻ mã PIN 6 số để cùng bạn bè xếp chung 1 phòng.' },
    { num: '03', title: 'Ký E-Sign & VietQR', desc: 'Ký hợp đồng số và thanh toán học phí qua mã QR NapAS 247.' },
    { num: '04', title: 'Nhận phòng & Thẻ từ', desc: 'Check-in bằng Gate Pass QR, kiểm tra tài sản số hóa.' },
  ];

  const amenities = [
    { icon: Wifi, title: 'Wifi FPT tốc độ cao', desc: 'Phủ sóng toàn bộ phòng ở và khuôn viên KTX' },
    { icon: ShieldCheck, title: 'An ninh 24/7 & FaceID', desc: 'Kiểm soát ra vào thông minh, an toàn tuyệt đối' },
    { icon: Shirt, title: 'Phòng giặt sấy thông minh', desc: 'Thanh toán tự động qua app, tiện lợi nhanh chóng' },
    { icon: BookOpen, title: 'Không gian tự học 24h', desc: 'Yên tĩnh, trang bị máy lạnh, đèn bảo vệ thị lực' },
    { icon: Dumbbell, title: 'Khu thể thao đa năng', desc: 'Sân bóng rổ, cầu lông, bàn bóng bàn tiêu chuẩn' },
    { icon: Coffee, title: 'Căn tin & Cửa hàng tiện lợi', desc: 'Phục vụ ăn uống và đồ dùng thiết yếu ngay tầng 1' },
  ];

  return (
    <section id="amenities" className="py-24 bg-white border-t border-slate-200/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Process */}
        <div id="process" className="mb-24">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-[#1A365D] mb-4">Quy trình 4 bước số hóa 100%</h2>
            <p className="text-slate-600 text-sm">Không cần nộp giấy tờ, không cần xếp hàng bốc thăm phòng.</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {steps.map((s, idx) => (
              <div
                key={idx}
                className="p-6 rounded-2xl bg-slate-50 border border-slate-200/80 hover:border-slate-300 hover:shadow-sm transition-all relative"
              >
                <span className="text-3xl font-black text-[#F26522] mb-3 block">{s.num}</span>
                <h3 className="text-base font-bold text-slate-900 mb-2">{s.title}</h3>
                <p className="text-xs text-slate-600 leading-relaxed">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Amenities */}
        <div>
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-[#1A365D] mb-4">Tiện ích khuôn viên chuẩn quốc tế</h2>
            <p className="text-slate-600 text-sm">Không gian sống hiện đại hỗ trợ tối đa cho sinh viên FPT University.</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {amenities.map((a, idx) => (
              <div
                key={idx}
                className="p-6 rounded-2xl bg-white border border-slate-200/80 hover:border-slate-300 hover:shadow-sm transition-all flex items-start gap-4"
              >
                <div className="w-12 h-12 rounded-xl bg-orange-50 border border-orange-100 text-[#F26522] flex items-center justify-center shrink-0">
                  <a.icon className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-slate-900 mb-1">{a.title}</h3>
                  <p className="text-xs text-slate-500 leading-relaxed">{a.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
