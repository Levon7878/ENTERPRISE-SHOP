import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Scale, Trash2, X, ShoppingCart } from 'lucide-react';
import { useCompareStore, useCurrencyStore } from '../app/store/useCompareStore';
import { useCartStore } from '../app/store/useCartStore';
import { SEOHead } from '../features/seo/SEOHead';
import { SafeImage } from '../shared/components/ui/SafeImage';
import { Language } from '../shared/types';

export const ComparePage: React.FC = () => {
  const { lang } = useParams<{ lang?: string }>();
  const { i18n } = useTranslation('common');
  const currentLang = (lang || i18n.language || 'am') as Language;
  const { formatPrice } = useCurrencyStore();

  const { items, toggleCompare, clearCompare } = useCompareStore();
  const addItem = useCartStore((state) => state.addItem);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-8 py-8 space-y-8">
      <SEOHead title="Compare Products - Enterprise Electronics" description="Side-by-side spec comparison" canonicalPath="/compare" />

      <div className="flex justify-between items-center bg-white p-6 rounded-3xl border border-slate-100 shadow-sm">
        <div className="flex items-center space-x-3">
          <div className="p-3 bg-blue-50 text-blue-600 rounded-2xl">
            <Scale size={24} />
          </div>
          <div>
            <h1 className="text-2xl font-black text-slate-900">Product Comparison</h1>
            <p className="text-xs text-slate-500">{items.length} products selected for comparison</p>
          </div>
        </div>

        {items.length > 0 && (
          <button
            onClick={clearCompare}
            className="text-xs text-slate-400 hover:text-red-500 flex items-center space-x-1 transition-colors cursor-pointer"
          >
            <Trash2 size={14} />
            <span>Clear Comparison</span>
          </button>
        )}
      </div>

      {items.length === 0 ? (
        <div className="bg-white rounded-3xl p-12 text-center space-y-4 border border-slate-100">
          <p className="text-sm font-semibold text-slate-600">No products added for comparison.</p>
          <Link
            to={`/${currentLang}/`}
            className="px-6 py-2.5 bg-blue-600 text-white font-bold text-xs rounded-xl inline-block"
          >
            Browse Products
          </Link>
        </div>
      ) : (
        <div className="overflow-x-auto bg-white rounded-3xl border border-slate-100 shadow-sm p-6">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr>
                <th className="p-4 w-48 font-bold text-slate-400 uppercase tracking-wider border-b border-slate-100">Features</th>
                {items.map((prod) => (
                  <th key={prod.id} className="p-4 min-w-[220px] border-b border-slate-100 relative">
                    <button
                      onClick={() => toggleCompare(prod)}
                      className="absolute top-2 right-2 text-slate-300 hover:text-red-500 p-1"
                    >
                      <X size={16} />
                    </button>
                    <div className="space-y-2">
                      <SafeImage src={prod.images[0]} alt={prod.translations[currentLang].name} className="w-24 h-24 object-cover rounded-xl mx-auto" />
                      <h4 className="font-bold text-slate-900 line-clamp-2 text-center">{prod.translations[currentLang].name}</h4>
                      <p className="text-base font-black text-blue-600 text-center">{formatPrice(prod.price)}</p>
                      <button
                        onClick={() => addItem(prod)}
                        className="w-full py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl flex items-center justify-center space-x-1"
                      >
                        <ShoppingCart size={14} />
                        <span>Add to Cart</span>
                      </button>
                    </div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              <tr>
                <td className="p-4 font-bold text-slate-700">Brand</td>
                {items.map((prod) => (
                  <td key={prod.id} className="p-4 text-slate-600 font-semibold">{prod.brand.name}</td>
                ))}
              </tr>
              <tr>
                <td className="p-4 font-bold text-slate-700">Category</td>
                {items.map((prod) => (
                  <td key={prod.id} className="p-4 text-slate-600">{prod.category.name[currentLang]}</td>
                ))}
              </tr>
              <tr>
                <td className="p-4 font-bold text-slate-700">Rating</td>
                {items.map((prod) => (
                  <td key={prod.id} className="p-4 text-slate-600 font-bold">{prod.rating} / 5.0</td>
                ))}
              </tr>
              <tr>
                <td className="p-4 font-bold text-slate-700">Credit Eligible</td>
                {items.map((prod) => (
                  <td key={prod.id} className="p-4 text-slate-600 font-bold">
                    {prod.isCreditEligible ? 'Yes (0% Down)' : 'No'}
                  </td>
                ))}
              </tr>
              <tr>
                <td className="p-4 font-bold text-slate-700">Warranty</td>
                {items.map((prod) => (
                  <td key={prod.id} className="p-4 text-slate-600">{prod.warrantyMonths} Months</td>
                ))}
              </tr>
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};
