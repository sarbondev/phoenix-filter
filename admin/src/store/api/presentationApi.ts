import { baseApi } from './baseApi';
import type { ApiResponse, Presentation, CreatePresentationRequest } from '@/lib/types';

export const presentationApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getPresentations: builder.query<Presentation[], void>({
      query: () => '/presentations',
      transformResponse: (res: ApiResponse<Presentation[]>) => res.data ?? [],
      providesTags: (result) =>
        result
          ? [...result.map(({ id }) => ({ type: 'Presentation' as const, id })), 'Presentation']
          : ['Presentation'],
    }),
    createPresentation: builder.mutation<Presentation, CreatePresentationRequest>({
      query: (body) => ({ url: '/presentations', method: 'POST', body }),
      transformResponse: (res: ApiResponse<Presentation>) => res.data,
      invalidatesTags: ['Presentation'],
    }),
    updatePresentation: builder.mutation<Presentation, { id: string; data: Partial<CreatePresentationRequest> }>({
      query: ({ id, data }) => ({ url: `/presentations/${id}`, method: 'PATCH', body: data }),
      transformResponse: (res: ApiResponse<Presentation>) => res.data,
      invalidatesTags: (_r, _e, { id }) => [{ type: 'Presentation', id }, 'Presentation'],
    }),
    deletePresentation: builder.mutation<void, string>({
      query: (id) => ({ url: `/presentations/${id}`, method: 'DELETE' }),
      invalidatesTags: ['Presentation'],
    }),
  }),
});

export const {
  useGetPresentationsQuery,
  useCreatePresentationMutation,
  useUpdatePresentationMutation,
  useDeletePresentationMutation,
} = presentationApi;
