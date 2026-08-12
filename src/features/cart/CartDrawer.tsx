import React, { useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { X, Trash2, Plus, Minus, ShoppingBag, ArrowRight, Tag, Check } from 'lucide-react';
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

  const { items, updateQuantity, removeItem, promoCode, discountRate, applyPromoCode, removePromoCode, getSubtotal, getDiscountAmount, getTotalPrice } = useCartStore();
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
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-slate-900/60 backdrop-blur-xs transition-opacity"
        onClick={onClose}
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-white text-slate-900 shadow-2xl flex flex-col">
          {/* Header */}
          <div className="p-5 border-b border-slate-100 flex items-center justify-between bg-slate-50">
            <div className="flex items-center space-x-2">
              <ShoppingBag size={20} className="text-blue-600" />
              <h2 className="font-bold text-lg text-slate-900">{t('nav.cart')}</h2>
              <span className="bg-blue-100 text-blue-700 text-xs font-black px-2 py-0.5 rounded-full">
                {items.reduce((a, b) => a + b.quantity, 0)}
              </span>
            </div>
            <button
              onClick={onClose}
              className="p-2 text-slate-400 hover:text-slate-700 rounded-full hover:bg-slate-200/50 transition-colors"
              aria-label="Close cart"
            >
              <X size={20} />
            </button>
          </div>

          {/* Cart Items List */}
          <div className="flex-1 overflow-y-auto p-5 space-y-4">
            {items.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center space-y-4 text-slate-400 py-12">
                <ShoppingBag size={56} className="text-slate-200 stroke-1" />
                <p className="text-sm font-semibold text-slate-600">Your cart is currently empty</p>
                <button
                  onClick={onClose}
                  className="bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold px-5 py-2.5 rounded-xl transition-all shadow-md"
                >
                  Explore Electronics
                </button>
              </div>
            ) : (
              items.map(({ product, quantity }) => (
                <div
                  key={product.id}
                  className="flex space-x-3 p-3 bg-slate-50/70 border border-slate-100 rounded-2xl relative group"
                >
                  <SafeImage
                    src={product.images[0]}
                    alt={product.translations[currentLang].name}
                    className="w-20 h-20 object-cover rounded-xl bg-white border border-slate-100 shrink-0"
                  />
                  <div className="flex-1 min-w-0 flex flex-col justify-between">
                    <div>
                      <div className="flex justify-between items-start">
                        <Link
                          to={`/${currentLang}/product/${product.slug}`}
                          onClick={onClose}
                          className="text-xs font-bold text-slate-900 truncate hover:text-blue-600"
                        >
                          {product.translations[currentLang].name}
                        </Link>
                        <button
                          onClick={() => removeItem(product.id)}
                          className="text-slate-400 hover:text-red-500 p-1 transition-colors"
                          aria-label="Remove item"
                        >
                          <Trash2 size={15} />
                        </button>
                      </div>
                      <p className="text-xs text-slate-400">{product.brand.name}</p>
                    </div>

                    <div className="flex justify-between items-center mt-2">
                      <span className="text-sm font-black text-slate-900">
                        {formatPrice(product.price * quantity)}
                      </span>

                      {/* Quantity control */}
                      <div className="flex items-center space-x-1.5 bg-white border border-slate-200 rounded-lg p-0.5">
                        <button
                          onClick={() => updateQuantity(product.id, quantity - 1)}
                          className="p-1 hover:bg-slate-100 text-slate-600 rounded"
                        >
                          <Minus size={13} />
                        </button>
                        <span className="text-xs font-bold w-5 text-center">{quantity}</span>
                        <button
                          onClick={() => updateQuantity(product.id, quantity + 1)}
                          className="p-1 hover:bg-slate-100 text-slate-600 rounded"
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

          {/* Footer & Checkout Summary */}
          {items.length > 0 && (
            <div className="p-5 border-t border-slate-100 bg-slate-50 space-y-4">
              {/* Promo code box */}
              <div>
                {promoCode ? (
                  <div className="flex items-center justify-between p-2.5 bg-emerald-50 border border-emerald-200 rounded-xl text-xs text-emerald-800 font-semibold">
                    <span className="flex items-center space-x-1">
                      <Tag size={14} className="text-emerald-600" />
                      <span>PROMO ({promoCode}): -{(discountRate * 100)}%</span>
                    </span>
                    <button onClick={removePromoCode} className="text-emerald-700 underline text-[11px]">
                      Remove
                    </button>
                  </div>
                ) : (
                  <form onSubmit={handleApplyPromo} className="flex space-x-2">
                    <input
                      type="text"
                      value={promoInput}
                      onChange={(e) => setPromoInput(e.target.value)}
                      placeholder="Promo code (e.g. ENTERPRISE10)"
                      className="flex-1 bg-white border border-slate-200 text-xs px-3 py-2 rounded-xl focus:outline-hidden focus:border-blue-500"
                    />
                    <button
                      type="submit"
                      className="bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold px-3 py-2 rounded-xl transition-colors cursor-pointer"
                    >
                      Apply
                    </button>
                  </form>
                )}
                {promoMsg && (
                  <p className={`text-[11px] mt-1 font-semibold ${promoMsg.success ? 'text-emerald-600' : 'text-red-500'}`}>
                    {promoMsg.text}
                  </p>
                )}
              </div>

              {/* Totals */}
              <div className="space-y-1.5 text-xs text-slate-600">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span className="font-semibold text-slate-900">{formatPrice(getSubtotal())}</span>
                </div>
                {discountRate > 0 && (
                  <div className="flex justify-between text-emerald-600 font-semibold">
                    <span>Discount</span>
                    <span>-{formatPrice(getDiscountAmount())}</span>
                  </div>
                )}
                <div className="flex justify-between text-base font-black text-slate-900 pt-2 border-t border-slate-200">
                  <span>Total</span>
                  <span className="text-blue-600">{formatPrice(getTotalPrice())}</span>
                </div>
              </div>

              {/* Checkout Button */}
              <button
                onClick={handleCheckout}
                className="w-full py-3.5 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white rounded-2xl font-bold text-sm shadow-xl flex items-center justify-center space-x-2 transition-all cursor-pointer"
              >
                <span>Proceed to Checkout</span>
                <ArrowRight size={18} />
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
