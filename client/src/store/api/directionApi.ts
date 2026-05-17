import { baseApi } from './baseApi';
import type { ApiResponse, Direction } from '@/shared/types';

export const directionApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getDirections: builder.query<Direction[], void>({
      query: () => '/directions?active=true',
      transformResponse: (res: ApiResponse<Direction[]>) => res.data ?? [],
      providesTags: ['Direction'],
    }),
    getDirectionBySlug: builder.query<Direction, string>({
      query: (slug) => `/directions/slug/${slug}`,
      transformResponse: (res: ApiResponse<Direction>) => res.data,
    }),
  }),
});

export const { useGetDirectionsQuery, useGetDirectionBySlugQuery } = directionApi;
