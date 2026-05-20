import { EquipmentTypeRepository } from "./equipment-type.repository";
import {
  EquipmentTypeResponse,
  toEquipmentTypeResponse,
} from "./equipment-type.entity";
import {
  CreateEquipmentTypeDto,
  UpdateEquipmentTypeDto,
} from "./equipment-type.schema";
import {
  NotFoundError,
  ConflictError,
} from "../../shared/middleware/error-handler.middleware";
import { deleteFile } from "../upload/upload.service";
import { emitToAll } from "../../shared/services/socket.service";
import { geminiService } from "../../shared/services/gemini.service";

export class EquipmentTypeService {
  constructor(private readonly repository: EquipmentTypeRepository) {}

  private slugify(text: string): string {
    return text
      .toLowerCase()
      .trim()
      .replace(/[^\w\s-]/g, "")
      .replace(/[\s_]+/g, "-")
      .replace(/-+/g, "-")
      .replace(/^-|-$/g, "");
  }

  async create(dto: CreateEquipmentTypeDto): Promise<EquipmentTypeResponse> {
    const slug = dto.slug?.trim() || this.slugify(dto.name);
    if (await this.repository.findBySlug(slug)) {
      throw new ConflictError(`Equipment type slug '${slug}' is taken`);
    }

    const name = await geminiService.translateOne(dto.name);

    const et = await this.repository.create({
      name,
      slug,
      machineBrands: (dto.machineBrands ?? []).map((b) => b.toUpperCase().trim()),
      isActive: dto.isActive,
      sortOrder: dto.sortOrder,
      ...(dto.image !== undefined ? { image: dto.image } : {}),
      ...(dto.icon !== undefined ? { icon: dto.icon } : {}),
    } as any);

    const response = toEquipmentTypeResponse(et);
    emitToAll("equipment-type:created", response);
    return response;
  }

  async findActive(): Promise<EquipmentTypeResponse[]> {
    return (await this.repository.findActive()).map(toEquipmentTypeResponse);
  }

  async findAll(): Promise<EquipmentTypeResponse[]> {
    return (await this.repository.findAll()).map(toEquipmentTypeResponse);
  }

  async findOne(id: string): Promise<EquipmentTypeResponse> {
    const et = await this.repository.findById(id);
    if (!et) throw new NotFoundError("Equipment type");
    return toEquipmentTypeResponse(et);
  }

  async findBySlug(slug: string): Promise<EquipmentTypeResponse> {
    const et = await this.repository.findBySlug(slug);
    if (!et) throw new NotFoundError("Equipment type");
    return toEquipmentTypeResponse(et);
  }

  async update(
    id: string,
    dto: UpdateEquipmentTypeDto,
  ): Promise<EquipmentTypeResponse> {
    const existing = await this.repository.findById(id);
    if (!existing) throw new NotFoundError("Equipment type");

    const updateData: Record<string, unknown> = {};

    if (dto.name) updateData.name = await geminiService.translateOne(dto.name);
    if (dto.slug !== undefined) updateData.slug = dto.slug;
    if (dto.image !== undefined) {
      updateData.image = dto.image;
      if (existing.image && dto.image !== existing.image) {
        deleteFile(existing.image);
      }
    }
    if (dto.icon !== undefined) updateData.icon = dto.icon;
    if (dto.machineBrands !== undefined) {
      updateData.machineBrands = dto.machineBrands.map((b) =>
        b.toUpperCase().trim(),
      );
    }
    if (dto.isActive !== undefined) updateData.isActive = dto.isActive;
    if (dto.sortOrder !== undefined) updateData.sortOrder = dto.sortOrder;

    const updated = await this.repository.update(id, updateData as any);
    if (!updated) throw new NotFoundError("Equipment type");

    const response = toEquipmentTypeResponse(updated);
    emitToAll("equipment-type:updated", response);
    return response;
  }

  async remove(id: string): Promise<void> {
    const et = await this.repository.findById(id);
    if (!et) throw new NotFoundError("Equipment type");
    if (et.image) deleteFile(et.image);
    await this.repository.delete(id);
    emitToAll("equipment-type:deleted", { id });
  }
}
