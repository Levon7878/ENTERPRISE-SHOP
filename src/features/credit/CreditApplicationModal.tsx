import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useTranslation } from 'react-i18next';
import { CheckCircle2, ShieldCheck } from 'lucide-react';
import { Modal } from '../../shared/components/ui/Modal';
import { useCurrencyStore } from '../../app/store/useCompareStore';

const creditSchema = z.object({
  fullName: z.string().min(3, 'Full name must be at least 3 characters'),
  phone: z.string().min(8, 'Enter a valid phone number (e.g. +374 99 000000)'),
  passportId: z.string().min(5, 'Passport or National ID number is required'),
  income: z.number({ invalid_type_error: 'Income must be a valid number' }).min(50000, 'Minimum income 50,000 AMD'),
});

type CreditFormData = z.infer<typeof creditSchema>;

interface CreditApplicationModalProps {
  isOpen: boolean;
  onClose: () => void;
  loanDetails: {
    bankId: string;
    bankName: string;
    termMonths: number;
    monthlyPayment: number;
    downPayment: number;
    productName?: string;
  } | null;
}

export const CreditApplicationModal: React.FC<CreditApplicationModalProps> = ({
  isOpen,
  onClose,
  loanDetails,
}) => {
  const { t } = useTranslation('credit');
  const { formatPrice } = useCurrencyStore();
  const [isSuccess, setIsSuccess] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
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

  const handleClose = () => {
    setIsSuccess(false);
    reset();
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={handleClose} title={t('modal.title')} maxWidth="max-w-xl">
      {isSuccess ? (
        <div className="py-8 text-center space-y-4">
          <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto">
            <CheckCircle2 size={36} />
          </div>
          <h3 className="text-xl font-bold text-slate-900">Application Submitted!</h3>
          <p className="text-sm text-slate-600 max-w-md mx-auto">{t('modal.success')}</p>
          <button
            onClick={handleClose}
            className="mt-4 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs px-6 py-3 rounded-xl transition-colors cursor-pointer"
          >
            Close Window
          </button>
        </div>
      ) : (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          {loanDetails && (
            <div className="p-4 bg-blue-50 border border-blue-100 rounded-2xl space-y-1 text-xs text-slate-700">
              <p className="font-bold text-blue-900">
                {loanDetails.productName || 'Financing Application'}
              </p>
              <div className="flex justify-between text-slate-600">
                <span>Bank: <strong className="text-slate-900">{loanDetails.bankName}</strong></span>
                <span>Term: <strong className="text-slate-900">{loanDetails.termMonths} Months</strong></span>
                <span>Monthly: <strong className="text-blue-600">{formatPrice(loanDetails.monthlyPayment)}</strong></span>
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
              placeholder="e.g. Armen Grigoryan"
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 focus:outline-hidden focus:border-blue-500"
            />
            {errors.fullName && <p className="text-red-500 text-[11px] mt-1 font-semibold">{errors.fullName.message}</p>}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                {t('modal.phone')}
              </label>
              <input
                type="text"
                {...register('phone')}
                placeholder="+374 99 000000"
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 focus:outline-hidden focus:border-blue-500"
              />
              {errors.phone && <p className="text-red-500 text-[11px] mt-1 font-semibold">{errors.phone.message}</p>}
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                {t('modal.passport')}
              </label>
              <input
                type="text"
                {...register('passportId')}
                placeholder="AN0123456"
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 focus:outline-hidden focus:border-blue-500"
              />
              {errors.passportId && <p className="text-red-500 text-[11px] mt-1 font-semibold">{errors.passportId.message}</p>}
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
            {errors.income && <p className="text-red-500 text-[11px] mt-1 font-semibold">{errors.income.message}</p>}
          </div>

          <div className="flex items-center space-x-2 text-[11px] text-slate-500 bg-slate-50 p-3 rounded-xl border border-slate-100">
            <ShieldCheck size={18} className="text-blue-500 shrink-0" />
            <span>Your personal data is encrypted and transmitted securely directly to the partner bank.</span>
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full py-3.5 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl shadow-lg transition-all cursor-pointer disabled:opacity-50"
          >
            {isSubmitting ? 'Submitting Application...' : t('modal.submit')}
          </button>
        </form>
      )}
    </Modal>
  );
};
