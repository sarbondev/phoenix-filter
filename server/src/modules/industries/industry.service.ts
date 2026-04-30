import { IndustryRepository } from "./industry.repository";
import { IndustryResponse, toIndustryResponse } from "./industry.entity";
import { CreateIndustryDto, UpdateIndustryDto } from "./industry.schema";
import { NotFoundError } from "../../shared/middleware/error-handler.middleware";
import { deleteFile } from "../upload/upload.service";
import { emitToAll } from "../../shared/services/socket.service";
import { geminiService } from "../../shared/services/gemini.service";

export class IndustryService {
  constructor(private readonly industryRepository: IndustryRepository) {}

  async create(dto: CreateIndustryDto): Promise<IndustryResponse> {
    const name = await geminiService.translateOne(dto.name);

    const industry = await this.industryRepository.create({
      name,
      image: dto.image,
      isActive: dto.isActive,
      sortOrder: dto.sortOrder,
    } as any);

    const response = toIndustryResponse(industry);
    emitToAll("industry:created", response);
    return response;
  }

  async findActive(): Promise<IndustryResponse[]> {
    const industries = await this.industryRepository.findActive();
    return industries.map(toIndustryResponse);
  }

  async findAll(): Promise<IndustryResponse[]> {
    const industries = await this.industryRepository.findAll();
    return industries.map(toIndustryResponse);
  }

  async findOne(id: string): Promise<IndustryResponse> {
    const industry = await this.industryRepository.findById(id);
    if (!industry) throw new NotFoundError("Industry");
    return toIndustryResponse(industry);
  }

  async update(id: string, dto: UpdateIndustryDto): Promise<IndustryResponse> {
    const existing = await this.industryRepository.findById(id);
    if (!existing) throw new NotFoundError("Industry");

    const updateData: Record<string, unknown> = {};

    if (dto.name) {
      updateData.name = await geminiService.translateOne(dto.name);
    }
    if (dto.image !== undefined) {
      updateData.image = dto.image;
      if (existing.image && dto.image !== existing.image) {
        deleteFile(existing.image);
      }
    }
    if (dto.isActive !== undefined) updateData.isActive = dto.isActive;
    if (dto.sortOrder !== undefined) updateData.sortOrder = dto.sortOrder;

    const updated = await this.industryRepository.update(id, updateData as any);
    if (!updated) throw new NotFoundError("Industry");
    const response = toIndustryResponse(updated);
    emitToAll("industry:updated", response);
    return response;
  }

  async remove(id: string): Promise<void> {
    const industry = await this.industryRepository.findById(id);
    if (!industry) throw new NotFoundError("Industry");
    if (industry.image) deleteFile(industry.image);
    await this.industryRepository.delete(id);
    emitToAll("industry:deleted", { id });
  }
}
