
import { t } from '@shared-ui';export function HomeHero() {
  return (
    <section className="relative overflow-hidden min-h-[580px] flex items-center justify-center py-20 sm:py-28 text-white">
      {/* Full Background Image: /assets/campus-building.png */}
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: `url('/assets/campus-building.png')` }}
      />
      {/* Dark / soft gradient overlay for maximum readability */}
      <div className="absolute inset-0 bg-gradient-to-b from-slate-950/85 via-slate-900/70 to-slate-950/85" />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <div className="max-w-3xl mb-12 sm:mb-16">
          {/* Opening Badge */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-xs font-semibold text-orange-400 mb-6 shadow-sm">
            <span className="w-2 h-2 rounded-full bg-[#F26522] animate-pulse" />
            <span>{t('Opening Q3/2026 • FPT Campus Tan Uyen')}</span>
          </div>

          {/* Main Title */}
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-white tracking-tight leading-[1.15] mb-6 drop-shadow-md">
            {t('A smart dormitory for')}{' '}
            <span className="text-[#F26522]">{t('4,000 students')}</span>{' '}
            {t('FPT Tan Uyen')}
          </h1>

          {/* Subtitle */}
          <p className="text-base sm:text-lg text-slate-200 font-normal leading-relaxed max-w-2xl drop-shadow-sm">
            {t('Register online • Choose a room type & match roommates • Pay with VietQR. No queues. No paperwork.')}
          </p>
        </div>

        {/* 4 Metric Summary Stats Cards sitting cleanly on top of background image */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 p-6 sm:p-8 rounded-2xl bg-white/95 backdrop-blur-md border border-white/20 shadow-2xl text-slate-900">
          <div className="border-r border-slate-200/80 last:border-0 pr-4">
            <div className="text-2xl sm:text-3xl font-black text-[#1A365D]">4.000+</div>
            <div className="text-xs sm:text-sm text-slate-600 mt-1 font-medium">{t('Capacity')}</div>
          </div>
          <div className="border-r border-slate-200/80 last:border-0 pr-4 pl-2 sm:pl-4">
            <div className="text-2xl sm:text-3xl font-black text-[#1A365D]">Q3/2026</div>
            <div className="text-xs sm:text-sm text-slate-600 mt-1 font-medium">{t('Opening')}</div>
          </div>
          <div className="border-r border-slate-200/80 last:border-0 pr-4 pl-2 sm:pl-4">
            <div className="text-2xl sm:text-3xl font-black text-[#1A365D]">84.000 m²</div>
            <div className="text-xs sm:text-sm text-slate-600 mt-1 font-medium">{t('Campus area')}</div>
          </div>
          <div className="pl-2 sm:pl-4">
            <div className="text-2xl sm:text-3xl font-black text-[#F26522]">100%</div>
            <div className="text-xs sm:text-sm text-slate-600 mt-1 font-medium">{t('Digitized process')}</div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default HomeHero;
