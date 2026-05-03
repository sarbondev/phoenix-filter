import { FilterQuery } from 'mongoose';
import { ProductModel } from './product.schema';
import { IProduct } from './product.entity';

export interface ProductFilter {
  category?: string;
  categoryIds?: string[];
  isActive?: boolean;
  isFeatured?: boolean;
  minPrice?: number;
  maxPrice?: number;
  search?: string;
  vehicleBrand?: string;
  manufacturer?: string;
}

export class ProductRepository {
  async create(data: Partial<IProduct>): Promise<IProduct> {
    const product = new ProductModel(data);
    return product.save();
  }

  async findById(id: string): Promise<IProduct | null> {
    return ProductModel.findById(id).populate('category', 'name slug').lean<IProduct>();
  }

  async findBySlug(slug: string): Promise<IProduct | null> {
    return ProductModel.findOne({ slug }).populate('category', 'name slug').lean<IProduct>();
  }

  async findBySku(sku: string): Promise<IProduct | null> {
    return ProductModel.findOne({ sku }).lean<IProduct>();
  }

  async findAll(
    filter: ProductFilter,
    skip: number,
    limit: number,
    sortBy = 'createdAt',
    sortOrder: 'asc' | 'desc' = 'desc',
  ): Promise<{ data: IProduct[]; total: number }> {
    const query: FilterQuery<IProduct> = {};

    if (filter.categoryIds && filter.categoryIds.length > 0) {
      query.category = { $in: filter.categoryIds };
    } else if (filter.category) {
      query.category = filter.category;
    }
    if (filter.isActive !== undefined) query.isActive = filter.isActive;
    if (filter.isFeatured !== undefined) query.isFeatured = filter.isFeatured;
    if (filter.minPrice !== undefined || filter.maxPrice !== undefined) {
      query.price = {};
      if (filter.minPrice !== undefined) query.price.$gte = filter.minPrice;
      if (filter.maxPrice !== undefined) query.price.$lte = filter.maxPrice;
    }
    if (filter.vehicleBrand) query.vehicleBrand = filter.vehicleBrand.toUpperCase();
    if (filter.manufacturer) query['crossReferences.manufacturer'] = { $regex: filter.manufacturer, $options: 'i' };
    if (filter.search) {
      query.$or = [
        { 'name.uz': { $regex: filter.search, $options: 'i' } },
        { 'name.ru': { $regex: filter.search, $options: 'i' } },
        { 'name.en': { $regex: filter.search, $options: 'i' } },
        { 'description.uz': { $regex: filter.search, $options: 'i' } },
        { 'description.ru': { $regex: filter.search, $options: 'i' } },
        { 'description.en': { $regex: filter.search, $options: 'i' } },
        { sku: { $regex: filter.search, $options: 'i' } },
        { oem: { $regex: filter.search, $options: 'i' } },
        { application: { $regex: filter.search, $options: 'i' } },
        { 'crossReferences.partNumber': { $regex: filter.search, $options: 'i' } },
      ];
    }

    const sort: Record<string, 1 | -1> = { [sortBy]: sortOrder === 'asc' ? 1 : -1 };

    const [data, total] = await Promise.all([
      ProductModel.find(query).populate('category', 'name slug').sort(sort).skip(skip).limit(limit).lean<IProduct[]>(),
      ProductModel.countDocuments(query),
    ]);

    return { data, total };
  }

  async update(id: string, data: Partial<IProduct>): Promise<IProduct | null> {
    return ProductModel.findByIdAndUpdate(id, { $set: data }, { new: true })
      .populate('category', 'name slug')
      .lean<IProduct>();
  }

  async delete(id: string): Promise<void> {
    await ProductModel.findByIdAndDelete(id);
  }

  async incrementViews(id: string): Promise<void> {
    await ProductModel.findByIdAndUpdate(id, { $inc: { views: 1 } });
  }

  async updateStock(id: string, quantity: number): Promise<void> {
    await ProductModel.findByIdAndUpdate(id, { $inc: { stock: quantity } });
  }

  async count(): Promise<number> {
    return ProductModel.countDocuments();
  }

  async findByCategory(categoryId: string): Promise<IProduct[]> {
    return ProductModel.find({ category: categoryId, isActive: true }).lean<IProduct[]>();
  }
}
