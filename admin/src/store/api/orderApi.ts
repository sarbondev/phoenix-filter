import { baseApi } from './baseApi';
import type { PaginatedApiResponse, PaginatedResult, ApiResponse, Order } from '@/lib/types';

interface OrdersQuery {
  page?: number;
  limit?: number;
  status?: string;
}

export const orderApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getOrders: builder.query<PaginatedResult<Order>, OrdersQuery | void>({
      query: (params) => ({ url: '/orders', params: params || {} }),
      transformResponse: (res: PaginatedApiResponse<Order>) => ({
        data: res.data,
        meta: res.meta,
      }),
      providesTags: (result) =>
        result?.data
          ? [...result.data.map(({ id }) => ({ type: 'Order' as const, id })), 'Order']
          : ['Order'],
    }),
    getOrderStats: builder.query<Record<string, number>, void>({
      query: () => '/orders/stats',
      transformResponse: (res: ApiResponse<Record<string, number>>) => res.data,
      providesTags: ['Order'],
    }),
    updateOrderStatus: builder.mutation<Order, { id: string; status: string; cancelReason?: string }>({
      query: ({ id, ...body }) => ({ url: `/orders/${id}/status`, method: 'PATCH', body }),
      transformResponse: (res: ApiResponse<Order>) => res.data,
      invalidatesTags: (_r, _e, { id }) => [{ type: 'Order', id }, 'Order', 'Dashboard'],
    }),
  }),
});

export const {
  useGetOrdersQuery,
  useGetOrderStatsQuery,
  useUpdateOrderStatusMutation,
} = orderApi;
