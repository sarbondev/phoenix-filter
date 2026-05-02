import { baseApi } from "./baseApi";
import type { ApiResponse, TranslatedField } from "@/shared/types";

export interface SiteOffice {
  label: TranslatedField;
  address: TranslatedField;
  mapUrl?: string;
}

export interface SiteSocials {
  facebook?: string;
  instagram?: string;
  telegram?: string;
  youtube?: string;
  whatsapp?: string;
}

export interface SiteSections {
  hero: boolean;
  about: boolean;
  brands: boolean;
  industries: boolean;
  whyUs: boolean;
  categories: boolean;
  products: boolean;
  ctaBanners: boolean;
  process: boolean;
  certificates: boolean;
  integration: boolean;
  productRequest: boolean;
  contactFaq: boolean;
}

export interface SiteSettings {
  brandName: string;
  brandAccent: string;
  logo?: string;
  consultationCta: TranslatedField;
  consultationSubtitle: TranslatedField;
  phone: string;
  phoneSecondary?: string;
  email: string;
  emailSecondary?: string;
  workingHours: TranslatedField;
  offices: SiteOffice[];
  socials: SiteSocials;
  sections: SiteSections;
  copyright: TranslatedField;
}

export const siteSettingsApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getSiteSettings: builder.query<SiteSettings, void>({
      query: () => "/site-settings",
      transformResponse: (res: ApiResponse<SiteSettings>) => res.data,
      providesTags: ["SiteSettings"],
    }),
    updateSiteSettings: builder.mutation<SiteSettings, Partial<SiteSettings>>({
      query: (body) => ({ url: "/site-settings", method: "PATCH", body }),
      transformResponse: (res: ApiResponse<SiteSettings>) => res.data,
      invalidatesTags: ["SiteSettings"],
    }),
  }),
});

export const { useGetSiteSettingsQuery, useUpdateSiteSettingsMutation } =
  siteSettingsApi;
