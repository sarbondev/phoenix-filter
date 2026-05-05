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

export interface Order {
  id: string;
  orderNumber: string;
  items: OrderItemResponse[];
  subtotal?: number;
  shippingCost?: number;
  totalAmount: number;
  status: string;
  shippingAddress?: ShippingAddress;
  note?: string;
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
    createOrder: builder.mutation<Order, CreateOrderRequest>({
      query: (body) => ({ url: '/orders', method: 'POST', body }),
      transformResponse: (res: ApiResponse<Order>) => res.data,
      invalidatesTags: ['Order'],
    }),
    getMyOrders: builder.query<{ data: Order[]; meta: unknown }, void>({
      query: () => '/orders/my',
      providesTags: ['Order'],
    }),
    getOrderByNumber: builder.query<Order, string>({
      query: (orderNumber) => `/orders/by-number/${orderNumber}`,
      transformResponse: (res: ApiResponse<Order>) => res.data,
      providesTags: (_r, _e, n) => [{ type: 'Order', id: n }],
    }),
  }),
});

export const {
  useCreateOrderMutation,
  useGetMyOrdersQuery,
  useGetOrderByNumberQuery,
} = orderApi;
