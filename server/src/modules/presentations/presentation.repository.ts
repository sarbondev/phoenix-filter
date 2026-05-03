import { PresentationModel } from './presentation.schema';
import { IPresentation } from './presentation.entity';

export class PresentationRepository {
  async create(data: Partial<IPresentation>): Promise<IPresentation> {
    const presentation = new PresentationModel(data);
    return presentation.save();
  }

  async findById(id: string): Promise<IPresentation | null> {
    return PresentationModel.findById(id).lean<IPresentation>();
  }

  async findActive(): Promise<IPresentation[]> {
    return PresentationModel.find({ isActive: true })
      .sort({ sortOrder: 1, createdAt: -1 })
      .lean<IPresentation[]>();
  }

  async findAll(): Promise<IPresentation[]> {
    return PresentationModel.find()
      .sort({ sortOrder: 1, createdAt: -1 })
      .lean<IPresentation[]>();
  }

  async update(id: string, data: Partial<IPresentation>): Promise<IPresentation | null> {
    return PresentationModel.findByIdAndUpdate(id, { $set: data }, { new: true }).lean<IPresentation>();
  }

  async delete(id: string): Promise<void> {
    await PresentationModel.findByIdAndDelete(id);
  }
}
