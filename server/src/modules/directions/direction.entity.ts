import { Document, Types } from "mongoose";
import { TranslatedField } from "../../shared/types/common.types";

export interface IDirection extends Document {
  _id: Types.ObjectId;
  name: TranslatedField;
  description: TranslatedField;
  slug: string;
  icon?: string;
  image?: string;
  isActive: boolean;
  sortOrder: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface DirectionResponse {
  id: string;
  name: TranslatedField;
  description: TranslatedField;
  slug: string;
  icon?: string;
  image?: string;
  isActive: boolean;
  sortOrder: number;
  createdAt: Date;
}

export const toDirectionResponse = (d: IDirection): DirectionResponse => ({
  id: String(d._id),
  name: d.name,
  description: d.description,
  slug: d.slug,
  icon: d.icon,
  image: d.image,
  isActive: d.isActive,
  sortOrder: d.sortOrder,
  createdAt: d.createdAt,
});
