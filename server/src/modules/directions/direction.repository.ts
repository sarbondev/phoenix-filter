import { DirectionModel } from "./direction.schema";
import { IDirection } from "./direction.entity";

export class DirectionRepository {
  async create(data: Partial<IDirection>): Promise<IDirection> {
    const direction = new DirectionModel(data);
    return direction.save();
  }

  async findById(id: string): Promise<IDirection | null> {
    return DirectionModel.findById(id).lean<IDirection>();
  }

  async findBySlug(slug: string): Promise<IDirection | null> {
    return DirectionModel.findOne({ slug }).lean<IDirection>();
  }

  async findAll(filter: Record<string, unknown> = {}): Promise<IDirection[]> {
    return DirectionModel.find(filter)
      .sort({ sortOrder: 1, createdAt: -1 })
      .lean<IDirection[]>();
  }

  async update(id: string, data: Partial<IDirection>): Promise<IDirection | null> {
    return DirectionModel.findByIdAndUpdate(id, { $set: data }, { new: true }).lean<IDirection>();
  }

  async delete(id: string): Promise<void> {
    await DirectionModel.findByIdAndDelete(id);
  }
}
