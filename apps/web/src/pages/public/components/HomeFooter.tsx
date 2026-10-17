import { MapPin, Phone, Mail, Clock } from 'lucide-react';

export function HomeFooter() {
  return (
    <footer id="contact" className="bg-slate-950 border-t border-slate-800/80 text-slate-400 py-12 text-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
          <div className="md:col-span-2">
            <div className="flex items-center gap-2 mb-3">
              <div className="w-8 h-8 rounded-lg bg-[#F26F21] flex items-center justify-center font-black text-white text-xs">
                FPT
              </div>
              <span className="text-white font-bold text-base">CampusStay KTX Tân Uyên</span>
            </div>
            <p className="text-slate-400 leading-relaxed max-w-md">
              Hệ thống Ký túc xá thông minh Đại học FPT Phân hiệu Bình Dương (Campus Tân Uyên).
              Giải pháp toàn diện quản lý phòng ở, hợp đồng số và chăm sóc đời sống sinh viên.
            </p>
          </div>

          <div>
            <h4 className="text-white font-semibold mb-3 uppercase tracking-wider text-xs">Thông tin Liên hệ</h4>
            <ul className="space-y-2">
              <li className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-[#F26F21] shrink-0" />
                <span>Phường Tân Uyên, TP. Tân Uyên, Bình Dương</span>
              </li>
              <li className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-[#F26F21] shrink-0" />
                <span>Hotline BQL: (0274) 7300 999</span>
              </li>
              <li className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-[#F26F21] shrink-0" />
                <span>campusstay.bd@fpt.edu.vn</span>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="text-white font-semibold mb-3 uppercase tracking-wider text-xs">Thời gian làm việc</h4>
            <div className="flex items-start gap-2">
              <Clock className="w-4 h-4 text-[#F26F21] shrink-0 mt-0.5" />
              <div>
                <p className="text-white font-medium">Thứ 2 - Thứ 7: 07:30 - 17:00</p>
                <p className="text-slate-400 mt-1">Trực an ninh & kỹ thuật: 24/7</p>
              </div>
            </div>
          </div>
        </div>

        <div className="pt-8 border-t border-slate-900 flex flex-col sm:flex-row items-center justify-between text-slate-400">
          <p>© 2026 CampusStay FPT Tân Uyên. Bản quyền thuộc Trường Đại học FPT.</p>
          <p className="mt-2 sm:mt-0">Đồ án Tốt nghiệp CNTT • FPT University</p>
        </div>
      </div>
    </footer>
  );
}
