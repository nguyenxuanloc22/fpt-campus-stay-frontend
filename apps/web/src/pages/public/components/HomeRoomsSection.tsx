import { Check, Sparkles } from 'lucide-react';

import { t } from '@shared-ui';
export function HomeRoomsSection() {
  const rooms = [
    {
      title: t('4-bed air-conditioned room'),
      badge: t('Most popular'),
      price: '1.200.000',
      period: t('month / student'),
      desc: t('Smart design that optimizes space for studying and resting.'),
      features: [
        t('Two-way inverter air conditioner'),
        t('Personal desk and wardrobe'),
        t('Water heater & private bathroom'),
        t('Balcony with natural airflow'),
      ],
      popular: true,
    },
    {
      title: t('6-bed standard room'),
      badge: t('Budget saver'),
      price: '850.000',
      period: t('month / student'),
      desc: t('The most budget-friendly option for students.'),
      features: [
        t('Ceiling fan ventilation'),
        t('Sturdy bunk beds with soft mattresses'),
        t('Personal lockable wardrobe'),
        t('Clean, well-ventilated bathroom'),
      ],
      popular: false,
    },
    {
      title: t('2-bed VIP service room'),
      badge: t('Premium amenities'),
      price: '2.100.000',
      period: t('month / student'),
      desc: t('A completely quiet space for final-year students & research.'),
      features: [
        t('Private air conditioner & mini fridge'),
        t('Priority broadband Wi-Fi'),
        t('Weekly room cleaning'),
        t('Smart TV & premium wooden furniture'),
      ],
      popular: false,
    },
  ];

  return (
    <section id="rooms" className="py-24 bg-slate-50/80 border-t border-slate-200/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#FFF2EA] text-[#F26522] text-xs font-bold uppercase tracking-wider mb-3">
            <Sparkles className="w-3.5 h-3.5" />
            <span>{t('Room models')}</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-bold text-[#1A365D] mb-4">{t('Choose the room that fits your needs')}</h2>
          <p className="text-slate-600 text-sm sm:text-base">{t('Every room comes fully furnished, fire-safety compliant and covered by 24/7 security cameras.')}</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {rooms.map((room, idx) => (
            <div
              key={idx}
              className={`rounded-2xl p-7 sm:p-8 border transition-all duration-300 flex flex-col justify-between ${
                room.popular
                  ? 'bg-white border-2 border-[#F26522] shadow-xl shadow-orange-500/10 -translate-y-1 relative'
                  : 'bg-white border-slate-200/90 hover:border-slate-300 hover:shadow-md'
              }`}
            >
              <div>
                <div className="flex items-center justify-between mb-4">
                  <span className={`text-xs font-bold px-3 py-1 rounded-full ${
                    room.popular ? 'bg-[#F26522] text-white shadow-xs' : 'bg-slate-100 text-slate-700'
                  }`}>
                    {room.badge}
                  </span>
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-2">{room.title}</h3>
                <p className="text-slate-500 text-xs mb-6 leading-relaxed">{room.desc}</p>
                <div className="mb-6 pb-6 border-b border-slate-100">
                  <span className="text-3xl font-black text-[#1A365D]">{room.price}đ</span>
                  <span className="text-slate-500 text-xs ml-2">/ {room.period}</span>
                </div>
                <ul className="space-y-3">
                  {room.features.map((f, fIdx) => (
                    <li key={fIdx} className="flex items-start gap-2.5 text-xs text-slate-700">
                      <Check className="w-4 h-4 text-[#F26522] shrink-0 mt-0.5" />
                      <span>{f}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
