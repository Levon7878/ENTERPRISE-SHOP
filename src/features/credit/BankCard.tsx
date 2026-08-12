import React from 'react';
import { CheckCircle2, Clock } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { BankPartner, Language } from '../../shared/types';
import { useCurrencyStore } from '../../app/store/useCompareStore';
import { SafeImage } from '../../shared/components/ui/SafeImage';

interface BankCardProps {
  bank: BankPartner;
  isSelected: boolean;
  onSelect: () => void;
  lang: Language;
  monthlyPayment: number;
  termMonths: number;
}

export const BankCard: React.FC<BankCardProps> = ({
  bank,
  isSelected,
  onSelect,
  lang,
  monthlyPayment,
  termMonths,
}) => {
  const { t } = useTranslation('credit');
  const { formatPrice } = useCurrencyStore();

  return (
    <button
      type="button"
      onClick={onSelect}
      className={`relative w-full text-left p-4 rounded-2xl border-2 transition-all cursor-pointer bg-white ${
        isSelected
          ? 'border-blue-600 shadow-xl ring-2 ring-blue-600/20'
          : 'border-slate-200 hover:border-blue-300 hover:shadow-md'
      }`}
    >
      {isSelected && (
        <div className="absolute -top-2.5 right-3 bg-blue-600 text-white text-[10px] font-black uppercase px-2.5 py-0.5 rounded-full flex items-center space-x-1">
          <CheckCircle2 size={12} />
          <span>{t('banks.selected')}</span>
        </div>
      )}

      <div className="flex items-start justify-between gap-3 mb-3">
        <div className="flex items-center space-x-3 min-w-0">
          <SafeImage
            src={bank.logo}
            alt={bank.name}
            className="w-11 h-11 object-cover rounded-xl border border-slate-100 shrink-0"
          />
          <div className="min-w-0">
            <h4 className="font-bold text-slate-900 text-sm truncate">{bank.name}</h4>
            <span className="text-[11px] text-slate-500 font-semibold flex items-center space-x-1">
              <Clock size={12} className="text-blue-500" />
              <span>
                {bank.approvalSpeedMinutes} {t('banks.minutes')}
              </span>
            </span>
          </div>
        </div>
        <div
          className={`w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0 ${
            isSelected ? 'border-blue-600 bg-blue-600' : 'border-slate-300'
          }`}
        >
          {isSelected && <div className="w-2 h-2 rounded-full bg-white" />}
        </div>
      </div>

      <div className="rounded-xl bg-slate-50 border border-slate-100 p-3 mb-3">
        <p className="text-[10px] uppercase tracking-wider text-slate-400 font-bold mb-0.5">
          {t('calculator.monthlyPayment')}
        </p>
        <p className="text-lg font-black text-blue-600 leading-none">
          {formatPrice(monthlyPayment)}
          <span className="text-xs font-bold text-slate-500"> / {termMonths} {t('banks.monthsShort')}</span>
        </p>
        <p className="text-[11px] text-slate-500 mt-1 font-medium">
          {t('banks.rateFrom')} {bank.minRate}%
        </p>
      </div>

      <div className="space-y-1">
        {bank.features.slice(0, 2).map((feat, idx) => (
          <div key={idx} className="flex items-center space-x-2 text-[11px] text-slate-600 font-medium">
            <CheckCircle2 size={13} className="text-emerald-500 shrink-0" />
            <span>{feat[lang]}</span>
          </div>
        ))}
      </div>
    </button>
  );
};
