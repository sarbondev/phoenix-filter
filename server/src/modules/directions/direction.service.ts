import { DirectionRepository } from "./direction.repository";
import { CategoryRepository } from "../categories/category.repository";
import { DirectionResponse, toDirectionResponse } from "./direction.entity";
import { CreateDirectionDto, UpdateDirectionDto } from "./direction.schema";
import {
  NotFoundError,
  ConflictError,
} from "../../shared/middleware/error-handler.middleware";
import { deleteFile } from "../upload/upload.service";
import { geminiService } from "../../shared/services/gemini.service";
import { emitToAll } from "../../shared/services/socket.service";

export class DirectionService {
  private readonly categoryRepository = new CategoryRepository();
  constructor(private readonly directionRepository: DirectionRepository) {}

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
    if (!slug) slug = "direction";
    let candidate = slug;
    let counter = 0;
    while (await this.directionRepository.findBySlug(candidate)) {
      counter++;
      candidate = `${slug}-${counter}`;
    }
    return candidate;
  }

  async create(dto: CreateDirectionDto): Promise<DirectionResponse> {
    const slug = dto.slug || (await this.generateUniqueSlug(dto.name));

    const { name, description } = await geminiService.translateWithDescription(
      dto.name,
      "product direction / industry segment (e.g. automotive filters, household filters)",
    );

    const direction = await this.directionRepository.create({
      slug,
      icon: dto.icon,
      image: dto.image,
      isActive: dto.isActive,
      sortOrder: dto.sortOrder,
      name,
      description,
    } as any);

    const response = toDirectionResponse(direction);
    emitToAll("direction:created", response);
    return response;
  }

  async findAll(activeOnly = false): Promise<DirectionResponse[]> {
    const filter = activeOnly ? { isActive: true } : {};
    const items = await this.directionRepository.findAll(filter);
    return items.map(toDirectionResponse);
  }

  async findOne(id: string): Promise<DirectionResponse> {
    const direction = await this.directionRepository.findById(id);
    if (!direction) throw new NotFoundError("Direction");
    return toDirectionResponse(direction);
  }

  async findBySlug(slug: string): Promise<DirectionResponse> {
    const direction = await this.directionRepository.findBySlug(slug);
    if (!direction) throw new NotFoundError("Direction");
    return toDirectionResponse(direction);
  }

  async update(id: string, dto: UpdateDirectionDto): Promise<DirectionResponse> {
    const existing = await this.directionRepository.findById(id);
    if (!existing) throw new NotFoundError("Direction");

    const updateData: Record<string, unknown> = {};
    if (dto.name && !dto.slug) {
      updateData.slug = await this.generateUniqueSlug(dto.name);
    } else if (dto.slug) {
      updateData.slug = dto.slug;
    }
    if (dto.icon !== undefined) updateData.icon = dto.icon;
    if (dto.image !== undefined) {
      updateData.image = dto.image;
      if (existing.image && dto.image !== existing.image) {
        deleteFile(existing.image);
      }
    }
    if (dto.isActive !== undefined) updateData.isActive = dto.isActive;
    if (dto.sortOrder !== undefined) updateData.sortOrder = dto.sortOrder;

    if (dto.name) {
      const { name, description } = await geminiService.translateWithDescription(
        dto.name,
        "product direction / industry segment",
      );
      updateData.name = name;
      updateData.description = description;
    }

    const updated = await this.directionRepository.update(id, updateData as any);
    if (!updated) throw new NotFoundError("Direction");
    const response = toDirectionResponse(updated);
    emitToAll("direction:updated", response);
    return response;
  }

  async remove(id: string): Promise<void> {
    const direction = await this.directionRepository.findById(id);
    if (!direction) throw new NotFoundError("Direction");

    const childCount = await this.categoryRepository.countByDirection(id);
    if (childCount > 0)
      throw new ConflictError("Cannot delete direction that has categories");

    if (direction.image) deleteFile(direction.image);
    await this.directionRepository.delete(id);
    emitToAll("direction:deleted", { id });
  }
}
