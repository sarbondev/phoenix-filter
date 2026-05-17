import { CategoryRepository } from "./category.repository";
import { DirectionRepository } from "../directions/direction.repository";
import { CategoryResponse, toCategoryResponse } from "./category.entity";
import { CreateCategoryDto, UpdateCategoryDto } from "./category.schema";
import {
  NotFoundError,
  ValidationError,
} from "../../shared/middleware/error-handler.middleware";
import { deleteFile } from "../upload/upload.service";
import { geminiService } from "../../shared/services/gemini.service";
import { emitToAll } from "../../shared/services/socket.service";

export class CategoryService {
  private readonly directionRepository = new DirectionRepository();
  constructor(private readonly categoryRepository: CategoryRepository) {}

  private slugify(text: string): string {
    return text
      .toLowerCase()
      .trim()
      .replace(/[^\w\s-]/g, "")
      .replace(/[\s_]+/g, "-")
      .replace(/-+/g, "-")
      .replace(/^-|-$/g, "");
  }

  private async generateUniqueSlug(name: string): Promise<string> {
    let slug = this.slugify(name);
    if (!slug) slug = "category";
    let candidate = slug;
    let counter = 0;
    while (await this.categoryRepository.findBySlug(candidate)) {
      counter++;
      candidate = `${slug}-${counter}`;
    }
    return candidate;
  }

  private async assertDirectionExists(directionId: string): Promise<void> {
    const direction = await this.directionRepository.findById(directionId);
    if (!direction) throw new ValidationError("Direction does not exist");
  }

  async create(dto: CreateCategoryDto): Promise<CategoryResponse> {
    await this.assertDirectionExists(dto.direction);
    const slug = dto.slug || (await this.generateUniqueSlug(dto.name));

    const { name, description } = await geminiService.translateWithDescription(
      dto.name,
      "e-commerce product category",
    );
    const category = await this.categoryRepository.create({
      slug,
      image: dto.image,
      direction: dto.direction as any,
      isActive: dto.isActive,
      sortOrder: dto.sortOrder,
      name,
      description,
    } as any);

    const response = toCategoryResponse(category);
    emitToAll("category:created", response);
    return response;
  }

  async findAll(activeOnly = false, directionId?: string): Promise<CategoryResponse[]> {
    const filter: Record<string, unknown> = {};
    if (activeOnly) filter.isActive = true;
    if (directionId) filter.direction = directionId;
    const categories = await this.categoryRepository.findAll(filter);
    return categories.map(toCategoryResponse);
  }

  async findOne(id: string): Promise<CategoryResponse> {
    const category = await this.categoryRepository.findById(id);
    if (!category) throw new NotFoundError("Category");
    return toCategoryResponse(category);
  }

  async findBySlug(slug: string): Promise<CategoryResponse> {
    const category = await this.categoryRepository.findBySlug(slug);
    if (!category) throw new NotFoundError("Category");
    return toCategoryResponse(category);
  }

  async update(id: string, dto: UpdateCategoryDto): Promise<CategoryResponse> {
    const existing = await this.categoryRepository.findById(id);
    if (!existing) throw new NotFoundError("Category");

    const updateData: Record<string, unknown> = {};
    if (dto.name && !dto.slug) {
      updateData.slug = await this.generateUniqueSlug(dto.name);
    } else if (dto.slug) {
      updateData.slug = dto.slug;
    }
    if (dto.image !== undefined) updateData.image = dto.image;
    if (
      dto.image !== undefined &&
      existing.image &&
      dto.image !== existing.image
    ) {
      deleteFile(existing.image);
    }
    if (dto.direction !== undefined) {
      await this.assertDirectionExists(dto.direction);
      updateData.direction = dto.direction;
    }
    if (dto.isActive !== undefined) updateData.isActive = dto.isActive;
    if (dto.sortOrder !== undefined) updateData.sortOrder = dto.sortOrder;

    if (dto.name) {
      const { name, description } =
        await geminiService.translateWithDescription(dto.name);
      updateData.name = name;
      updateData.description = description;
    }

    const updated = await this.categoryRepository.update(id, updateData as any);
    if (!updated) throw new NotFoundError("Category");
    const response = toCategoryResponse(updated);
    emitToAll("category:updated", response);
    return response;
  }

  async remove(id: string): Promise<void> {
    const category = await this.categoryRepository.findById(id);
    if (!category) throw new NotFoundError("Category");

    if (category.image) deleteFile(category.image);
    await this.categoryRepository.delete(id);
    emitToAll("category:deleted", { id });
  }
}
