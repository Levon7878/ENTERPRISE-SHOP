import React, { useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import {
  Sparkles,
  ArrowRight,
  ChevronDown,
  ChevronUp,
  CheckCircle2,
} from 'lucide-react';
import { SEOHead } from '../features/seo/SEOHead';
import { OrganizationSchema, WebsiteSchema, FAQSchema } from '../features/seo/schemas/Schemas';
import { useProducts, useCategories, useBrands } from '../services/api/queries';
import { ProductCard } from '../features/products/ProductCard';
import { ProductCardSkeleton } from '../shared/components/ui/Skeleton';
import { SafeImage } from '../shared/components/ui/SafeImage';
import { mockFAQs } from '../data/faqs';
import { mockReviews } from '../data/reviews';
import { Language } from '../shared/types';

export const HomePage: React.FC = () => {
  const { t, i18n } = useTranslation('common');
  const { lang } = useParams<{ lang?: string }>();
  const currentLang = (lang || i18n.language || 'am') as Language;

  const [activeTab, setActiveTab] = useState<'featured' | 'bestsellers' | 'new'>('featured');
  const [openFaqId, setOpenFaqId] = useState<string | null>(mockFAQs[0].id);

  const { data: categories, isLoading: isCatLoading } = useCategories();
  const { data: brands } = useBrands();
  const { data: products, isLoading: isProdLoading } = useProducts();

  const filteredProducts = (products || []).filter((p) => {
    if (activeTab === 'bestsellers') return p.isBestSeller;
    if (activeTab === 'new') return p.isNew;
    return p.isFeatured;
  });

  const firstCategorySlug = categories?.[0]?.slug || 'smartphones';

  return (
    <div className="space-y-16 pb-16">
      <SEOHead
        title={t('footer.aboutDesc')}
        description={t('home.seoDescription')}
        canonicalPath=""
      />
      <OrganizationSchema />
      <WebsiteSchema />
      <FAQSchema faqs={mockFAQs} lang={currentLang} />

      <section className="relative overflow-hidden bg-slate-900 text-white rounded-3xl mx-4 sm:mx-8 mt-6 border border-slate-800 shadow-2xl">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-900/80 via-slate-900 to-indigo-950/80 z-10" />
        <SafeImage
          src="https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&w=1600&q=80"
          alt={t('home.heroTitleAccent')}
          className="absolute inset-0 w-full h-full object-cover opacity-20"
        />

        <div className="relative z-20 max-w-7xl mx-auto px-6 sm:px-12 py-16 sm:py-24 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          <div className="lg:col-span-8 space-y-6">
            <div className="inline-flex items-center space-x-2 bg-blue-500/20 text-blue-400 border border-blue-500/30 px-3.5 py-1.5 rounded-full text-xs font-bold uppercase tracking-widest">
              <Sparkles size={14} />
              <span>{t('home.heroBadge')}</span>
            </div>

            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black tracking-tight leading-none text-white">
              {t('home.heroTitle')} <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-indigo-300 to-amber-300">
                {t('home.heroTitleAccent')}
              </span>
            </h1>

            <p className="text-sm sm:text-base text-slate-300 max-w-2xl leading-relaxed">
              {t('home.heroDescription')}
            </p>

            <div className="flex flex-wrap gap-4 pt-2">
              <Link
                to={`/${currentLang}/category/${firstCategorySlug}`}
                className="px-6 py-3.5 bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm rounded-2xl shadow-xl hover:shadow-blue-500/30 transition-all flex items-center space-x-2"
              >
                <span>{t('buttons.buyNow')}</span>
                <ArrowRight size={18} />
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-4 sm:px-8 space-y-6">
        <div className="flex justify-between items-end">
          <div>
            <h2 className="text-2xl font-black text-slate-900 tracking-tight">{t('home.popularCategories')}</h2>
            <p className="text-xs text-slate-500">{t('home.popularCategoriesDesc')}</p>
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
          {isCatLoading
            ? Array.from({ length: 10 }).map((_, i) => (
                <div key={i} className="h-40 bg-slate-100 rounded-2xl animate-pulse" />
              ))
            : (categories || []).map((cat) => (
                <Link
                  key={cat.id}
                  to={`/${currentLang}/category/${cat.slug}`}
                  className="group bg-white p-4 rounded-3xl border border-slate-100 shadow-xs hover:shadow-xl hover:border-blue-200 transition-all duration-300 flex flex-col items-center text-center space-y-3"
                >
                  <div className="w-16 h-16 rounded-2xl overflow-hidden bg-slate-50 group-hover:scale-110 transition-transform">
                    <SafeImage src={cat.image} alt={cat.name[currentLang]} className="w-full h-full object-cover" />
                  </div>
                  <div>
                    <h3 className="text-xs font-bold text-slate-900 group-hover:text-blue-600 transition-colors">
                      {cat.name[currentLang]}
                    </h3>
                    <span className="text-[10px] text-slate-400 font-semibold">
                      {t('home.itemsCount', { count: cat.productCount })}
                    </span>
                  </div>
                </Link>
              ))}
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-4 sm:px-8 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-4">
          <h2 className="text-2xl font-black text-slate-900 tracking-tight">{t('home.topDeals')}</h2>

          <div className="flex space-x-2 bg-slate-100 p-1 rounded-2xl">
            <button
              onClick={() => setActiveTab('featured')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                activeTab === 'featured' ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              {t('home.featured')}
            </button>
            <button
              onClick={() => setActiveTab('bestsellers')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                activeTab === 'bestsellers' ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              {t('nav.bestSellers')}
            </button>
            <button
              onClick={() => setActiveTab('new')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                activeTab === 'new' ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              {t('nav.newArrivals')}
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {isProdLoading
            ? Array.from({ length: 8 }).map((_, i) => <ProductCardSkeleton key={i} />)
            : filteredProducts.slice(0, 8).map((product) => (
                <ProductCard key={product.id} product={product} lang={currentLang} />
              ))}
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-4 sm:px-8 space-y-6">
        <h2 className="text-xl font-bold text-slate-900">{t('home.brandPartners')}</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-4">
          {(brands || []).map((brand) => (
            <Link
              key={brand.id}
              to={`/${currentLang}/brand/${brand.slug}`}
              className="bg-white p-6 rounded-2xl border border-slate-100 shadow-xs flex items-center justify-center grayscale hover:grayscale-0 hover:border-blue-200 hover:shadow-lg transition-all duration-300"
            >
              <span className="text-base font-black tracking-wider text-slate-700">{brand.name}</span>
            </Link>
          ))}
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-4 sm:px-8 space-y-6">
        <h2 className="text-2xl font-black text-slate-900 tracking-tight">{t('home.reviewsTitle')}</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {mockReviews.slice(0, 3).map((rev) => (
            <div key={rev.id} className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm space-y-4">
              <div className="flex items-center space-x-3">
                <SafeImage src={rev.userAvatar} alt={rev.userName} className="w-10 h-10 rounded-full object-cover" />
                <div>
                  <h4 className="text-xs font-bold text-slate-900">{rev.userName}</h4>
                  <span className="text-[10px] text-emerald-600 font-semibold flex items-center space-x-1">
                    <CheckCircle2 size={12} />
                    <span>{t('home.verifiedBuyer')}</span>
                  </span>
                </div>
              </div>
              <p className="text-xs text-slate-600 italic leading-relaxed">"{rev.comment}"</p>
            </div>
          ))}
        </div>
      </section>

      <section className="max-w-4xl mx-auto px-4 sm:px-8 space-y-6">
        <div className="text-center space-y-2">
          <h2 className="text-2xl font-black text-slate-900 tracking-tight">{t('home.faqTitle')}</h2>
          <p className="text-xs text-slate-500">{t('home.faqDesc')}</p>
        </div>

        <div className="space-y-3">
          {mockFAQs.map((faq) => {
            const isOpen = openFaqId === faq.id;
            return (
              <div
                key={faq.id}
                className="bg-white rounded-2xl border border-slate-200 overflow-hidden transition-all shadow-xs"
              >
                <button
                  onClick={() => setOpenFaqId(isOpen ? null : faq.id)}
                  className="w-full p-4 text-left flex justify-between items-center text-xs font-bold text-slate-900 cursor-pointer"
                >
                  <span>{faq.question[currentLang]}</span>
                  {isOpen ? <ChevronUp size={16} className="text-blue-600" /> : <ChevronDown size={16} className="text-slate-400" />}
                </button>
                {isOpen && (
                  <div className="px-4 pb-4 text-xs text-slate-600 leading-relaxed border-t border-slate-100 pt-3">
                    {faq.answer[currentLang]}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </section>
    </div>
  );
};
