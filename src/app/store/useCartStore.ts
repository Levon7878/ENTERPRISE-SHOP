import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Product, CartItem } from '../../shared/types';

interface CartState {
  items: CartItem[];
  promoCode: string | null;
  discountRate: number; // 0 to 1
  addItem: (product: Product, quantity?: number, selectedColor?: string) => void;
  removeItem: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  applyPromoCode: (code: string) => boolean;
  removePromoCode: () => void;
  getTotalItems: () => number;
  getSubtotal: () => number;
  getDiscountAmount: () => number;
  getTotalPrice: () => number;
}

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],
      promoCode: null,
      discountRate: 0,

      addItem: (product, quantity = 1, selectedColor) => {
        const currentItems = get().items;
        const existingIndex = currentItems.findIndex((item) => item.product.id === product.id);

        if (existingIndex > -1) {
          const updated = [...currentItems];
          updated[existingIndex].quantity += quantity;
          set({ items: updated });
        } else {
          set({ items: [...currentItems, { product, quantity, selectedColor }] });
        }
      },

      removeItem: (productId) => {
        set({ items: get().items.filter((item) => item.product.id !== productId) });
      },

      updateQuantity: (productId, quantity) => {
        if (quantity <= 0) {
          get().removeItem(productId);
          return;
        }
        set({
          items: get().items.map((item) =>
            item.product.id === productId ? { ...item, quantity } : item
          ),
        });
      },

      clearCart: () => set({ items: [], promoCode: null, discountRate: 0 }),

      applyPromoCode: (code) => {
        const clean = code.trim().toUpperCase();
        if (clean === 'ENTERPRISE10' || clean === 'PROMO10') {
          set({ promoCode: clean, discountRate: 0.1 });
          return true;
        } else if (clean === 'SUMMER15') {
          set({ promoCode: clean, discountRate: 0.15 });
          return true;
        }
        return false;
      },

      removePromoCode: () => set({ promoCode: null, discountRate: 0 }),

      getTotalItems: () => get().items.reduce((acc, item) => acc + item.quantity, 0),

      getSubtotal: () =>
        get().items.reduce((acc, item) => acc + item.product.price * item.quantity, 0),

      getDiscountAmount: () => get().getSubtotal() * get().discountRate,

      getTotalPrice: () => get().getSubtotal() - get().getDiscountAmount(),
    }),
    {
      name: 'enterprise_cart_storage',
    }
  )
);
