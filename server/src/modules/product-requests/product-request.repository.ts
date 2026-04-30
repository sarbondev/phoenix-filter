import { ProductRequestModel } from './product-request.schema';
import { IProductRequest, ProductRequestStatus } from './product-request.entity';

export class ProductRequestRepository {
  async create(data: Partial<IProductRequest>): Promise<IProductRequest> {
    const doc = new ProductRequestModel(data);
    return doc.save();
  }

  async findById(id: string): Promise<IProductRequest | null> {
    return ProductRequestModel.findById(id).lean<IProductRequest>();
  }

  async findAll(filter: { status?: ProductRequestStatus } = {}): Promise<IProductRequest[]> {
    const query: Record<string, unknown> = {};
    if (filter.status) query['status'] = filter.status;
    return ProductRequestModel.find(query)
      .sort({ createdAt: -1 })
      .lean<IProductRequest[]>();
  }

  async updateStatus(
    id: string,
    status: ProductRequestStatus,
  ): Promise<IProductRequest | null> {
    return ProductRequestModel.findByIdAndUpdate(
      id,
      { $set: { status } },
      { new: true },
    ).lean<IProductRequest>();
  }

  async delete(id: string): Promise<void> {
    await ProductRequestModel.findByIdAndDelete(id);
  }

  async countByStatus(status: ProductRequestStatus): Promise<number> {
    return ProductRequestModel.countDocuments({ status });
  }
}
