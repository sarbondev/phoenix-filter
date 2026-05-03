import { Document, Types } from "mongoose";
import { TranslatedField } from "../../shared/types/common.types";

export interface ISpecification {
  key: TranslatedField;
  value: TranslatedField;
}

export interface ICrossReference {
  partNumber: string;
  manufacturer: string;
}

export interface IDimensions {
  height?: number;
  outerDiameter?: number;
  innerDiameter?: number;
  threadSize?: string;
  inletDiameter?: number;
  outletDiameter?: number;
}

export interface IProduct extends Document {
  _id: Types.ObjectId;
  name: TranslatedField;
  description: TranslatedField;
  slug: string;
  sku: string;
  oem?: string;
  crossReferences: ICrossReference[];
  material?: string;
  application?: string;
  dimensions?: IDimensions;
  vehicleBrand?: string;
  price: number;
  discountPercent?: number;
  category: Types.ObjectId;
  images: string[];
  specifications: ISpecification[];
  tags: TranslatedField;
  stock: number;
  isActive: boolean;
  isFeatured: boolean;
  views: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface ProductResponse {
  id: string;
  name: TranslatedField;
  description: TranslatedField;
  slug: string;
  sku: string;
  oem?: string;
  crossReferences: ICrossReference[];
  material?: string;
  application?: string;
  dimensions?: IDimensions;
  vehicleBrand?: string;
  price: number;
  discountPercent?: number;
  discountPrice?: number;
  category: string | Record<string, unknown>;
  images: string[];
  specifications: ISpecification[];
  tags: TranslatedField;
  stock: number;
  isActive: boolean;
  isFeatured: boolean;
  views: number;
  createdAt: Date;
}

export const toProductResponse = (product: IProduct): ProductResponse => ({
  id: String(product._id),
  name: product.name,
  description: product.description,
  slug: product.slug,
  sku: product.sku,
  oem: product.oem,
  crossReferences: product.crossReferences ?? [],
  material: product.material,
  application: product.application,
  dimensions: product.dimensions,
  vehicleBrand: product.vehicleBrand,
  price: product.price,
  discountPercent: product.discountPercent,
  discountPrice: product.discountPercent
    ? Math.round(product.price * (1 - product.discountPercent / 100))
    : undefined,
  category:
    product.category &&
    typeof product.category === "object" &&
    "name" in product.category
      ? (product.category as unknown as Record<string, unknown>)
      : String(product.category),
  images: product.images,
  specifications: product.specifications,
  tags: product.tags,
  stock: product.stock,
  isActive: product.isActive,
  isFeatured: product.isFeatured,
  views: product.views,
  createdAt: product.createdAt,
});
