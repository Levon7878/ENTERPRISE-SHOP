import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

import amCommon from '../../locales/am/common.json';
import amProducts from '../../locales/am/products.json';
import amCheckout from '../../locales/am/checkout.json';
import amCredit from '../../locales/am/credit.json';

import ruCommon from '../../locales/ru/common.json';
import ruProducts from '../../locales/ru/products.json';
import ruCheckout from '../../locales/ru/checkout.json';
import ruCredit from '../../locales/ru/credit.json';

import enCommon from '../../locales/en/common.json';
import enProducts from '../../locales/en/products.json';
import enCheckout from '../../locales/en/checkout.json';
import enCredit from '../../locales/en/credit.json';

const resources = {
  am: {
    common: amCommon,
    products: amProducts,
    checkout: amCheckout,
    credit: amCredit,
  },
  ru: {
    common: ruCommon,
    products: ruProducts,
    checkout: ruCheckout,
    credit: ruCredit,
  },
  en: {
    common: enCommon,
    products: enProducts,
    checkout: enCheckout,
    credit: enCredit,
  },
};

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources,
    fallbackLng: 'am',
    supportedLngs: ['am', 'ru', 'en'],
    defaultNS: 'common',
    ns: ['common', 'products', 'checkout', 'credit'],
    interpolation: {
      escapeValue: false,
    },
    detection: {
      order: ['path', 'localStorage', 'navigator'],
      lookupFromPathIndex: 0,
      caches: ['localStorage'],
    },
  });

export default i18n;
