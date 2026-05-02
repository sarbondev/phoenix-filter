import { baseApi } from "./baseApi";
import type { ApiResponse, TranslatedField } from "@/shared/types";

export interface Certificate {
  id: string;
  caption: TranslatedField;
  image: string;
  isActive: boolean;
  sortOrder: number;
  createdAt: string;
}

export interface CreateCertificateRequest {
  caption: string;
  image: string;
  isActive?: boolean;
  sortOrder?: number;
}

export const certificateApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getCertificates: builder.query<Certificate[], void>({
      query: () => "/certificates",
      transformResponse: (res: ApiResponse<Certificate[]>) => res.data ?? [],
      providesTags: (result) =>
        result
          ? [
              ...result.map(({ id }) => ({
                type: "Certificate" as const,
                id,
              })),
              "Certificate",
            ]
          : ["Certificate"],
    }),
    getAllCertificates: builder.query<Certificate[], void>({
      query: () => "/certificates/all",
      transformResponse: (res: ApiResponse<Certificate[]>) => res.data ?? [],
      providesTags: ["Certificate"],
    }),
    createCertificate: builder.mutation<Certificate, CreateCertificateRequest>({
      query: (body) => ({ url: "/certificates", method: "POST", body }),
      transformResponse: (res: ApiResponse<Certificate>) => res.data,
      invalidatesTags: ["Certificate"],
    }),
    updateCertificate: builder.mutation<
      Certificate,
      { id: string; data: Partial<CreateCertificateRequest> }
    >({
      query: ({ id, data }) => ({
        url: `/certificates/${id}`,
        method: "PATCH",
        body: data,
      }),
      transformResponse: (res: ApiResponse<Certificate>) => res.data,
      invalidatesTags: (_r, _e, { id }) => [
        { type: "Certificate", id },
        "Certificate",
      ],
    }),
    deleteCertificate: builder.mutation<void, string>({
      query: (id) => ({ url: `/certificates/${id}`, method: "DELETE" }),
      invalidatesTags: ["Certificate"],
    }),
  }),
});

export const {
  useGetCertificatesQuery,
  useGetAllCertificatesQuery,
  useCreateCertificateMutation,
  useUpdateCertificateMutation,
  useDeleteCertificateMutation,
} = certificateApi;
