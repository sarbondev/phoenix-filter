import { baseApi } from './baseApi';
import type { ApiResponse, Category, CreateCategoryRequest } from '@/lib/types';

export const categoryApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getCategories: builder.query<Category[], { active?: boolean; direction?: string } | void>({
      query: (params) => ({
        url: '/categories',
        params: params
          ? { active: params.active, direction: params.direction }
          : undefined,
      }),
      transformResponse: (res: ApiResponse<Category[]>) => res.data ?? [],
      providesTags: (result) =>
        result
          ? [...result.map(({ id }) => ({ type: 'Category' as const, id })), 'Category']
          : ['Category'],
    }),
    getCategory: builder.query<Category, string>({
      query: (id) => `/categories/${id}`,
      transformResponse: (res: ApiResponse<Category>) => res.data,
      providesTags: (_r, _e, id) => [{ type: 'Category', id }],
    }),
    createCategory: builder.mutation<Category, CreateCategoryRequest>({
      query: (body) => ({ url: '/categories', method: 'POST', body }),
      transformResponse: (res: ApiResponse<Category>) => res.data,
      invalidatesTags: ['Category', 'Dashboard'],
    }),
    updateCategory: builder.mutation<Category, { id: string; data: Partial<CreateCategoryRequest> }>({
      query: ({ id, data }) => ({ url: `/categories/${id}`, method: 'PATCH', body: data }),
      transformResponse: (res: ApiResponse<Category>) => res.data,
      invalidatesTags: (_r, _e, { id }) => [{ type: 'Category', id }, 'Category'],
    }),
    deleteCategory: builder.mutation<void, string>({
      query: (id) => ({ url: `/categories/${id}`, method: 'DELETE' }),
      invalidatesTags: ['Category', 'Dashboard'],
    }),
  }),
});

export const {
  useGetCategoriesQuery,
  useGetCategoryQuery,
  useCreateCategoryMutation,
  useUpdateCategoryMutation,
  useDeleteCategoryMutation,
} = categoryApi;
