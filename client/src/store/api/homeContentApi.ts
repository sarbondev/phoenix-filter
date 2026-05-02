import { baseApi } from "./baseApi";
import type { ApiResponse, TranslatedField } from "@/shared/types";

export interface IconFeature {
  icon: string;
  title: TranslatedField;
  desc: TranslatedField;
}

export interface ProcessStep {
  number: string;
  icon: string;
  title: TranslatedField;
  desc: TranslatedField;
}

export interface AboutSectionContent {
  body: TranslatedField;
  image: string;
  features: IconFeature[];
}

export interface WhyUsSectionContent {
  title: TranslatedField;
  features: IconFeature[];
}

export interface ProcessSectionContent {
  title: TranslatedField;
  steps: ProcessStep[];
}

export interface IntegrationSectionContent {
  title: TranslatedField;
  body: TranslatedField;
  tiles: TranslatedField[];
}

export type CTABannerVariant = "blue-ink" | "ink";

export interface CTABanner {
  title: TranslatedField;
  subtitle: TranslatedField;
  points: TranslatedField[];
  ctaLabel: TranslatedField;
  ctaHref: string;
  variant: CTABannerVariant;
}

export interface CTABannersSectionContent {
  left: CTABanner;
  right: CTABanner;
}

export interface HomeContent {
  about: AboutSectionContent;
  whyUs: WhyUsSectionContent;
  process: ProcessSectionContent;
  integration: IntegrationSectionContent;
  ctaBanners: CTABannersSectionContent;
}

export const homeContentApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getHomeContent: builder.query<HomeContent, void>({
      query: () => "/home-content",
      transformResponse: (res: ApiResponse<HomeContent>) => res.data,
      providesTags: ["HomeContent"],
    }),
    updateHomeContent: builder.mutation<HomeContent, Partial<HomeContent>>({
      query: (body) => ({ url: "/home-content", method: "PATCH", body }),
      transformResponse: (res: ApiResponse<HomeContent>) => res.data,
      invalidatesTags: ["HomeContent"],
    }),
  }),
});

export const { useGetHomeContentQuery, useUpdateHomeContentMutation } =
  homeContentApi;
