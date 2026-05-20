import { Schema, model } from "mongoose";
import { z } from "zod";
import { IEquipmentType } from "./equipment-type.entity";

const translatedFieldSchema = new Schema(
  {
    uz: { type: String, required: true },
    ru: { type: String, required: true },
    en: { type: String, required: true },
    kz: { type: String, required: true },
  },
  { _id: false },
);

const equipmentTypeMongoSchema = new Schema<IEquipmentType>(
  {
    name: { type: translatedFieldSchema, required: true },
    slug: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    image: { type: String, trim: true },
    icon: { type: String, trim: true },
    machineBrands: { type: [String], default: [] },
    isActive: { type: Boolean, default: true },
    sortOrder: { type: Number, default: 0 },
  },
  { timestamps: true, versionKey: false },
);

equipmentTypeMongoSchema.index({ slug: 1 });
equipmentTypeMongoSchema.index({ isActive: 1, sortOrder: 1 });

export const EquipmentTypeModel = model<IEquipmentType>(
  "EquipmentType",
  equipmentTypeMongoSchema,
);

export const createEquipmentTypeSchema = z.object({
  name: z.string().min(1).max(200),
  slug: z.string().max(200).optional(),
  image: z.string().max(500).optional(),
  icon: z.string().max(500).optional(),
  machineBrands: z.array(z.string().min(1).max(100)).default([]),
  isActive: z.boolean().default(true),
  sortOrder: z.number().int().default(0),
});
export type CreateEquipmentTypeDto = z.infer<typeof createEquipmentTypeSchema>;

export const updateEquipmentTypeSchema = createEquipmentTypeSchema.partial();
export type UpdateEquipmentTypeDto = z.infer<typeof updateEquipmentTypeSchema>;
