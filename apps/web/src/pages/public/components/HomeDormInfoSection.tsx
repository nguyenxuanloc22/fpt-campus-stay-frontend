import { Building2 } from 'lucide-react';

import { t } from '@shared-ui';
export function HomeDormInfoSection() {
  return (
    <section className="py-16 sm:py-24 px-4 sm:px-6 lg:px-8 bg-slate-50/70">
      <div className="max-w-6xl mx-auto">
        {/* Centered Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16 sm:mb-20">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-orange-50 border border-orange-200/80 text-xs font-semibold text-[#F26522] mb-3">
            <Building2 className="w-4 h-4" />
            <span>{t('Tan Uyen campus • Binh Duong')}</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-black text-[#1A365D] tracking-tight">
            {t('FPT University Dormitory')}
          </h2>
          <p className="text-slate-500 text-sm sm:text-base mt-3 max-w-xl mx-auto">
            {t('Modern, airy and safe living and study spaces built to international standards, exclusively for FPT University students')}
          </p>
        </div>

        {/* 3 Content Rows in Alternating Zigzag Layout */}
        <div className="space-y-16 sm:space-y-24">
          {/* ── Row 1 (Image Left, Text Right) ── */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12 items-center bg-white p-6 sm:p-10 rounded-3xl border border-slate-100 shadow-sm">
            <div className="overflow-hidden rounded-2xl shadow-md">
              <img
                src="/assets/ktx-overview-1.png"
                alt={t('Panoramic view of the FPT University Dormitory')}
                className="rounded-2xl shadow-md object-cover w-full h-[300px] md:h-[350px] hover:scale-[1.02] transition-transform duration-500"
              />
            </div>
            <div className="text-slate-700 leading-relaxed space-y-4">
              <span className="inline-block px-3 py-1 rounded-full bg-slate-100 text-slate-700 text-xs font-bold uppercase tracking-wider">
                {t('01 • Environment & student life')}
              </span>
              <h3 className="text-xl sm:text-2xl font-bold text-[#1A365D]">
                {t('A second home for FPT students')}
              </h3>
              <p className="text-sm sm:text-base leading-relaxed text-slate-600">
                {t('FPT University is a well-known multidisciplinary university with internationally accredited education. Beyond teaching quality and admissions, the university cares about student life: it has invested in a fully equipped dormitory with airy, clean spaces to meet students\' needs and provide the most comfortable environment for studying and living. For many students, the dormitory is a second home.')}
              </p>
            </div>
          </div>

          {/* ── Row 2 (Text Left, Image Right) ── */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12 items-center bg-white p-6 sm:p-10 rounded-3xl border border-slate-100 shadow-sm">
            <div className="text-slate-700 leading-relaxed space-y-4 order-2 md:order-1">
              <span className="inline-block px-3 py-1 rounded-full bg-orange-50 text-[#F26522] text-xs font-bold uppercase tracking-wider">
                {t('02 • Convenience & security')}
              </span>
              <h3 className="text-xl sm:text-2xl font-bold text-[#1A365D]">
                {t('An ideal place to live and study with peace of mind')}
              </h3>
              <p className="text-sm sm:text-base leading-relaxed text-slate-600">
                {t('The FPT University dormitory is reserved for FPT University students. Right after receiving their admission results, new students face the challenge of finding accommodation that is affordable, secure and good for studying. Not only freshmen but also senior students prefer to stay in the campus dormitory for easy commuting, lower costs and a good environment for study and daily life.')}
              </p>
            </div>
            <div className="overflow-hidden rounded-2xl shadow-md order-1 md:order-2">
              <img
                src="/assets/ktx-block-2.png"
                alt={t('FPT University Tan Uyen dormitory buildings')}
                className="rounded-2xl shadow-md object-cover w-full h-[300px] md:h-[350px] hover:scale-[1.02] transition-transform duration-500"
              />
            </div>
          </div>

          {/* ── Row 3 (Image Left, Text Right) ── */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12 items-center bg-white p-6 sm:p-10 rounded-3xl border border-slate-100 shadow-sm">
            <div className="overflow-hidden rounded-2xl shadow-md">
              <img
                src="/assets/ktx-campus-3.png"
                alt={t('Modern design and amenities of the FPT dormitory')}
                className="rounded-2xl shadow-md object-cover w-full h-[300px] md:h-[350px] hover:scale-[1.02] transition-transform duration-500"
              />
            </div>
            <div className="text-slate-700 leading-relaxed space-y-4">
              <span className="inline-block px-3 py-1 rounded-full bg-slate-100 text-slate-700 text-xs font-bold uppercase tracking-wider">
                {t('03 • Design & equipment')}
              </span>
              <h3 className="text-xl sm:text-2xl font-bold text-[#1A365D]">
                {t('Modern design, fully equipped')}
              </h3>
              <p className="text-sm sm:text-base leading-relaxed text-slate-600">
                {t('The FPT University dormitory is built with a modern, airy and fully equipped design. The dormitory has several buildings, each with spacious, clean floors, Wi-Fi, vending machines and self-service washers and dryers, surrounded by fresh green trees. Rooms are designed for comfort and fit each room type of 2, 4 or 6 people. Every room is equipped with the essentials: bunk beds, desks, drying racks, water heaters, air conditioning, shoe cabinets and a private bathroom… so students can focus on their studies and feel at home throughout their time at FPT University.')}
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default HomeDormInfoSection;
