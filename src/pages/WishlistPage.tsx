import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Heart, Trash2 } from 'lucide-react';
import { useWishlistStore } from '../app/store/useWishlistStore';
import { ProductCard } from '../features/products/ProductCard';
import { SEOHead } from '../features/seo/SEOHead';
import { Language } from '../shared/types';

export const WishlistPage: React.FC = () => {
  const { lang } = useParams<{ lang?: string }>();
  const { i18n } = useTranslation('common');
  const currentLang = (lang || i18n.language || 'am') as Language;

  const { items, clearWishlist } = useWishlistStore();

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-8 py-8 space-y-8">
      <SEOHead title="Wishlist - Enterprise Electronics" description="Saved favorite electronic products" canonicalPath="/wishlist" />

      <div className="flex justify-between items-center bg-white p-6 rounded-3xl border border-slate-100 shadow-sm">
        <div className="flex items-center space-x-3">
          <div className="p-3 bg-red-50 text-red-500 rounded-2xl">
            <Heart size={24} className="fill-red-500" />
          </div>
          <div>
            <h1 className="text-2xl font-black text-slate-900">Wishlist</h1>
            <p className="text-xs text-slate-500">{items.length} saved products</p>
          </div>
        </div>

        {items.length > 0 && (
          <button
            onClick={clearWishlist}
            className="text-xs text-slate-400 hover:text-red-500 flex items-center space-x-1 transition-colors cursor-pointer"
          >
            <Trash2 size={14} />
            <span>Clear All</span>
          </button>
        )}
      </div>

      {items.length === 0 ? (
        <div className="bg-white rounded-3xl p-12 text-center space-y-4 border border-slate-100">
          <p className="text-sm font-semibold text-slate-600">Your wishlist is currently empty.</p>
          <Link
            to={`/${currentLang}/`}
            className="px-6 py-2.5 bg-blue-600 text-white font-bold text-xs rounded-xl inline-block"
          >
            Discover Products
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {items.map((product) => (
            <ProductCard key={product.id} product={product} lang={currentLang} />
          ))}
        </div>
      )}
    </div>
  );
};
