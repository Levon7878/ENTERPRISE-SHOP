import React, { lazy, Suspense, useEffect } from 'react';
import { Routes, Route, Navigate, useParams, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Language } from '../../shared/types';

const HomePage = lazy(() => import('../../pages/HomePage').then((m) => ({ default: m.HomePage })));
const CategoryPage = lazy(() => import('../../pages/CategoryPage').then((m) => ({ default: m.CategoryPage })));
const SearchPage = lazy(() => import('../../pages/SearchPage').then((m) => ({ default: m.SearchPage })));
const BrandPage = lazy(() => import('../../pages/BrandPage').then((m) => ({ default: m.BrandPage })));
const ProductDetailPage = lazy(() => import('../../pages/ProductDetailPage').then((m) => ({ default: m.ProductDetailPage })));
const CheckoutPage = lazy(() => import('../../pages/CheckoutPage').then((m) => ({ default: m.CheckoutPage })));
const WishlistPage = lazy(() => import('../../pages/WishlistPage').then((m) => ({ default: m.WishlistPage })));
const ComparePage = lazy(() => import('../../pages/ComparePage').then((m) => ({ default: m.ComparePage })));

const SuspenseFallback: React.FC = () => (
  <div className="min-h-screen flex items-center justify-center bg-slate-50">
    <div className="w-10 h-10 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
  </div>
);

const LanguageGuard: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { lang } = useParams<{ lang?: string }>();
  const { i18n } = useTranslation();

  useEffect(() => {
    if (lang && ['am', 'ru', 'en'].includes(lang)) {
      if (i18n.language !== lang) {
        i18n.changeLanguage(lang);
      }
    }
  }, [lang, i18n]);

  if (!lang || !['am', 'ru', 'en'].includes(lang)) {
    const fallbackLang = (i18n.language || 'am') as Language;
    return <Navigate to={`/${fallbackLang}`} replace />;
  }

  return <>{children}</>;
};

const RootRedirect: React.FC = () => {
  const { i18n } = useTranslation();
  const detectedLang = (i18n.language || 'am').slice(0, 2) as Language;
  const validLang = ['am', 'ru', 'en'].includes(detectedLang) ? detectedLang : 'am';
  return <Navigate to={`/${validLang}`} replace />;
};

export const AppRouter: React.FC = () => {
  return (
    <Suspense fallback={<SuspenseFallback />}>
      <Routes>
        <Route path="/" element={<RootRedirect />} />
        <Route
          path="/:lang/*"
          element={
            <LanguageGuard>
              <Routes>
                <Route path="/" element={<HomePage />} />
                <Route path="/search" element={<SearchPage />} />
                <Route path="/category/:slug" element={<CategoryPage />} />
                <Route path="/brand/:slug" element={<BrandPage />} />
                <Route path="/product/:slug" element={<ProductDetailPage />} />
                <Route path="/credit" element={<Navigate to="/" replace />} />
                <Route path="/checkout" element={<CheckoutPage />} />
                <Route path="/wishlist" element={<WishlistPage />} />
                <Route path="/compare" element={<ComparePage />} />
                <Route path="*" element={<Navigate to="/" replace />} />
              </Routes>
            </LanguageGuard>
          }
        />
        <Route path="*" element={<RootRedirect />} />
      </Routes>
    </Suspense>
  );
};
