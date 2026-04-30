import { baseApi } from './baseApi';
import type { ApiResponse, ProductRequest, ProductRequestStatus } from '@/lib/types';

export const productRequestApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getProductRequests: builder.query<ProductRequest[], { status?: ProductRequestStatus } | void>({
      query: (params) => ({ url: '/product-requests', params: params ?? undefined }),
      transformResponse: (res: ApiResponse<ProductRequest[]>) => res.data ?? [],
      providesTags: (result) =>
        result
          ? [...result.map(({ id }) => ({ type: 'ProductRequest' as const, id })), 'ProductRequest']
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
      invalidatesTags: (_r, _e, { id }) => [{ type: 'ProductRequest', id }, 'ProductRequest'],
    }),
    deleteProductRequest: builder.mutation<void, string>({
      query: (id) => ({ url: `/product-requests/${id}`, method: 'DELETE' }),
      invalidatesTags: ['ProductRequest'],
    }),
  }),
});

export const {
  useGetProductRequestsQuery,
  useUpdateProductRequestStatusMutation,
  useDeleteProductRequestMutation,
} = productRequestApi;
