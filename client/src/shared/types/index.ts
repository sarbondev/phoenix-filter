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

export interface Direction {
  id: string;
  name: TranslatedField;
  description: TranslatedField;
  slug: string;
  icon?: string;
  image?: string;
  isActive: boolean;
  sortOrder: number;
  createdAt: string;
}

export interface Category {
  id: string;
  name: TranslatedField;
  description: TranslatedField;
  slug: string;
  image?: string;
  direction: string;
  isActive: boolean;
  sortOrder: number;
  createdAt: string;
}

export interface ProductSpecification {
  key: TranslatedField;
  value: TranslatedField;
}

export interface CrossReference {
  partNumber: string;
  manufacturer: string;
}

export interface ProductDimensions {
  height?: number;
  outerDiameter?: number;
  innerDiameter?: number;
  threadSize?: string;
  inletDiameter?: number;
  outletDiameter?: number;
  gasketOuterDiameter?: number;
  gasketInnerDiameter?: number;
  weight?: number;
}

export interface ProductApplication {
  machineBrand: string;
  model?: string;
  engine?: string;
  year?: string;
}

export type StockStatus = "in_stock" | "under_order";

export interface Product {
  id: string;
  name: TranslatedField;
  description: TranslatedField;
  slug: string;
  sku: string;
  oem?: string;
  oemNumbers?: string[];
  crossReferences?: CrossReference[];
  material?: string;
  application?: string;
  applications?: ProductApplication[];
  dimensions?: ProductDimensions;
  vehicleBrand?: string;
  price: number;
  priceOnRequest?: boolean;
  discountPercent?: number;
  discountPrice?: number;
  category:
    | string
    | { id?: string; _id?: string; name?: TranslatedField; slug?: string };
  images: string[];
  specifications: ProductSpecification[];
  tags: TranslatedField;
  stock: number;
  stockStatus?: StockStatus;
  datasheetUrl?: string;
  isActive: boolean;
  isFeatured: boolean;
  views: number;
  createdAt: string;
}

export interface EquipmentType {
  id: string;
  name: TranslatedField;
  slug: string;
  image?: string;
  icon?: string;
  machineBrands: string[];
  isActive: boolean;
  sortOrder: number;
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
