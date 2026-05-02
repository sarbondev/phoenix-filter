import { FaqModel } from "./faq.schema";
import { IFaq } from "./faq.entity";

export class FaqRepository {
  async create(data: Partial<IFaq>): Promise<IFaq> {
    const doc = new FaqModel(data);
    return doc.save();
  }

  async findById(id: string): Promise<IFaq | null> {
    return FaqModel.findById(id).lean<IFaq>();
  }

  async findActive(): Promise<IFaq[]> {
    return FaqModel.find({ isActive: true })
      .sort({ sortOrder: 1, createdAt: -1 })
      .lean<IFaq[]>();
  }

  async findAll(): Promise<IFaq[]> {
    return FaqModel.find()
      .sort({ sortOrder: 1, createdAt: -1 })
      .lean<IFaq[]>();
  }

  async update(id: string, data: Partial<IFaq>): Promise<IFaq | null> {
    return FaqModel.findByIdAndUpdate(id, { $set: data }, { new: true }).lean<IFaq>();
  }

  async delete(id: string): Promise<void> {
    await FaqModel.findByIdAndDelete(id);
  }
}
