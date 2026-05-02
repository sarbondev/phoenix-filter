import { FaqRepository } from "./faq.repository";
import { FaqResponse, toFaqResponse } from "./faq.entity";
import { CreateFaqDto, UpdateFaqDto } from "./faq.schema";
import { NotFoundError } from "../../shared/middleware/error-handler.middleware";
import { emitToAll } from "../../shared/services/socket.service";
import { geminiService } from "../../shared/services/gemini.service";

export class FaqService {
  constructor(private readonly repo: FaqRepository) {}

  async create(dto: CreateFaqDto): Promise<FaqResponse> {
    const [question, answer] = await Promise.all([
      geminiService.translateOne(dto.question),
      geminiService.translateOne(dto.answer),
    ]);
    const doc = await this.repo.create({
      question,
      answer,
      isActive: dto.isActive,
      sortOrder: dto.sortOrder,
    } as Partial<import("./faq.entity").IFaq>);
    const response = toFaqResponse(doc);
    emitToAll("faq:created", response);
    return response;
  }

  async findActive(): Promise<FaqResponse[]> {
    const docs = await this.repo.findActive();
    return docs.map(toFaqResponse);
  }

  async findAll(): Promise<FaqResponse[]> {
    const docs = await this.repo.findAll();
    return docs.map(toFaqResponse);
  }

  async findOne(id: string): Promise<FaqResponse> {
    const doc = await this.repo.findById(id);
    if (!doc) throw new NotFoundError("FAQ");
    return toFaqResponse(doc);
  }

  async update(id: string, dto: UpdateFaqDto): Promise<FaqResponse> {
    const existing = await this.repo.findById(id);
    if (!existing) throw new NotFoundError("FAQ");

    const updateData: Record<string, unknown> = {};
    if (dto.question) {
      updateData.question = await geminiService.translateOne(dto.question);
    }
    if (dto.answer) {
      updateData.answer = await geminiService.translateOne(dto.answer);
    }
    if (dto.isActive !== undefined) updateData.isActive = dto.isActive;
    if (dto.sortOrder !== undefined) updateData.sortOrder = dto.sortOrder;

    const updated = await this.repo.update(id, updateData as Partial<import("./faq.entity").IFaq>);
    if (!updated) throw new NotFoundError("FAQ");
    const response = toFaqResponse(updated);
    emitToAll("faq:updated", response);
    return response;
  }

  async remove(id: string): Promise<void> {
    const doc = await this.repo.findById(id);
    if (!doc) throw new NotFoundError("FAQ");
    await this.repo.delete(id);
    emitToAll("faq:deleted", { id });
  }
}
