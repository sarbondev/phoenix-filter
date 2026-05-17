import { baseApi } from './baseApi';
import type { ApiResponse, PaginatedApiResponse, Product } from '@/shared/types';

interface ProductsQuery {
  page?: number;
  limit?: number;
  category?: string;
  search?: string;
  minPrice?: string;
  maxPrice?: string;
  isFeatured?: string;
  manufacturer?: string;
  vehicleBrand?: string;
  sortBy?: string;
  sortOrder?: string;
}

export const productApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getProducts: builder.query<PaginatedApiResponse<Product>, ProductsQuery | void>({
      query: (params) => ({ url: '/products', params: params || {} }),
      providesTags: (result) =>
        result?.data
          ? [...result.data.map(({ id }) => ({ type: 'Product' as const, id })), 'Product']
          : ['Product'],
    }),
    getProduct: builder.query<Product, string>({
      query: (id) => `/products/${id}`,
      transformResponse: (res: ApiResponse<Product>) => res.data,
      providesTags: (_r, _e, id) => [{ type: 'Product', id }],
    }),
    getProductBySlug: builder.query<Product, string>({
      query: (slug) => `/products/slug/${slug}`,
      transformResponse: (res: ApiResponse<Product>) => res.data,
      providesTags: (result) => result ? [{ type: 'Product', id: result.id }] : [],
    }),
    getManufacturers: builder.query<string[], void>({
      query: () => '/products/manufacturers',
      transformResponse: (res: ApiResponse<string[]>) => res.data,
      providesTags: ['Product'],
    }),
  }),
});

export const {
  useGetProductsQuery,
  useGetProductQuery,
  useGetProductBySlugQuery,
  useGetManufacturersQuery,
} = productApi;
