import { mockProducts } from '../../data/products';
import { mockCategories } from '../../data/categories';
import { mockBrands } from '../../data/brands';
import { mockReviews } from '../../data/reviews';
import { mockBanks } from '../../data/banks';
import { Product, Category, Brand, Review, BankPartner, CategoryFilterState } from '../../shared/types';
import { productMatchesQuery, productSearchScore } from '../../shared/utils/searchProducts';

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export const productService = {
  async getProducts(filters?: Partial<CategoryFilterState> & { categorySlug?: string; searchQuery?: string }): Promise<Product[]> {
    await delay(200);
    let list = [...mockProducts];

    if (filters?.categorySlug) {
      list = list.filter((p) => p.category.slug === filters.categorySlug);
    }

    if (filters?.searchQuery) {
      const q = filters.searchQuery.trim();
      list = list.filter((p) => productMatchesQuery(p, q));
      // Relevance first when searching (unless user picked an explicit sort)
      if (!filters.sortBy || filters.sortBy === 'popular') {
        list.sort((a, b) => {
          const diff = productSearchScore(a, q, 'en') - productSearchScore(b, q, 'en');
          if (diff !== 0) return diff;
          return a.translations.en.name.localeCompare(b.translations.en.name, undefined, {
            sensitivity: 'base',
          });
        });
      }
    }

    if (filters?.minPrice !== undefined) {
      list = list.filter((p) => p.price >= (filters.minPrice || 0));
    }

    if (filters?.maxPrice !== undefined && filters.maxPrice > 0) {
      list = list.filter((p) => p.price <= (filters.maxPrice || Infinity));
    }

    if (filters?.selectedBrands && filters.selectedBrands.length > 0) {
      list = list.filter((p) => filters.selectedBrands?.includes(p.brand.id));
    }

    if (filters?.inStockOnly) {
      list = list.filter((p) => p.stock > 0);
    }

    if (filters?.creditEligibleOnly) {
      list = list.filter((p) => p.isCreditEligible);
    }

    if (filters?.sortBy) {
      if (filters.sortBy === 'price-asc') list.sort((a, b) => a.price - b.price);
      else if (filters.sortBy === 'price-desc') list.sort((a, b) => b.price - a.price);
      else if (filters.sortBy === 'rating-desc') list.sort((a, b) => b.rating - a.rating);
      else if (filters.sortBy === 'newest')
        list.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
      else if (filters.sortBy === 'name-asc')
        list.sort((a, b) =>
          a.translations.en.name.localeCompare(b.translations.en.name, undefined, { sensitivity: 'base' })
        );
      else if (filters.sortBy === 'name-desc')
        list.sort((a, b) =>
          b.translations.en.name.localeCompare(a.translations.en.name, undefined, { sensitivity: 'base' })
        );
    }

    return list;
  },

  async getProductBySlug(slug: string): Promise<Product | null> {
    await delay(150);
    const prod = mockProducts.find((p) => p.slug === slug);
    return prod || null;
  },

  async getCategories(): Promise<Category[]> {
    await delay(100);
    return mockCategories.map((cat) => ({
      ...cat,
      productCount: mockProducts.filter((p) => p.category.id === cat.id).length,
    }));
  },

  async getCategoryBySlug(slug: string): Promise<Category | null> {
    await delay(100);
    const cat = mockCategories.find((c) => c.slug === slug);
    if (!cat) return null;
    return {
      ...cat,
      productCount: mockProducts.filter((p) => p.category.id === cat.id).length,
    };
  },

  async getBrands(): Promise<Brand[]> {
    await delay(100);
    return mockBrands;
  },

  async getBrandBySlug(slug: string): Promise<Brand | null> {
    await delay(100);
    return mockBrands.find((b) => b.slug === slug) || null;
  },

  async getReviews(productId?: string): Promise<Review[]> {
    await delay(100);
    if (productId) {
      return mockReviews.filter((r) => r.productId === productId);
    }
    return mockReviews;
  },

  async getBankPartners(): Promise<BankPartner[]> {
    await delay(100);
    return mockBanks;
  },
};
