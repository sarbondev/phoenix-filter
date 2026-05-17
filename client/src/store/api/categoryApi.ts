import { baseApi } from './baseApi';
import type { ApiResponse, Category } from '@/shared/types';

export const categoryApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getCategories: builder.query<Category[], { direction?: string } | void>({
      query: (params) => ({
        url: '/categories',
        params: { active: true, ...(params?.direction ? { direction: params.direction } : {}) },
      }),
      transformResponse: (res: ApiResponse<Category[]>) => res.data ?? [],
      providesTags: ['Category'],
    }),
    getCategoryBySlug: builder.query<Category, string>({
      query: (slug) => `/categories/slug/${slug}`,
      transformResponse: (res: ApiResponse<Category>) => res.data,
    }),
  }),
});

export const { useGetCategoriesQuery, useGetCategoryBySlugQuery } = categoryApi;
