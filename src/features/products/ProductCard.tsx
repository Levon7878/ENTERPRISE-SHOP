import React from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Heart, Scale, ShoppingCart, Percent, Eye } from 'lucide-react';
import { RatingStars } from '../../shared/components/ui/RatingStars';
import { SafeImage } from '../../shared/components/ui/SafeImage';
import { useWishlistStore } from '../../app/store/useWishlistStore';
import { useCompareStore, useCurrencyStore } from '../../app/store/useCompareStore';
import { useAddToCart } from '../../shared/hooks/useAddToCart';
import { Product, Language } from '../../shared/types';

interface ProductCardProps {
  product: Product;
  lang: Language;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product, lang }) => {
  const { t } = useTranslation('common');
  const { formatPrice } = useCurrencyStore();
  const addToCart = useAddToCart();

  const { toggleWishlist, isInWishlist } = useWishlistStore();
  const { toggleCompare, isInCompare } = useCompareStore();

  const isLiked = isInWishlist(product.id);
  const isCompared = isInCompare(product.id);

  const name = product.translations[lang].name;
  const shortDesc = product.translations[lang].shortDescription;

  return (
    <div className="group bg-white rounded-3xl p-4 border border-slate-100 shadow-xs hover:shadow-2xl hover:border-blue-100 transition-all duration-300 flex flex-col justify-between relative overflow-hidden">
      {/* Top Badges */}
      <div className="flex justify-between items-start z-10">
        <div className="flex flex-col space-y-1">
          {product.discountPercentage && (
            <span className="bg-red-500 text-white text-[10px] font-black uppercase px-2 py-0.5 rounded-full shadow-xs">
              -{product.discountPercentage}%
            </span>
          )}
          {product.isNew && (
            <span className="bg-blue-600 text-white text-[10px] font-black uppercase px-2 py-0.5 rounded-full shadow-xs">
              NEW
            </span>
          )}
        </div>

        {/* Action icons */}
        <div className="flex flex-col space-y-1">
          <button
            onClick={() => toggleWishlist(product)}
            className={`p-2 rounded-full backdrop-blur-xs transition-colors cursor-pointer ${
              isLiked ? 'bg-red-50 text-red-500' : 'bg-slate-100/80 text-slate-400 hover:text-red-500'
            }`}
            aria-label="Wishlist"
          >
            <Heart size={16} className={isLiked ? 'fill-red-500' : ''} />
          </button>
          <button
            onClick={() => toggleCompare(product)}
            className={`p-2 rounded-full backdrop-blur-xs transition-colors cursor-pointer ${
              isCompared ? 'bg-blue-50 text-blue-600' : 'bg-slate-100/80 text-slate-400 hover:text-blue-600'
            }`}
            aria-label="Compare"
          >
            <Scale size={16} />
          </button>
        </div>
      </div>

      {/* Image Preview */}
      <Link to={`/${lang}/product/${product.slug}`} className="block relative my-3 group-hover:scale-105 transition-transform duration-300">
        <SafeImage
          src={product.images[0]}
          alt={name}
          className="w-full h-44 object-cover rounded-2xl bg-slate-50"
          loading="lazy"
        />
      </Link>

      {/* Product Content */}
      <div className="space-y-2">
        <div className="flex justify-between items-center text-xs">
          <span className="text-slate-400 font-semibold">{product.brand.name}</span>
          <RatingStars rating={product.rating} count={product.reviewCount} size={13} />
        </div>

        <Link to={`/${lang}/product/${product.slug}`} className="block">
          <h3 className="text-xs font-bold text-slate-900 line-clamp-2 hover:text-blue-600 transition-colors leading-snug">
            {name}
          </h3>
        </Link>
        <p className="text-[11px] text-slate-400 line-clamp-1">{shortDesc}</p>

        {/* Credit monthly hint — goes to product page, not standalone credit */}
        {product.isCreditEligible && (
          <Link
            to={`/${lang}/product/${product.slug}?credit=1`}
            className="inline-flex items-center space-x-1 text-[11px] text-amber-600 font-bold bg-amber-50 px-2 py-0.5 rounded-lg border border-amber-200/60"
          >
            <Percent size={11} />
            <span>{t('buttons.buyInCredit')}: {formatPrice(product.minMonthlyInstallment)} / mo</span>
          </Link>
        )}
      </div>

      {/* Price & Add to Cart Row */}
      <div className="pt-3 mt-3 border-t border-slate-100 flex items-center justify-between">
        <div>
          {product.oldPrice && (
            <span className="text-[11px] text-slate-400 line-through block -mb-1">
              {formatPrice(product.oldPrice)}
            </span>
          )}
          <span className="text-base font-black text-slate-900">
            {formatPrice(product.price)}
          </span>
        </div>

        <button
          onClick={() => addToCart(product)}
          className="p-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl shadow-md hover:shadow-blue-500/30 transition-all cursor-pointer flex items-center space-x-1 text-xs font-bold"
          aria-label={t('buttons.addToCart')}
        >
          <ShoppingCart size={16} />
          <span className="hidden sm:inline">{t('buttons.addToCart')}</span>
        </button>
      </div>
    </div>
  );
};
