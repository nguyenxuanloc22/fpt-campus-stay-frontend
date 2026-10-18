import { MapPin, Phone, Mail, Clock } from 'lucide-react';

import { t } from '@shared-ui';
export function HomeFooter() {
  return (
    <footer id="contact" className="bg-slate-50 border-t border-slate-200/80 text-slate-600 py-14 text-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
          <div className="md:col-span-2">
            <div className="flex items-center gap-2 mb-3">
              <div className="w-8 h-8 rounded-lg bg-[#F26522] flex items-center justify-center font-black text-white text-xs shadow-xs">
                FPT
              </div>
              <span className="text-[#1A365D] font-bold text-base">{t('CampusStay Tan Uyen Dormitory')}</span>
            </div>
            <p className="text-slate-500 leading-relaxed max-w-md">
              {t('The smart dormitory system of FPT University, Binh Duong branch (Tan Uyen campus). An end-to-end solution for rooms, digital contracts and student life.')}
            </p>
          </div>

          <div>
            <h4 className="text-slate-900 font-bold mb-3 uppercase tracking-wider text-xs">{t('Contact information')}</h4>
            <ul className="space-y-2">
              <li className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-[#F26522] shrink-0" />
                <span className="text-slate-600">{t('Tan Uyen Ward, Tan Uyen City, Binh Duong')}</span>
              </li>
              <li className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-[#F26522] shrink-0" />
                <span className="text-slate-600">Hotline BQL: (0274) 7300 999</span>
              </li>
              <li className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-[#F26522] shrink-0" />
                <span className="text-slate-600">campusstay.bd@fpt.edu.vn</span>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="text-slate-900 font-bold mb-3 uppercase tracking-wider text-xs">{t('Office hours')}</h4>
            <div className="flex items-start gap-2">
              <Clock className="w-4 h-4 text-[#F26522] shrink-0 mt-0.5" />
              <div>
                <p className="text-slate-900 font-medium">{t('Mon – Sat: 07:30 - 17:00')}</p>
                <p className="text-slate-500 mt-1">{t('Security & maintenance on duty: 24/7')}</p>
              </div>
            </div>
          </div>
        </div>

        <div className="pt-8 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between text-slate-500">
          <p>{t('© 2026 CampusStay FPT Tan Uyen. Copyright FPT University.')}</p>
          <p className="mt-2 sm:mt-0">{t('IT capstone project • FPT University')}</p>
        </div>
      </div>
    </footer>
  );
}
