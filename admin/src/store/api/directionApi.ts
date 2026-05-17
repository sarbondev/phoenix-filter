import { baseApi } from './baseApi';
import type { ApiResponse, Direction, CreateDirectionRequest } from '@/lib/types';

export const directionApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getDirections: builder.query<Direction[], { active?: boolean } | void>({
      query: (params) => ({
        url: '/directions',
        params: params ? { active: params.active } : undefined,
      }),
      transformResponse: (res: ApiResponse<Direction[]>) => res.data ?? [],
      providesTags: (result) =>
        result
          ? [...result.map(({ id }) => ({ type: 'Direction' as const, id })), 'Direction']
          : ['Direction'],
    }),
    getDirection: builder.query<Direction, string>({
      query: (id) => `/directions/${id}`,
      transformResponse: (res: ApiResponse<Direction>) => res.data,
      providesTags: (_r, _e, id) => [{ type: 'Direction', id }],
    }),
    createDirection: builder.mutation<Direction, CreateDirectionRequest>({
      query: (body) => ({ url: '/directions', method: 'POST', body }),
      transformResponse: (res: ApiResponse<Direction>) => res.data,
      invalidatesTags: ['Direction', 'Dashboard'],
    }),
    updateDirection: builder.mutation<Direction, { id: string; data: Partial<CreateDirectionRequest> }>({
      query: ({ id, data }) => ({ url: `/directions/${id}`, method: 'PATCH', body: data }),
      transformResponse: (res: ApiResponse<Direction>) => res.data,
      invalidatesTags: (_r, _e, { id }) => [{ type: 'Direction', id }, 'Direction'],
    }),
    deleteDirection: builder.mutation<void, string>({
      query: (id) => ({ url: `/directions/${id}`, method: 'DELETE' }),
      invalidatesTags: ['Direction', 'Dashboard'],
    }),
  }),
});

export const {
  useGetDirectionsQuery,
  useGetDirectionQuery,
  useCreateDirectionMutation,
  useUpdateDirectionMutation,
  useDeleteDirectionMutation,
} = directionApi;
