import { baseApi } from "./baseApi";
import type { ApiResponse, TranslatedField } from "@/shared/types";

export type HeroSmallCardVariant = "blue" | "ink";

export interface HeroSmallCard {
  title: TranslatedField;
  subtitle: TranslatedField;
  description: TranslatedField;
  ctaLabel: TranslatedField;
  ctaHref: string;
  image: string;
  variant: HeroSmallCardVariant;
}

export interface HeroMainCard {
  title: TranslatedField;
  subtitle: TranslatedField;
  features: TranslatedField[];
  ctaLabel: TranslatedField;
  ctaHref: string;
  image: string;
}

export interface HeroContent {
  mainCard: HeroMainCard;
  smallCard1: HeroSmallCard;
  smallCard2: HeroSmallCard;
}

export const heroContentApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getHeroContent: builder.query<HeroContent, void>({
      query: () => "/hero-content",
      transformResponse: (res: ApiResponse<HeroContent>) => res.data,
      providesTags: ["HeroContent"],
    }),
    updateHeroContent: builder.mutation<HeroContent, Partial<HeroContent>>({
      query: (body) => ({ url: "/hero-content", method: "PATCH", body }),
      transformResponse: (res: ApiResponse<HeroContent>) => res.data,
      invalidatesTags: ["HeroContent"],
    }),
  }),
});

export const { useGetHeroContentQuery, useUpdateHeroContentMutation } =
  heroContentApi;
