import { Schema, model } from "mongoose";
import { z } from "zod";
import { IHeroContent } from "./hero-content.entity";

const tfMongo = new Schema(
  {
    uz: { type: String, default: "" },
    ru: { type: String, default: "" },
    en: { type: String, default: "" },
    kz: { type: String, default: "" },
  },
  { _id: false },
);

const mainCardMongo = new Schema(
  {
    title: { type: tfMongo, default: () => ({}) },
    subtitle: { type: tfMongo, default: () => ({}) },
    features: { type: [tfMongo], default: [] },
    ctaLabel: { type: tfMongo, default: () => ({}) },
    ctaHref: { type: String, default: "/products" },
    image: { type: String, default: "" },
  },
  { _id: false },
);

const smallCardMongo = new Schema(
  {
    title: { type: tfMongo, default: () => ({}) },
    subtitle: { type: tfMongo, default: () => ({}) },
    description: { type: tfMongo, default: () => ({}) },
    ctaLabel: { type: tfMongo, default: () => ({}) },
    ctaHref: { type: String, default: "/products" },
    image: { type: String, default: "" },
    variant: { type: String, enum: ["blue", "ink"], default: "blue" },
  },
  { _id: false },
);

const heroContentMongoSchema = new Schema<IHeroContent>(
  {
    mainCard: { type: mainCardMongo, default: () => ({}) },
    smallCard1: { type: smallCardMongo, default: () => ({}) },
    smallCard2: { type: smallCardMongo, default: () => ({}) },
  },
  { timestamps: true, versionKey: false },
);

export const HeroContentModel = model<IHeroContent>(
  "HeroContent",
  heroContentMongoSchema,
);

// ── Zod ────────────────────────────────────────────────────
const tfZ = z.object({
  uz: z.string().default(""),
  ru: z.string().default(""),
  en: z.string().default(""),
  kz: z.string().default(""),
});

const mainCardZ = z.object({
  title: tfZ,
  subtitle: tfZ,
  features: z.array(tfZ),
  ctaLabel: tfZ,
  ctaHref: z.string().max(500),
  image: z.string().max(500),
});

const smallCardZ = z.object({
  title: tfZ,
  subtitle: tfZ,
  description: tfZ,
  ctaLabel: tfZ,
  ctaHref: z.string().max(500),
  image: z.string().max(500),
  variant: z.enum(["blue", "ink"]),
});

export const updateHeroContentSchema = z
  .object({
    mainCard: mainCardZ,
    smallCard1: smallCardZ,
    smallCard2: smallCardZ,
  })
  .partial();

export type UpdateHeroContentDto = z.infer<typeof updateHeroContentSchema>;
