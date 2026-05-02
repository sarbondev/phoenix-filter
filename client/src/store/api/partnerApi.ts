import { baseApi } from './baseApi';
import type { ApiResponse } from '@/shared/types';

interface Partner {
  id: string;
  image: string;
  isActive: boolean;
  sortOrder: number;
  createdAt: string;
}

export const partnerApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getPartners: builder.query<Partner[], void>({
      query: () => '/partners',
      transformResponse: (res: ApiResponse<Partner[]>) => res.data,
      providesTags: ['Partner'],
    }),
  }),
});

export const { useGetPartnersQuery } = partnerApi;
