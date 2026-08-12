import React from 'react';
import { Link, useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { ChevronRight } from 'lucide-react';
import { SEOHead } from '../features/seo/SEOHead';
import { useBrandBySlug, useProducts } from '../services/api/queries';
import { ProductCard } from '../features/products/ProductCard';
import { ProductCardSkeleton } from '../shared/components/ui/Skeleton';
import { SafeImage } from '../shared/components/ui/SafeImage';
import { Language } from '../shared/types';

export const BrandPage: React.FC = () => {
  const { slug, lang } = useParams<{ slug: string; lang?: string }>();
  const { t, i18n } = useTranslation(['products', 'common']);
  const currentLang = (lang || i18n.language || 'am') as Language;

  const { data: brand, isLoading: isBrandLoading } = useBrandBySlug(slug || '');
  const { data: products, isLoading: isProductsLoading } = useProducts(
    brand ? { selectedBrands: [brand.id] } : undefined,
    !!brand
  );

  if (isBrandLoading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-8 py-16 text-center">
        <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto" />
      </div>
    );
  }

  if (!brand) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-8 py-16 text-center space-y-4">
        <h2 className="text-2xl font-bold text-slate-900">{t('productDetail.notFound')}</h2>
        <Link
          to={`/${currentLang}/`}
          className="px-6 py-2.5 bg-blue-600 text-white font-bold text-xs rounded-xl inline-block"
        >
          {t('productDetail.returnHome')}
        </Link>
      </div>
    );
  }

  const description = brand.description?.[currentLang] || '';

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-8 py-8 space-y-8">
      <SEOHead
        title={brand.name}
        description={description}
        canonicalPath={`/brand/${brand.slug}`}
      />

      <nav className="flex items-center space-x-2 text-xs text-slate-400">
        <Link to={`/${currentLang}/`} className="hover:text-blue-600">
          {t('productDetail.home')}
        </Link>
        <ChevronRight size={12} />
        <span className="text-slate-700 font-bold">{brand.name}</span>
      </nav>

      <div className="bg-white rounded-3xl border border-slate-100 p-6 sm:p-8 flex flex-col sm:flex-row gap-6 items-start sm:items-center">
        <SafeImage
          src={brand.logo}
          alt={brand.name}
          className="w-20 h-20 rounded-2xl object-cover bg-slate-50 border border-slate-100"
        />
        <div className="space-y-2">
          <h1 className="text-3xl font-black text-slate-900 tracking-tight">{brand.name}</h1>
          <p className="text-xs text-slate-500 font-semibold uppercase tracking-wider">{brand.country}</p>
          {description && <p className="text-sm text-slate-600 max-w-2xl leading-relaxed">{description}</p>}
          <p className="text-xs text-blue-600 font-bold">
            {t('common:home.itemsCount', { count: products?.length || 0 })}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {isProductsLoading
          ? Array.from({ length: 8 }).map((_, i) => <ProductCardSkeleton key={i} />)
          : (products || []).length > 0
            ? (products || []).map((product) => (
                <ProductCard key={product.id} product={product} lang={currentLang} />
              ))
            : (
              <div className="col-span-full text-center py-16 text-sm text-slate-500">
                {t('productDetail.notFound')}
              </div>
            )}
      </div>
    </div>
  );
};
