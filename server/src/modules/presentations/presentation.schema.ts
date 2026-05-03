import { Schema, model } from 'mongoose';
import { z } from 'zod';
import { IPresentation } from './presentation.entity';

const presentationMongoSchema = new Schema<IPresentation>(
  {
    title: { type: String, required: true, trim: true },
    url: { type: String, required: true, trim: true },
    isActive: { type: Boolean, default: true },
    sortOrder: { type: Number, default: 0 },
  },
  { timestamps: true, versionKey: false },
);

presentationMongoSchema.index({ isActive: 1, sortOrder: 1 });

export const PresentationModel = model<IPresentation>('Presentation', presentationMongoSchema);

export const createPresentationSchema = z.object({
  title: z.string().min(1).max(200),
  url: z.string().url(),
  isActive: z.boolean().default(true),
  sortOrder: z.number().int().default(0),
});
export type CreatePresentationDto = z.infer<typeof createPresentationSchema>;

export const updatePresentationSchema = createPresentationSchema.partial();
export type UpdatePresentationDto = z.infer<typeof updatePresentationSchema>;
