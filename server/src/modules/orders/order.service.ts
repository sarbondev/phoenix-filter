import { OrderRepository } from "./order.repository";
import { OrderResponse, toOrderResponse } from "./order.entity";
import { CreateOrderDto, UpdateOrderStatusDto } from "./order.schema";
import {
  NotFoundError,
  AppError,
} from "../../shared/middleware/error-handler.middleware";
import { ProductRepository } from "../products/product.repository";
import { PaginatedResponse } from "../../shared/types/common.types";
import { buildPaginatedResponse } from "../../shared/utils/pagination";
import { emitToUser, emitToStaff } from "../../shared/services/socket.service";

export class OrderService {
  constructor(
    private readonly orderRepository: OrderRepository,
    private readonly productRepository: ProductRepository,
  ) {}

  async create(userId: string, dto: CreateOrderDto): Promise<OrderResponse> {
    let subtotal = 0;
    const orderItems = [];

    for (const item of dto.items) {
      const product = await this.productRepository.findById(item.product);
      if (!product) throw new NotFoundError(`Product ${item.product}`);
      if (!product.isActive)
        throw new AppError(`Product ${product.name.en} is not available`, 400);
      if (product.stock < item.quantity) {
        throw new AppError(
          `Insufficient stock for ${product.name.en}. Available: ${product.stock}`,
          400,
        );
      }

      const price = product.discountPercent
        ? Math.round(product.price * (1 - product.discountPercent / 100))
        : product.price;
      const total = price * item.quantity;
      subtotal += total;

      orderItems.push({
        product: product._id,
        quantity: item.quantity,
        price,
        total,
      });
    }

    const shippingCost = subtotal >= 500000 ? 0 : 30000; // Free shipping over 500,000 UZS
    const totalAmount = subtotal + shippingCost;
    const orderNumber = await this.orderRepository.generateOrderNumber();

    const order = await this.orderRepository.create({
      orderNumber,
      user: userId as any,
      items: orderItems as any,
      subtotal,
      shippingCost,
      totalAmount,
      shippingAddress: dto.shippingAddress,
      note: dto.note,
    });

    // Decrease stock
    for (const item of dto.items) {
      await this.productRepository.updateStock(item.product, -item.quantity);
    }

    const populated = await this.orderRepository.findById(String(order._id));

    // Notify staff about new order
    emitToStaff("order:new", toOrderResponse(populated!));

    return toOrderResponse(populated!);
  }

  async findMyOrders(
    userId: string,
    page: number,
    limit: number,
  ): Promise<PaginatedResponse<OrderResponse>> {
    const skip = (page - 1) * limit;
    const { data, total } = await this.orderRepository.findByUser(
      userId,
      skip,
      limit,
    );
    return buildPaginatedResponse(data.map(toOrderResponse), total, {
      page,
      limit,
      skip,
    });
  }

  async findOne(id: string, userId?: string): Promise<OrderResponse> {
    const order = await this.orderRepository.findById(id);
    if (!order) throw new NotFoundError("Order");
    if (userId && String(order.user) !== userId && !(order.user as any)._id) {
      // Check if populated
      const orderUserId =
        typeof order.user === "object" && "_id" in order.user
          ? String((order.user as any)._id)
          : String(order.user);
      if (orderUserId !== userId) throw new NotFoundError("Order");
    }
    return toOrderResponse(order);
  }

  async findByOrderNumber(orderNumber: string, userId: string): Promise<OrderResponse> {
    const order = await this.orderRepository.findByOrderNumber(orderNumber);
    if (!order) throw new NotFoundError("Order");
    const orderUserId =
      typeof order.user === "object" && "_id" in order.user
        ? String((order.user as any)._id)
        : String(order.user);
    if (orderUserId !== userId) throw new NotFoundError("Order");
    return toOrderResponse(order);
  }

  async findAll(
    page: number,
    limit: number,
    status?: string,
    search?: string,
  ): Promise<PaginatedResponse<OrderResponse>> {
    const skip = (page - 1) * limit;
    const filter: Record<string, unknown> = {};
    if (status) filter.status = status;
    if (search) {
      // Escape regex metacharacters from user input.
      const safe = search.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
      filter.$or = [
        { orderNumber: { $regex: safe, $options: "i" } },
        { "shippingAddress.fullName": { $regex: safe, $options: "i" } },
        { "shippingAddress.phoneNumber": { $regex: safe, $options: "i" } },
      ];
    }
    const { data, total } = await this.orderRepository.findAll(
      filter,
      skip,
      limit,
    );
    return buildPaginatedResponse(data.map(toOrderResponse), total, {
      page,
      limit,
      skip,
    });
  }

  async updateStatus(
    id: string,
    dto: UpdateOrderStatusDto,
  ): Promise<OrderResponse> {
    const order = await this.orderRepository.findById(id);
    if (!order) throw new NotFoundError("Order");

    if (order.status === "CANCELLED")
      throw new AppError("Cannot update cancelled order", 400);
    if (order.status === "DELIVERED")
      throw new AppError("Cannot update delivered order", 400);

    const updateData: Record<string, unknown> = { status: dto.status };

    if (dto.status === "CANCELLED") {
      updateData.cancelReason = dto.cancelReason || "No reason provided";
      // Restore stock
      for (const item of order.items) {
        await this.productRepository.updateStock(
          String(item.product),
          item.quantity,
        );
      }
    }

    const updated = await this.orderRepository.update(id, updateData as any);

    // Notify the customer about status change
    const orderUserId =
      typeof order.user === "object" && "_id" in order.user
        ? String((order.user as any)._id)
        : String(order.user);
    emitToUser(orderUserId, "order:statusUpdated", toOrderResponse(updated!));
    emitToStaff("order:statusUpdated", toOrderResponse(updated!));

    return toOrderResponse(updated!);
  }

  async getStats(): Promise<Record<string, number>> {
    return this.orderRepository.countByStatus();
  }
}
