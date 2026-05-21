import { Document, Types } from "mongoose";
import { TranslatedField } from "../../shared/types/common.types";

export interface IIconFeature {
  icon: string; // lucide-react identifier (e.g. "ShieldCheck")
  title: TranslatedField;
  desc: TranslatedField;
}

export interface IProcessStep {
  number: string; // "01" "02" "03" "04"
  icon: string;
  title: TranslatedField;
  desc: TranslatedField;
}

export interface IAboutSection {
  body: TranslatedField;
  image: string;
  features: IIconFeature[];
}

export interface IWhyUsSection {
  title: TranslatedField;
  features: IIconFeature[];
}

export interface IProcessSection {
  title: TranslatedField;
  steps: IProcessStep[];
}

export interface IIntegrationSection {
  title: TranslatedField;
  body: TranslatedField;
  tiles: TranslatedField[];
}

export type CTABannerVariant = "blue-ink" | "ink";

export interface ICTABanner {
  title: TranslatedField;
  subtitle: TranslatedField;
  points: TranslatedField[];
  ctaLabel: TranslatedField;
  ctaHref: string;
  variant: CTABannerVariant;
}

export interface ICTABannersSection {
  left: ICTABanner;
  right: ICTABanner;
}

/** A single headline stat shown on a marketing page (e.g. "250+" / "Projects"). */
export interface IPageStat {
  value: string;
  label: TranslatedField;
}

/**
 * Editable "above-the-fold" content for a standalone marketing page
 * (About, Services, Engineering, Projects, Industries). The deep structured
 * lists on each page (project tables, industry matrices, service bullets)
 * stay in code — only the hero copy, intro, banner image and stats are CMS-driven.
 */
export interface IMarketingPage {
  title: TranslatedField;
  subtitle: TranslatedField;
  intro: TranslatedField;
  image: string;
  stats: IPageStat[];
}

export interface IMarketingPages {
  about: IMarketingPage;
  services: IMarketingPage;
  engineering: IMarketingPage;
  projects: IMarketingPage;
  industries: IMarketingPage;
}

export interface IHomeContent extends Document {
  _id: Types.ObjectId;
  about: IAboutSection;
  whyUs: IWhyUsSection;
  process: IProcessSection;
  integration: IIntegrationSection;
  ctaBanners: ICTABannersSection;
  pages: IMarketingPages;
  createdAt: Date;
  updatedAt: Date;
}

export interface HomeContentResponse {
  about: IAboutSection;
  whyUs: IWhyUsSection;
  process: IProcessSection;
  integration: IIntegrationSection;
  ctaBanners: ICTABannersSection;
  pages: IMarketingPages;
}

export const toHomeContentResponse = (h: IHomeContent): HomeContentResponse => ({
  about: h.about,
  whyUs: h.whyUs,
  process: h.process,
  integration: h.integration,
  ctaBanners: h.ctaBanners,
  pages: h.pages,
});
