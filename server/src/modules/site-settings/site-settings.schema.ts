import { Schema, model } from "mongoose";
import { z } from "zod";
import { ISiteSettings } from "./site-settings.entity";

const tfMongoSchema = new Schema(
  {
    uz: { type: String, default: "" },
    ru: { type: String, default: "" },
    en: { type: String, default: "" },
    kz: { type: String, default: "" },
  },
  { _id: false },
);

const officeMongoSchema = new Schema(
  {
    label: { type: tfMongoSchema, required: true },
    address: { type: tfMongoSchema, required: true },
    mapUrl: { type: String, default: "" },
  },
  { _id: false },
);

const socialsMongoSchema = new Schema(
  {
    facebook: { type: String, default: "" },
    instagram: { type: String, default: "" },
    telegram: { type: String, default: "" },
    youtube: { type: String, default: "" },
    whatsapp: { type: String, default: "" },
  },
  { _id: false },
);

const sectionsMongoSchema = new Schema(
  {
    hero: { type: Boolean, default: true },
    about: { type: Boolean, default: true },
    brands: { type: Boolean, default: true },
    industries: { type: Boolean, default: true },
    whyUs: { type: Boolean, default: true },
    categories: { type: Boolean, default: true },
    products: { type: Boolean, default: true },
    ctaBanners: { type: Boolean, default: true },
    process: { type: Boolean, default: true },
    certificates: { type: Boolean, default: true },
    integration: { type: Boolean, default: true },
    productRequest: { type: Boolean, default: true },
    contactFaq: { type: Boolean, default: true },
  },
  { _id: false },
);

const siteSettingsMongoSchema = new Schema<ISiteSettings>(
  {
    brandName: { type: String, default: "PRESTIGE" },
    brandAccent: { type: String, default: "FILTER" },
    logo: { type: String, default: "" },
    consultationCta: { type: tfMongoSchema, default: () => ({}) },
    consultationSubtitle: { type: tfMongoSchema, default: () => ({}) },
    phone: { type: String, default: "" },
    phoneSecondary: { type: String, default: "" },
    email: { type: String, default: "" },
    emailSecondary: { type: String, default: "" },
    workingHours: { type: tfMongoSchema, default: () => ({}) },
    offices: { type: [officeMongoSchema], default: [] },
    socials: { type: socialsMongoSchema, default: () => ({}) },
    sections: { type: sectionsMongoSchema, default: () => ({}) },
    copyright: { type: tfMongoSchema, default: () => ({}) },
  },
  { timestamps: true, versionKey: false },
);

export const SiteSettingsModel = model<ISiteSettings>(
  "SiteSettings",
  siteSettingsMongoSchema,
);

// ── Zod schemas ────────────────────────────────────────────
const tfZ = z.object({
  uz: z.string().default(""),
  ru: z.string().default(""),
  en: z.string().default(""),
  kz: z.string().default(""),
});

const officeZ = z.object({
  label: tfZ,
  address: tfZ,
  mapUrl: z.string().default(""),
});

const socialsZ = z.object({
  facebook: z.string().default(""),
  instagram: z.string().default(""),
  telegram: z.string().default(""),
  youtube: z.string().default(""),
  whatsapp: z.string().default(""),
});

const sectionsZ = z.object({
  hero: z.boolean().default(true),
  about: z.boolean().default(true),
  brands: z.boolean().default(true),
  industries: z.boolean().default(true),
  whyUs: z.boolean().default(true),
  categories: z.boolean().default(true),
  products: z.boolean().default(true),
  ctaBanners: z.boolean().default(true),
  process: z.boolean().default(true),
  certificates: z.boolean().default(true),
  integration: z.boolean().default(true),
  productRequest: z.boolean().default(true),
  contactFaq: z.boolean().default(true),
});

export const updateSiteSettingsSchema = z
  .object({
    brandName: z.string().max(60),
    brandAccent: z.string().max(60),
    logo: z.string().max(500),
    consultationCta: tfZ,
    consultationSubtitle: tfZ,
    phone: z.string().max(40),
    phoneSecondary: z.string().max(40),
    email: z.string().max(120),
    emailSecondary: z.string().max(120),
    workingHours: tfZ,
    offices: z.array(officeZ),
    socials: socialsZ,
    sections: sectionsZ,
    copyright: tfZ,
  })
  .partial();

export type UpdateSiteSettingsDto = z.infer<typeof updateSiteSettingsSchema>;
