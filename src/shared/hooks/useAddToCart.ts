import { useTranslation } from 'react-i18next';
import { useCartStore } from '../../app/store/useCartStore';
import { useToastStore } from '../../app/store/useToastStore';
import { Language, Product } from '../types';

/** Adds a product to the cart and shows a confirmation toast. */
export function useAddToCart() {
  const { t, i18n } = useTranslation('common');
  const addItem = useCartStore((state) => state.addItem);
  const showToast = useToastStore((state) => state.showToast);

  return (product: Product, quantity = 1, selectedColor?: string) => {
    addItem(product, quantity, selectedColor);
    const lang = (i18n.language?.slice(0, 2) || 'am') as Language;
    const name = product.translations[lang]?.name ?? product.translations.en?.name ?? '';
    showToast(t('toast.addedToCart', { name }));
  };
}
