import { ProductRequestRepository } from "./product-request.repository";
import {
  ProductRequestResponse,
  toProductRequestResponse,
  ProductRequestStatus,
} from "./product-request.entity";
import { CreateProductRequestDto } from "./product-request.schema";
import { NotFoundError } from "../../shared/middleware/error-handler.middleware";
import { emitToStaff, emitToAll } from "../../shared/services/socket.service";

export class ProductRequestService {
  constructor(private readonly repository: ProductRequestRepository) {}

  async create(dto: CreateProductRequestDto): Promise<ProductRequestResponse> {
    const doc = await this.repository.create({
      productName: dto.productName,
      name: dto.name,
      phoneNumber: dto.phoneNumber,
      note: dto.note,
      searchQuery: dto.searchQuery,
      locale: dto.locale,
      status: "NEW",
    });
    const response = toProductRequestResponse(doc);
    emitToStaff("product-request:new", response);
    return response;
  }

  async findAll(
    status?: ProductRequestStatus,
  ): Promise<ProductRequestResponse[]> {
    const docs = await this.repository.findAll(status ? { status } : {});
    return docs.map(toProductRequestResponse);
  }

  async findOne(id: string): Promise<ProductRequestResponse> {
    const doc = await this.repository.findById(id);
    if (!doc) throw new NotFoundError("Product request");
    return toProductRequestResponse(doc);
  }

  async updateStatus(
    id: string,
    status: ProductRequestStatus,
  ): Promise<ProductRequestResponse> {
    const doc = await this.repository.updateStatus(id, status);
    if (!doc) throw new NotFoundError("Product request");
    const response = toProductRequestResponse(doc);
    emitToAll("product-request:updated", response);
    return response;
  }

  async remove(id: string): Promise<void> {
    const doc = await this.repository.findById(id);
    if (!doc) throw new NotFoundError("Product request");
    await this.repository.delete(id);
    emitToAll("product-request:deleted", { id });
  }

  async countNew(): Promise<number> {
    return this.repository.countByStatus("NEW");
  }
}
