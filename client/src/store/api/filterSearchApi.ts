import { baseApi } from "./baseApi";
import type {
  ApiResponse,
  PaginatedApiResponse,
  Product,
} from "@/shared/types";

export interface OemSearchPayload {
  query: string;
  page?: number;
  limit?: number;
}

export interface AnalogSearchPayload {
  query: string;
  manufacturer?: string;
  page?: number;
  limit?: number;
}

export interface SizeSearchPayload {
  height?: number;
  outerDiameter?: number;
  innerDiameter?: number;
  threadSize?: string;
  tolerance?: number;
  page?: number;
  limit?: number;
}

export interface MachineSearchPayload {
  machineBrand: string;
  model?: string;
  engine?: string;
  year?: string;
  page?: number;
  limit?: number;
}

export interface PhotoSearchPayload {
  phoneNumber: string;
  name?: string;
  note?: string;
  imageUrl: string;
  locale?: string;
}

export const filterSearchApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    searchByOem: builder.mutation<PaginatedApiResponse<Product>, OemSearchPayload>({
      query: (body) => ({ url: "/filter-search/oem", method: "POST", body }),
    }),
    searchByAnalog: builder.mutation<
      PaginatedApiResponse<Product>,
      AnalogSearchPayload
    >({
      query: (body) => ({ url: "/filter-search/analog", method: "POST", body }),
    }),
    searchBySize: builder.mutation<
      PaginatedApiResponse<Product>,
      SizeSearchPayload
    >({
      query: (body) => ({ url: "/filter-search/size", method: "POST", body }),
    }),
    searchByMachine: builder.mutation<
      PaginatedApiResponse<Product>,
      MachineSearchPayload
    >({
      query: (body) => ({ url: "/filter-search/machine", method: "POST", body }),
    }),
    searchByPhoto: builder.mutation<
      ApiResponse<{ requestId: string }>,
      PhotoSearchPayload
    >({
      query: (body) => ({ url: "/filter-search/photo", method: "POST", body }),
      invalidatesTags: ["ProductRequest"],
    }),
  }),
});

export const {
  useSearchByOemMutation,
  useSearchByAnalogMutation,
  useSearchBySizeMutation,
  useSearchByMachineMutation,
  useSearchByPhotoMutation,
} = filterSearchApi;
