import { Document, Types } from "mongoose";
import { TranslatedField } from "../../shared/types/common.types";

export interface IOffice {
  label: TranslatedField;
  address: TranslatedField;
  mapUrl?: string;
}

export interface ISocialLinks {
  facebook?: string;
  instagram?: string;
  telegram?: string;
  youtube?: string;
  whatsapp?: string;
}

export interface ISectionVisibility {
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

export interface ISiteSettings extends Document {
  _id: Types.ObjectId;
  brandName: string;
  brandAccent: string; // "FILTER" red label
  logo?: string;
  consultationCta: TranslatedField;
  consultationSubtitle: TranslatedField;
  phone: string;
  phoneSecondary?: string;
  email: string;
  emailSecondary?: string;
  workingHours: TranslatedField;
  offices: IOffice[];
  socials: ISocialLinks;
  sections: ISectionVisibility;
  copyright: TranslatedField;
  createdAt: Date;
  updatedAt: Date;
}

export interface SiteSettingsResponse {
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
  offices: IOffice[];
  socials: ISocialLinks;
  sections: ISectionVisibility;
  copyright: TranslatedField;
}

export const toSiteSettingsResponse = (
  s: ISiteSettings,
): SiteSettingsResponse => ({
  brandName: s.brandName,
  brandAccent: s.brandAccent,
  logo: s.logo,
  consultationCta: s.consultationCta,
  consultationSubtitle: s.consultationSubtitle,
  phone: s.phone,
  phoneSecondary: s.phoneSecondary,
  email: s.email,
  emailSecondary: s.emailSecondary,
  workingHours: s.workingHours,
  offices: s.offices,
  socials: s.socials,
  sections: s.sections,
  copyright: s.copyright,
});
