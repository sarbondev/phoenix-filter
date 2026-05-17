import { Document, Types } from 'mongoose';
import { TranslatedField } from '../../shared/types/common.types';

export interface ICategory extends Document {
  _id: Types.ObjectId;
  name: TranslatedField;
  description: TranslatedField;
  slug: string;
  image?: string;
  direction: Types.ObjectId;
  isActive: boolean;
  sortOrder: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface CategoryResponse {
  id: string;
  name: TranslatedField;
  description: TranslatedField;
  slug: string;
  image?: string;
  direction: string;
  isActive: boolean;
  sortOrder: number;
  createdAt: Date;
}

export const toCategoryResponse = (cat: ICategory): CategoryResponse => ({
  id: String(cat._id),
  name: cat.name,
  description: cat.description,
  slug: cat.slug,
  image: cat.image,
  direction: String(cat.direction),
  isActive: cat.isActive,
  sortOrder: cat.sortOrder,
  createdAt: cat.createdAt,
});
