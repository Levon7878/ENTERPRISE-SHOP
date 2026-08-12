import React, { useEffect, useState } from 'react';
import { useParams, Link, useSearchParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import {
  ShieldCheck,
  Truck,
  Heart,
  Scale,
  ShoppingCart,
  Percent,
  CheckCircle2,
  ChevronRight,
} from 'lucide-react';
import { SEOHead } from '../features/seo/SEOHead';
import { ProductSchema, BreadcrumbSchema, ReviewSchema } from '../features/seo/schemas/Schemas';
import { useProductBySlug, useProducts, useReviews } from '../services/api/queries';
import { ProductGallery } from '../features/products/ProductGallery';
import { ProductCard } from '../features/products/ProductCard';
import { CreditCalculator } from '../features/credit/CreditCalculator';
import { CreditApplicationForm } from '../features/credit/CreditApplicationFormInline';
import { Modal } from '../shared/components/ui/Modal';
import { RatingStars } from '../shared/components/ui/RatingStars';
import { useCartStore } from '../app/store/useCartStore';
import { useWishlistStore } from '../app/store/useWishlistStore';
import { useCompareStore, useCurrencyStore } from '../app/store/useCompareStore';
import { Language } from '../shared/types';

type CreditStep = 'calculator' | 'application';

type LoanDetails = {
  bankId: string;
  bankName: string;
  termMonths: number;
  monthlyPayment: number;
  downPayment: number;
  productName: string;
  productId: string;
};

export const ProductDetailPage: React.FC = () => {
  const { slug, lang } = useParams<{ slug: string; lang?: string }>();
  const [searchParams, setSearchParams] = useSearchParams();
  const { t, i18n } = useTranslation(['products', 'common', 'credit']);
  const currentLang = (lang || i18n.language || 'am') as Language;
  const { formatPrice } = useCurrencyStore();

  const [activeTab, setActiveTab] = useState<'specs' | 'desc' | 'reviews'>('specs');
  const [isCreditOpen, setIsCreditOpen] = useState(false);
  const [creditStep, setCreditStep] = useState<CreditStep>('calculator');
  const [loanDetails, setLoanDetails] = useState<LoanDetails | null>(null);

  const { data: product, isLoading } = useProductBySlug(slug || '');
  const { data: reviews } = useReviews(product?.id);
  const { data: allProducts } = useProducts();

  const addItem = useCartStore((state) => state.addItem);
  const { toggleWishlist, isInWishlist } = useWishlistStore();
  const { toggleCompare, isInCompare } = useCompareStore();

  // Open credit panel when arriving with ?credit=1
  useEffect(() => {
    if (searchParams.get('credit') === '1' && product?.isCreditEligible) {
      setCreditStep('calculator');
      setIsCreditOpen(true);
      searchParams.delete('credit');
      setSearchParams(searchParams, { replace: true });
    }
  }, [product, searchParams, setSearchParams]);

  const openCreditPanel = () => {
    setCreditStep('calculator');
    setLoanDetails(null);
    setIsCreditOpen(true);
  };

  const closeCreditPanel = () => {
    setIsCreditOpen(false);
    setCreditStep('calculator');
    setLoanDetails(null);
  };

  if (isLoading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-8 py-16 text-center">
        <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto" />
        <p className="text-xs text-slate-500 mt-4">{t('productDetail.loading')}</p>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-8 py-16 text-center space-y-4">
        <h2 className="text-2xl font-bold text-slate-900">{t('productDetail.notFound')}</h2>
        <Link to={`/${currentLang}/`} className="px-6 py-2.5 bg-blue-600 text-white font-bold text-xs rounded-xl inline-block">
          {t('productDetail.returnHome')}
        </Link>
      </div>
    );
  }

  const name = product.translations[currentLang].name;
  const description = product.translations[currentLang].description;
  const isLiked = isInWishlist(product.id);
  const isCompared = isInCompare(product.id);

  const similarProducts = (allProducts || []).filter(
    (p) => p.category.id === product.category.id && p.id !== product.id
  );

  const breadcrumbs = [
    { name: t('productDetail.home'), url: `https://shop.enterprise-electronics.com/${currentLang}/` },
    {
      name: product.category.name[currentLang],
      url: `https://shop.enterprise-electronics.com/${currentLang}/category/${product.category.slug}`,
    },
    { name: name, url: `https://shop.enterprise-electronics.com/${currentLang}/product/${product.slug}` },
  ];

  const handleApplyLoanFromCalc = (details: {
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
      productName: name,
      productId: product.id,
    });
    setCreditStep('application');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-8 py-8 space-y-12">
      <SEOHead
        title={name}
        description={product.translations[currentLang].shortDescription}
        canonicalPath={`/product/${product.slug}`}
        ogImage={product.images[0]}
        ogType="product"
      />
      <ProductSchema product={product} name={name} description={description} />
      <BreadcrumbSchema items={breadcrumbs} />
      {reviews && <ReviewSchema reviews={reviews} productName={name} />}

      <nav className="flex items-center space-x-2 text-xs text-slate-400">
        <Link to={`/${currentLang}/`} className="hover:text-blue-600">
          {t('productDetail.home')}
        </Link>
        <ChevronRight size={12} />
        <Link to={`/${currentLang}/category/${product.category.slug}`} className="hover:text-blue-600">
          {product.category.name[currentLang]}
        </Link>
        <ChevronRight size={12} />
        <span className="text-slate-700 font-bold truncate max-w-xs">{name}</span>
      </nav>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        <div className="lg:col-span-6">
          <ProductGallery images={product.images} alt={name} />
        </div>

        <div className="lg:col-span-6 space-y-6">
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-blue-600 bg-blue-50 px-2.5 py-1 rounded-lg">
                {product.brand.name}
              </span>
              <span className="text-xs text-slate-400">
                {t('productDetail.sku')}: {product.sku}
              </span>
            </div>

            <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight leading-snug">
              {name}
            </h1>

            <div className="flex items-center space-x-4">
              <RatingStars rating={product.rating} count={product.reviewCount} size={16} />
              <span className="text-xs text-slate-400">|</span>
              <span className="text-xs text-emerald-600 font-bold flex items-center space-x-1">
                <CheckCircle2 size={14} />
                <span>
                  {product.stock > 0 ? t('productDetail.inStockReady') : t('productDetail.outOfStock')}
                </span>
              </span>
            </div>
          </div>

          <div className="bg-slate-50 p-6 rounded-3xl border border-slate-100 space-y-4">
            <div className="flex items-baseline space-x-3">
              <span className="text-3xl font-black text-slate-900">{formatPrice(product.price)}</span>
              {product.oldPrice && (
                <span className="text-sm font-semibold text-slate-400 line-through">
                  {formatPrice(product.oldPrice)}
                </span>
              )}
              {product.discountPercentage && (
                <span className="bg-red-500 text-white text-xs font-black px-2 py-0.5 rounded-full">
                  {t('productDetail.savePercent', { percent: product.discountPercentage })}
                </span>
              )}
            </div>

            {product.isCreditEligible && (
              <div className="flex items-center justify-between p-3.5 bg-amber-500/10 border border-amber-500/30 rounded-2xl text-xs">
                <div className="flex items-center space-x-2 text-amber-700 font-bold">
                  <Percent size={18} className="text-amber-500" />
                  <span>
                    {t('productDetail.buyCreditFrom', {
                      price: formatPrice(product.minMonthlyInstallment),
                    })}
                  </span>
                </div>
              </div>
            )}

            <div className="flex flex-col sm:flex-row gap-3 pt-2">
              <button
                type="button"
                onClick={() => addItem(product)}
                className="flex-1 py-4 bg-blue-600 hover:bg-blue-700 text-white font-black text-sm rounded-2xl shadow-xl flex items-center justify-center space-x-2 transition-all cursor-pointer"
              >
                <ShoppingCart size={18} />
                <span>{t('common:buttons.addToCart')}</span>
              </button>

              {product.isCreditEligible && (
                <button
                  type="button"
                  onClick={openCreditPanel}
                  className="flex-1 py-4 bg-amber-500 hover:bg-amber-600 text-white font-black text-sm rounded-2xl shadow-xl flex items-center justify-center space-x-2 transition-all cursor-pointer"
                >
                  <Percent size={18} />
                  <span>{t('common:buttons.buyInCredit')}</span>
                </button>
              )}

              <button
                type="button"
                onClick={() => toggleWishlist(product)}
                className={`p-4 rounded-2xl border transition-colors cursor-pointer ${
                  isLiked
                    ? 'bg-red-50 border-red-200 text-red-500'
                    : 'bg-white border-slate-200 text-slate-400 hover:text-red-500'
                }`}
              >
                <Heart size={20} className={isLiked ? 'fill-red-500' : ''} />
              </button>

              <button
                type="button"
                onClick={() => toggleCompare(product)}
                className={`p-4 rounded-2xl border transition-colors cursor-pointer ${
                  isCompared
                    ? 'bg-blue-50 border-blue-200 text-blue-600'
                    : 'bg-white border-slate-200 text-slate-400 hover:text-blue-600'
                }`}
              >
                <Scale size={20} />
              </button>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4 text-xs">
            <div className="flex items-center space-x-3 p-4 bg-white rounded-2xl border border-slate-100">
              <Truck size={24} className="text-blue-600 shrink-0" />
              <div>
                <span className="font-bold text-slate-900 block">
                  {t('productDetail.expressDelivery')}
                </span>
                <span className="text-slate-400">
                  {t('productDetail.daysInArmenia', {
                    min: product.deliveryDaysMin,
                    max: product.deliveryDaysMax,
                  })}
                </span>
              </div>
            </div>

            <div className="flex items-center space-x-3 p-4 bg-white rounded-2xl border border-slate-100">
              <ShieldCheck size={24} className="text-emerald-600 shrink-0" />
              <div>
                <span className="font-bold text-slate-900 block">
                  {t('productDetail.officialWarranty')}
                </span>
                <span className="text-slate-400">
                  {t('productDetail.monthsService', { months: product.warrantyMonths })}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-3xl border border-slate-100 shadow-sm p-6 sm:p-8 space-y-6">
        <div className="flex space-x-4 border-b border-slate-100 pb-4">
          <button
            type="button"
            onClick={() => setActiveTab('specs')}
            className={`pb-2 text-sm font-bold transition-all border-b-2 cursor-pointer ${
              activeTab === 'specs'
                ? 'border-blue-600 text-blue-600'
                : 'border-transparent text-slate-500 hover:text-slate-900'
            }`}
          >
            {t('productDetail.specifications')}
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('desc')}
            className={`pb-2 text-sm font-bold transition-all border-b-2 cursor-pointer ${
              activeTab === 'desc'
                ? 'border-blue-600 text-blue-600'
                : 'border-transparent text-slate-500 hover:text-slate-900'
            }`}
          >
            {t('productDetail.description')}
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('reviews')}
            className={`pb-2 text-sm font-bold transition-all border-b-2 cursor-pointer ${
              activeTab === 'reviews'
                ? 'border-blue-600 text-blue-600'
                : 'border-transparent text-slate-500 hover:text-slate-900'
            }`}
          >
            {t('productDetail.reviews')} ({reviews?.length || 0})
          </button>
        </div>

        {activeTab === 'specs' && (
          <div className="space-y-6 animate-fade-in text-xs">
            {product.specifications && product.specifications.length > 0 ? (
              product.specifications.map((group, idx) => (
                <div key={idx} className="space-y-2">
                  <h4 className="font-bold text-slate-900 text-sm">{group.groupName[currentLang]}</h4>
                  <div className="divide-y divide-slate-100 border border-slate-100 rounded-2xl overflow-hidden">
                    {group.items.map((item, itemIdx) => (
                      <div key={itemIdx} className="flex justify-between p-3 bg-slate-50/50 hover:bg-slate-50">
                        <span className="text-slate-500">{item.label[currentLang]}</span>
                        <span className="font-semibold text-slate-900">{item.value[currentLang]}</span>
                      </div>
                    ))}
                  </div>
                </div>
              ))
            ) : (
              <p className="text-slate-500">{t('productDetail.standardSpecs')}</p>
            )}
          </div>
        )}

        {activeTab === 'desc' && (
          <div className="prose prose-slate max-w-none text-xs leading-relaxed animate-fade-in">
            <p>{description}</p>
          </div>
        )}

        {activeTab === 'reviews' && (
          <div className="space-y-6 animate-fade-in text-xs">
            <div className="flex justify-between items-center pb-4 border-b border-slate-100">
              <h4 className="font-bold text-slate-900 text-sm">{t('productDetail.customerFeedback')}</h4>
              <button type="button" className="px-4 py-2 bg-blue-600 text-white font-bold rounded-xl hover:bg-blue-700">
                {t('productDetail.writeReview')}
              </button>
            </div>

            <div className="space-y-4">
              {reviews && reviews.length > 0 ? (
                reviews.map((rev) => (
                  <div key={rev.id} className="p-4 bg-slate-50 rounded-2xl space-y-2">
                    <div className="flex justify-between items-center">
                      <div className="flex items-center space-x-2">
                        <span className="font-bold text-slate-900">{rev.userName}</span>
                        <RatingStars rating={rev.rating} size={12} />
                      </div>
                      <span className="text-slate-400 text-[10px]">{rev.date}</span>
                    </div>
                    <p className="text-slate-600">{rev.comment}</p>
                  </div>
                ))
              ) : (
                <p className="text-slate-400">{t('productDetail.noReviews')}</p>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Single credit panel: calculator → application form */}
      <Modal
        isOpen={isCreditOpen}
        onClose={closeCreditPanel}
        title={
          creditStep === 'calculator'
            ? t('productDetail.creditPanelTitle')
            : t('credit:modal.title')
        }
        maxWidth="max-w-5xl"
      >
        {creditStep === 'calculator' ? (
          <CreditCalculator product={product} lang={currentLang} onApplyLoan={handleApplyLoanFromCalc} />
        ) : (
          <CreditApplicationForm
            loanDetails={loanDetails}
            onBack={() => setCreditStep('calculator')}
            onSuccessClose={closeCreditPanel}
          />
        )}
      </Modal>

      {similarProducts.length > 0 && (
        <section className="space-y-6">
          <h3 className="text-xl font-black text-slate-900">{t('productDetail.similarProducts')}</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {similarProducts.slice(0, 4).map((p) => (
              <ProductCard key={p.id} product={p} lang={currentLang} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
};
