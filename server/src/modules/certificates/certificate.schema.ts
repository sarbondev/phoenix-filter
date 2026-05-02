import { Schema, model } from "mongoose";
import { z } from "zod";
import { ICertificate } from "./certificate.entity";

const tfMongo = new Schema(
  {
    uz: { type: String, default: "" },
    ru: { type: String, default: "" },
    en: { type: String, default: "" },
    kz: { type: String, default: "" },
  },
  { _id: false },
);

const certMongoSchema = new Schema<ICertificate>(
  {
    caption: { type: tfMongo, default: () => ({}) },
    image: { type: String, required: true },
    isActive: { type: Boolean, default: true },
    sortOrder: { type: Number, default: 0 },
  },
  { timestamps: true, versionKey: false },
);

certMongoSchema.index({ isActive: 1, sortOrder: 1 });

export const CertificateModel = model<ICertificate>(
  "Certificate",
  certMongoSchema,
);

const tfZ = z.object({
  uz: z.string().default(""),
  ru: z.string().default(""),
  en: z.string().default(""),
  kz: z.string().default(""),
});

export const createCertificateSchema = z.object({
  caption: z.union([z.string(), tfZ]),
  image: z.string().min(1),
  isActive: z.boolean().default(true),
  sortOrder: z.number().int().default(0),
});
export type CreateCertificateDto = z.infer<typeof createCertificateSchema>;

export const updateCertificateSchema = createCertificateSchema.partial();
export type UpdateCertificateDto = z.infer<typeof updateCertificateSchema>;
