import React, { useState, useMemo } from 'react';
import { useParams, Link, useSearchParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import {
  SlidersHorizontal,
  Grid,
  List,
  ChevronRight,
  RotateCcw,
  Check,
  Percent,
} from 'lucide-react';
import { SEOHead } from '../features/seo/SEOHead';
import { BreadcrumbSchema, FAQSchema } from '../features/seo/schemas/Schemas';
import { useCategoryBySlug, useProducts, useBrands } from '../services/api/queries';
import { ProductCard } from '../features/products/ProductCard';
import { ProductCardSkeleton } from '../shared/components/ui/Skeleton';
import { RatingStars } from '../shared/components/ui/RatingStars';
import { mockFAQs } from '../data/faqs';
import { Language, CategoryFilterState } from '../shared/types';
import { useCurrencyStore } from '../app/store/useCompareStore';

export const CategoryPage: React.FC = () => {
  const { slug, lang } = useParams<{ slug: string; lang?: string }>();
  const { t, i18n } = useTranslation('products');
  const currentLang = (lang || i18n.language || 'am') as Language;
  const { formatPrice } = useCurrencyStore();
  const [searchParams] = useSearchParams();

  const searchQuery = searchParams.get('search') || '';

  const { data: category } = useCategoryBySlug(slug || 'smartphones');
  const { data: brands } = useBrands();

  // Filter State
  const [minPrice, setMinPrice] = useState<number>(0);
  const [maxPrice, setMaxPrice] = useState<number>(3000000);
  const [selectedBrands, setSelectedBrands] = useState<string[]>([]);
  const [inStockOnly, setInStockOnly] = useState<boolean>(false);
  const [creditOnly, setCreditOnly] = useState<boolean>(false);
  const [sortBy, setSortBy] = useState<CategoryFilterState['sortBy']>('popular');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  const filterParams = useMemo(
    () => ({
      categorySlug: slug,
      searchQuery,
      minPrice,
      maxPrice,
      selectedBrands,
      inStockOnly,
      creditEligibleOnly: creditOnly,
      sortBy,
    }),
    [slug, searchQuery, minPrice, maxPrice, selectedBrands, inStockOnly, creditOnly, sortBy]
  );

  const { data: products, isLoading } = useProducts(filterParams);

  const categoryName = category
    ? category.name[currentLang]
    : searchQuery
    ? `Search: "${searchQuery}"`
    : 'Electronics Catalog';

  const handleBrandToggle = (brandId: string) => {
    setSelectedBrands((prev) =>
      prev.includes(brandId) ? prev.filter((id) => id !== brandId) : [...prev, brandId]
    );
  };

  const handleReset = () => {
    setMinPrice(0);
    setMaxPrice(3000000);
    setSelectedBrands([]);
    setInStockOnly(false);
    setCreditOnly(false);
    setSortBy('popular');
  };

  const breadcrumbs = [
    { name: t('productDetail.home'), url: `https://shop.enterprise-electronics.com/${currentLang}/` },
    { name: categoryName, url: `https://shop.enterprise-electronics.com/${currentLang}/category/${slug}` },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-8 py-8 space-y-8">
      {/* SEO Head & Breadcrumb Schema */}
      <SEOHead
        title={categoryName}
        description={category?.description[currentLang] || categoryName}
        canonicalPath={`/category/${slug}`}
      />
      <BreadcrumbSchema items={breadcrumbs} />
      <FAQSchema faqs={mockFAQs} lang={currentLang} />

      {/* Breadcrumb UI */}
      <nav className="flex items-center space-x-2 text-xs text-slate-400">
        <Link to={`/${currentLang}/`} className="hover:text-blue-600">{t('productDetail.home')}</Link>
        <ChevronRight size={12} />
        <span className="text-slate-700 font-bold">{categoryName}</span>
      </nav>

      {/* Category H1 Header */}
      <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-100 shadow-sm flex flex-col md:flex-row justify-between md:items-center gap-4">
        <div>
          <h1 className="text-2xl sm:text-4xl font-black text-slate-900 tracking-tight">
            {categoryName}
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            {category ? category.description[currentLang] : 'Filter and find the best electronic devices'}
          </p>
        </div>
        <span className="bg-blue-50 text-blue-700 text-xs font-black px-4 py-2 rounded-2xl shrink-0">
          {products?.length || 0} Products Found
        </span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Filters Sidebar */}
        <aside className="lg:col-span-3 space-y-6">
          <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm space-y-6 sticky top-24">
            <div className="flex justify-between items-center pb-4 border-b border-slate-100">
              <h3 className="text-sm font-bold text-slate-900 flex items-center space-x-2">
                <SlidersHorizontal size={18} className="text-blue-600" />
                <span>Filters</span>
              </h3>
              <button
                onClick={handleReset}
                className="text-xs text-slate-400 hover:text-red-500 flex items-center space-x-1 transition-colors cursor-pointer"
              >
                <RotateCcw size={12} />
                <span>Reset</span>
              </button>
            </div>

            {/* Price Slider */}
            <div className="space-y-3">
              <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block">
                {t('filters.price')}
              </label>
              <div className="flex justify-between text-xs font-bold text-slate-900">
                <span>{formatPrice(minPrice)}</span>
                <span>{formatPrice(maxPrice)}</span>
              </div>
              <input
                type="range"
                min={0}
                max={3000000}
                step={50000}
                value={maxPrice}
                onChange={(e) => setMaxPrice(Number(e.target.value))}
                className="w-full h-2 bg-slate-100 rounded-lg appearance-none cursor-pointer accent-blue-600"
              />
            </div>

            {/* Brands */}
            <div className="space-y-3 pt-4 border-t border-slate-100">
              <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block">
                {t('filters.brand')}
              </label>
              <div className="space-y-2 max-h-48 overflow-y-auto">
                {(brands || []).map((brand) => {
                  const isChecked = selectedBrands.includes(brand.id);
                  return (
                    <label
                      key={brand.id}
                      onClick={() => handleBrandToggle(brand.id)}
                      className="flex items-center space-x-2.5 text-xs text-slate-700 font-medium cursor-pointer hover:text-blue-600"
                    >
                      <div
                        className={`w-4 h-4 rounded-md border flex items-center justify-center transition-colors ${
                          isChecked ? 'bg-blue-600 border-blue-600 text-white' : 'border-slate-300 bg-white'
                        }`}
                      >
                        {isChecked && <Check size={12} />}
                      </div>
                      <span>{brand.name}</span>
                    </label>
                  );
                })}
              </div>
            </div>

            {/* Checkbox Toggles */}
            <div className="space-y-3 pt-4 border-t border-slate-100">
              <label
                onClick={() => setInStockOnly(!inStockOnly)}
                className="flex items-center space-x-2.5 text-xs text-slate-700 font-medium cursor-pointer"
              >
                <div
                  className={`w-4 h-4 rounded-md border flex items-center justify-center transition-colors ${
                    inStockOnly ? 'bg-blue-600 border-blue-600 text-white' : 'border-slate-300 bg-white'
                  }`}
                >
                  {inStockOnly && <Check size={12} />}
                </div>
                <span>{t('filters.inStock')}</span>
              </label>

              <label
                onClick={() => setCreditOnly(!creditOnly)}
                className="flex items-center space-x-2.5 text-xs text-amber-700 font-bold cursor-pointer"
              >
                <div
                  className={`w-4 h-4 rounded-md border flex items-center justify-center transition-colors ${
                    creditOnly ? 'bg-amber-500 border-amber-500 text-white' : 'border-slate-300 bg-white'
                  }`}
                >
                  {creditOnly && <Check size={12} />}
                </div>
                <span className="flex items-center space-x-1">
                  <Percent size={12} />
                  <span>{t('filters.creditEligible')}</span>
                </span>
              </label>
            </div>
          </div>
        </aside>

        {/* Main Product Grid Column */}
        <main className="lg:col-span-9 space-y-6">
          {/* Sorting & Layout Header */}
          <div className="bg-white p-4 rounded-2xl border border-slate-100 shadow-xs flex flex-col sm:flex-row justify-between items-center gap-4">
            <div className="flex items-center space-x-2 text-xs text-slate-600">
              <span className="font-bold">{t('filters.sortBy')}:</span>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as CategoryFilterState['sortBy'])}
                className="bg-slate-50 border border-slate-200 text-slate-900 rounded-xl px-3 py-1.5 text-xs font-bold focus:outline-hidden"
              >
                <option value="popular">{t('filters.sortPopular')}</option>
                <option value="name-asc">{t('filters.sortNameAsc')}</option>
                <option value="name-desc">{t('filters.sortNameDesc')}</option>
                <option value="price-asc">{t('filters.sortPriceAsc')}</option>
                <option value="price-desc">{t('filters.sortPriceDesc')}</option>
                <option value="rating-desc">{t('filters.sortRating')}</option>
                <option value="newest">{t('filters.sortNewest')}</option>
              </select>
            </div>

            <div className="flex items-center space-x-2">
              <button
                onClick={() => setViewMode('grid')}
                className={`p-2 rounded-xl transition-colors cursor-pointer ${
                  viewMode === 'grid' ? 'bg-blue-600 text-white' : 'bg-slate-100 text-slate-600'
                }`}
                aria-label="Grid View"
              >
                <Grid size={16} />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`p-2 rounded-xl transition-colors cursor-pointer ${
                  viewMode === 'list' ? 'bg-blue-600 text-white' : 'bg-slate-100 text-slate-600'
                }`}
                aria-label="List View"
              >
                <List size={16} />
              </button>
            </div>
          </div>

          {/* Product Items */}
          {isLoading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {Array.from({ length: 6 }).map((_, i) => (
                <ProductCardSkeleton key={i} />
              ))}
            </div>
          ) : !products || products.length === 0 ? (
            <div className="bg-white rounded-3xl p-12 text-center space-y-4 border border-slate-100">
              <p className="text-base font-bold text-slate-700">No products match your filter parameters</p>
              <button
                onClick={handleReset}
                className="px-6 py-2.5 bg-blue-600 text-white font-bold text-xs rounded-xl hover:bg-blue-700 transition-colors"
              >
                Reset All Filters
              </button>
            </div>
          ) : (
            <div
              className={
                viewMode === 'grid'
                  ? 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6'
                  : 'space-y-4'
              }
            >
              {products.map((product) => (
                <ProductCard key={product.id} product={product} lang={currentLang} />
              ))}
            </div>
          )}

          {category && (
            <div className="bg-white p-8 rounded-3xl border border-slate-100 text-xs text-slate-600 leading-relaxed space-y-3">
              <h3 className="text-base font-bold text-slate-900">{categoryName}</h3>
              <p>{category.description[currentLang]}</p>
            </div>
          )}
        </main>
      </div>
    </div>
  );
};
