import { Wifi, ShieldCheck, Shirt, BookOpen, Coffee, Dumbbell } from 'lucide-react';

import { t } from '@shared-ui';
export function HomeFeaturesSection() {
  const steps = [
    { num: '01', title: t('Online registration'), desc: t('Choose your semester and preferred room type in 2 minutes.') },
    { num: '02', title: t('Roommate matching by PIN'), desc: t('Share a 6-digit PIN to be placed in the same room as your friends.') },
    { num: '03', title: t('E-sign & VietQR'), desc: t('Sign your digital contract and pay fees with a NAPAS 247 QR code.') },
    { num: '04', title: t('Check-in & key card'), desc: t('Check in with a Gate Pass QR and a digital asset inspection.') },
  ];

  const amenities = [
    { icon: Wifi, title: t('High-speed FPT Wi-Fi'), desc: t('Coverage in every room and across the dormitory grounds') },
    { icon: ShieldCheck, title: 'An ninh 24/7 & FaceID', desc: t('Smart access control, fully secure') },
    { icon: Shirt, title: t('Smart laundry room'), desc: t('Automatic payment via the app, fast and convenient') },
    { icon: BookOpen, title: t('24h self-study space'), desc: t('Quiet, air-conditioned, with eye-friendly lighting') },
    { icon: Dumbbell, title: t('Multi-sport area'), desc: t('Basketball, badminton and standard table tennis') },
    { icon: Coffee, title: t('Canteen & convenience store'), desc: t('Food and essentials right on the ground floor') },
  ];

  return (
    <section id="amenities" className="py-24 bg-white border-t border-slate-200/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Process */}
        <div id="process" className="mb-24">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-[#1A365D] mb-4">{t('A 100% digital 4-step process')}</h2>
            <p className="text-slate-600 text-sm">{t('No paperwork, no queuing for a room lottery.')}</p>
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
            <h2 className="text-3xl sm:text-4xl font-bold text-[#1A365D] mb-4">{t('International-standard campus amenities')}</h2>
            <p className="text-slate-600 text-sm">{t('A modern living space supporting FPT University students.')}</p>
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
