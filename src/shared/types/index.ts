export type Language = 'am' | 'ru' | 'en';
export type Currency = 'AMD' | 'RUB' | 'USD';

export interface LocalizedText {
  am: string;
  ru: string;
  en: string;
}

export interface Brand {
  id: string;
  name: string;
  slug: string;
  logo: string;
  country: string;
  description?: LocalizedText;
}

export interface Category {
  id: string;
  slug: string;
  name: LocalizedText;
  description: LocalizedText;
  icon: string;
  image: string;
  productCount: number;
  featured?: boolean;
}

export interface ProductSpecification {
  groupName: LocalizedText;
  items: {
    label: LocalizedText;
    value: LocalizedText;
  }[];
}

export interface BankPartner {
  id: string;
  name: string;
  logo: string;
  minRate: number; // Percentage
  maxTermMonths: number;
  minDownPaymentPct: number;
  approvalSpeedMinutes: number;
  features: LocalizedText[];
}

export interface CreditPlan {
  id: string;
  bankName: string;
  termMonths: number;
  interestRate: number; // Percentage
  minAmount: number;
  maxAmount: number;
}

export interface CreditOptions {
  available: boolean;
  minTerm: number;
  maxTerm: number;
  banks: {
    name: string;
    interestRate: number;
  }[];
}

export interface Product {
  id: string;
  slug: string;
  sku: string;
  translations: {
    am: { name: string; description: string; shortDescription: string };
    ru: { name: string; description: string; shortDescription: string };
    en: { name: string; description: string; shortDescription: string };
  };
  price: number; // In base AMD currency
  oldPrice?: number; // In AMD
  discountPercentage?: number;
  isCreditEligible: boolean;
  creditAvailable: boolean;
  creditOptions?: CreditOptions;
  badgeType?: 'credit' | 'installment' | 'parts';
  minMonthlyInstallment: number; // In AMD
  images: string[];
  brand: Brand;
  category: Category;
  rating: number;
  reviewCount: number;
  stock: number;
  isNew?: boolean;
  isBestSeller?: boolean;
  isFeatured?: boolean;
  specifications: ProductSpecification[];
  warrantyMonths: number;
  deliveryDaysMin: number;
  deliveryDaysMax: number;
  createdAt: string;
}

export interface Review {
  id: string;
  productId: string;
  userName: string;
  userAvatar?: string;
  rating: number;
  comment: string;
  date: string;
  verifiedPurchase: boolean;
  likes: number;
}

export interface FAQItem {
  id: string;
  question: LocalizedText;
  answer: LocalizedText;
  category?: string;
}

export interface User {
  id: string;
  email: string;
  fullName: string;
  phone: string;
  avatar?: string;
  addresses: ShippingAddress[];
}

export interface ShippingAddress {
  id: string;
  title: string;
  fullName: string;
  phone: string;
  city: string;
  street: string;
  building: string;
  apartment?: string;
  isDefault?: boolean;
}

export interface CartItem {
  product: Product;
  quantity: number;
  selectedColor?: string;
}

export interface CreditApplication {
  id: string; // e.g. CRD-948201
  productId?: string;
  productName: string;
  productPrice: number;
  bankId: string;
  bankName: string;
  downPayment: number;
  termMonths: number;
  monthlyPayment: number;
  totalPayment: number;
  overpayment: number;
  fullName: string;
  email: string;
  phone: string;
  passportId: string;
  income: number;
  status: 'pending' | 'approved' | 'rejected';
  createdAt: string;
}

export interface OrderItem {
  productId: string;
  productName: string;
  productImage: string;
  price: number;
  quantity: number;
}

export interface Order {
  id: string;
  orderNumber: string;
  createdAt: string;
  items: OrderItem[];
  totalAmount: number;
  currency: Currency;
  status: 'processing' | 'shipped' | 'delivered' | 'cancelled';
  paymentMethod: 'cash' | 'card' | 'credit';
  shippingAddress: ShippingAddress;
  customerName: string;
  customerPhone: string;
  customerEmail: string;
  creditDetails?: {
    bankName: string;
    termMonths: number;
    monthlyPayment: number;
  };
}

export interface SEOData {
  title: string;
  description: string;
  canonicalUrl: string;
  ogImage?: string;
  ogType?: string;
  keywords?: string[];
  noIndex?: boolean;
}

export interface CategoryFilterState {
  minPrice: number;
  maxPrice: number;
  selectedBrands: string[];
  selectedRatings: number[];
  inStockOnly: boolean;
  creditEligibleOnly: boolean;
  specifications: Record<string, string[]>;
  sortBy: 'price-asc' | 'price-desc' | 'rating-desc' | 'popular' | 'newest' | 'name-asc' | 'name-desc';
}
