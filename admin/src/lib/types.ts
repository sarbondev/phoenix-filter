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

// Category
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

export interface CreateCategoryRequest {
  name: string;
  slug?: string;
  image?: string;
  parent?: string;
  isActive?: boolean;
  sortOrder?: number;
}

// Product
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
  category: string | { id?: string; _id?: string; name?: TranslatedField; slug?: string };
  images: string[];
  specifications: ProductSpecification[];
  tags: TranslatedField;
  stock: number;
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
  price: number;
  discountPercent?: number;
  category: string;
  images?: string[];
  specifications?: Array<{ key: string; value: string }>;
  tags?: string;
  stock?: number;
  isActive?: boolean;
  isFeatured?: boolean;
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
export type PaymentStatus = 'PENDING' | 'PAID' | 'FAILED' | 'REFUNDED';

export interface Order {
  id: string;
  orderNumber: string;
  user: string | { name?: string; phoneNumber?: string; _id?: string };
  items: OrderItem[];
  subtotal: number;
  shippingCost: number;
  totalAmount: number;
  status: OrderStatus;
  paymentStatus: PaymentStatus;
  paymentMethod: 'CASH' | 'CARD' | 'BANK_TRANSFER';
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

// Blog
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

export interface CreateBlogRequest {
  title: string;
  content: string;
  image?: string;
  isPublished?: boolean;
}

// Partner
export interface Partner {
  id: string;
  image: string;
  isActive: boolean;
  sortOrder: number;
  createdAt: string;
}

export interface CreatePartnerRequest {
  image: string;
  isActive?: boolean;
  sortOrder?: number;
}

// Industry
export interface Industry {
  id: string;
  name: TranslatedField;
  image: string;
  isActive: boolean;
  sortOrder: number;
  createdAt: string;
}

export interface CreateIndustryRequest {
  name: string;
  image: string;
  isActive?: boolean;
  sortOrder?: number;
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

// Dashboard
export interface DashboardStats {
  orders: { total: number; pending: number };
  products: { total: number; active: number };
  users: { total: number };
  categories: { total: number };
  reviews: { total: number };
  revenue: number;
}
