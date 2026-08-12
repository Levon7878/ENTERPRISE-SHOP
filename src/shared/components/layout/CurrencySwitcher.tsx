import React from 'react';
import { useCurrencyStore } from '../../../app/store/useCompareStore';
import { Currency } from '../../types';

export const CurrencySwitcher: React.FC = () => {
  const { currency, setCurrency } = useCurrencyStore();

  return (
    <div className="flex items-center bg-slate-800/80 rounded-lg p-0.5 border border-slate-700">
      {(['AMD', 'RUB', 'USD'] as Currency[]).map((c) => (
        <button
          key={c}
          onClick={() => setCurrency(c)}
          className={`px-2 py-1 text-[11px] font-bold rounded-md transition-all cursor-pointer ${
            currency === c
              ? 'bg-blue-600 text-white shadow-xs'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          {c}
        </button>
      ))}
    </div>
  );
};
