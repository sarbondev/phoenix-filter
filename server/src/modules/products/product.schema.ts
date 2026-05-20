import { Schema, model } from "mongoose";
import { z } from "zod";
import { IProduct } from "./product.entity";

const translatedFieldSchema = new Schema(
  {
    uz: { type: String, required: true },
    ru: { type: String, required: true },
    en: { type: String, required: true },
    kz: { type: String, required: true },
  },
  { _id: false },
);

const specificationSchema = new Schema(
  {
    key: { type: translatedFieldSchema, required: true },
    value: { type: translatedFieldSchema, required: true },
  },
  { _id: false },
);

const crossReferenceSchema = new Schema(
  {
    partNumber: { type: String, required: true, trim: true },
    manufacturer: { type: String, required: true, trim: true },
  },
  { _id: false },
);

const applicationSchema = new Schema(
  {
    machineBrand: { type: String, required: true, trim: true, uppercase: true },
    model: { type: String, trim: true },
    engine: { type: String, trim: true },
    year: { type: String, trim: true },
  },
  { _id: false },
);

const dimensionsSchema = new Schema(
  {
    height: { type: Number },
    outerDiameter: { type: Number },
    innerDiameter: { type: Number },
    threadSize: { type: String, trim: true },
    inletDiameter: { type: Number },
    outletDiameter: { type: Number },
    gasketOuterDiameter: { type: Number },
    gasketInnerDiameter: { type: Number },
    weight: { type: Number },
  },
  { _id: false },
);

const productMongoSchema = new Schema<IProduct>(
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
    sku: {
      type: String,
      required: true,
      unique: true,
      uppercase: true,
      trim: true,
    },
    oem: { type: String, trim: true },
    oemNumbers: { type: [String], default: [] },
    crossReferences: { type: [crossReferenceSchema], default: [] },
    material: { type: String, trim: true },
    application: { type: String, trim: true },
    applications: { type: [applicationSchema], default: [] },
    dimensions: { type: dimensionsSchema },
    vehicleBrand: { type: String, trim: true, uppercase: true },
    price: { type: Number, required: true, min: 0 },
    priceOnRequest: { type: Boolean, default: false },
    discountPercent: { type: Number, min: 0, max: 100 },
    category: { type: Schema.Types.ObjectId, ref: "Category", required: true },
    images: [{ type: String }],
    specifications: [specificationSchema],
    tags: { type: translatedFieldSchema },
    stock: { type: Number, required: true, default: 0, min: 0 },
    stockStatus: {
      type: String,
      enum: ["in_stock", "under_order"],
      default: "in_stock",
    },
    datasheetUrl: { type: String, trim: true },
    isActive: { type: Boolean, default: true },
    isFeatured: { type: Boolean, default: false },
    views: { type: Number, default: 0 },
  },
  { timestamps: true, versionKey: false },
);

productMongoSchema.index({ slug: 1 });
productMongoSchema.index({ sku: 1 });
productMongoSchema.index({ category: 1 });
productMongoSchema.index({ isActive: 1, isFeatured: 1 });
productMongoSchema.index({ price: 1 });
productMongoSchema.index({ oem: 1 });
productMongoSchema.index({ oemNumbers: 1 });
productMongoSchema.index({ vehicleBrand: 1 });
productMongoSchema.index({ "applications.machineBrand": 1 });
productMongoSchema.index({ "crossReferences.partNumber": 1 });
productMongoSchema.index({ "crossReferences.manufacturer": 1 });
productMongoSchema.index({
  "name.uz": "text",
  "name.ru": "text",
  "name.en": "text",
  "name.kz": "text",
  "description.en": "text",
  sku: "text",
  oem: "text",
  oemNumbers: "text",
  application: "text",
  "crossReferences.partNumber": "text",
});

export const ProductModel = model<IProduct>("Product", productMongoSchema);

// Zod schemas
const specificationInputSchema = z.object({
  key: z.string().min(1),
  value: z.string().min(1),
});

const crossReferenceInputSchema = z.object({
  partNumber: z.string().min(1),
  manufacturer: z.string().min(1),
});

const applicationInputSchema = z.object({
  machineBrand: z.string().min(1),
  model: z.string().optional(),
  engine: z.string().optional(),
  year: z.string().optional(),
});

const dimensionsInputSchema = z.object({
  height: z.number().optional(),
  outerDiameter: z.number().optional(),
  innerDiameter: z.number().optional(),
  threadSize: z.string().optional(),
  inletDiameter: z.number().optional(),
  outletDiameter: z.number().optional(),
  gasketOuterDiameter: z.number().optional(),
  gasketInnerDiameter: z.number().optional(),
  weight: z.number().optional(),
});

export const createProductSchema = z.object({
  name: z.string().min(1).max(300),
  description: z.string().min(1).max(5000),
  slug: z.string().max(300).optional(),
  sku: z.string().max(50).optional(),
  oem: z.string().max(200).optional(),
  oemNumbers: z.array(z.string().min(1).max(200)).default([]),
  crossReferences: z.array(crossReferenceInputSchema).default([]),
  material: z.string().max(100).optional(),
  application: z.string().max(1000).optional(),
  applications: z.array(applicationInputSchema).default([]),
  dimensions: dimensionsInputSchema.optional(),
  vehicleBrand: z.string().max(100).optional(),
  price: z.number().min(0),
  priceOnRequest: z.boolean().default(false),
  discountPercent: z.number().min(0).max(100).optional(),
  category: z.string().min(1),
  images: z.array(z.string()).default([]),
  specifications: z.array(specificationInputSchema).default([]),
  tags: z.string().optional(),
  stock: z.number().int().min(0).default(0),
  stockStatus: z.enum(["in_stock", "under_order"]).default("in_stock"),
  datasheetUrl: z.string().max(500).optional(),
  isActive: z.boolean().default(true),
  isFeatured: z.boolean().default(false),
});
export type CreateProductDto = z.infer<typeof createProductSchema>;

export const updateProductSchema = createProductSchema.partial();
export type UpdateProductDto = z.infer<typeof updateProductSchema>;

// Strict — rejects unknown keys and operator-style nesting (e.g.
// ?category[$ne]=x), which Express's qs parser would otherwise turn into
// objects that could be passed to Mongoose. Strings only at this layer; the
// service coerces page/limit/prices and verifies ObjectIds.
export const productQuerySchema = z.object({
  page: z.string().regex(/^\d+$/).optional(),
  limit: z.string().regex(/^\d+$/).optional(),
  direction: z.string().regex(/^[a-f0-9]{24}$/).optional(),
  category: z.string().regex(/^[a-f0-9]{24}$/).optional(),
  categorySlug: z.string().max(120).optional(),
  search: z.string().max(200).optional(),
  minPrice: z.string().regex(/^\d+(\.\d+)?$/).optional(),
  maxPrice: z.string().regex(/^\d+(\.\d+)?$/).optional(),
  isFeatured: z.enum(["true", "false"]).optional(),
  vehicleBrand: z.string().max(100).optional(),
  manufacturer: z.string().max(100).optional(),
  machineBrand: z.string().max(100).optional(),
  sortBy: z.enum(["price", "createdAt", "views", "name"]).optional(),
  sortOrder: z.enum(["asc", "desc"]).optional(),
}).strict();
export type ProductQueryDto = z.infer<typeof productQuerySchema>;
