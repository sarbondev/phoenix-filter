import { EquipmentTypeModel } from "./equipment-type.schema";
import { IEquipmentType } from "./equipment-type.entity";

export class EquipmentTypeRepository {
  async create(data: Partial<IEquipmentType>): Promise<IEquipmentType> {
    const et = new EquipmentTypeModel(data);
    return et.save();
  }

  async findById(id: string): Promise<IEquipmentType | null> {
    return EquipmentTypeModel.findById(id).lean<IEquipmentType>();
  }

  async findBySlug(slug: string): Promise<IEquipmentType | null> {
    return EquipmentTypeModel.findOne({ slug }).lean<IEquipmentType>();
  }

  async findActive(): Promise<IEquipmentType[]> {
    return EquipmentTypeModel.find({ isActive: true })
      .sort({ sortOrder: 1 })
      .lean<IEquipmentType[]>();
  }

  async findAll(): Promise<IEquipmentType[]> {
    return EquipmentTypeModel.find()
      .sort({ sortOrder: 1, createdAt: -1 })
      .lean<IEquipmentType[]>();
  }

  async update(
    id: string,
    data: Partial<IEquipmentType>,
  ): Promise<IEquipmentType | null> {
    return EquipmentTypeModel.findByIdAndUpdate(id, { $set: data }, { new: true })
      .lean<IEquipmentType>();
  }

  async delete(id: string): Promise<void> {
    await EquipmentTypeModel.findByIdAndDelete(id);
  }
}
