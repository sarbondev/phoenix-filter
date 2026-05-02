import { CertificateModel } from "./certificate.schema";
import { ICertificate } from "./certificate.entity";

export class CertificateRepository {
  async create(data: Partial<ICertificate>): Promise<ICertificate> {
    const doc = new CertificateModel(data);
    return doc.save();
  }

  async findById(id: string): Promise<ICertificate | null> {
    return CertificateModel.findById(id).lean<ICertificate>();
  }

  async findActive(): Promise<ICertificate[]> {
    return CertificateModel.find({ isActive: true })
      .sort({ sortOrder: 1, createdAt: -1 })
      .lean<ICertificate[]>();
  }

  async findAll(): Promise<ICertificate[]> {
    return CertificateModel.find()
      .sort({ sortOrder: 1, createdAt: -1 })
      .lean<ICertificate[]>();
  }

  async update(
    id: string,
    data: Partial<ICertificate>,
  ): Promise<ICertificate | null> {
    return CertificateModel.findByIdAndUpdate(
      id,
      { $set: data },
      { new: true },
    ).lean<ICertificate>();
  }

  async delete(id: string): Promise<void> {
    await CertificateModel.findByIdAndDelete(id);
  }
}
