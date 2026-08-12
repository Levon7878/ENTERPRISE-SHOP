import React from 'react';
import { ShieldCheck, Clock, Percent, FileCheck2, Sparkles, CheckCircle2 } from 'lucide-react';
import { Language } from '../../../shared/types';

interface CreditAdvantagesProps {
  lang: Language;
}

export const CreditAdvantages: React.FC<CreditAdvantagesProps> = ({ lang }) => {
  const advantages = [
    {
      icon: Percent,
      color: 'bg-amber-500/10 text-amber-500 border-amber-500/20',
      title: {
        am: 'Առանց կանխավճարի',
        ru: 'Без первоначального взноса',
        en: 'No down payment',
      },
      desc: {
        am: 'Գնեք ապրանքն անմիջապես առանց նախնական վճարի',
        ru: 'Забирайте технику сразу без внесения наличных средств',
        en: 'Take your tech home today without paying any upfront cash',
      },
    },
    {
      icon: Clock,
      color: 'bg-blue-500/10 text-blue-500 border-blue-500/20',
      title: {
        am: '5-Րոպեում Օնլայն Հաստատում',
        ru: 'Одобрение за 5 минут',
        en: '5-Minute Online Approval',
      },
      desc: {
        am: 'Առանց բանկ այցելելու, 100% թվային հայտ',
        ru: 'Без визита в банк — прямо с вашего смартфона',
        en: 'No bank visit required — 100% digital application',
      },
    },
    {
      icon: FileCheck2,
      color: 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20',
      title: {
        am: 'Միայն Անձնագրով / ID-ով',
        ru: 'Только Паспорт / ID карта',
        en: 'Only ID Card / Passport',
      },
      desc: {
        am: 'Առանց աշխատավայրից տեղեկանքների և ավելորդ փաստաթղթերի',
        ru: 'Минимум документов — без справок о доходах и поручителей',
        en: 'No proof of income or guarantor documentation required',
      },
    },
    {
      icon: ShieldCheck,
      color: 'bg-purple-500/10 text-purple-500 border-purple-500/20',
      title: {
        am: 'Առանց Թաքնված Միջնորդավճարների',
        ru: 'Без скрытых комиссий',
        en: 'Zero Hidden Fees',
      },
      desc: {
        am: 'Թափանցիկ պայմանագրեր առաջատար բանկերի հետ',
        ru: 'Прозрачные договоры с официальной банковской гарантией',
        en: 'Transparent terms guaranteed by leading Armenian banks',
      },
    },
  ];

  return (
    <div className="space-y-6">
      <div className="text-center space-y-2">
        <div className="inline-flex items-center space-x-2 bg-amber-500/10 text-amber-500 border border-amber-500/30 px-3.5 py-1 rounded-full text-xs font-extrabold uppercase tracking-widest">
          <Sparkles size={14} />
          <span>{lang === 'am' ? 'Առավելություններ' : lang === 'ru' ? 'Преимущества' : 'Key Advantages'}</span>
        </div>
        <h2 className="text-2xl sm:text-3xl font-black text-slate-900">
          {lang === 'am' ? 'Ինչո՞ւ գնել ապառիկ Enterprise Shop-ում' : lang === 'ru' ? 'Почему выгодно брать в кредит у нас' : 'Why Choose Enterprise Credit'}
        </h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {advantages.map((adv, idx) => {
          const Icon = adv.icon;
          return (
            <div key={idx} className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm space-y-4 hover:shadow-xl transition-all duration-300">
              <div className={`w-12 h-12 rounded-2xl flex items-center justify-center border ${adv.color}`}>
                <Icon size={24} />
              </div>
              <div className="space-y-1">
                <h3 className="text-sm font-bold text-slate-900">{adv.title[lang]}</h3>
                <p className="text-xs text-slate-500 leading-relaxed">{adv.desc[lang]}</p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
