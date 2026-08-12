import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useTranslation } from 'react-i18next';
import { ArrowLeft, CheckCircle2, ShieldCheck } from 'lucide-react';
import { useCurrencyStore } from '../../app/store/useCompareStore';

const creditSchema = z.object({
  fullName: z.string().min(3),
  phone: z.string().min(8),
  passportId: z.string().min(5),
  income: z.number().min(50000),
});

type CreditFormData = z.infer<typeof creditSchema>;

interface LoanDetails {
  bankId: string;
  bankName: string;
  termMonths: number;
  monthlyPayment: number;
  downPayment: number;
  productName?: string;
}

interface CreditApplicationFormProps {
  loanDetails: LoanDetails | null;
  onBack: () => void;
  onSuccessClose: () => void;
}

export const CreditApplicationForm: React.FC<CreditApplicationFormProps> = ({
  loanDetails,
  onBack,
  onSuccessClose,
}) => {
  const { t } = useTranslation('credit');
  const { formatPrice } = useCurrencyStore();
  const [isSuccess, setIsSuccess] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<CreditFormData>({
    resolver: zodResolver(creditSchema),
    defaultValues: {
      fullName: '',
      phone: '+374 ',
      passportId: '',
      income: 250000,
    },
  });

  const onSubmit = async (data: CreditFormData) => {
    console.log('Loan application submitted:', data, loanDetails);
    await new Promise((res) => setTimeout(res, 800));
    setIsSuccess(true);
  };

  if (isSuccess) {
    return (
      <div className="py-8 text-center space-y-4">
        <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto">
          <CheckCircle2 size={36} />
        </div>
        <h3 className="text-xl font-bold text-slate-900">{t('modal.success')}</h3>
        <button
          type="button"
          onClick={onSuccessClose}
          className="mt-4 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs px-6 py-3 rounded-xl transition-colors cursor-pointer"
        >
          OK
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 max-w-xl mx-auto">
      <button
        type="button"
        onClick={onBack}
        className="inline-flex items-center space-x-1 text-xs font-bold text-slate-500 hover:text-blue-600 cursor-pointer"
      >
        <ArrowLeft size={14} />
        <span>←</span>
      </button>

      {loanDetails && (
        <div className="p-4 bg-blue-50 border border-blue-100 rounded-2xl space-y-1 text-xs text-slate-700">
          <p className="font-bold text-blue-900">{loanDetails.productName}</p>
          <div className="flex flex-wrap gap-3 text-slate-600">
            <span>
              {loanDetails.bankName}
            </span>
            <span>
              {loanDetails.termMonths} mo
            </span>
            <span className="text-blue-600 font-bold">
              {formatPrice(loanDetails.monthlyPayment)} / mo
            </span>
          </div>
        </div>
      )}

      <div>
        <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
          {t('modal.fullName')}
        </label>
        <input
          type="text"
          {...register('fullName')}
          className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 focus:outline-hidden focus:border-blue-500"
        />
        {errors.fullName && (
          <p className="text-red-500 text-[11px] mt-1 font-semibold">{errors.fullName.message}</p>
        )}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
            {t('modal.phone')}
          </label>
          <input
            type="text"
            {...register('phone')}
            className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 focus:outline-hidden focus:border-blue-500"
          />
          {errors.phone && (
            <p className="text-red-500 text-[11px] mt-1 font-semibold">{errors.phone.message}</p>
          )}
        </div>

        <div>
          <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
            {t('modal.passport')}
          </label>
          <input
            type="text"
            {...register('passportId')}
            className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 focus:outline-hidden focus:border-blue-500"
          />
          {errors.passportId && (
            <p className="text-red-500 text-[11px] mt-1 font-semibold">{errors.passportId.message}</p>
          )}
        </div>
      </div>

      <div>
        <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
          {t('modal.income')}
        </label>
        <input
          type="number"
          {...register('income', { valueAsNumber: true })}
          className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 focus:outline-hidden focus:border-blue-500"
        />
        {errors.income && (
          <p className="text-red-500 text-[11px] mt-1 font-semibold">{errors.income.message}</p>
        )}
      </div>

      <div className="flex items-center space-x-2 text-[11px] text-slate-500 bg-slate-50 p-3 rounded-xl border border-slate-100">
        <ShieldCheck size={18} className="text-blue-500 shrink-0" />
        <span>{t('modal.success')}</span>
      </div>

      <button
        type="submit"
        disabled={isSubmitting}
        className="w-full py-3.5 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl shadow-lg transition-all cursor-pointer disabled:opacity-50"
      >
        {t('modal.submit')}
      </button>
    </form>
  );
};
