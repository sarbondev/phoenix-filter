import { ProductRepository, ProductFilter } from "./product.repository";
import { CategoryRepository } from "../categories/category.repository";
import { ProductResponse, toProductResponse } from "./product.entity";
import {
  CreateProductDto,
  UpdateProductDto,
  ProductQueryDto,
} from "./product.schema";
import { NotFoundError } from "../../shared/middleware/error-handler.middleware";
import { deleteFiles } from "../upload/upload.service";
import { geminiService } from "../../shared/services/gemini.service";
import { PaginatedResponse } from "../../shared/types/common.types";
import { buildPaginatedResponse } from "../../shared/utils/pagination";
import { emitToAll } from "../../shared/services/socket.service";

export class ProductService {
  private readonly categoryRepository = new CategoryRepository();
  constructor(private readonly productRepository: ProductRepository) {}

  private async expandCategoryFilter(category: string | undefined): Promise<string[] | undefined> {
    if (!category) return undefined;
    return this.categoryRepository.collectDescendants(category);
  }

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
    if (!slug) slug = "product";
    let candidate = slug;
    let counter = 0;
    while (await this.productRepository.findBySlug(candidate)) {
      counter++;
      candidate = `${slug}-${counter}`;
    }
    return candidate;
  }

  private async generateSku(): Promise<string> {
    const prefix = "FS";
    const count = await this.productRepository.count();
    const num = String(count + 1).padStart(6, "0");
    const sku = `${prefix}-${num}`;
    if (await this.productRepository.findBySku(sku)) {
      const ts = Date.now().toString(36).toUpperCase().slice(-4);
      return `${prefix}-${num}-${ts}`;
    }
    return sku;
  }

  async create(dto: CreateProductDto): Promise<ProductResponse> {
    const slug = dto.slug || (await this.generateUniqueSlug(dto.name));
    const sku = dto.sku?.toUpperCase() || (await this.generateSku());

    // Translate text fields
    const translations = await geminiService.translate(
      {
        name: dto.name,
        description: dto.description,
        ...(dto.tags ? { tags: dto.tags } : {}),
      },
      {
        context:
          "filter-system factory product for industrial/household water, air, oil filters",
      },
    );

    // Translate specifications
    const translatedSpecs = await Promise.all(
      dto.specifications.map(async (spec) => {
        const specTranslation = await geminiService.translate(
          { key: spec.key, value: spec.value },
          { context: "product technical specification for filters" },
        );
        return { key: specTranslation.key, value: specTranslation.value };
      }),
    );

    const product = await this.productRepository.create({
      slug,
      sku,
      price: dto.price,
      discountPercent: dto.discountPercent,
      category: dto.category as any,
      images: dto.images,
      stock: dto.stock,
      isActive: dto.isActive,
      isFeatured: dto.isFeatured,
      name: translations.name,
      description: translations.description,
      ...(dto.tags && translations.tags?.uz ? { tags: translations.tags } : {}),
      specifications: translatedSpecs,
      ...(dto.oem !== undefined ? { oem: dto.oem } : {}),
      ...(dto.material !== undefined ? { material: dto.material } : {}),
      ...(dto.application !== undefined ? { application: dto.application } : {}),
      ...(dto.vehicleBrand !== undefined ? { vehicleBrand: dto.vehicleBrand } : {}),
      ...(dto.dimensions ? { dimensions: dto.dimensions } : {}),
      ...(dto.crossReferences ? { crossReferences: dto.crossReferences } : {}),
    } as any);

    const response = toProductResponse(product);
    emitToAll("product:created", response);
    return response;
  }

  async findAll(
    query: ProductQueryDto,
    page: number,
    limit: number,
  ): Promise<PaginatedResponse<ProductResponse>> {
    const skip = (page - 1) * limit;
    const filter: ProductFilter = {
      isActive: true,
    };

    if (query.category) filter.categoryIds = await this.expandCategoryFilter(query.category);
    if (query.isFeatured === "true") filter.isFeatured = true;
    if (query.minPrice) filter.minPrice = parseFloat(query.minPrice);
    if (query.maxPrice) filter.maxPrice = parseFloat(query.maxPrice);
    if (query.search) filter.search = query.search;
    if (query.vehicleBrand) filter.vehicleBrand = query.vehicleBrand;
    if (query.manufacturer) filter.manufacturer = query.manufacturer;

    const { data, total } = await this.productRepository.findAll(
      filter,
      skip,
      limit,
      query.sortBy || "createdAt",
      (query.sortOrder as "asc" | "desc") || "desc",
    );

    return buildPaginatedResponse(data.map(toProductResponse), total, {
      page,
      limit,
      skip,
    });
  }

  async findAllAdmin(
    query: ProductQueryDto,
    page: number,
    limit: number,
  ): Promise<PaginatedResponse<ProductResponse>> {
    const skip = (page - 1) * limit;
    const filter: ProductFilter = {};

    if (query.category) filter.categoryIds = await this.expandCategoryFilter(query.category);
    if (query.isFeatured === "true") filter.isFeatured = true;
    if (query.minPrice) filter.minPrice = parseFloat(query.minPrice);
    if (query.maxPrice) filter.maxPrice = parseFloat(query.maxPrice);
    if (query.search) filter.search = query.search;
    if (query.vehicleBrand) filter.vehicleBrand = query.vehicleBrand;
    if (query.manufacturer) filter.manufacturer = query.manufacturer;

    const { data, total } = await this.productRepository.findAll(
      filter,
      skip,
      limit,
      query.sortBy || "createdAt",
      (query.sortOrder as "asc" | "desc") || "desc",
    );

    return buildPaginatedResponse(data.map(toProductResponse), total, {
      page,
      limit,
      skip,
    });
  }

  async findOne(id: string): Promise<ProductResponse> {
    const product = await this.productRepository.findById(id);
    if (!product) throw new NotFoundError("Product");
    await this.productRepository.incrementViews(id);
    return toProductResponse(product);
  }

  async findBySlug(slug: string): Promise<ProductResponse> {
    const product = await this.productRepository.findBySlug(slug);
    if (!product) throw new NotFoundError("Product");
    await this.productRepository.incrementViews(String(product._id));
    return toProductResponse(product);
  }

  async update(id: string, dto: UpdateProductDto): Promise<ProductResponse> {
    const existing = await this.productRepository.findById(id);
    if (!existing) throw new NotFoundError("Product");

    const updateData: Record<string, unknown> = {};

    // Non-translatable fields
    if (dto.name && !dto.slug) {
      updateData.slug = await this.generateUniqueSlug(dto.name);
    } else if (dto.slug) {
      updateData.slug = dto.slug;
    }
    if (dto.price !== undefined) updateData.price = dto.price;
    if (dto.discountPercent !== undefined)
      updateData.discountPercent = dto.discountPercent;
    if (dto.category) updateData.category = dto.category;
    if (dto.images) {
      updateData.images = dto.images;
      // Delete images that were removed
      const oldImages = existing.images || [];
      const newImages = dto.images;
      const removedImages = oldImages.filter(
        (img: string) => !newImages.includes(img),
      );
      deleteFiles(removedImages);
    }
    if (dto.stock !== undefined) updateData.stock = dto.stock;
    if (dto.isActive !== undefined) updateData.isActive = dto.isActive;
    if (dto.isFeatured !== undefined) updateData.isFeatured = dto.isFeatured;
    if (dto.oem !== undefined) updateData.oem = dto.oem;
    if (dto.material !== undefined) updateData.material = dto.material;
    if (dto.application !== undefined) updateData.application = dto.application;
    if (dto.vehicleBrand !== undefined) updateData.vehicleBrand = dto.vehicleBrand;
    if (dto.dimensions !== undefined) updateData.dimensions = dto.dimensions;
    if (dto.crossReferences !== undefined) updateData.crossReferences = dto.crossReferences;

    // Translatable fields
    const fieldsToTranslate: Record<string, string> = {};
    if (dto.name) fieldsToTranslate.name = dto.name;
    if (dto.description) fieldsToTranslate.description = dto.description;
    if (dto.tags) fieldsToTranslate.tags = dto.tags;

    if (Object.keys(fieldsToTranslate).length > 0) {
      const translations = await geminiService.translate(fieldsToTranslate, {
        context:
          "filter-system factory product for industrial/household filters",
      });
      Object.assign(updateData, translations);
    }

    // Translate specifications if provided
    if (dto.specifications) {
      const translatedSpecs = await Promise.all(
        dto.specifications.map(async (spec) => {
          const specTranslation = await geminiService.translate(
            { key: spec.key, value: spec.value },
            { context: "product technical specification for filters" },
          );
          return { key: specTranslation.key, value: specTranslation.value };
        }),
      );
      updateData.specifications = translatedSpecs;
    }

    const updated = await this.productRepository.update(id, updateData as any);
    if (!updated) throw new NotFoundError("Product");
    const response = toProductResponse(updated);
    emitToAll("product:updated", response);
    return response;
  }

  async remove(id: string): Promise<void> {
    const product = await this.productRepository.findById(id);
    if (!product) throw new NotFoundError("Product");
    // Clean up uploaded images
    deleteFiles(product.images || []);
    await this.productRepository.delete(id);
    emitToAll("product:deleted", { id });
  }
}
