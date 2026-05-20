import { ProductRepository } from "../products/product.repository";
import { ProductRequestRepository } from "../product-requests/product-request.repository";
import { toProductResponse, ProductResponse } from "../products/product.entity";
import {
  OemSearchDto,
  AnalogSearchDto,
  SizeSearchDto,
  MachineSearchDto,
  PhotoSearchDto,
} from "./filter-search.schema";
import { buildPaginatedResponse } from "../../shared/utils/pagination";
import { PaginatedResponse } from "../../shared/types/common.types";
import { emitToAll } from "../../shared/services/socket.service";

export class FilterSearchService {
  constructor(
    private readonly productRepository: ProductRepository,
    private readonly productRequestRepository: ProductRequestRepository,
  ) {}

  private resolvePagination(page = 1, limit = 24) {
    const skip = (page - 1) * limit;
    return { page, limit, skip };
  }

  async byOem(dto: OemSearchDto): Promise<PaginatedResponse<ProductResponse>> {
    const { page, limit, skip } = this.resolvePagination(dto.page, dto.limit);
    const { data, total } = await this.productRepository.findAll(
      { isActive: true, search: dto.query },
      skip,
      limit,
    );
    return buildPaginatedResponse(data.map(toProductResponse), total, {
      page,
      limit,
      skip,
    });
  }

  async byAnalog(
    dto: AnalogSearchDto,
  ): Promise<PaginatedResponse<ProductResponse>> {
    const { page, limit, skip } = this.resolvePagination(dto.page, dto.limit);
    const { data, total } = await this.productRepository.findAll(
      {
        isActive: true,
        search: dto.query,
        ...(dto.manufacturer ? { manufacturer: dto.manufacturer } : {}),
      },
      skip,
      limit,
    );
    return buildPaginatedResponse(data.map(toProductResponse), total, {
      page,
      limit,
      skip,
    });
  }

  async bySize(
    dto: SizeSearchDto,
  ): Promise<PaginatedResponse<ProductResponse>> {
    const { page, limit, skip } = this.resolvePagination(dto.page, dto.limit);
    const { data, total } = await this.productRepository.findBySize(
      {
        ...(dto.height !== undefined ? { height: dto.height } : {}),
        ...(dto.outerDiameter !== undefined
          ? { outerDiameter: dto.outerDiameter }
          : {}),
        ...(dto.innerDiameter !== undefined
          ? { innerDiameter: dto.innerDiameter }
          : {}),
        ...(dto.threadSize ? { threadSize: dto.threadSize } : {}),
        tolerance: dto.tolerance ?? 5,
      },
      skip,
      limit,
    );
    return buildPaginatedResponse(data.map(toProductResponse), total, {
      page,
      limit,
      skip,
    });
  }

  async byMachine(
    dto: MachineSearchDto,
  ): Promise<PaginatedResponse<ProductResponse>> {
    const { page, limit, skip } = this.resolvePagination(dto.page, dto.limit);
    // Use search for model/engine/year as text hints; machineBrand is structural.
    const searchParts: string[] = [];
    if (dto.model) searchParts.push(dto.model);
    if (dto.engine) searchParts.push(dto.engine);
    if (dto.year) searchParts.push(dto.year);

    const { data, total } = await this.productRepository.findAll(
      {
        isActive: true,
        machineBrand: dto.machineBrand,
        ...(searchParts.length ? { search: searchParts.join(" ") } : {}),
      },
      skip,
      limit,
    );
    return buildPaginatedResponse(data.map(toProductResponse), total, {
      page,
      limit,
      skip,
    });
  }

  async byPhoto(dto: PhotoSearchDto): Promise<{ requestId: string }> {
    // Photo search ALWAYS routes to product-requests — a human picks the
    // right filter in CRM. We persist the photo URL and contact details.
    const note = [dto.note, `Photo: ${dto.imageUrl}`].filter(Boolean).join("\n\n");

    const request = await this.productRequestRepository.create({
      productName: "Filter search by photo",
      phoneNumber: dto.phoneNumber,
      note,
      searchQuery: dto.imageUrl,
      status: "NEW",
      ...(dto.name ? { name: dto.name } : {}),
      ...(dto.locale ? { locale: dto.locale } : {}),
    } as any);

    emitToAll("product-request:created", {
      id: String(request._id),
      productName: request.productName,
    });

    return { requestId: String(request._id) };
  }
}
