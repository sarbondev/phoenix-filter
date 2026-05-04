import { baseApi } from './baseApi';
import type { ApiResponse } from '@/shared/types';

export interface Partner {
  id: string;
  image: string;
  isActive: boolean;
  sortOrder: number;
  createdAt: string;
}

export interface CreatePartnerRequest {
  image: string;
  isActive?: boolean;
  sortOrder?: number;
}

export const partnerApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getPartners: builder.query<Partner[], void>({
      query: () => '/partners',
      transformResponse: (res: ApiResponse<Partner[]>) => res.data,
      providesTags: (result) =>
        result
          ? [...result.map(({ id }) => ({ type: 'Partner' as const, id })), 'Partner']
          : ['Partner'],
    }),
    getAllPartners: builder.query<Partner[], void>({
      query: () => '/partners/all',
      transformResponse: (res: ApiResponse<Partner[]>) => res.data ?? [],
      providesTags: ['Partner'],
    }),
    createPartner: builder.mutation<Partner, CreatePartnerRequest>({
      query: (body) => ({ url: '/partners', method: 'POST', body }),
      transformResponse: (res: ApiResponse<Partner>) => res.data,
      invalidatesTags: ['Partner'],
    }),
    updatePartner: builder.mutation<Partner, { id: string; data: Partial<CreatePartnerRequest> }>({
      query: ({ id, data }) => ({ url: `/partners/${id}`, method: 'PATCH', body: data }),
      transformResponse: (res: ApiResponse<Partner>) => res.data,
      invalidatesTags: (_r, _e, { id }) => [{ type: 'Partner', id }, 'Partner'],
    }),
    deletePartner: builder.mutation<void, string>({
      query: (id) => ({ url: `/partners/${id}`, method: 'DELETE' }),
      invalidatesTags: ['Partner'],
    }),
  }),
});

export const {
  useGetPartnersQuery,
  useGetAllPartnersQuery,
  useCreatePartnerMutation,
  useUpdatePartnerMutation,
  useDeletePartnerMutation,
} = partnerApi;
