import { baseApi } from './baseApi';
import type { ApiResponse, TranslatedField } from '@/shared/types';

export interface Industry {
  id: string;
  name: TranslatedField;
  image: string;
  isActive: boolean;
  sortOrder: number;
  createdAt: string;
}

export interface CreateIndustryRequest {
  name: string;
  image: string;
  isActive?: boolean;
  sortOrder?: number;
}

export const industryApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getIndustries: builder.query<Industry[], void>({
      query: () => '/industries',
      transformResponse: (res: ApiResponse<Industry[]>) => res.data,
      providesTags: (result) =>
        result
          ? [...result.map(({ id }) => ({ type: 'Industry' as const, id })), 'Industry']
          : ['Industry'],
    }),
    getAllIndustries: builder.query<Industry[], void>({
      query: () => '/industries/all',
      transformResponse: (res: ApiResponse<Industry[]>) => res.data ?? [],
      providesTags: ['Industry'],
    }),
    createIndustry: builder.mutation<Industry, CreateIndustryRequest>({
      query: (body) => ({ url: '/industries', method: 'POST', body }),
      transformResponse: (res: ApiResponse<Industry>) => res.data,
      invalidatesTags: ['Industry'],
    }),
    updateIndustry: builder.mutation<Industry, { id: string; data: Partial<CreateIndustryRequest> }>({
      query: ({ id, data }) => ({ url: `/industries/${id}`, method: 'PATCH', body: data }),
      transformResponse: (res: ApiResponse<Industry>) => res.data,
      invalidatesTags: (_r, _e, { id }) => [{ type: 'Industry', id }, 'Industry'],
    }),
    deleteIndustry: builder.mutation<void, string>({
      query: (id) => ({ url: `/industries/${id}`, method: 'DELETE' }),
      invalidatesTags: ['Industry'],
    }),
  }),
});

export const {
  useGetIndustriesQuery,
  useGetAllIndustriesQuery,
  useCreateIndustryMutation,
  useUpdateIndustryMutation,
  useDeleteIndustryMutation,
} = industryApi;
