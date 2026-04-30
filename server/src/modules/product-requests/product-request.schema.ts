import { Schema, model } from 'mongoose';
import { z } from 'zod';
import { IProductRequest, ProductRequestStatus } from './product-request.entity';

const STATUSES: ProductRequestStatus[] = ['NEW', 'CONTACTED', 'RESOLVED', 'REJECTED'];

const productRequestMongoSchema = new Schema<IProductRequest>(
  {
    productName: { type: String, required: true, trim: true, maxlength: 300 },
    name: { type: String, trim: true, maxlength: 200 },
    phoneNumber: { type: String, required: true, trim: true, maxlength: 30 },
    note: { type: String, trim: true, maxlength: 2000 },
    searchQuery: { type: String, trim: true, maxlength: 300 },
    locale: { type: String, trim: true, maxlength: 8 },
    status: {
      type: String,
      enum: STATUSES,
      default: 'NEW',
      index: true,
    },
  },
  { timestamps: true, versionKey: false },
);

productRequestMongoSchema.index({ createdAt: -1 });
productRequestMongoSchema.index({ status: 1, createdAt: -1 });

export const ProductRequestModel = model<IProductRequest>(
  'ProductRequest',
  productRequestMongoSchema,
);

export const createProductRequestSchema = z.object({
  productName: z.string().min(1).max(300),
  name: z.string().min(1).max(200).optional(),
  phoneNumber: z.string().min(5).max(30),
  note: z.string().max(2000).optional(),
  searchQuery: z.string().max(300).optional(),
  locale: z.string().max(8).optional(),
});
export type CreateProductRequestDto = z.infer<typeof createProductRequestSchema>;

export const updateProductRequestStatusSchema = z.object({
  status: z.enum(['NEW', 'CONTACTED', 'RESOLVED', 'REJECTED']),
});
export type UpdateProductRequestStatusDto = z.infer<
  typeof updateProductRequestStatusSchema
>;
