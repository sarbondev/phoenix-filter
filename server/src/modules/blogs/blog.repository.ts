import { FilterQuery } from "mongoose";
import { BlogModel } from "./blog.schema";
import { IBlog } from "./blog.entity";

export class BlogRepository {
  async create(data: Partial<IBlog>): Promise<IBlog> {
    const blog = new BlogModel(data);
    return blog.save();
  }

  async findById(id: string): Promise<IBlog | null> {
    return BlogModel.findById(id).lean<IBlog>();
  }

  async findBySlug(slug: string): Promise<IBlog | null> {
    return BlogModel.findOne({ slug }).lean<IBlog>();
  }

  async findAll(
    filter: FilterQuery<IBlog>,
    skip: number,
    limit: number,
  ): Promise<{ data: IBlog[]; total: number }> {
    const [data, total] = await Promise.all([
      BlogModel.find(filter)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .lean<IBlog[]>(),
      BlogModel.countDocuments(filter),
    ]);
    return { data, total };
  }

  async update(id: string, data: Partial<IBlog>): Promise<IBlog | null> {
    return BlogModel.findByIdAndUpdate(
      id,
      { $set: data },
      { new: true },
    ).lean<IBlog>();
  }

  async delete(id: string): Promise<void> {
    await BlogModel.findByIdAndDelete(id);
  }

  async incrementViews(id: string): Promise<void> {
    await BlogModel.findByIdAndUpdate(id, { $inc: { views: 1 } });
  }

  async count(): Promise<number> {
    return BlogModel.countDocuments();
  }
}
