import { baseApi } from './baseApi';
import type {
  ApiResponse,
  EquipmentType,
  CreateEquipmentTypeRequest,
} from '@/lib/types';

export const equipmentTypeApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getEquipmentTypes: builder.query<EquipmentType[], void>({
      query: () => '/equipment-types/all',
      transformResponse: (res: ApiResponse<EquipmentType[]>) => res.data ?? [],
      providesTags: (result) =>
        result
          ? [
              ...result.map(({ id }) => ({ type: 'EquipmentType' as const, id })),
              'EquipmentType',
            ]
          : ['EquipmentType'],
    }),
    getEquipmentType: builder.query<EquipmentType, string>({
      query: (id) => `/equipment-types/${id}`,
      transformResponse: (res: ApiResponse<EquipmentType>) => res.data,
      providesTags: (_r, _e, id) => [{ type: 'EquipmentType', id }],
    }),
    createEquipmentType: builder.mutation<EquipmentType, CreateEquipmentTypeRequest>({
      query: (body) => ({ url: '/equipment-types', method: 'POST', body }),
      transformResponse: (res: ApiResponse<EquipmentType>) => res.data,
      invalidatesTags: ['EquipmentType'],
    }),
    updateEquipmentType: builder.mutation<
      EquipmentType,
      { id: string; data: Partial<CreateEquipmentTypeRequest> }
    >({
      query: ({ id, data }) => ({
        url: `/equipment-types/${id}`,
        method: 'PATCH',
        body: data,
      }),
      transformResponse: (res: ApiResponse<EquipmentType>) => res.data,
      invalidatesTags: (_r, _e, { id }) => [
        { type: 'EquipmentType', id },
        'EquipmentType',
      ],
    }),
    deleteEquipmentType: builder.mutation<void, string>({
      query: (id) => ({ url: `/equipment-types/${id}`, method: 'DELETE' }),
      invalidatesTags: ['EquipmentType'],
    }),
  }),
});

export const {
  useGetEquipmentTypesQuery,
  useGetEquipmentTypeQuery,
  useCreateEquipmentTypeMutation,
  useUpdateEquipmentTypeMutation,
  useDeleteEquipmentTypeMutation,
} = equipmentTypeApi;
