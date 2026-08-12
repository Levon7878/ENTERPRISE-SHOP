import React from 'react';
import { Helmet } from 'react-helmet-async';
import { useTranslation } from 'react-i18next';
import { Language } from '../../shared/types';

interface SEOHeadProps {
  title: string;
  description: string;
  canonicalPath: string; // e.g. "/product/apple-iphone-17-pro"
  ogImage?: string;
  ogType?: 'website' | 'product' | 'article';
  noIndex?: boolean;
}

const DOMAIN = 'https://shop.enterprise-electronics.com';

export const SEOHead: React.FC<SEOHeadProps> = ({
  title,
  description,
  canonicalPath,
  ogImage = 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&w=1200&q=80',
  ogType = 'website',
  noIndex = false,
}) => {
  const { i18n } = useTranslation();
  const currentLang = (i18n.language || 'am') as Language;

  // Clean canonical path without leading slash duplicate
  const cleanPath = canonicalPath.startsWith('/') ? canonicalPath : `/${canonicalPath}`;
  const fullCanonicalUrl = `${DOMAIN}/${currentLang}${cleanPath}`;

  const amUrl = `${DOMAIN}/am${cleanPath}`;
  const ruUrl = `${DOMAIN}/ru${cleanPath}`;
  const enUrl = `${DOMAIN}/en${cleanPath}`;

  return (
    <Helmet>
      {/* Basic HTML Meta */}
      <html lang={currentLang} />
      <title>{title} | Enterprise Electronics</title>
      <meta name="description" content={description} />
      {noIndex && <meta name="robots" content="noindex, nofollow" />}
      <link rel="canonical" href={fullCanonicalUrl} />

      {/* hreflang Alternates */}
      <link rel="alternate" hrefLang="am" href={amUrl} />
      <link rel="alternate" hrefLang="ru" href={ruUrl} />
      <link rel="alternate" hrefLang="en" href={enUrl} />
      <link rel="alternate" hrefLang="x-default" href={amUrl} />

      {/* Open Graph Tags */}
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:type" content={ogType} />
      <meta property="og:url" content={fullCanonicalUrl} />
      <meta property="og:image" content={ogImage} />
      <meta property="og:site_name" content="Enterprise Electronics" />
      <meta property="og:locale" content={currentLang === 'am' ? 'hy_AM' : currentLang === 'ru' ? 'ru_RU' : 'en_US'} />

      {/* Twitter Cards */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={ogImage} />
    </Helmet>
  );
};
