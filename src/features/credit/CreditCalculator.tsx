import React, { useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Calculator, ChevronDown, ChevronUp, Send } from 'lucide-react';
import { mockBanks } from '../../data/banks';
import { BankCard } from './BankCard';
import { PaymentPlan } from './PaymentPlan';
import { useCurrencyStore } from '../../app/store/useCompareStore';
import { SafeImage } from '../../shared/components/ui/SafeImage';
import { Language, Product } from '../../shared/types';

interface CreditCalculatorProps {
  product?: Product;
  amount?: number;
  lang: Language;
  onApplyLoan?: (details: {
    bankId: string;
    termMonths: number;
    monthlyPayment: number;
    downPayment: number;
  }) => void;
}

function calcMonthly(financed: number, annualRatePct: number, termMonths: number) {
  if (financed <= 0 || termMonths <= 0) return 0;
  const monthlyRate = annualRatePct / 100 / 12;
  if (monthlyRate <= 0) return Math.round(financed / termMonths);
  return Math.round(
    (financed * monthlyRate * Math.pow(1 + monthlyRate, termMonths)) /
      (Math.pow(1 + monthlyRate, termMonths) - 1)
  );
}

export const CreditCalculator: React.FC<CreditCalculatorProps> = ({
  product,
  amount,
  lang,
  onApplyLoan,
}) => {
  const { t } = useTranslation('credit');
  const { formatPrice } = useCurrencyStore();

  const initialPrice = amount ?? product?.price ?? 650000;
  const [productPrice, setProductPrice] = useState<number>(initialPrice);
  const [downPayment, setDownPayment] = useState<number>(0);
  const [selectedTerm, setSelectedTerm] = useState<number>(12);
  const [selectedBankId, setSelectedBankId] = useState<string>(mockBanks[0].id);
  const [showSchedule, setShowSchedule] = useState<boolean>(false);

  const priceLocked = Boolean(product || amount != null);
  const selectedBank = mockBanks.find((b) => b.id === selectedBankId) || mockBanks[0];

  const availableTerms = useMemo(
    () => [3, 6, 12, 24, 36].filter((term) => term <= selectedBank.maxTermMonths),
    [selectedBank.maxTermMonths]
  );

  const minDown = Math.round((productPrice * selectedBank.minDownPaymentPct) / 100);
  const maxDown = Math.round(productPrice * 0.5);

  useEffect(() => {
    const next = amount ?? product?.price;
    if (next != null) {
      setProductPrice(next);
    }
  }, [amount, product?.price, product?.id]);

  // Keep down payment & term valid for selected bank
  useEffect(() => {
    setDownPayment((prev) => Math.max(minDown, Math.min(prev, maxDown)));
    if (!availableTerms.includes(selectedTerm)) {
      setSelectedTerm(availableTerms[availableTerms.length - 1] || selectedBank.maxTermMonths);
    }
  }, [selectedBankId, minDown, maxDown, availableTerms, selectedTerm, selectedBank.maxTermMonths]);

  const financedAmount = Math.max(0, productPrice - downPayment);

  const bankPayments = useMemo(
    () =>
      Object.fromEntries(
        mockBanks.map((bank) => {
          const bankMinDown = Math.round((productPrice * bank.minDownPaymentPct) / 100);
          const bankFinanced = Math.max(0, productPrice - Math.max(downPayment, bankMinDown));
          const term = Math.min(selectedTerm, bank.maxTermMonths);
          return [bank.id, calcMonthly(bankFinanced, bank.minRate, term)];
        })
      ) as Record<string, number>,
    [productPrice, downPayment, selectedTerm]
  );

  const monthlyPayment = bankPayments[selectedBank.id] || 0;
  const totalRepayment = monthlyPayment * selectedTerm + downPayment;
  const overpayment = Math.max(0, totalRepayment - productPrice);

  const handleApplyClick = () => {
    onApplyLoan?.({
      bankId: selectedBank.id,
      termMonths: selectedTerm,
      monthlyPayment,
      downPayment,
    });
  };

  return (
    <div className="bg-white text-slate-900 rounded-2xl space-y-6">
      {/* Product strip — like checkout */}
      {product && (
        <div className="flex items-center gap-3 p-4 rounded-2xl bg-slate-50 border border-slate-100">
          <SafeImage
            src={product.images[0]}
            alt={product.translations[lang].name}
            className="w-16 h-16 object-cover rounded-xl bg-white border border-slate-100"
          />
          <div className="min-w-0 flex-1">
            <p className="text-sm font-bold text-slate-900 line-clamp-2">
              {product.translations[lang].name}
            </p>
            <p className="text-base font-black text-slate-900 mt-1">{formatPrice(productPrice)}</p>
          </div>
        </div>
      )}

      {!priceLocked && (
        <div>
          <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-2">
            {t('calculator.productPrice')}
          </label>
          <input
            type="number"
            value={productPrice}
            onChange={(e) => setProductPrice(Number(e.target.value))}
            className="w-full bg-slate-50 border border-slate-200 text-slate-900 text-base font-bold rounded-xl px-4 py-3 focus:outline-hidden focus:border-blue-500"
          />
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-7 space-y-6">
          {/* Down payment */}
          <div>
            <div className="flex justify-between items-center text-xs font-bold mb-2">
              <span className="text-slate-600 uppercase tracking-wider">
                {t('calculator.downPayment')}
              </span>
              <span className="text-amber-600">
                {formatPrice(downPayment)} ({Math.round((downPayment / productPrice) * 100) || 0}%)
              </span>
            </div>
            <input
              type="range"
              min={minDown}
              max={maxDown}
              step={5000}
              value={downPayment}
              onChange={(e) => setDownPayment(Number(e.target.value))}
              className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-amber-500"
            />
            <div className="flex justify-between text-[10px] text-slate-500 font-semibold mt-1">
              <span>
                {t('calculator.minDown')}: {formatPrice(minDown)}
              </span>
              <span>50%</span>
            </div>
          </div>

          {/* Term */}
          <div>
            <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-3">
              {t('calculator.term')}
            </label>
            <div className="grid grid-cols-5 gap-2">
              {availableTerms.map((term) => (
                <button
                  type="button"
                  key={term}
                  onClick={() => setSelectedTerm(term)}
                  className={`py-3 rounded-xl font-black text-xs transition-all cursor-pointer border ${
                    selectedTerm === term
                      ? 'bg-blue-600 border-blue-500 text-white shadow-lg'
                      : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'
                  }`}
                >
                  {term} {t('banks.monthsShort')}
                </button>
              ))}
            </div>
          </div>

          {/* Banks with live monthly prices */}
          <div>
            <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-3">
              {t('calculator.selectBank')}
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {mockBanks.map((bank) => (
                <BankCard
                  key={bank.id}
                  bank={bank}
                  isSelected={bank.id === selectedBankId}
                  onSelect={() => setSelectedBankId(bank.id)}
                  lang={lang}
                  monthlyPayment={bankPayments[bank.id]}
                  termMonths={Math.min(selectedTerm, bank.maxTermMonths)}
                />
              ))}
            </div>
          </div>
        </div>

        {/* Order-like summary */}
        <div className="lg:col-span-5">
          <div className="sticky top-4 bg-slate-900 text-white rounded-3xl p-6 shadow-xl space-y-5 border border-slate-800">
            <h3 className="text-base font-bold flex items-center space-x-2">
              <Calculator className="text-blue-400" size={20} />
              <span>{t('calculator.summary')}</span>
            </h3>

            <div className="bg-slate-800/80 p-5 rounded-2xl border border-slate-700 text-center space-y-1">
              <span className="text-xs text-slate-400 font-semibold uppercase tracking-wider">
                {t('calculator.monthlyPayment')}
              </span>
              <p className="text-3xl font-black text-blue-400 tracking-tight">
                {formatPrice(monthlyPayment)}
              </p>
              <p className="text-[11px] text-slate-400">
                {selectedTerm} × {formatPrice(monthlyPayment)}
              </p>
            </div>

            <div className="space-y-2.5 text-xs text-slate-300">
              <div className="flex justify-between py-2 border-b border-slate-700/60">
                <span>{t('calculator.productPrice')}</span>
                <span className="font-bold text-white">{formatPrice(productPrice)}</span>
              </div>
              <div className="flex justify-between py-2 border-b border-slate-700/60">
                <span>{t('calculator.selectBank')}</span>
                <span className="font-bold text-white">{selectedBank.name}</span>
              </div>
              <div className="flex justify-between py-2 border-b border-slate-700/60">
                <span>{t('calculator.interestRate')}</span>
                <span className="font-bold text-emerald-400">{selectedBank.minRate}%</span>
              </div>
              <div className="flex justify-between py-2 border-b border-slate-700/60">
                <span>{t('calculator.downPayment')}</span>
                <span className="font-bold text-white">{formatPrice(downPayment)}</span>
              </div>
              <div className="flex justify-between py-2 border-b border-slate-700/60">
                <span>{t('calculator.creditAmount')}</span>
                <span className="font-bold text-white">{formatPrice(financedAmount)}</span>
              </div>
              <div className="flex justify-between py-2 border-b border-slate-700/60">
                <span>{t('calculator.totalOverpayment')}</span>
                <span className="font-bold text-amber-400">{formatPrice(overpayment)}</span>
              </div>
              <div className="flex justify-between py-2 font-bold text-sm text-white pt-1">
                <span>{t('calculator.totalRepayment')}</span>
                <span>{formatPrice(totalRepayment)}</span>
              </div>
            </div>

            <button
              type="button"
              onClick={handleApplyClick}
              className="w-full py-4 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-black text-sm rounded-2xl shadow-xl flex items-center justify-center space-x-2 transition-all cursor-pointer"
            >
              <Send size={18} />
              <span>
                {t('calculator.buyWithBank', { bank: selectedBank.name })}
              </span>
            </button>

            <button
              type="button"
              onClick={() => setShowSchedule(!showSchedule)}
              className="w-full py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white text-xs font-semibold rounded-xl flex items-center justify-center space-x-1.5 transition-colors cursor-pointer"
            >
              <span>{showSchedule ? t('calculator.hideSchedule') : t('calculator.viewSchedule')}</span>
              {showSchedule ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
            </button>
          </div>
        </div>
      </div>

      {showSchedule && (
        <div className="pt-2 animate-fade-in">
          <PaymentPlan
            amount={financedAmount}
            termMonths={selectedTerm}
            annualRatePct={selectedBank.minRate}
          />
        </div>
      )}
    </div>
  );
};
