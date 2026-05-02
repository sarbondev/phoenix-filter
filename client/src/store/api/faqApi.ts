import { baseApi } from "./baseApi";
import type { ApiResponse, TranslatedField } from "@/shared/types";

export interface Faq {
  id: string;
  question: TranslatedField;
  answer: TranslatedField;
  isActive: boolean;
  sortOrder: number;
  createdAt: string;
}

export interface CreateFaqRequest {
  question: string;
  answer: string;
  isActive?: boolean;
  sortOrder?: number;
}

export const faqApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getFaqs: builder.query<Faq[], void>({
      query: () => "/faq",
      transformResponse: (res: ApiResponse<Faq[]>) => res.data ?? [],
      providesTags: (result) =>
        result
          ? [...result.map(({ id }) => ({ type: "Faq" as const, id })), "Faq"]
          : ["Faq"],
    }),
    getAllFaqs: builder.query<Faq[], void>({
      query: () => "/faq/all",
      transformResponse: (res: ApiResponse<Faq[]>) => res.data ?? [],
      providesTags: ["Faq"],
    }),
    createFaq: builder.mutation<Faq, CreateFaqRequest>({
      query: (body) => ({ url: "/faq", method: "POST", body }),
      transformResponse: (res: ApiResponse<Faq>) => res.data,
      invalidatesTags: ["Faq"],
    }),
    updateFaq: builder.mutation<
      Faq,
      { id: string; data: Partial<CreateFaqRequest> }
    >({
      query: ({ id, data }) => ({
        url: `/faq/${id}`,
        method: "PATCH",
        body: data,
      }),
      transformResponse: (res: ApiResponse<Faq>) => res.data,
      invalidatesTags: (_r, _e, { id }) => [{ type: "Faq", id }, "Faq"],
    }),
    deleteFaq: builder.mutation<void, string>({
      query: (id) => ({ url: `/faq/${id}`, method: "DELETE" }),
      invalidatesTags: ["Faq"],
    }),
  }),
});

export const {
  useGetFaqsQuery,
  useGetAllFaqsQuery,
  useCreateFaqMutation,
  useUpdateFaqMutation,
  useDeleteFaqMutation,
} = faqApi;
