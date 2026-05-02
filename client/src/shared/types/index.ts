export interface TranslatedField {
  uz: string;
  ru: string;
  en: string;
  kz: string;
}

export type Locale = "uz" | "ru" | "en" | "kz";

export interface PaginationMeta {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
}

export interface ApiResponse<T = unknown> {
  success: boolean;
  message: string;
  data: T;
}

export interface PaginatedApiResponse<T = unknown> {
  success: boolean;
  message: string;
  data: T[];
  meta: PaginationMeta;
}

export interface Category {
  id: string;
  name: TranslatedField;
  description: TranslatedField;
  slug: string;
  image?: string;
  parent?: string;
  isActive: boolean;
  sortOrder: number;
  children?: Category[];
  createdAt: string;
}

export interface ProductSpecification {
  key: TranslatedField;
  value: TranslatedField;
}

export interface Product {
  id: string;
  name: TranslatedField;
  description: TranslatedField;
  slug: string;
  sku: string;
  price: number;
  discountPercent?: number;
  discountPrice?: number;
  category:
    | string
    | { id?: string; _id?: string; name?: TranslatedField; slug?: string };
  images: string[];
  specifications: ProductSpecification[];
  tags: TranslatedField;
  stock: number;
  isActive: boolean;
  isFeatured: boolean;
  views: number;
  createdAt: string;
}

export interface CartItem {
  product: Product;
  quantity: number;
}

export interface Cart {
  id: string;
  user: string;
  items: CartItem[];
  totalItems: number;
  createdAt: string;
}

export interface Review {
  id: string;
  user: string | { name?: string };
  product: string;
  rating: number;
  comment: TranslatedField;
  isApproved: boolean;
  createdAt: string;
}

export interface Banner {
  id: string;
  image: string;
  isActive: boolean;
  sortOrder: number;
  createdAt: string;
}

export interface Blog {
  id: string;
  title: TranslatedField;
  content: TranslatedField;
  excerpt: TranslatedField;
  slug: string;
  image?: string;
  isPublished: boolean;
  views: number;
  createdAt: string;
}
