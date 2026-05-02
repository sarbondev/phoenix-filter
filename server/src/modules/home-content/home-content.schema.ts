import { Schema, model } from "mongoose";
import { z } from "zod";
import { IHomeContent } from "./home-content.entity";

const tfMongo = new Schema(
  {
    uz: { type: String, default: "" },
    ru: { type: String, default: "" },
    en: { type: String, default: "" },
    kz: { type: String, default: "" },
  },
  { _id: false },
);

const iconFeatureMongo = new Schema(
  {
    icon: { type: String, default: "" },
    title: { type: tfMongo, default: () => ({}) },
    desc: { type: tfMongo, default: () => ({}) },
  },
  { _id: false },
);

const processStepMongo = new Schema(
  {
    number: { type: String, default: "01" },
    icon: { type: String, default: "" },
    title: { type: tfMongo, default: () => ({}) },
    desc: { type: tfMongo, default: () => ({}) },
  },
  { _id: false },
);

const ctaBannerMongo = new Schema(
  {
    title: { type: tfMongo, default: () => ({}) },
    subtitle: { type: tfMongo, default: () => ({}) },
    points: { type: [tfMongo], default: [] },
    ctaLabel: { type: tfMongo, default: () => ({}) },
    ctaHref: { type: String, default: "/products" },
    variant: { type: String, enum: ["blue-ink", "ink"], default: "blue-ink" },
  },
  { _id: false },
);

const homeContentMongoSchema = new Schema<IHomeContent>(
  {
    about: {
      type: new Schema(
        {
          body: { type: tfMongo, default: () => ({}) },
          image: { type: String, default: "" },
          features: { type: [iconFeatureMongo], default: [] },
        },
        { _id: false },
      ),
      default: () => ({}),
    },
    whyUs: {
      type: new Schema(
        {
          title: { type: tfMongo, default: () => ({}) },
          features: { type: [iconFeatureMongo], default: [] },
        },
        { _id: false },
      ),
      default: () => ({}),
    },
    process: {
      type: new Schema(
        {
          title: { type: tfMongo, default: () => ({}) },
          steps: { type: [processStepMongo], default: [] },
        },
        { _id: false },
      ),
      default: () => ({}),
    },
    integration: {
      type: new Schema(
        {
          title: { type: tfMongo, default: () => ({}) },
          body: { type: tfMongo, default: () => ({}) },
          tiles: { type: [tfMongo], default: [] },
        },
        { _id: false },
      ),
      default: () => ({}),
    },
    ctaBanners: {
      type: new Schema(
        {
          left: { type: ctaBannerMongo, default: () => ({}) },
          right: { type: ctaBannerMongo, default: () => ({}) },
        },
        { _id: false },
      ),
      default: () => ({}),
    },
  },
  { timestamps: true, versionKey: false },
);

export const HomeContentModel = model<IHomeContent>(
  "HomeContent",
  homeContentMongoSchema,
);

// ── Zod ────────────────────────────────────────────────────
const tfZ = z.object({
  uz: z.string().default(""),
  ru: z.string().default(""),
  en: z.string().default(""),
  kz: z.string().default(""),
});

const iconFeatureZ = z.object({
  icon: z.string().max(60),
  title: tfZ,
  desc: tfZ,
});

const processStepZ = z.object({
  number: z.string().max(8),
  icon: z.string().max(60),
  title: tfZ,
  desc: tfZ,
});

const ctaBannerZ = z.object({
  title: tfZ,
  subtitle: tfZ,
  points: z.array(tfZ),
  ctaLabel: tfZ,
  ctaHref: z.string().max(500),
  variant: z.enum(["blue-ink", "ink"]),
});

export const updateHomeContentSchema = z
  .object({
    about: z.object({
      body: tfZ,
      image: z.string().max(500),
      features: z.array(iconFeatureZ),
    }),
    whyUs: z.object({
      title: tfZ,
      features: z.array(iconFeatureZ),
    }),
    process: z.object({
      title: tfZ,
      steps: z.array(processStepZ),
    }),
    integration: z.object({
      title: tfZ,
      body: tfZ,
      tiles: z.array(tfZ),
    }),
    ctaBanners: z.object({
      left: ctaBannerZ,
      right: ctaBannerZ,
    }),
  })
  .partial();

export type UpdateHomeContentDto = z.infer<typeof updateHomeContentSchema>;
