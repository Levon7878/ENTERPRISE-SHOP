import React, { useEffect, useMemo, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useForm, useWatch } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { CheckCircle2, CreditCard, Truck, ArrowRight, Percent } from 'lucide-react';
import { useCartStore } from '../app/store/useCartStore';
import { useCurrencyStore } from '../app/store/useCompareStore';
import { SEOHead } from '../features/seo/SEOHead';
import { Modal } from '../shared/components/ui/Modal';
import { SafeImage } from '../shared/components/ui/SafeImage';
import { CreditCalculator } from '../features/credit/CreditCalculator';
import { CreditApplicationForm } from '../features/credit/CreditApplicationFormInline';
import { Language } from '../shared/types';

const checkoutSchema = z.object({
  fullName: z.string().min(3, 'Full name is required'),
  phone: z.string().min(8, 'Phone number is required'),
  city: z.string().min(2, 'City/Location is required'),
  address: z.string().min(5, 'Street address is required'),
  paymentMethod: z.enum(['cash', 'card', 'credit']),
  notes: z.string().optional(),
});

type CheckoutFormData = z.infer<typeof checkoutSchema>;

type CreditStep = 'calculator' | 'application';

type LoanDetails = {
  bankId: string;
  bankName: string;
  termMonths: number;
  monthlyPayment: number;
  downPayment: number;
  productName: string;
};

