import { Language, Product } from '../types';

/** Case-insensitive normalize for A–Z / а–я / հայերեն search. */
export function normalizeSearchText(value: string): string {
  return value
    .normalize('NFKC')
    .toLocaleLowerCase()
    .replace(/\s+/g, ' ')
    .trim();
}

function productHaystack(product: Product): string {
  return [
    product.translations.en.name,
    product.translations.ru.name,
    product.translations.am.name,
    product.translations.en.shortDescription,
    product.translations.ru.shortDescription,
    product.translations.am.shortDescription,
    product.brand.name,
    product.sku,
    product.slug,
    product.category.name.en,
    product.category.name.ru,
    product.category.name.am,
  ].join(' ');
}

/** True if every query token appears somewhere in the product text. */
export function productMatchesQuery(product: Product, query: string): boolean {
  const q = normalizeSearchText(query);
  if (!q) return true;

  const haystack = normalizeSearchText(productHaystack(product));
  const tokens = q.split(' ').filter(Boolean);
  return tokens.every((token) => haystack.includes(token));
}

/** Lower score = better match (prefix > contains > brand/other). */
export function productSearchScore(product: Product, query: string, lang: Language): number {
  const q = normalizeSearchText(query);
  if (!q) return 99;

  const name = normalizeSearchText(product.translations[lang].name);
  const brand = normalizeSearchText(product.brand.name);
  const sku = normalizeSearchText(product.sku);

  if (name === q || sku === q) return 0;
  if (name.startsWith(q)) return 1;
  if (brand.startsWith(q)) return 2;
  if (name.includes(q)) return 3;
  if (brand.includes(q)) return 4;
  if (sku.includes(q)) return 5;
  return 6;
}

export function searchProducts(
  products: Product[],
  query: string,
  lang: Language,
  limit?: number
): Product[] {
  const q = query.trim();
  if (!q) return [];

  const matched = products
    .filter((p) => productMatchesQuery(p, q))
    .sort((a, b) => {
      const scoreDiff = productSearchScore(a, q, lang) - productSearchScore(b, q, lang);
      if (scoreDiff !== 0) return scoreDiff;
      return a.translations[lang].name.localeCompare(b.translations[lang].name, lang, {
        sensitivity: 'base',
      });
    });

  return typeof limit === 'number' ? matched.slice(0, limit) : matched;
}
