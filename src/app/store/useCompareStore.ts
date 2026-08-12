import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Product, Currency } from '../../shared/types';

interface CompareState {
  items: Product[];
  toggleCompare: (product: Product) => void;
  isInCompare: (productId: string) => boolean;
  clearCompare: () => void;
}

export const useCompareStore = create<CompareState>()(
  persist(
    (set, get) => ({
      items: [],
      toggleCompare: (product) => {
        const current = get().items;
        const exists = current.some((p) => p.id === product.id);
        if (exists) {
          set({ items: current.filter((p) => p.id !== product.id) });
        } else {
          if (current.length >= 4) {
            alert('You can compare up to 4 products simultaneously.');
            return;
          }
          set({ items: [...current, product] });
        }
      },
      isInCompare: (productId) => get().items.some((p) => p.id === productId),
      clearCompare: () => set({ items: [] }),
    }),
    {
      name: 'enterprise_compare_storage',
    }
  )
);

interface CurrencyState {
  currency: Currency;
  setCurrency: (c: Currency) => void;
  formatPrice: (priceInAMD: number) => string;
}

/** Armenian retail price format, e.g. "650 000 ֏" */
export function formatAmdPrice(priceInAMD: number): string {
  const value = Math.round(Number(priceInAMD) || 0);
  const formatted = new Intl.NumberFormat('hy-AM', {
    maximumFractionDigits: 0,
    useGrouping: true,
  }).format(value);
  return `${formatted} ֏`;
}

export const useCurrencyStore = create<CurrencyState>()(
  persist(
    (set) => ({
      currency: 'AMD',
      setCurrency: (currency) => set({ currency }),
      formatPrice: (priceInAMD: number) => formatAmdPrice(priceInAMD),
    }),
    {
      name: 'enterprise_currency_storage',
    }
  )
);