export const CheckoutPage: React.FC = () => {
  const { t, i18n } = useTranslation(['checkout', 'common', 'products', 'credit']);
  const { lang } = useParams<{ lang?: string }>();
  const currentLang = (lang || i18n.language || 'am') as Language;

  const { items, clearCart, getSubtotal, getDiscountAmount, getTotalPrice } = useCartStore();
  const { formatPrice } = useCurrencyStore();

  const [orderComplete, setOrderComplete] = useState<string | null>(null);
  const [isCreditOpen, setIsCreditOpen] = useState(false);
  const [creditStep, setCreditStep] = useState<CreditStep>('calculator');
  const [loanDetails, setLoanDetails] = useState<LoanDetails | null>(null);

  const {
    register,
    handleSubmit,
    control,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<CheckoutFormData>({
    resolver: zodResolver(checkoutSchema),
    defaultValues: {
      fullName: '',
      phone: '+374 ',
      city: 'Yerevan',
      address: '',
      paymentMethod: 'cash',
      notes: '',
    },
  });

  const paymentMethod = useWatch({ control, name: 'paymentMethod' });

  const creditEligibleItems = useMemo(
    () => items.filter((item) => item.product.isCreditEligible),
    [items]
  );

  const creditProduct = creditEligibleItems[0]?.product;
  const creditAmount = getTotalPrice();
  const creditProductName =
    items.length === 1
      ? items[0].product.translations[currentLang].name
      : items.map((i) => i.product.translations[currentLang].name).join(', ');

  // Open credit panel when user selects credit payment
  useEffect(() => {
    if (paymentMethod === 'credit') {
      if (creditEligibleItems.length === 0) {
        setValue('paymentMethod', 'cash');
        return;
      }
      setCreditStep('calculator');
      setLoanDetails(null);
      setIsCreditOpen(true);
    }
  }, [paymentMethod, creditEligibleItems.length, setValue]);

  const closeCreditPanel = () => {
    setIsCreditOpen(false);
    setCreditStep('calculator');
    setLoanDetails(null);
    if (paymentMethod === 'credit') {
      setValue('paymentMethod', 'cash');
    }
  };

  const handleApplyLoan = (details: {
    bankId: string;
    termMonths: number;
    monthlyPayment: number;
    downPayment: number;
  }) => {
    setLoanDetails({
      ...details,
      bankName:
        details.bankId === 'ameria'
          ? 'Ameriabank'
          : details.bankId === 'acba'
            ? 'ACBA Bank'
            : 'Inecobank',
      productName: creditProductName,
    });
    setCreditStep('application');
  };

  const finishCreditOrder = () => {
    const orderNum = `CRD-${Math.floor(100000 + Math.random() * 900000)}`;
    clearCart();
    setIsCreditOpen(false);
    setOrderComplete(orderNum);
  };

  const onSubmit = async (data: CheckoutFormData) => {
    if (data.paymentMethod === 'credit') {
      // Credit is handled via the credit panel, not the normal submit
      setIsCreditOpen(true);
      setCreditStep('calculator');
      return;
    }

    console.log('Order submitted:', data, items);
    await new Promise((res) => setTimeout(res, 1000));
    const orderNum = `ORD-${Math.floor(100000 + Math.random() * 900000)}`;
    clearCart();
    setOrderComplete(orderNum);
  };

  if (orderComplete) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-16 text-center space-y-6">
        <div className="w-20 h-20 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto">
          <CheckCircle2 size={48} />
        </div>
        <h1 className="text-3xl font-black text-slate-900">{t('title')}</h1>
        <p className="text-sm text-slate-600">
          <strong className="text-blue-600 font-mono text-base">{orderComplete}</strong>
        </p>
        <Link
          to={`/${currentLang}/`}
          className="px-8 py-3.5 bg-blue-600 text-white font-bold text-xs rounded-xl inline-block shadow-lg hover:bg-blue-700 transition-all"
        >
          {t('common:buttons.backToHome')}
        </Link>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-16 text-center space-y-4">
        <h2 className="text-xl font-bold text-slate-900">{t('title')}</h2>
        <Link
          to={`/${currentLang}/`}
          className="px-6 py-2.5 bg-blue-600 text-white font-bold text-xs rounded-xl inline-block"
        >
          {t('common:buttons.backToHome')}
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-8 py-8 space-y-8">
      <SEOHead title={t('title')} description={t('title')} canonicalPath="/checkout" />

      <h1 className="text-3xl font-black text-slate-900 tracking-tight">{t('title')}</h1>

      <form onSubmit={handleSubmit(onSubmit)} className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div className="lg:col-span-7 space-y-6">
          <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-100 shadow-sm space-y-4">
            <h3 className="text-base font-bold text-slate-900 flex items-center space-x-2">
              <Truck size={20} className="text-blue-600" />
              <span>1. {t('steps.shipping')}</span>
            </h3>

            <div className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                  {t('shippingForm.fullName')}
                </label>
                <input
                  type="text"
                  {...register('fullName')}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-xs text-slate-900 focus:outline-hidden focus:border-blue-500"
                />
                {errors.fullName && (
                  <p className="text-red-500 text-[11px] mt-1">{errors.fullName.message}</p>
                )}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                    {t('shippingForm.phone')}
                  </label>
                  <input
                    type="text"
                    {...register('phone')}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-xs text-slate-900 focus:outline-hidden focus:border-blue-500"
                  />
                  {errors.phone && (
                    <p className="text-red-500 text-[11px] mt-1">{errors.phone.message}</p>
                  )}
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                    {t('shippingForm.city')}
                  </label>
                  <input
                    type="text"
                    {...register('city')}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-xs text-slate-900 focus:outline-hidden focus:border-blue-500"
                  />
                  {errors.city && (
                    <p className="text-red-500 text-[11px] mt-1">{errors.city.message}</p>
                  )}
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                  {t('shippingForm.address')}
                </label>
                <input
                  type="text"
                  {...register('address')}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-xs text-slate-900 focus:outline-hidden focus:border-blue-500"
                />
                {errors.address && (
                  <p className="text-red-500 text-[11px] mt-1">{errors.address.message}</p>
                )}
              </div>
            </div>
          </div>

          <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-100 shadow-sm space-y-4">
            <h3 className="text-base font-bold text-slate-900 flex items-center space-x-2">
              <CreditCard size={20} className="text-blue-600" />
              <span>2. {t('steps.payment')}</span>
            </h3>

            <div className="space-y-3">
              <label className="flex items-center space-x-3 p-4 bg-slate-50 rounded-2xl border border-slate-200 cursor-pointer has-[:checked]:border-blue-500 has-[:checked]:bg-blue-50">
                <input type="radio" value="cash" {...register('paymentMethod')} />
                <span className="text-xs font-bold text-slate-900">{t('paymentMethods.cash')}</span>
              </label>

              <label className="flex items-center space-x-3 p-4 bg-slate-50 rounded-2xl border border-slate-200 cursor-pointer has-[:checked]:border-blue-500 has-[:checked]:bg-blue-50">
                <input type="radio" value="card" {...register('paymentMethod')} />
                <span className="text-xs font-bold text-slate-900">{t('paymentMethods.card')}</span>
              </label>

              <label
                className={`flex items-center justify-between p-4 rounded-2xl border cursor-pointer ${
                  creditEligibleItems.length === 0
                    ? 'bg-slate-100 border-slate-200 opacity-50 cursor-not-allowed'
                    : 'bg-amber-50 border-amber-200 has-[:checked]:border-amber-500'
                }`}
              >
                <div className="flex items-center space-x-3">
                  <input
                    type="radio"
                    value="credit"
                    {...register('paymentMethod')}
                    disabled={creditEligibleItems.length === 0}
                  />
                  <span className="text-xs font-bold text-amber-700 flex items-center space-x-1.5">
                    <Percent size={14} />
                    <span>{t('paymentMethods.credit')}</span>
                  </span>
                </div>
                {paymentMethod === 'credit' && creditEligibleItems.length > 0 && (
                  <button
                    type="button"
                    onClick={() => {
                      setCreditStep('calculator');
                      setIsCreditOpen(true);
                    }}
                    className="text-[11px] font-bold text-amber-800 underline"
                  >
                    {t('products:productDetail.calculate')}
                  </button>
                )}
              </label>
            </div>
          </div>
        </div>

        <div className="lg:col-span-5 space-y-6">
          <div className="bg-slate-900 text-white p-6 sm:p-8 rounded-3xl shadow-xl space-y-6">
            <h3 className="text-lg font-black text-white border-b border-slate-800 pb-4">
              {t('summary.total')}
            </h3>

            <div className="space-y-3 max-h-60 overflow-y-auto">
              {items.map(({ product, quantity }) => (
                <div key={product.id} className="flex justify-between items-center text-xs">
                  <div className="flex items-center space-x-2 min-w-0">
                    <SafeImage
                      src={product.images[0]}
                      alt={product.translations[currentLang].name}
                      className="w-8 h-8 rounded-lg object-cover bg-white"
                    />
                    <span className="truncate max-w-[180px]">
                      {product.translations[currentLang].name} x{quantity}
                    </span>
                  </div>
                  <span className="font-bold text-white shrink-0">
                    {formatPrice(product.price * quantity)}
                  </span>
                </div>
              ))}
            </div>

            <div className="border-t border-slate-800 pt-4 space-y-2 text-xs text-slate-300">
              <div className="flex justify-between">
                <span>{t('summary.itemsTotal')}</span>
                <span>{formatPrice(getSubtotal())}</span>
              </div>
              <div className="flex justify-between">
                <span>{t('summary.shippingFee')}</span>
                <span className="text-emerald-400 font-bold">{t('summary.freeShipping')}</span>
              </div>
              {getDiscountAmount() > 0 && (
                <div className="flex justify-between text-emerald-400 font-bold">
                  <span>{t('summary.discount')}</span>
                  <span>-{formatPrice(getDiscountAmount())}</span>
                </div>
              )}
              <div className="flex justify-between text-lg font-black text-white pt-2 border-t border-slate-800">
                <span>{t('summary.total')}</span>
                <span className="text-blue-400">{formatPrice(getTotalPrice())}</span>
              </div>
            </div>

            <button
              type={paymentMethod === 'credit' ? 'button' : 'submit'}
              disabled={isSubmitting}
              onClick={() => {
                if (paymentMethod === 'credit') {
                  setCreditStep('calculator');
                  setIsCreditOpen(true);
                }
              }}
              className="w-full py-4 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-black text-sm rounded-2xl shadow-xl flex items-center justify-center space-x-2 transition-all cursor-pointer disabled:opacity-50"
            >
              <span>
                {paymentMethod === 'credit'
                  ? t('common:buttons.buyInCredit')
                  : t('common:buttons.checkout')}
              </span>
              <ArrowRight size={18} />
            </button>
          </div>
        </div>
      </form>

      <Modal
        isOpen={isCreditOpen}
        onClose={closeCreditPanel}
        title={
          creditStep === 'calculator'
            ? t('products:productDetail.creditPanelTitle')
            : t('credit:modal.title')
        }
        maxWidth="max-w-5xl"
      >
        {creditStep === 'calculator' ? (
          <CreditCalculator
            product={creditProduct}
            amount={creditAmount}
            lang={currentLang}
            onApplyLoan={handleApplyLoan}
          />
        ) : (
          <CreditApplicationForm
            loanDetails={loanDetails}
            onBack={() => setCreditStep('calculator')}
            onSuccessClose={finishCreditOrder}
          />
        )}
      </Modal>
    </div>
  );
};
