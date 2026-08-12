import React from 'react';
import { Percent, Sparkles, CreditCard } from 'lucide-react';

interface CreditProductBadgeProps {
  type?: 'credit' | 'installment' | 'parts';
  className?: string;
}

export const CreditProductBadge: React.FC<CreditProductBadgeProps> = ({
  type = 'installment',
  className = '',
}) => {
  if (type === 'installment') {
    return (
      <span className={`inline-flex items-center space-x-1 bg-amber-500/10 text-amber-600 border border-amber-500/30 text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-full shadow-2xs ${className}`}>
        <Percent size={11} />
        <span>Рассрочка</span>
      </span>
    );
  }

  if (type === 'parts') {
    return (
      <span className={`inline-flex items-center space-x-1 bg-emerald-500/10 text-emerald-600 border border-emerald-500/30 text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-full shadow-2xs ${className}`}>
        <CreditCard size={11} />
        <span>Оплата частями</span>
      </span>
    );
  }

  return (
    <span className={`inline-flex items-center space-x-1 bg-blue-500/10 text-blue-600 border border-blue-500/30 text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-full shadow-2xs ${className}`}>
      <Sparkles size={11} />
      <span>Можно в кредит</span>
    </span>
  );
};
