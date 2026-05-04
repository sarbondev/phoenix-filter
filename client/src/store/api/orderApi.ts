import { baseApi } from './baseApi';

interface OrderProduct {
  name?: { uz: string; ru: string; en: string; kz: string };
  slug?: string;
  images?: string[];
  price?: number;
}

interface OrderItemResponse {
  product: string | OrderProduct;
  quantity: number;
  price: number;
  total: number;
}

interface Order {
  id: string;
  orderNumber: string;
  items: OrderItemResponse[];
  totalAmount: number;
  status: string;
  createdAt: string;
}

interface OrderItem {
  product: string;
  quantity: number;
}

interface ShippingAddress {
  fullName: string;
  phoneNumber: string;
  region: string;
  district: string;
  address: string;
  note?: string;
}

interface CreateOrderRequest {
  items: OrderItem[];
  shippingAddress: ShippingAddress;
  note?: string;
}

interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
}

export const orderApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    createOrder: builder.mutation<unknown, CreateOrderRequest>({
      query: (body) => ({ url: '/orders', method: 'POST', body }),
      transformResponse: (res: ApiResponse<unknown>) => res.data,
      invalidatesTags: ['Order'],
    }),
    getMyOrders: builder.query<{ data: Order[]; meta: unknown }, void>({
      query: () => '/orders/my',
      providesTags: ['Order'],
    }),
  }),
});

export const { useCreateOrderMutation, useGetMyOrdersQuery } = orderApi;
