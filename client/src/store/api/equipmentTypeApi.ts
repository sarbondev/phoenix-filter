import { baseApi } from "./baseApi";
import type { ApiResponse, EquipmentType } from "@/shared/types";

export const equipmentTypeApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getEquipmentTypes: builder.query<EquipmentType[], void>({
      query: () => "/equipment-types",
      transformResponse: (res: ApiResponse<EquipmentType[]>) => res.data,
      providesTags: (result) =>
        result
          ? [
              ...result.map(({ id }) => ({ type: "EquipmentType" as const, id })),
              "EquipmentType",
            ]
          : ["EquipmentType"],
    }),
    getEquipmentTypeBySlug: builder.query<EquipmentType, string>({
      query: (slug) => `/equipment-types/slug/${slug}`,
      transformResponse: (res: ApiResponse<EquipmentType>) => res.data,
      providesTags: (_r, _e, slug) => [{ type: "EquipmentType", id: slug }],
    }),
  }),
});

export const {
  useGetEquipmentTypesQuery,
  useGetEquipmentTypeBySlugQuery,
} = equipmentTypeApi;
