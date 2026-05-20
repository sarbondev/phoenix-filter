export interface TranslatedField {
  uz: string;
  ru: string;
  en: string;
  kz: string;
}

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

export interface PaginatedResult<T = unknown> {
  data: T[];
  meta: PaginationMeta;
}

// Auth
export interface LoginRequest {
  phoneNumber: string;
  password: string;
}

export interface AuthUser {
  id: string;
  phoneNumber: string;
  name: string;
  role: 'ADMIN' | 'CALL_MANAGER' | 'CLIENT';
  createdAt: string;
}

export interface AuthResponse {
  user: AuthUser;
  accessToken: string;
  expiresIn: string;
}

// Direction (top-level grouping for categories)
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

export interface CreateDirectionRequest {
  name: string;
  slug?: string;
  icon?: string;
  image?: string;
  isActive?: boolean;
  sortOrder?: number;
}

// Category
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

export interface CreateCategoryRequest {
  name: string;
  slug?: string;
  image?: string;
  direction: string;
  isActive?: boolean;
  sortOrder?: number;
}

// Product
export interface ProductSpecification {
  key: TranslatedField;
  value: TranslatedField;
}

export interface CrossReference {
  partNumber: string;
  manufacturer: string;
}

export interface ProductApplication {
  machineBrand: string;
  model?: string;
  engine?: string;
  year?: string;
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

export type StockStatus = 'in_stock' | 'under_order';

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
  category: string | { id?: string; _id?: string; name?: TranslatedField; slug?: string };
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

export interface CreateProductRequest {
  name: string;
  description: string;
  slug?: string;
  sku?: string;
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
  category: string;
  images?: string[];
  specifications?: Array<{ key: string; value: string }>;
  tags?: string;
  stock?: number;
  stockStatus?: StockStatus;
  datasheetUrl?: string;
  isActive?: boolean;
  isFeatured?: boolean;
}

// Equipment type (spetstexnika)
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

export interface CreateEquipmentTypeRequest {
  name: string;
  slug?: string;
  image?: string;
  icon?: string;
  machineBrands?: string[];
  isActive?: boolean;
  sortOrder?: number;
}

// Order
export interface ShippingAddress {
  fullName: string;
  phoneNumber: string;
  region: string;
  district: string;
  address: string;
  note?: string;
}

export interface OrderItem {
  product: string | { name?: TranslatedField; slug?: string; images?: string[]; price?: number };
  quantity: number;
  price: number;
  total: number;
}

export type OrderStatus = 'PENDING' | 'CONFIRMED' | 'PROCESSING' | 'SHIPPED' | 'DELIVERED' | 'CANCELLED';

export interface Order {
  id: string;
  orderNumber: string;
  user: string | { name?: string; phoneNumber?: string; _id?: string };
  items: OrderItem[];
  subtotal: number;
  shippingCost: number;
  totalAmount: number;
  status: OrderStatus;
  shippingAddress: ShippingAddress;
  note?: string;
  cancelReason?: string;
  createdAt: string;
}

// Review
export interface Review {
  id: string;
  user: string | { name?: string; _id?: string };
  product: string | { name?: TranslatedField; slug?: string; _id?: string };
  rating: number;
  comment: TranslatedField;
  isApproved: boolean;
  createdAt: string;
}

// Banner
export interface Banner {
  id: string;
  image: string;
  isActive: boolean;
  sortOrder: number;
  createdAt: string;
}

export interface CreateBannerRequest {
  image: string;
  isActive?: boolean;
  sortOrder?: number;
}

// User (admin)
export interface User {
  id: string;
  phoneNumber: string;
  name: string;
  role: 'ADMIN' | 'CALL_MANAGER' | 'CLIENT';
  createdAt: string;
}

export interface CreateUserRequest {
  phoneNumber: string;
  password: string;
  name: string;
  role?: 'ADMIN' | 'CALL_MANAGER' | 'CLIENT';
}

// Product Request (customer-searched products that returned no results)
export type ProductRequestStatus = 'NEW' | 'CONTACTED' | 'RESOLVED' | 'REJECTED';

export interface ProductRequest {
  id: string;
  productName: string;
  name?: string;
  phoneNumber: string;
  note?: string;
  searchQuery?: string;
  locale?: string;
  status: ProductRequestStatus;
  createdAt: string;
  updatedAt: string;
}

// Site Settings
export interface SiteOffice {
  label: TranslatedField;
  address: TranslatedField;
  mapUrl?: string;
}

export interface SiteSocials {
  facebook?: string;
  instagram?: string;
  telegram?: string;
  youtube?: string;
  whatsapp?: string;
}

export interface SiteSections {
  hero: boolean;
  about: boolean;
  brands: boolean;
  industries: boolean;
  whyUs: boolean;
  categories: boolean;
  products: boolean;
  ctaBanners: boolean;
  process: boolean;
  certificates: boolean;
  integration: boolean;
  productRequest: boolean;
  contactFaq: boolean;
}

export interface SiteSettings {
  brandName: string;
  brandAccent: string;
  logo?: string;
  consultationCta: TranslatedField;
  consultationSubtitle: TranslatedField;
  phone: string;
  phoneSecondary?: string;
  email: string;
  emailSecondary?: string;
  workingHours: TranslatedField;
  offices: SiteOffice[];
  socials: SiteSocials;
  sections: SiteSections;
  copyright: TranslatedField;
}

// FAQ
export interface Faq {
  id: string;
  question: TranslatedField;
  answer: TranslatedField;
  isActive: boolean;
  sortOrder: number;
  createdAt: string;
}

export interface CreateFaqRequest {
  question: string;
  answer: string;
  isActive?: boolean;
  sortOrder?: number;
}

// Presentation
export interface Presentation {
  id: string;
  title: string;
  url: string;
  isActive: boolean;
  sortOrder: number;
  createdAt: string;
}

export interface CreatePresentationRequest {
  title: string;
  url: string;
  isActive?: boolean;
  sortOrder?: number;
}

// Dashboard
export interface DashboardStats {
  orders: { total: number; pending: number };
  products: { total: number; active: number };
  users: { total: number };
  categories: { total: number };
  reviews: { total: number };
  revenue: number;
}
