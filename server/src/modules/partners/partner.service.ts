import { PartnerRepository } from "./partner.repository";
import { PartnerResponse, toPartnerResponse } from "./partner.entity";
import { CreatePartnerDto, UpdatePartnerDto } from "./partner.schema";
import { NotFoundError } from "../../shared/middleware/error-handler.middleware";
import { deleteFile } from "../upload/upload.service";
import { emitToAll } from "../../shared/services/socket.service";

export class PartnerService {
  constructor(private readonly partnerRepository: PartnerRepository) {}

  async create(dto: CreatePartnerDto): Promise<PartnerResponse> {
    const partner = await this.partnerRepository.create({
      image: dto.image,
      isActive: dto.isActive,
      sortOrder: dto.sortOrder,
    } as any);

    const response = toPartnerResponse(partner);
    emitToAll("partner:created", response);
    return response;
  }

  async findActive(): Promise<PartnerResponse[]> {
    const partners = await this.partnerRepository.findActive();
    return partners.map(toPartnerResponse);
  }

  async findAll(): Promise<PartnerResponse[]> {
    const partners = await this.partnerRepository.findAll();
    return partners.map(toPartnerResponse);
  }

  async findOne(id: string): Promise<PartnerResponse> {
    const partner = await this.partnerRepository.findById(id);
    if (!partner) throw new NotFoundError("Partner");
    return toPartnerResponse(partner);
  }

  async update(id: string, dto: UpdatePartnerDto): Promise<PartnerResponse> {
    const existing = await this.partnerRepository.findById(id);
    if (!existing) throw new NotFoundError("Partner");

    // Delete old image if replaced
    if (dto.image && existing.image && dto.image !== existing.image) {
      deleteFile(existing.image);
    }

    const updated = await this.partnerRepository.update(id, dto as any);
    if (!updated) throw new NotFoundError("Partner");
    const response = toPartnerResponse(updated);
    emitToAll("partner:updated", response);
    return response;
  }

  async remove(id: string): Promise<void> {
    const partner = await this.partnerRepository.findById(id);
    if (!partner) throw new NotFoundError("Partner");
    if (partner.image) deleteFile(partner.image);
    await this.partnerRepository.delete(id);
    emitToAll("partner:deleted", { id });
  }
}
