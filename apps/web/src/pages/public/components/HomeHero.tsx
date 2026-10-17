import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';

export function HomeHero() {
  return (
    <section id="hero" className="relative pt-12 pb-24 overflow-hidden bg-slate-950">
      {/* Background Architectural Overlay */}
      <div className="absolute inset-0 opacity-20 bg-[radial-gradient(#475569_1px,transparent_1px)] [background-size:24px_24px] pointer-events-none" />
      <div className="absolute -top-40 -right-40 w-96 h-96 bg-[#F26F21]/20 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute top-1/2 -left-40 w-96 h-96 bg-blue-600/10 rounded-full blur-3xl pointer-events-none" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-slate-900 border border-slate-700/80 text-xs font-semibold text-white mb-8 shadow-sm">
            <span className="w-2 h-2 rounded-full bg-[#F26F21] animate-pulse" />
            <span>Khai trương Q3/2026 • FPT Campus Tân Uyên</span>
          </div>

          {/* Heading */}
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-white tracking-tight leading-[1.15] mb-6">
            Ký túc xá thông minh cho{' '}
            <span className="text-[#F26F21]">4.000 sinh viên</span>{' '}
            FPT Tân Uyên
          </h1>

          {/* Subheading */}
          <p className="text-base sm:text-lg text-slate-300 font-normal leading-relaxed mb-10 max-w-2xl">
            Đăng ký online • Chọn loại phòng & ghép roommate • Thanh toán VietQR.
            Không cần xếp hàng. Không cần giấy tờ.
          </p>

          {/* Action Buttons */}
          <div className="flex flex-wrap items-center gap-4 mb-16">
            <Link
              to="/login"
              className="inline-flex items-center gap-2 px-7 py-3.5 rounded-full bg-[#F26F21] hover:bg-[#D95A12] text-white font-semibold text-sm transition-all shadow-lg shadow-orange-500/25 group"
            >
              <span>Đăng ký chỗ ở ngay</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
            <a
              href="#rooms"
              className="px-7 py-3.5 rounded-full bg-slate-800/80 hover:bg-slate-700/80 border border-slate-700 text-white font-semibold text-sm transition backdrop-blur-sm"
            >
              Xem loại phòng
            </a>
          </div>
        </div>

        {/* Stats Grid Bar */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 p-6 sm:p-8 rounded-2xl bg-slate-900/70 border border-slate-800/90 backdrop-blur-md shadow-2xl">
          <div className="border-r border-slate-800/80 last:border-0 pr-4">
            <div className="text-2xl sm:text-3xl font-black text-white">4.000+</div>
            <div className="text-xs sm:text-sm text-slate-400 mt-1 font-medium">Sức chứa</div>
          </div>
          <div className="border-r border-slate-800/80 last:border-0 pr-4 pl-2 sm:pl-4">
            <div className="text-2xl sm:text-3xl font-black text-white">Q3/2026</div>
            <div className="text-xs sm:text-sm text-slate-400 mt-1 font-medium">Khai trương</div>
          </div>
          <div className="border-r border-slate-800/80 last:border-0 pr-4 pl-2 sm:pl-4">
            <div className="text-2xl sm:text-3xl font-black text-white">84.000 m²</div>
            <div className="text-xs sm:text-sm text-slate-400 mt-1 font-medium">Diện tích campus</div>
          </div>
          <div className="pl-2 sm:pl-4">
            <div className="text-2xl sm:text-3xl font-black text-white">100%</div>
            <div className="text-xs sm:text-sm text-slate-400 mt-1 font-medium">Số hoá quy trình</div>
          </div>
        </div>
      </div>
    </section>
  );
}
