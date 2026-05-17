import { Schema, model } from "mongoose";
import { z } from "zod";
import { IDirection } from "./direction.entity";

const translatedFieldSchema = new Schema(
  {
    uz: { type: String, required: true },
    ru: { type: String, required: true },
    en: { type: String, required: true },
    kz: { type: String, required: true },
  },
  { _id: false },
);

const directionMongoSchema = new Schema<IDirection>(
  {
    name: { type: translatedFieldSchema, required: true },
    description: { type: translatedFieldSchema, required: true },
    slug: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    icon: { type: String },
    image: { type: String },
    isActive: { type: Boolean, default: true },
    sortOrder: { type: Number, default: 0 },
  },
  { timestamps: true, versionKey: false },
);

directionMongoSchema.index({ slug: 1 });
directionMongoSchema.index({ isActive: 1, sortOrder: 1 });

export const DirectionModel = model<IDirection>("Direction", directionMongoSchema);

export const createDirectionSchema = z.object({
  name: z.string().min(1).max(200),
  slug: z.string().max(200).optional(),
  icon: z.string().max(500).optional(),
  image: z.string().min(1).optional(),
  isActive: z.boolean().default(true),
  sortOrder: z.number().int().default(0),
});
export type CreateDirectionDto = z.infer<typeof createDirectionSchema>;

export const updateDirectionSchema = createDirectionSchema.partial();
export type UpdateDirectionDto = z.infer<typeof updateDirectionSchema>;
