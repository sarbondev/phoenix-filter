import { Document, Types } from "mongoose";
import { TranslatedField } from "../../shared/types/common.types";

export interface IEquipmentType extends Document {
  _id: Types.ObjectId;
  name: TranslatedField;
  slug: string;
  image?: string;
  icon?: string;
  /** Uppercase brand tokens used to filter products by `applications.machineBrand`. */
  machineBrands: string[];
  isActive: boolean;
  sortOrder: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface EquipmentTypeResponse {
  id: string;
  name: TranslatedField;
  slug: string;
  image?: string;
  icon?: string;
  machineBrands: string[];
  isActive: boolean;
  sortOrder: number;
  createdAt: Date;
}

export const toEquipmentTypeResponse = (
  et: IEquipmentType,
): EquipmentTypeResponse => ({
  id: String(et._id),
  name: et.name,
  slug: et.slug,
  image: et.image,
  icon: et.icon,
  machineBrands: et.machineBrands ?? [],
  isActive: et.isActive,
  sortOrder: et.sortOrder,
  createdAt: et.createdAt,
});
