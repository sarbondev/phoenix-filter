import { Document, Types } from "mongoose";
import { TranslatedField } from "../../shared/types/common.types";

export interface IFaq extends Document {
  _id: Types.ObjectId;
  question: TranslatedField;
  answer: TranslatedField;
  isActive: boolean;
  sortOrder: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface FaqResponse {
  id: string;
  question: TranslatedField;
  answer: TranslatedField;
  isActive: boolean;
  sortOrder: number;
  createdAt: Date;
}

export const toFaqResponse = (faq: IFaq): FaqResponse => ({
  id: String(faq._id),
  question: faq.question,
  answer: faq.answer,
  isActive: faq.isActive,
  sortOrder: faq.sortOrder,
  createdAt: faq.createdAt,
});
