import React, { useEffect, useMemo, useState } from 'react';
import { Link, useParams, useSearchParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { ChevronRight, Search, RotateCcw } from 'lucide-react';
import { SEOHead } from '../features/seo/SEOHead';
import { useProducts } from '../services/api/queries';
import { ProductCard } from '../features/products/ProductCard';
import { ProductCardSkeleton } from '../shared/components/ui/Skeleton';
import { Language, CategoryFilterState } from '../shared/types';

export const SearchPage: React.FC = () => {
  const { lang } = useParams<{ lang?: string }>();
  const { t, i18n } = useTranslation(['common', 'products']);
  const currentLang = (lang || i18n.language || 'am') as Language;
  const [searchParams, setSearchParams] = useSearchParams();

  const queryFromUrl = searchParams.get('q') || searchParams.get('search') || '';
  const [inputValue, setInputValue] = useState(queryFromUrl);
  const [sortBy, setSortBy] = useState<CategoryFilterState['sortBy']>('name-asc');

  useEffect(() => {
    setInputValue(queryFromUrl);
  }, [queryFromUrl]);

  const filterParams = useMemo(
    () => ({
      searchQuery: queryFromUrl,
      sortBy,
    }),
    [queryFromUrl, sortBy]
  );

  const { data: products, isLoading } = useProducts(filterParams, !!queryFromUrl.trim());

  const submitSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const next = inputValue.trim();
    if (!next) return;
    setSearchParams({ q: next });
  };

  const title = queryFromUrl
    ? t('common:search.resultsFor', { query: queryFromUrl })
    : t('common:search.title');

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-8 py-8 space-y-8">
      <SEOHead title={title} description={title} canonicalPath="/search" />

      <nav className="flex items-center space-x-2 text-xs text-slate-400">
        <Link to={`/${currentLang}/`} className="hover:text-blue-600">
          {t('products:productDetail.home')}
        </Link>
        <ChevronRight size={12} />
        <span className="text-slate-700 font-bold">{t('common:search.title')}</span>
      </nav>

      <div className="bg-white rounded-3xl border border-slate-100 p-6 space-y-4 shadow-sm">
        <h1 className="text-2xl font-black text-slate-900 tracking-tight">{title}</h1>

        <form onSubmit={submitSearch} className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="search"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder={t('common:nav.searchPlaceholder')}
              className="w-full rounded-xl border border-slate-200 bg-slate-50 pl-10 pr-4 py-2.5 text-sm focus:outline-hidden focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
              autoFocus
            />
          </div>
          <button
            type="submit"
            className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-sm font-bold rounded-xl"
          >
            {t('common:search.button')}
          </button>
        </form>

        <div className="flex flex-wrap items-center justify-between gap-3 text-xs text-slate-500">
          <span>
            {queryFromUrl
              ? t('common:search.found', { count: products?.length || 0 })
              : t('common:search.hint')}
          </span>
          <div className="flex items-center gap-2">
            <span className="font-bold">{t('products:filters.sortBy')}:</span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as CategoryFilterState['sortBy'])}
              className="rounded-lg border border-slate-200 bg-white px-2 py-1.5 font-semibold text-slate-700"
            >
              <option value="name-asc">{t('products:filters.sortNameAsc')}</option>
              <option value="name-desc">{t('products:filters.sortNameDesc')}</option>
              <option value="price-asc">{t('products:filters.sortPriceAsc')}</option>
              <option value="price-desc">{t('products:filters.sortPriceDesc')}</option>
              <option value="rating-desc">{t('products:filters.sortRating')}</option>
              <option value="newest">{t('products:filters.sortNewest')}</option>
            </select>
            {queryFromUrl && (
              <button
                type="button"
                onClick={() => {
                  setInputValue('');
                  setSearchParams({});
                }}
                className="inline-flex items-center gap-1 text-slate-400 hover:text-red-500"
              >
                <RotateCcw size={12} />
                {t('common:search.clear')}
              </button>
            )}
          </div>
        </div>
      </div>

      {!queryFromUrl.trim() ? (
        <div className="bg-white rounded-3xl border border-slate-100 p-12 text-center text-sm text-slate-500">
          {t('common:search.hint')}
        </div>
      ) : isLoading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {Array.from({ length: 8 }).map((_, i) => (
            <ProductCardSkeleton key={i} />
          ))}
        </div>
      ) : products && products.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} lang={currentLang} />
          ))}
        </div>
      ) : (
        <div className="bg-white rounded-3xl border border-slate-100 p-12 text-center space-y-3">
          <p className="text-sm font-semibold text-slate-600">{t('common:search.empty')}</p>
          <Link
            to={`/${currentLang}/`}
            className="inline-block px-5 py-2.5 bg-blue-600 text-white text-xs font-bold rounded-xl"
          >
            {t('products:productDetail.returnHome')}
          </Link>
        </div>
      )}
    </div>
  );
};
