import { Schema, model } from "mongoose";
import { z } from "zod";
import { IFaq } from "./faq.entity";

const tfMongo = new Schema(
  {
    uz: { type: String, required: true },
    ru: { type: String, required: true },
    en: { type: String, required: true },
    kz: { type: String, required: true },
  },
  { _id: false },
);

const faqMongoSchema = new Schema<IFaq>(
  {
    question: { type: tfMongo, required: true },
    answer: { type: tfMongo, required: true },
    isActive: { type: Boolean, default: true },
    sortOrder: { type: Number, default: 0 },
  },
  { timestamps: true, versionKey: false },
);

faqMongoSchema.index({ isActive: 1, sortOrder: 1 });

export const FaqModel = model<IFaq>("Faq", faqMongoSchema);

// ── Zod ────────────────────────────────────────────────────
export const createFaqSchema = z.object({
  question: z.string().min(1).max(500),
  answer: z.string().min(1).max(5000),
  isActive: z.boolean().default(true),
  sortOrder: z.number().int().default(0),
});
export type CreateFaqDto = z.infer<typeof createFaqSchema>;

export const updateFaqSchema = createFaqSchema.partial();
export type UpdateFaqDto = z.infer<typeof updateFaqSchema>;
