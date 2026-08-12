import React from 'react';
import { Link, useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { ShieldCheck, Truck, CreditCard, Headphones, Sparkles, Mail, MapPin, Phone } from 'lucide-react';
import { mockCategories } from '../../../data/categories';
import { Language } from '../../types';

export const Footer: React.FC = () => {
  const { t, i18n } = useTranslation('common');
  const { lang } = useParams<{ lang?: string }>();
  const currentLang = (lang || i18n.language || 'am') as Language;

  return (
    <footer className="bg-slate-950 text-slate-300 pt-16 pb-12 border-t border-slate-800">
      {/* Advantages Banner */}
      <div className="max-w-7xl mx-auto px-4 sm:px-8 mb-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 p-8 bg-slate-900 rounded-3xl border border-slate-800 shadow-xl">
          <div className="flex items-center space-x-4">
            <div className="p-3 bg-blue-600/10 text-blue-400 rounded-2xl border border-blue-500/20">
              <ShieldCheck size={28} />
            </div>
            <div>
              <h4 className="text-sm font-bold text-white">{t('advantages.warrantyTitle')}</h4>
              <p className="text-xs text-slate-400 mt-0.5">{t('advantages.warrantyDesc')}</p>
            </div>
          </div>

          <div className="flex items-center space-x-4">
            <div className="p-3 bg-emerald-600/10 text-emerald-400 rounded-2xl border border-emerald-500/20">
              <Truck size={28} />
            </div>
            <div>
              <h4 className="text-sm font-bold text-white">{t('advantages.deliveryTitle')}</h4>
              <p className="text-xs text-slate-400 mt-0.5">{t('advantages.deliveryDesc')}</p>
            </div>
          </div>

          <div className="flex items-center space-x-4">
            <div className="p-3 bg-amber-600/10 text-amber-400 rounded-2xl border border-amber-500/20">
              <CreditCard size={28} />
            </div>
            <div>
              <h4 className="text-sm font-bold text-white">{t('advantages.creditTitle')}</h4>
              <p className="text-xs text-slate-400 mt-0.5">{t('advantages.creditDesc')}</p>
            </div>
          </div>

          <div className="flex items-center space-x-4">
            <div className="p-3 bg-purple-600/10 text-purple-400 rounded-2xl border border-purple-500/20">
              <Headphones size={28} />
            </div>
            <div>
              <h4 className="text-sm font-bold text-white">{t('advantages.supportTitle')}</h4>
              <p className="text-xs text-slate-400 mt-0.5">{t('advantages.supportDesc')}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Footer Links */}
      <div className="max-w-7xl mx-auto px-4 sm:px-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 pb-12 border-b border-slate-800">
        {/* Brand Col */}
        <div className="lg:col-span-2 space-y-4">
          <Link to={`/${currentLang}/`} className="flex items-center space-x-2.5">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-500 flex items-center justify-center shadow-lg">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-black text-white tracking-tight">
              ENTERPRISE<span className="text-blue-400 ml-1">SHOP</span>
            </span>
          </Link>
          <p className="text-xs text-slate-400 leading-relaxed max-w-sm">
            {t('footer.aboutDesc')}
          </p>
          <div className="space-y-2 text-xs">
            <p className="flex items-center space-x-2 text-slate-300">
              <MapPin size={14} className="text-blue-400 shrink-0" />
              <span>{t('footer.address')}</span>
            </p>
            <p className="flex items-center space-x-2 text-slate-300">
              <Phone size={14} className="text-blue-400 shrink-0" />
              <span>+374 10 00-00-00</span>
            </p>
            <p className="flex items-center space-x-2 text-slate-300">
              <Mail size={14} className="text-blue-400 shrink-0" />
              <span>support@enterprise-electronics.com</span>
            </p>
          </div>
        </div>

        {/* Categories Col */}
        <div>
          <h4 className="text-sm font-bold text-white uppercase tracking-wider mb-4">{t('footer.catalog')}</h4>
          <ul className="space-y-2 text-xs">
            {mockCategories.slice(0, 6).map((cat) => (
              <li key={cat.id}>
                <Link to={`/${currentLang}/category/${cat.slug}`} className="hover:text-blue-400 transition-colors">
                  {cat.name[currentLang]}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Customer Care */}
        <div>
          <h4 className="text-sm font-bold text-white uppercase tracking-wider mb-4">{t('footer.customerCare')}</h4>
          <ul className="space-y-2 text-xs">
            <li>
              <Link to={`/${currentLang}/`} className="hover:text-blue-400 transition-colors">
                {t('nav.bestSellers')}
              </Link>
            </li>
            <li>
              <Link to={`/${currentLang}/`} className="hover:text-blue-400 transition-colors">
                {t('nav.newArrivals')}
              </Link>
            </li>
          </ul>
        </div>

        {/* Newsletter */}
        <div>
          <h4 className="text-sm font-bold text-white uppercase tracking-wider mb-4">{t('footer.newsletter')}</h4>
          <p className="text-xs text-slate-400 mb-3">
            {t('footer.newsletterDesc')}
          </p>
          <div className="flex space-x-2">
            <input
              type="email"
              placeholder={t('footer.newsletterPlaceholder')}
              className="bg-slate-900 border border-slate-800 text-xs px-3 py-2 rounded-xl text-white focus:outline-hidden focus:border-blue-500 w-full"
            />
            <button className="bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold px-3 py-2 rounded-xl transition-colors cursor-pointer">
              {t('footer.newsletterJoin')}
            </button>
          </div>
        </div>
      </div>

      {/* SEO Text Block */}
      <div className="max-w-7xl mx-auto px-4 sm:px-8 py-8 border-b border-slate-800 text-xs text-slate-500 leading-relaxed">
        <h5 className="font-bold text-slate-400 mb-2">
          {t('footer.seoTitle')}
        </h5>
        <p>
          {t('footer.seoText')}
        </p>
      </div>

      {/* Bottom Legal & Payment Logos */}
      <div className="max-w-7xl mx-auto px-4 sm:px-8 pt-8 flex flex-col sm:flex-row justify-between items-center text-xs text-slate-500 gap-4">
        <p>© 2026 Enterprise Electronics LLC. {t('footer.rights')}</p>
        <div className="flex items-center space-x-3 text-slate-400 font-mono text-[10px]">
          <span className="px-2 py-1 bg-slate-900 border border-slate-800 rounded">VISA</span>
          <span className="px-2 py-1 bg-slate-900 border border-slate-800 rounded">MASTERCARD</span>
          <span className="px-2 py-1 bg-slate-900 border border-slate-800 rounded">ArCa</span>
          <span className="px-2 py-1 bg-slate-900 border border-slate-800 rounded">IDRAM</span>
          <span className="px-2 py-1 bg-slate-900 border border-slate-800 rounded">AMERIABANK</span>
        </div>
      </div>
    </footer>
  );
};
