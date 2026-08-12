import React from 'react';
import { Helmet } from 'react-helmet-async';
import { Product, FAQItem, Review } from '../../../shared/types';

export const OrganizationSchema: React.FC = () => {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'Enterprise Electronics LLC',
    url: 'https://shop.enterprise-electronics.com',
    logo: 'https://shop.enterprise-electronics.com/logo.png',
    description: 'Leading Enterprise Electronics Marketplace in Armenia',
    contactPoint: {
      '@type': 'ContactPoint',
      telephone: '+374-10-00-00-00',
      contactType: 'customer service',
      areaServed: 'AM',
      availableLanguage: ['Armenian', 'Russian', 'English'],
    },
    address: {
      '@type': 'PostalAddress',
      streetAddress: 'Republic Square 1',
      addressLocality: 'Yerevan',
      addressCountry: 'AM',
    },
    sameAs: [
      'https://facebook.com/enterprise-electronics',
      'https://instagram.com/enterprise-electronics',
    ],
  };

  return (
    <Helmet>
      <script type="application/ld+json">{JSON.stringify(schema)}</script>
    </Helmet>
  );
};

export const WebsiteSchema: React.FC = () => {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: 'Enterprise Electronics',
    url: 'https://shop.enterprise-electronics.com',
    potentialAction: {
      '@type': 'SearchAction',
      target: 'https://shop.enterprise-electronics.com/search?q={search_term_string}',
      'query-input': 'required name=search_term_string',
    },
  };

  return (
    <Helmet>
      <script type="application/ld+json">{JSON.stringify(schema)}</script>
    </Helmet>
  );
};

export const ProductSchema: React.FC<{ product: Product; name: string; description: string }> = ({
  product,
  name,
  description,
}) => {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: name,
    image: product.images,
    description: description,
    sku: product.sku,
    mpn: product.id,
    brand: {
      '@type': 'Brand',
      name: product.brand.name,
    },
    offers: {
      '@type': 'Offer',
      url: `https://shop.enterprise-electronics.com/product/${product.slug}`,
      priceCurrency: 'AMD',
      price: product.price,
      priceValidUntil: '2027-12-31',
      itemCondition: 'https://schema.org/NewCondition',
      availability: product.stock > 0 ? 'https://schema.org/InStock' : 'https://schema.org/OutOfStock',
      seller: {
        '@type': 'Organization',
        name: 'Enterprise Electronics',
      },
    },
    aggregateRating: {
      '@type': 'AggregateRating',
      ratingValue: product.rating,
      reviewCount: product.reviewCount,
      bestRating: '5',
      worstRating: '1',
    },
  };

  return (
    <Helmet>
      <script type="application/ld+json">{JSON.stringify(schema)}</script>
    </Helmet>
  );
};

export const BreadcrumbSchema: React.FC<{ items: { name: string; url: string }[] }> = ({ items }) => {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, idx) => ({
      '@type': 'ListItem',
      position: idx + 1,
      name: item.name,
      item: item.url,
    })),
  };

  return (
    <Helmet>
      <script type="application/ld+json">{JSON.stringify(schema)}</script>
    </Helmet>
  );
};

export const FAQSchema: React.FC<{ faqs: FAQItem[]; lang: 'am' | 'ru' | 'en' }> = ({ faqs, lang }) => {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map((faq) => ({
      '@type': 'Question',
      name: faq.question[lang],
      acceptedAnswer: {
        '@type': 'Answer',
        text: faq.answer[lang],
      },
    })),
  };

  return (
    <Helmet>
      <script type="application/ld+json">{JSON.stringify(schema)}</script>
    </Helmet>
  );
};

export const ReviewSchema: React.FC<{ reviews: Review[]; productName: string }> = ({ reviews, productName }) => {
  const schema = reviews.map((r) => ({
    '@context': 'https://schema.org',
    '@type': 'Review',
    itemReviewed: {
      '@type': 'Product',
      name: productName,
    },
    author: {
      '@type': 'Person',
      name: r.userName,
    },
    reviewRating: {
      '@type': 'Rating',
      ratingValue: r.rating,
      bestRating: '5',
    },
    reviewBody: r.comment,
    datePublished: r.date,
  }));

  return (
    <Helmet>
      <script type="application/ld+json">{JSON.stringify(schema)}</script>
    </Helmet>
  );
};
