import { baseApi } from './baseApi';
import type { ApiResponse } from '@/shared/types';

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

export interface CreateProductRequestPayload {
  productName: string;
  name?: string;
  phoneNumber: string;
  note?: string;
  searchQuery?: string;
  locale?: string;
}

export const productRequestApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    submitProductRequest: builder.mutation<ProductRequest, CreateProductRequestPayload>({
      query: (body) => ({
        url: '/product-requests',
        method: 'POST',
        body,
      }),
      transformResponse: (res: ApiResponse<ProductRequest>) => res.data,
      invalidatesTags: ['ProductRequest'],
    }),
    getProductRequests: builder.query<ProductRequest[], { status?: ProductRequestStatus } | void>({
      query: (params) => ({
        url: '/product-requests',
        params: params ?? undefined,
      }),
      transformResponse: (res: ApiResponse<ProductRequest[]>) => res.data ?? [],
      providesTags: (result) =>
        result
          ? [
              ...result.map(({ id }) => ({ type: 'ProductRequest' as const, id })),
              'ProductRequest',
            ]
          : ['ProductRequest'],
    }),
    updateProductRequestStatus: builder.mutation<
      ProductRequest,
      { id: string; status: ProductRequestStatus }
    >({
      query: ({ id, status }) => ({
        url: `/product-requests/${id}/status`,
        method: 'PATCH',
        body: { status },
      }),
      transformResponse: (res: ApiResponse<ProductRequest>) => res.data,
      invalidatesTags: (_r, _e, { id }) => [
        { type: 'ProductRequest', id },
        'ProductRequest',
      ],
    }),
    deleteProductRequest: builder.mutation<void, string>({
      query: (id) => ({
        url: `/product-requests/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['ProductRequest'],
    }),
  }),
});

export const {
  useSubmitProductRequestMutation,
  useGetProductRequestsQuery,
  useUpdateProductRequestStatusMutation,
  useDeleteProductRequestMutation,
} = productRequestApi;
