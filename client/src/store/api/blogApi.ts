import { baseApi } from './baseApi';
import type { ApiResponse, PaginatedApiResponse } from '@/shared/types';
import type { Blog } from '@/shared/types';

interface BlogsQuery {
  page?: number;
  limit?: number;
}

export interface CreateBlogRequest {
  title: string;
  content: string;
  image?: string;
  isPublished?: boolean;
}

export const blogApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getBlogs: builder.query<PaginatedApiResponse<Blog>, BlogsQuery | void>({
      query: (params) => ({ url: '/blogs', params: params || {} }),
      providesTags: (result) =>
        result?.data
          ? [...result.data.map(({ id }) => ({ type: 'Blog' as const, id })), 'Blog']
          : ['Blog'],
    }),
    getAllBlogs: builder.query<Blog[], void>({
      query: () => '/blogs/admin/all',
      transformResponse: (res: ApiResponse<Blog[]>) => res.data ?? [],
      providesTags: ['Blog'],
    }),
    getBlogBySlug: builder.query<Blog, string>({
      query: (slug) => `/blogs/slug/${slug}`,
      transformResponse: (res: ApiResponse<Blog>) => res.data,
    }),
    createBlog: builder.mutation<Blog, CreateBlogRequest>({
      query: (body) => ({ url: '/blogs', method: 'POST', body }),
      transformResponse: (res: ApiResponse<Blog>) => res.data,
      invalidatesTags: ['Blog'],
    }),
    updateBlog: builder.mutation<Blog, { id: string; data: Partial<CreateBlogRequest> }>({
      query: ({ id, data }) => ({ url: `/blogs/${id}`, method: 'PATCH', body: data }),
      transformResponse: (res: ApiResponse<Blog>) => res.data,
      invalidatesTags: (_r, _e, { id }) => [{ type: 'Blog', id }, 'Blog'],
    }),
    deleteBlog: builder.mutation<void, string>({
      query: (id) => ({ url: `/blogs/${id}`, method: 'DELETE' }),
      invalidatesTags: ['Blog'],
    }),
  }),
});

export const {
  useGetBlogsQuery,
  useGetAllBlogsQuery,
  useGetBlogBySlugQuery,
  useCreateBlogMutation,
  useUpdateBlogMutation,
  useDeleteBlogMutation,
} = blogApi;
