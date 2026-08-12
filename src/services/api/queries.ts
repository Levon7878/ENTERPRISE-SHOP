import { useQuery } from '@tanstack/react-query';
import { productService } from './productService';
import { CategoryFilterState } from '../../shared/types';

export function useProducts(filters?: Partial<CategoryFilterState> & { categorySlug?: string; searchQuery?: string }, enabled = true) {
  return useQuery({
    queryKey: ['products', filters],
    queryFn: () => productService.getProducts(filters),
    staleTime: 1000 * 60 * 5, // 5 minutes cache
    enabled,
  });
}

export function useProductBySlug(slug: string) {
  return useQuery({
    queryKey: ['product', slug],
    queryFn: () => productService.getProductBySlug(slug),
    enabled: !!slug,
  });
}

export function useCategories() {
  return useQuery({
    queryKey: ['categories'],
    queryFn: () => productService.getCategories(),
    staleTime: 1000 * 60 * 30, // 30 minutes
  });
}

export function useCategoryBySlug(slug: string) {
  return useQuery({
    queryKey: ['category', slug],
    queryFn: () => productService.getCategoryBySlug(slug),
    enabled: !!slug,
  });
}

export function useBrands() {
  return useQuery({
    queryKey: ['brands'],
    queryFn: () => productService.getBrands(),
  });
}

export function useBrandBySlug(slug: string) {
  return useQuery({
    queryKey: ['brand', slug],
    queryFn: () => productService.getBrandBySlug(slug),
    enabled: !!slug,
  });
}

export function useReviews(productId?: string) {
  return useQuery({
    queryKey: ['reviews', productId],
    queryFn: () => productService.getReviews(productId),
  });
}

export function useBankPartners() {
  return useQuery({
    queryKey: ['banks'],
    queryFn: () => productService.getBankPartners(),
  });
}
