import { Link } from 'react-router-dom';
import { Check, Sparkles } from 'lucide-react';

export function HomeRoomsSection() {
  const rooms = [
    {
      title: 'Phòng 4 giường Điều hòa',
      badge: 'Phổ biến nhất',
      price: '1.200.000',
      period: 'tháng / sinh viên',
      desc: 'Thiết kế thông minh tối ưu không gian học tập và nghỉ ngơi.',
      features: ['Điều hòa 2 chiều Inverter', 'Bàn học và tủ cá nhân riêng', 'Bình nóng lạnh & vệ sinh khép kín', 'Ban công đón gió tự nhiên'],
      popular: true,
    },
    {
      title: 'Phòng 6 giường Tiêu chuẩn',
      badge: 'Tiết kiệm chi phí',
      price: '850.000',
      period: 'tháng / sinh viên',
      desc: 'Lựa chọn tiết kiệm tối đa chi phí sinh hoạt cho sinh viên.',
      features: ['Hệ thống quạt trần đối lưu', 'Giường tầng chắc chắn, đệm êm', 'Tủ đồ có khóa cá nhân', 'Khu vệ sinh sạch sẽ, thông thoáng'],
      popular: false,
    },
    {
      title: 'Phòng 2 giường VIP Dịch vụ',
      badge: 'Tiện nghi cao cấp',
      price: '2.100.000',
      period: 'tháng / sinh viên',
      desc: 'Không gian yên tĩnh tuyệt đối dành cho sinh viên năm cuối & nghiên cứu.',
      features: ['Điều hòa & tủ lạnh mini riêng', 'Wifi băng thông rộng ưu tiên', 'Dịch vụ dọn phòng hàng tuần', 'Smart TV & nội thất gỗ cao cấp'],
      popular: false,
    },
  ];

  return (
    <section id="rooms" className="py-24 bg-slate-900 border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#FFF2EA] text-[#F26F21] text-xs font-bold uppercase tracking-wider mb-3">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Mô hình phòng ở</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">Lựa chọn phòng phù hợp nhu cầu</h2>
          <p className="text-slate-400 text-sm sm:text-base">Mỗi phòng đều được trang bị đầy đủ nội thất cơ bản, an toàn PCCC và camera an ninh 24/7.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {rooms.map((room, idx) => (
            <div
              key={idx}
              className={`rounded-2xl p-7 border transition-all duration-300 flex flex-col justify-between ${
                room.popular
                  ? 'bg-gradient-to-b from-slate-800 to-slate-900 border-[#F26F21] shadow-xl shadow-orange-500/10 -translate-y-2'
                  : 'bg-slate-900/60 border-slate-800 hover:border-slate-700'
              }`}
            >
              <div>
                <div className="flex items-center justify-between mb-4">
                  <span className={`text-xs font-bold px-3 py-1 rounded-full ${
                    room.popular ? 'bg-[#F26F21] text-white' : 'bg-slate-800 text-slate-300'
                  }`}>
                    {room.badge}
                  </span>
                </div>
                <h3 className="text-xl font-bold text-white mb-2">{room.title}</h3>
                <p className="text-slate-400 text-xs mb-6 leading-relaxed">{room.desc}</p>
                <div className="mb-6 pb-6 border-b border-slate-800">
                  <span className="text-3xl font-black text-white">{room.price}đ</span>
                  <span className="text-slate-400 text-xs ml-2">/ {room.period}</span>
                </div>
                <ul className="space-y-3 mb-8">
                  {room.features.map((f, fIdx) => (
                    <li key={fIdx} className="flex items-start gap-2.5 text-xs text-slate-300">
                      <Check className="w-4 h-4 text-[#F26F21] shrink-0 mt-0.5" />
                      <span>{f}</span>
                    </li>
                  ))}
                </ul>
              </div>
              <Link
                to="/login"
                className={`w-full py-3 rounded-xl text-xs font-bold text-center transition ${
                  room.popular
                    ? 'bg-[#F26F21] hover:bg-[#D95A12] text-white shadow-md'
                    : 'bg-slate-800 hover:bg-slate-700 text-white'
                }`}
              >
                Đăng ký phòng này
              </Link>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
