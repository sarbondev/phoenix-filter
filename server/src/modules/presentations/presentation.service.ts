import { PresentationRepository } from "./presentation.repository";
import { PresentationResponse, toPresentationResponse } from "./presentation.entity";
import { CreatePresentationDto, UpdatePresentationDto } from "./presentation.schema";
import { NotFoundError } from "../../shared/middleware/error-handler.middleware";
import { emitToAll } from "../../shared/services/socket.service";

export class PresentationService {
  constructor(private readonly repository: PresentationRepository) {}

  async create(dto: CreatePresentationDto): Promise<PresentationResponse> {
    const created = await this.repository.create({
      title: dto.title,
      url: dto.url,
      isActive: dto.isActive,
      sortOrder: dto.sortOrder,
    } as any);
    const response = toPresentationResponse(created);
    emitToAll("presentation:created", response);
    return response;
  }

  async findActive(): Promise<PresentationResponse[]> {
    const items = await this.repository.findActive();
    return items.map(toPresentationResponse);
  }

  async findAll(): Promise<PresentationResponse[]> {
    const items = await this.repository.findAll();
    return items.map(toPresentationResponse);
  }

  async findOne(id: string): Promise<PresentationResponse> {
    const found = await this.repository.findById(id);
    if (!found) throw new NotFoundError("Presentation");
    return toPresentationResponse(found);
  }

  async update(id: string, dto: UpdatePresentationDto): Promise<PresentationResponse> {
    const existing = await this.repository.findById(id);
    if (!existing) throw new NotFoundError("Presentation");

    const updated = await this.repository.update(id, dto as any);
    if (!updated) throw new NotFoundError("Presentation");
    const response = toPresentationResponse(updated);
    emitToAll("presentation:updated", response);
    return response;
  }

  async remove(id: string): Promise<void> {
    const existing = await this.repository.findById(id);
    if (!existing) throw new NotFoundError("Presentation");
    await this.repository.delete(id);
    emitToAll("presentation:deleted", { id });
  }
}
