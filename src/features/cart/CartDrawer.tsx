import React, { useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { X, Trash2, Plus, Minus, ShoppingBag, ArrowRight, Tag } from 'lucide-react';
import { useCartStore } from '../../app/store/useCartStore';
import { useCurrencyStore } from '../../app/store/useCompareStore';
import { SafeImage } from '../../shared/components/ui/SafeImage';
import { Language } from '../../shared/types';

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

export const CartDrawer: React.FC<CartDrawerProps> = ({ isOpen, onClose }) => {
  const { t, i18n } = useTranslation(['common', 'checkout']);
  const { lang } = useParams<{ lang?: string }>();
  const currentLang = (lang || i18n.language || 'am') as Language;
  const navigate = useNavigate();

  const {
    items,
    updateQuantity,
    removeItem,
    promoCode,
    discountRate,
    applyPromoCode,
    removePromoCode,
    getSubtotal,
    getDiscountAmount,
    getTotalPrice,
  } = useCartStore();
  const { formatPrice } = useCurrencyStore();

  const [promoInput, setPromoInput] = useState('');
  const [promoMsg, setPromoMsg] = useState<{ text: string; success: boolean } | null>(null);

  if (!isOpen) return null;

  const handleApplyPromo = (e: React.FormEvent) => {
    e.preventDefault();
    if (!promoInput.trim()) return;
    const ok = applyPromoCode(promoInput);
    if (ok) {
      setPromoMsg({ text: 'Promo code applied! 10% Discount applied.', success: true });
      setPromoInput('');
    } else {
      setPromoMsg({ text: 'Invalid promo code. Try "ENTERPRISE10"', success: false });
    }
  };

  const handleCheckout = () => {
    onClose();
    navigate(`/${currentLang}/checkout`);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden animate-fade-in">
      <div
        className="absolute inset-0 bg-slate-900/60 backdrop-blur-xs transition-opacity"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Full-bleed under ~480px; capped width + side gap from sm up */}
      <div className="fixed inset-y-0 right-0 flex w-full max-w-full sm:pl-8 sm:max-w-md">
        <div className="flex h-full min-h-0 w-full flex-col bg-white text-slate-900 shadow-2xl">
          <div className="flex shrink-0 items-center justify-between border-b border-slate-100 bg-slate-50 px-3 py-3.5 sm:px-5 sm:py-4">
            <div className="flex min-w-0 items-center gap-2">
              <ShoppingBag size={18} className="shrink-0 text-blue-600 sm:size-5" />
              <h2 className="truncate text-base font-bold text-slate-900 sm:text-lg">{t('nav.cart')}</h2>
              <span className="shrink-0 rounded-full bg-blue-100 px-2 py-0.5 text-xs font-black text-blue-700">
                {items.reduce((a, b) => a + b.quantity, 0)}
              </span>
            </div>
            <button
              type="button"
              onClick={onClose}
              className="shrink-0 cursor-pointer rounded-full p-2 text-slate-400 transition-colors hover:bg-slate-200/50 hover:text-slate-700"
              aria-label="Close cart"
            >
              <X size={20} />
            </button>
          </div>

          <div className="min-h-0 flex-1 space-y-3 overflow-y-auto overscroll-contain px-3 py-3 sm:space-y-4 sm:px-5 sm:py-5">
            {items.length === 0 ? (
              <div className="flex h-full flex-col items-center justify-center space-y-4 py-12 text-center text-slate-400">
                <ShoppingBag size={56} className="stroke-1 text-slate-200" />
                <p className="text-sm font-semibold text-slate-600">Your cart is currently empty</p>
                <button
                  type="button"
                  onClick={onClose}
                  className="cursor-pointer rounded-xl bg-blue-600 px-5 py-2.5 text-xs font-bold text-white shadow-md transition-all hover:bg-blue-700"
                >
                  Explore Electronics
                </button>
              </div>
            ) : (
              items.map(({ product, quantity }) => (
                <div
                  key={product.id}
                  className="relative flex gap-2.5 rounded-2xl border border-slate-100 bg-slate-50/70 p-2.5 sm:gap-3 sm:p-3"
                >
                  <SafeImage
                    src={product.images[0]}
                    alt={product.translations[currentLang].name}
                    className="h-16 w-16 shrink-0 rounded-xl border border-slate-100 bg-white object-cover sm:h-20 sm:w-20"
                  />
                  <div className="flex min-w-0 flex-1 flex-col justify-between gap-2">
                    <div className="min-w-0">
                      <div className="flex items-start gap-2">
                        <Link
                          to={`/${currentLang}/product/${product.slug}`}
                          onClick={onClose}
                          className="min-w-0 flex-1 text-xs font-bold leading-snug text-slate-900 hover:text-blue-600 line-clamp-2"
                        >
                          {product.translations[currentLang].name}
                        </Link>
                        <button
                          type="button"
                          onClick={() => removeItem(product.id)}
                          className="shrink-0 cursor-pointer p-1 text-slate-400 transition-colors hover:text-red-500"
                          aria-label="Remove item"
                        >
                          <Trash2 size={15} />
                        </button>
                      </div>
                      <p className="mt-0.5 truncate text-[11px] text-slate-400 sm:text-xs">
                        {product.brand.name}
                      </p>
                    </div>

                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <span className="text-sm font-black text-slate-900">
                        {formatPrice(product.price * quantity)}
                      </span>

                      <div className="flex items-center gap-1 rounded-lg border border-slate-200 bg-white p-0.5">
                        <button
                          type="button"
                          onClick={() => updateQuantity(product.id, quantity - 1)}
                          className="cursor-pointer rounded p-1.5 text-slate-600 hover:bg-slate-100 sm:p-1"
                          aria-label="Decrease quantity"
                        >
                          <Minus size={13} />
                        </button>
                        <span className="w-5 text-center text-xs font-bold">{quantity}</span>
                        <button
                          type="button"
                          onClick={() => updateQuantity(product.id, quantity + 1)}
                          className="cursor-pointer rounded p-1.5 text-slate-600 hover:bg-slate-100 sm:p-1"
                          aria-label="Increase quantity"
                        >
                          <Plus size={13} />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {items.length > 0 && (
            <div className="shrink-0 space-y-3 border-t border-slate-100 bg-slate-50 px-3 py-3 pb-[max(0.75rem,env(safe-area-inset-bottom))] sm:space-y-4 sm:px-5 sm:py-5">
              <div>
                {promoCode ? (
                  <div className="flex items-center justify-between gap-2 rounded-xl border border-emerald-200 bg-emerald-50 p-2.5 text-xs font-semibold text-emerald-800">
                    <span className="flex min-w-0 items-center gap-1">
                      <Tag size={14} className="shrink-0 text-emerald-600" />
                      <span className="truncate">
                        PROMO ({promoCode}): -{discountRate * 100}%
                      </span>
                    </span>
                    <button
                      type="button"
                      onClick={removePromoCode}
                      className="shrink-0 cursor-pointer text-[11px] text-emerald-700 underline"
                    >
                      Remove
                    </button>
                  </div>
                ) : (
                  <form onSubmit={handleApplyPromo} className="flex gap-2">
                    <input
                      type="text"
                      value={promoInput}
                      onChange={(e) => setPromoInput(e.target.value)}
                      placeholder="Promo code"
                      className="min-w-0 flex-1 rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs focus:border-blue-500 focus:outline-hidden"
                    />
                    <button
                      type="submit"
                      className="shrink-0 cursor-pointer rounded-xl bg-slate-900 px-3 py-2 text-xs font-bold text-white transition-colors hover:bg-slate-800"
                    >
                      Apply
                    </button>
                  </form>
                )}
                {promoMsg && (
                  <p
                    className={`mt-1 text-[11px] font-semibold ${
                      promoMsg.success ? 'text-emerald-600' : 'text-red-500'
                    }`}
                  >
                    {promoMsg.text}
                  </p>
                )}
              </div>

              <div className="space-y-1.5 text-xs text-slate-600">
                <div className="flex justify-between gap-3">
                  <span>Subtotal</span>
                  <span className="font-semibold text-slate-900">{formatPrice(getSubtotal())}</span>
                </div>
                {discountRate > 0 && (
                  <div className="flex justify-between gap-3 font-semibold text-emerald-600">
                    <span>Discount</span>
                    <span>-{formatPrice(getDiscountAmount())}</span>
                  </div>
                )}
                <div className="flex justify-between gap-3 border-t border-slate-200 pt-2 text-base font-black text-slate-900">
                  <span>Total</span>
                  <span className="text-blue-600">{formatPrice(getTotalPrice())}</span>
                </div>
              </div>

              <button
                type="button"
                onClick={handleCheckout}
                className="flex w-full cursor-pointer items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-600 py-3.5 text-sm font-bold text-white shadow-xl transition-all hover:from-blue-700 hover:to-indigo-700"
              >
                <span>{t('buttons.checkout')}</span>
                <ArrowRight size={18} className="shrink-0" />
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
