import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useTranslation } from 'react-i18next';
import { CheckCircle2, ShieldCheck, Clock, Send } from 'lucide-react';
import { useCurrencyStore } from '../../../app/store/useCompareStore';
import { mockBanks } from '../../../data/banks';
import { Language, CreditApplication } from '../../../shared/types';

const creditAppSchema = z.object({
  fullName: z.string().min(3, 'Full name must be at least 3 characters'),
  phone: z.string().min(8, 'Phone number is required (e.g. +374 99 000000)'),
  email: z.string().email('Please enter a valid email address'),
  productName: z.string().min(2, 'Product name is required'),
  price: z.number({ invalid_type_error: 'Price must be a number' }).min(10000, 'Minimum price 10,000 AMD'),
  desiredTerm: z.number().min(3).max(36),
  preferredBank: z.string().min(1, 'Select a preferred bank'),
});

type CreditAppFormData = z.infer<typeof creditAppSchema>;

interface CreditApplicationFormProps {
  initialProduct?: { name: string; price: number };
  lang: Language;
  onSuccess?: (app: CreditApplication) => void;
}

export const CreditApplicationForm: React.FC<CreditApplicationFormProps> = ({
  initialProduct,
  lang,
  onSuccess,
}) => {
  const { t } = useTranslation('credit');
  const { formatPrice } = useCurrencyStore();
  const [submittedApp, setSubmittedApp] = useState<CreditApplication | null>(null);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<CreditAppFormData>({
    resolver: zodResolver(creditAppSchema),
    defaultValues: {
      fullName: '',
      phone: '+374 ',
      email: '',
      productName: initialProduct?.name || 'Apple iPhone 17 Pro 256GB Titanium',
      price: initialProduct?.price || 650000,
      desiredTerm: 12,
      preferredBank: mockBanks[0].name,
    },
  });

  const selectedPrice = watch('price') || 650000;
  const selectedTerm = watch('desiredTerm') || 12;
  const selectedBankName = watch('preferredBank') || mockBanks[0].name;

  const selectedBankObj = mockBanks.find((b) => b.name === selectedBankName) || mockBanks[0];
  const monthlyRate = selectedBankObj.minRate / 100 / 12;
  const estimatedMonthly = Math.round(
    (selectedPrice * monthlyRate * Math.pow(1 + monthlyRate, selectedTerm)) /
      (Math.pow(1 + monthlyRate, selectedTerm) - 1)
  );

  const onSubmit = async (data: CreditAppFormData) => {
    await new Promise((res) => setTimeout(res, 800));

    const newApp: CreditApplication = {
      id: `CRD-${Math.floor(100000 + Math.random() * 900000)}`,
      productName: data.productName,
      productPrice: data.price,
      bankId: selectedBankObj.id,
      bankName: selectedBankObj.name,
      downPayment: 0,
      termMonths: data.desiredTerm,
      monthlyPayment: estimatedMonthly,
      totalPayment: estimatedMonthly * data.desiredTerm,
      overpayment: estimatedMonthly * data.desiredTerm - data.price,
      fullName: data.fullName,
      email: data.email,
      phone: data.phone,
      passportId: 'AN0000000',
      income: 300000,
      status: 'pending',
      createdAt: new Date().toISOString(),
    };

    setSubmittedApp(newApp);
    if (onSuccess) onSuccess(newApp);
  };

  if (submittedApp) {
    return (
      <div className="bg-white rounded-3xl p-8 border border-slate-100 shadow-xl text-center space-y-6 animate-fade-in">
        <div className="w-20 h-20 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto">
          <CheckCircle2 size={44} />
        </div>
        <div className="space-y-2">
          <span className="bg-amber-100 text-amber-800 text-[10px] font-black uppercase px-3 py-1 rounded-full tracking-wider">
            Status: Pending Bank Review
          </span>
          <h3 className="text-2xl font-black text-slate-900">Application Submitted!</h3>
          <p className="text-xs text-slate-500 max-w-md mx-auto">
            Your credit application ID is <strong className="text-blue-600 font-mono text-sm">{submittedApp.id}</strong>. A credit specialist from {submittedApp.bankName} will contact you within 5 minutes.
          </p>
        </div>

        {/* Tracking Card */}
        <div className="p-4 bg-slate-50 border border-slate-200 rounded-2xl text-xs space-y-2 text-left max-w-md mx-auto">
          <div className="flex justify-between border-b border-slate-200 pb-2 font-bold text-slate-900">
            <span>Product</span>
            <span>{submittedApp.productName}</span>
          </div>
          <div className="flex justify-between text-slate-600">
            <span>Bank Partner:</span>
            <span className="font-semibold text-slate-900">{submittedApp.bankName}</span>
          </div>
          <div className="flex justify-between text-slate-600">
            <span>Monthly Payment:</span>
            <span className="font-bold text-blue-600">{formatPrice(submittedApp.monthlyPayment)} / mo</span>
          </div>
          <div className="flex justify-between text-slate-600">
            <span>Credit Term:</span>
            <span>{submittedApp.termMonths} Months</span>
          </div>
        </div>

        <button
          onClick={() => setSubmittedApp(null)}
          className="px-6 py-2.5 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs rounded-xl transition-colors"
        >
          Submit Another Application
        </button>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-3xl p-6 sm:p-10 border border-slate-100 shadow-xl space-y-6">
      <div className="flex items-center space-x-3 pb-4 border-b border-slate-100">
        <div className="p-3 bg-blue-50 text-blue-600 rounded-2xl">
          <Send size={24} />
        </div>
        <div>
          <h3 className="text-xl font-black text-slate-900">Online Credit Application Form</h3>
          <p className="text-xs text-slate-500">Fill out your details for instant partner bank evaluation</p>
        </div>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Full Name</label>
            <input
              type="text"
              {...register('fullName')}
              placeholder="e.g. Armen Grigoryan"
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 focus:outline-hidden focus:border-blue-500"
            />
            {errors.fullName && <p className="text-red-500 text-[11px] mt-1 font-semibold">{errors.fullName.message}</p>}
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Phone Number</label>
            <input
              type="text"
              {...register('phone')}
              placeholder="+374 99 000000"
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 focus:outline-hidden focus:border-blue-500"
            />
            {errors.phone && <p className="text-red-500 text-[11px] mt-1 font-semibold">{errors.phone.message}</p>}
          </div>
        </div>

        <div>
          <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Email Address</label>
          <input
            type="email"
            {...register('email')}
            placeholder="client@example.com"
            className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 focus:outline-hidden focus:border-blue-500"
          />
          {errors.email && <p className="text-red-500 text-[11px] mt-1 font-semibold">{errors.email.message}</p>}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Selected Product</label>
            <input
              type="text"
              {...register('productName')}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 focus:outline-hidden focus:border-blue-500"
            />
            {errors.productName && <p className="text-red-500 text-[11px] mt-1 font-semibold">{errors.productName.message}</p>}
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Product Price (AMD)</label>
            <input
              type="number"
              {...register('price', { valueAsNumber: true })}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 focus:outline-hidden focus:border-blue-500"
            />
            {errors.price && <p className="text-red-500 text-[11px] mt-1 font-semibold">{errors.price.message}</p>}
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Desired Credit Term</label>
            <select
              {...register('desiredTerm', { valueAsNumber: true })}
              className="w-full bg-slate-50 border border-slate-200 text-xs font-bold text-slate-900 rounded-xl px-3.5 py-2.5 focus:outline-hidden focus:border-blue-500"
            >
              <option value={3}>3 Months</option>
              <option value={6}>6 Months</option>
              <option value={12}>12 Months (Recommended)</option>
              <option value={24}>24 Months</option>
              <option value={36}>36 Months</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Preferred Bank</label>
            <select
              {...register('preferredBank')}
              className="w-full bg-slate-50 border border-slate-200 text-xs font-bold text-slate-900 rounded-xl px-3.5 py-2.5 focus:outline-hidden focus:border-blue-500"
            >
              {mockBanks.map((b) => (
                <option key={b.id} value={b.name}>
                  {b.name} ({b.minRate}% APR)
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Live Monthly Estimate Callout */}
        <div className="p-4 bg-blue-50/80 border border-blue-100 rounded-2xl flex justify-between items-center text-xs">
          <div>
            <span className="text-slate-500 block">Estimated Monthly Installment:</span>
            <span className="text-xl font-black text-blue-600">{formatPrice(estimatedMonthly)} / mo</span>
          </div>
          <div className="text-right text-slate-400 text-[11px]">
            <span>Bank: {selectedBankName}</span>
            <br />
            <span>Term: {selectedTerm} months</span>
          </div>
        </div>

        <div className="flex items-center space-x-2 text-[11px] text-slate-500 bg-slate-50 p-3 rounded-xl border border-slate-100">
          <ShieldCheck size={18} className="text-blue-500 shrink-0" />
          <span>Application evaluated with 256-bit encryption. Approval sent via SMS within 5 minutes.</span>
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full py-4 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-black text-sm rounded-2xl shadow-xl transition-all cursor-pointer disabled:opacity-50"
        >
          {isSubmitting ? 'Evaluating Credit Application...' : 'Submit Application Now'}
        </button>
      </form>
    </div>
  );
};
