import React, { useEffect, useRef, useState } from 'react';
import { Link, useNavigate, useParams, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import {
  Search,
  ShoppingCart,
  Heart,
  Scale,
  Phone,
  Layers,
  ChevronRight,
  X,
} from 'lucide-react';
import { LanguageSwitcher } from './LanguageSwitcher';
import { useCartStore } from '../../../app/store/useCartStore';
import { useWishlistStore } from '../../../app/store/useWishlistStore';
import { useCompareStore, useCurrencyStore } from '../../../app/store/useCompareStore';
import { mockCategories } from '../../../data/categories';
import { mockProducts } from '../../../data/products';
import { SafeImage } from '../ui/SafeImage';
import { searchProducts } from '../../utils/searchProducts';
import { Language } from '../../types';

interface HeaderProps {
  onOpenCart: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onOpenCart }) => {
  const { t, i18n } = useTranslation('common');
  const { lang } = useParams<{ lang?: string }>();
  const currentLang = (lang || i18n.language || 'am') as Language;
  const navigate = useNavigate();
  const location = useLocation();

  const totalCartItems = useCartStore((state) => state.getTotalItems());
  const wishlistCount = useWishlistStore((state) => state.items.length);
  const compareCount = useCompareStore((state) => state.items.length);
  const { formatPrice } = useCurrencyStore();

  const [searchQuery, setSearchQuery] = useState('');
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const [isCategoryMenuOpen, setIsCategoryMenuOpen] = useState(false);
  const desktopMenuRef = useRef<HTMLDivElement>(null);

  const homePath = `/${currentLang}`;
  const isOnHome = location.pathname === homePath || location.pathname === `${homePath}/`;

  // Close category menu on route change
  useEffect(() => {
    setIsCategoryMenuOpen(false);
  }, [location.pathname]);

  // Lock body scroll when mobile category panel is open
  useEffect(() => {
    if (!isCategoryMenuOpen) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = prev;
    };
  }, [isCategoryMenuOpen]);

  useEffect(() => {
    const onDocClick = (e: MouseEvent) => {
      if (desktopMenuRef.current && !desktopMenuRef.current.contains(e.target as Node)) {
        // Only auto-close desktop dropdown via outside click;
        // mobile uses overlay/X button
        if (window.matchMedia('(min-width: 1024px)').matches) {
          setIsCategoryMenuOpen(false);
        }
      }
    };
    document.addEventListener('mousedown', onDocClick);
    return () => document.removeEventListener('mousedown', onDocClick);
  }, []);

  const handleLogoClick = (e: React.MouseEvent) => {
    if (isOnHome) {
      e.preventDefault();
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const suggestions = searchQuery.trim()
    ? searchProducts(mockProducts, searchQuery, currentLang, 8)
    : [];

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const q = searchQuery.trim();
    if (!q) return;
    navigate(`/${currentLang}/search?q=${encodeURIComponent(q)}`);
    setIsSearchFocused(false);
  };

  const closeCategories = () => setIsCategoryMenuOpen(false);

  return (
    <header className="sticky top-0 z-40 bg-slate-900 text-white shadow-xl">
      <div className="bg-slate-950 border-b border-slate-800 text-xs py-1.5 px-3 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto flex justify-between items-center gap-2">
          <div className="flex items-center gap-2 sm:gap-4 text-slate-400 min-w-0">
            <span className="flex items-center gap-1 truncate">
              <Phone size={13} className="text-blue-400 shrink-0" />
              <span className="truncate">{t('nav.phoneContact')}</span>
            </span>
            <span className="hidden lg:inline text-slate-600">|</span>
            <span className="hidden lg:inline text-slate-400">{t('nav.deliveryTrack')}</span>
          </div>
          <div className="shrink-0">
            <LanguageSwitcher />
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 py-3">
        <div className="flex flex-wrap lg:flex-nowrap items-center gap-2 sm:gap-3">
          <Link
            to={homePath}
            onClick={handleLogoClick}
            className="flex items-center gap-2 group shrink-0"
            aria-label="Home"
          >
            <img
              src="/favicon.svg"
              alt="Enterprise Shop"
              className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl shadow-lg group-hover:scale-105 transition-transform shrink-0"
              width={40}
              height={40}
            />
            <span className="hidden sm:inline text-lg xl:text-xl font-black tracking-tight text-white whitespace-nowrap">
              ENTERPRISE
              <span className="text-blue-400 font-extrabold ml-1">SHOP</span>
            </span>
          </Link>

          {/* Desktop categories dropdown */}
          <div className="relative hidden lg:block shrink-0" ref={desktopMenuRef}>
            <button
              type="button"
              onClick={() => setIsCategoryMenuOpen((v) => !v)}
              className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-3 py-2.5 rounded-xl font-semibold text-sm transition-all shadow-md cursor-pointer whitespace-nowrap"
            >
              <Layers size={18} className="shrink-0" />
              <span className="max-w-[9rem] xl:max-w-none truncate">{t('nav.allCategories')}</span>
            </button>

            {isCategoryMenuOpen && (
              <div className="absolute top-full left-0 mt-2 w-72 max-h-[70vh] overflow-y-auto bg-white text-slate-900 rounded-2xl shadow-2xl border border-slate-100 py-2 z-50">
                {mockCategories.map((cat) => (
                  <Link
                    key={cat.id}
                    to={`/${currentLang}/category/${cat.slug}`}
                    onClick={closeCategories}
                    className="flex items-center justify-between px-4 py-2.5 hover:bg-blue-50 text-sm font-medium text-slate-700 hover:text-blue-600 transition-colors"
                  >
                    <span className="truncate pr-2">{cat.name[currentLang]}</span>
                    <ChevronRight size={16} className="text-slate-400 shrink-0" />
                  </Link>
                ))}
              </div>
            )}
          </div>

          <div className="relative w-full min-w-0 basis-full lg:basis-auto lg:flex-1 order-last lg:order-none">
            <form onSubmit={handleSearchSubmit} className="relative">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onFocus={() => setIsSearchFocused(true)}
                onBlur={() => setTimeout(() => setIsSearchFocused(false), 150)}
                placeholder={t('nav.searchPlaceholder')}
                className="w-full min-w-0 bg-slate-800 text-white placeholder-slate-400 text-sm rounded-xl pl-3 sm:pl-4 pr-11 py-2.5 border border-slate-700 focus:outline-hidden focus:border-blue-500 focus:ring-2 focus:ring-blue-500/30 transition-all"
              />
              <button
                type="submit"
                className="absolute right-1.5 top-1/2 -translate-y-1/2 p-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors cursor-pointer"
                aria-label="Search"
              >
                <Search size={16} />
              </button>
            </form>

            {isSearchFocused && searchQuery.trim() && (
              <div className="absolute top-full left-0 right-0 mt-2 bg-white text-slate-900 rounded-2xl shadow-2xl border border-slate-100 overflow-hidden z-50">
                <div className="p-2 border-b border-slate-100 text-xs font-semibold text-slate-400 uppercase">
                  {t('nav.productSuggestions')}
                </div>
                {suggestions.length > 0 ? (
                  suggestions.map((p) => (
                    <Link
                      key={p.id}
                      to={`/${currentLang}/product/${p.slug}`}
                      onClick={() => {
                        setIsSearchFocused(false);
                        setSearchQuery('');
                      }}
                      className="flex items-center gap-3 p-3 hover:bg-slate-50 transition-colors"
                    >
                      <SafeImage
                        src={p.images[0]}
                        alt={p.translations[currentLang].name}
                        className="w-10 h-10 object-cover rounded-lg shrink-0"
                      />
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-bold text-slate-900 truncate">
                          {p.translations[currentLang].name}
                        </p>
                        <p className="text-xs text-blue-600 font-semibold">{formatPrice(p.price)}</p>
                      </div>
                    </Link>
                  ))
                ) : (
                  <div className="p-4 text-xs text-slate-500">{t('search.noSuggestions')}</div>
                )}
              </div>
            )}
          </div>

          <div className="flex items-center gap-1.5 sm:gap-2 shrink-0 ml-auto lg:ml-0">
            <button
              type="button"
              onClick={() => setIsCategoryMenuOpen((v) => !v)}
              className="lg:hidden p-2 sm:p-2.5 text-slate-300 hover:text-white bg-slate-800 hover:bg-slate-700 rounded-xl transition-all cursor-pointer"
              aria-label={t('nav.allCategories')}
            >
              <Layers size={20} />
            </button>

            <Link
              to={`/${currentLang}/compare`}
              className="relative p-2 sm:p-2.5 text-slate-300 hover:text-white bg-slate-800 hover:bg-slate-700 rounded-xl transition-all"
              aria-label="Compare"
            >
              <Scale size={20} />
              {compareCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-blue-500 text-white text-[10px] font-black w-4 h-4 rounded-full flex items-center justify-center">
                  {compareCount}
                </span>
              )}
            </Link>

            <Link
              to={`/${currentLang}/wishlist`}
              className="relative p-2 sm:p-2.5 text-slate-300 hover:text-white bg-slate-800 hover:bg-slate-700 rounded-xl transition-all"
              aria-label="Wishlist"
            >
              <Heart size={20} />
              {wishlistCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] font-black w-4 h-4 rounded-full flex items-center justify-center">
                  {wishlistCount}
                </span>
              )}
            </Link>

            <button
              type="button"
              onClick={onOpenCart}
              className="relative flex items-center gap-1.5 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white px-2.5 sm:px-3.5 py-2 sm:py-2.5 rounded-xl font-bold text-xs sm:text-sm shadow-lg transition-all cursor-pointer"
              aria-label="Cart"
            >
              <ShoppingCart size={20} className="shrink-0" />
              <span className="hidden md:inline">{t('nav.cart')}</span>
              {totalCartItems > 0 && (
                <span className="bg-white text-blue-600 text-xs font-black px-1.5 py-0.5 rounded-full">
                  {totalCartItems}
                </span>
              )}
            </button>
          </div>
        </div>
      </div>

      <div className="border-t border-slate-800/80 px-3 sm:px-6 lg:px-8 py-2 overflow-x-auto">
        <div className="max-w-7xl mx-auto flex items-center gap-4 sm:gap-6 text-xs font-semibold whitespace-nowrap">
          {mockCategories.map((cat) => (
            <Link
              key={cat.id}
              to={`/${currentLang}/category/${cat.slug}`}
              className="text-slate-300 hover:text-blue-400 transition-colors shrink-0"
            >
              {cat.name[currentLang]}
            </Link>
          ))}
        </div>
      </div>

      {/* Mobile / tablet category panel — centered higher, not stuck at bottom */}
      {isCategoryMenuOpen && (
        <div className="lg:hidden fixed inset-0 z-[60] flex items-start justify-center pt-20 sm:pt-24 px-3 sm:px-4 bg-slate-950/60 backdrop-blur-sm">
          <button
            type="button"
            className="absolute inset-0 cursor-pointer"
            aria-label="Close"
            onClick={closeCategories}
          />
          <div className="relative w-full max-w-md max-h-[75vh] bg-white text-slate-900 rounded-3xl shadow-2xl flex flex-col overflow-hidden">
            <div className="flex items-center justify-between px-4 py-4 border-b border-slate-100 shrink-0">
              <h3 className="text-base font-black text-slate-900">{t('nav.allCategories')}</h3>
              <button
                type="button"
                onClick={closeCategories}
                className="p-2 rounded-full bg-slate-100 text-slate-600 hover:bg-slate-200 cursor-pointer"
                aria-label="Close"
              >
                <X size={18} />
              </button>
            </div>
            <div className="overflow-y-auto overscroll-contain py-2">
              {mockCategories.map((cat) => (
                <Link
                  key={cat.id}
                  to={`/${currentLang}/category/${cat.slug}`}
                  onClick={closeCategories}
                  className="flex items-center justify-between px-4 py-3.5 hover:bg-blue-50 text-sm font-semibold text-slate-800 active:bg-blue-100 transition-colors border-b border-slate-50 last:border-0"
                >
                  <span className="pr-3">{cat.name[currentLang]}</span>
                  <ChevronRight size={18} className="text-slate-400 shrink-0" />
                </Link>
              ))}
            </div>
          </div>
        </div>
      )}
    </header>
  );
};
