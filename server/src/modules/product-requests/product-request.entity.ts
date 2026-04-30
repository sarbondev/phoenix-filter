import { Document, Types } from 'mongoose';

export type ProductRequestStatus = 'NEW' | 'CONTACTED' | 'RESOLVED' | 'REJECTED';

export interface IProductRequest extends Document {
  _id: Types.ObjectId;
  productName: string;
  name?: string;
  phoneNumber: string;
  note?: string;
  searchQuery?: string;
  locale?: string;
  status: ProductRequestStatus;
  createdAt: Date;
  updatedAt: Date;
}

export interface ProductRequestResponse {
  id: string;
  productName: string;
  name?: string;
  phoneNumber: string;
  note?: string;
  searchQuery?: string;
  locale?: string;
  status: ProductRequestStatus;
  createdAt: Date;
  updatedAt: Date;
}

export const toProductRequestResponse = (
  req: IProductRequest,
): ProductRequestResponse => ({
  id: String(req._id),
  productName: req.productName,
  name: req.name,
  phoneNumber: req.phoneNumber,
  note: req.note,
  searchQuery: req.searchQuery,
  locale: req.locale,
  status: req.status,
  createdAt: req.createdAt,
  updatedAt: req.updatedAt,
});
