import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000/api';

export const baseApi = createApi({
  reducerPath: 'api',
  baseQuery: fetchBaseQuery({
    baseUrl: API_URL,
    prepareHeaders: (headers, { getState }) => {
      const lang = typeof window !== 'undefined'
        ? window.location.pathname.split('/')[1] || 'en'
        : 'en';
      headers.set('Accept-Language', lang);
      const state = getState() as { auth?: { token?: string | null } };
      if (state.auth?.token) {
        headers.set('Authorization', `Bearer ${state.auth.token}`);
      }
      return headers;
    },
  }),
  tagTypes: ['Product', 'Category', 'Cart', 'Review', 'Banner', 'Order', 'Blog', 'ProductRequest'],
  endpoints: () => ({}),
});
