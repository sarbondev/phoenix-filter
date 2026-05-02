import { CertificateRepository } from "./certificate.repository";
import { CertificateResponse, toCertificateResponse } from "./certificate.entity";
import {
  CreateCertificateDto,
  UpdateCertificateDto,
} from "./certificate.schema";
import { NotFoundError } from "../../shared/middleware/error-handler.middleware";
import { deleteFile } from "../upload/upload.service";
import { emitToAll } from "../../shared/services/socket.service";
import { fillEmptyTranslations } from "../../shared/utils/translate.util";
import { geminiService } from "../../shared/services/gemini.service";
import { TranslatedField } from "../../shared/types/common.types";

async function normalizeCaption(
  input: string | TranslatedField,
): Promise<TranslatedField> {
  if (typeof input === "string") {
    if (!input.trim()) {
      return { uz: "", ru: "", en: "", kz: "" };
    }
    return geminiService.translateOne(input);
  }
  return (await fillEmptyTranslations(input)) ?? input;
}

export class CertificateService {
  constructor(private readonly repo: CertificateRepository) {}

  async create(dto: CreateCertificateDto): Promise<CertificateResponse> {
    const caption = await normalizeCaption(dto.caption);
    const doc = await this.repo.create({
      caption,
      image: dto.image,
      isActive: dto.isActive,
      sortOrder: dto.sortOrder,
    } as Partial<import("./certificate.entity").ICertificate>);
    const response = toCertificateResponse(doc);
    emitToAll("certificate:created", response);
    return response;
  }

  async findActive(): Promise<CertificateResponse[]> {
    const docs = await this.repo.findActive();
    return docs.map(toCertificateResponse);
  }

  async findAll(): Promise<CertificateResponse[]> {
    const docs = await this.repo.findAll();
    return docs.map(toCertificateResponse);
  }

  async findOne(id: string): Promise<CertificateResponse> {
    const doc = await this.repo.findById(id);
    if (!doc) throw new NotFoundError("Certificate");
    return toCertificateResponse(doc);
  }

  async update(
    id: string,
    dto: UpdateCertificateDto,
  ): Promise<CertificateResponse> {
    const existing = await this.repo.findById(id);
    if (!existing) throw new NotFoundError("Certificate");

    const updateData: Record<string, unknown> = {};
    if (dto.caption !== undefined) {
      updateData.caption = await normalizeCaption(dto.caption);
    }
    if (dto.image !== undefined) {
      updateData.image = dto.image;
      if (existing.image && existing.image !== dto.image) {
        deleteFile(existing.image);
      }
    }
    if (dto.isActive !== undefined) updateData.isActive = dto.isActive;
    if (dto.sortOrder !== undefined) updateData.sortOrder = dto.sortOrder;

    const updated = await this.repo.update(
      id,
      updateData as Partial<import("./certificate.entity").ICertificate>,
    );
    if (!updated) throw new NotFoundError("Certificate");
    const response = toCertificateResponse(updated);
    emitToAll("certificate:updated", response);
    return response;
  }

  async remove(id: string): Promise<void> {
    const doc = await this.repo.findById(id);
    if (!doc) throw new NotFoundError("Certificate");
    if (doc.image) deleteFile(doc.image);
    await this.repo.delete(id);
    emitToAll("certificate:deleted", { id });
  }
}
