import { Document, Types } from 'mongoose';

export interface IPresentation extends Document {
  _id: Types.ObjectId;
  title: string;
  url: string;
  isActive: boolean;
  sortOrder: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface PresentationResponse {
  id: string;
  title: string;
  url: string;
  isActive: boolean;
  sortOrder: number;
  createdAt: Date;
}

export const toPresentationResponse = (p: IPresentation): PresentationResponse => ({
  id: String(p._id),
  title: p.title,
  url: p.url,
  isActive: p.isActive,
  sortOrder: p.sortOrder,
  createdAt: p.createdAt,
});
