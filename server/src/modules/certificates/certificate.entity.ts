import { Document, Types } from "mongoose";
import { TranslatedField } from "../../shared/types/common.types";

export interface ICertificate extends Document {
  _id: Types.ObjectId;
  caption: TranslatedField;
  image: string;
  isActive: boolean;
  sortOrder: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface CertificateResponse {
  id: string;
  caption: TranslatedField;
  image: string;
  isActive: boolean;
  sortOrder: number;
  createdAt: Date;
}

export const toCertificateResponse = (
  c: ICertificate,
): CertificateResponse => ({
  id: String(c._id),
  caption: c.caption,
  image: c.image,
  isActive: c.isActive,
  sortOrder: c.sortOrder,
  createdAt: c.createdAt,
});
