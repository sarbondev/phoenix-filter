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

export interface IApplication {
  machineBrand: string;
  model?: string;
  engine?: string;
  year?: string;
}

export interface IDimensions {
  height?: number;
  outerDiameter?: number;
  innerDiameter?: number;
  threadSize?: string;
  inletDiameter?: number;
  outletDiameter?: number;
  gasketOuterDiameter?: number;
  gasketInnerDiameter?: number;
  weight?: number;
}

export type StockStatus = "in_stock" | "under_order";

export interface IProduct extends Document {
  _id: Types.ObjectId;
  name: TranslatedField;
  description: TranslatedField;
  slug: string;
  sku: string;
  oem?: string;
  oemNumbers: string[];
  crossReferences: ICrossReference[];
  material?: string;
  application?: string;
  applications: IApplication[];
  dimensions?: IDimensions;
  vehicleBrand?: string;
  price: number;
  priceOnRequest: boolean;
  discountPercent?: number;
  category: Types.ObjectId;
  images: string[];
  specifications: ISpecification[];
  tags: TranslatedField;
  stock: number;
  stockStatus: StockStatus;
  datasheetUrl?: string;
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
  oemNumbers: string[];
  crossReferences: ICrossReference[];
  material?: string;
  application?: string;
  applications: IApplication[];
  dimensions?: IDimensions;
  vehicleBrand?: string;
  price: number;
  priceOnRequest: boolean;
  discountPercent?: number;
  discountPrice?: number;
  category: string | Record<string, unknown>;
  images: string[];
  specifications: ISpecification[];
  tags: TranslatedField;
  stock: number;
  stockStatus: StockStatus;
  datasheetUrl?: string;
  isActive: boolean;
  isFeatured: boolean;
  views: number;
  createdAt: Date;
}

export const toProductResponse = (product: IProduct): ProductResponse => {
  const oemNumbers = product.oemNumbers ?? [];
  // If legacy `oem` field is populated but oemNumbers is empty, surface it
  // through both so consumers see a consistent list.
  const effectiveOemNumbers =
    oemNumbers.length === 0 && product.oem ? [product.oem] : oemNumbers;

  return {
    id: String(product._id),
    name: product.name,
    description: product.description,
    slug: product.slug,
    sku: product.sku,
    oem: product.oem,
    oemNumbers: effectiveOemNumbers,
    crossReferences: product.crossReferences ?? [],
    material: product.material,
    application: product.application,
    applications: product.applications ?? [],
    dimensions: product.dimensions,
    vehicleBrand: product.vehicleBrand,
    price: product.price,
    priceOnRequest: product.priceOnRequest ?? false,
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
    stockStatus: product.stockStatus ?? (product.stock > 0 ? "in_stock" : "under_order"),
    datasheetUrl: product.datasheetUrl,
    isActive: product.isActive,
    isFeatured: product.isFeatured,
    views: product.views,
    createdAt: product.createdAt,
  };
};
