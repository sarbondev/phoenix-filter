import { Document, Types } from "mongoose";

export type OrderStatus =
  | "PENDING"
  | "CONFIRMED"
  | "PROCESSING"
  | "SHIPPED"
  | "DELIVERED"
  | "CANCELLED";

export interface IOrderItem {
  product: Types.ObjectId;
  quantity: number;
  price: number;
  total: number;
}

export interface IShippingAddress {
  fullName: string;
  phoneNumber: string;
  region: string;
  district: string;
  address: string;
  note?: string;
}

export interface IOrder extends Document {
  _id: Types.ObjectId;
  orderNumber: string;
  user: Types.ObjectId;
  items: IOrderItem[];
  subtotal: number;
  shippingCost: number;
  totalAmount: number;
  status: OrderStatus;
  shippingAddress: IShippingAddress;
  note?: string;
  cancelReason?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface OrderResponse {
  id: string;
  orderNumber: string;
  user: string | Record<string, unknown>;
  items: Array<{
    product: string | Record<string, unknown>;
    quantity: number;
    price: number;
    total: number;
  }>;
  subtotal: number;
  shippingCost: number;
  totalAmount: number;
  status: OrderStatus;
  shippingAddress: IShippingAddress;
  note?: string;
  cancelReason?: string;
  createdAt: Date;
}

export const toOrderResponse = (order: IOrder): OrderResponse => ({
  id: String(order._id),
  orderNumber: order.orderNumber,
  user:
    order.user && typeof order.user === "object" && "name" in order.user
      ? (order.user as unknown as Record<string, unknown>)
      : String(order.user),
  items: order.items.map((item) => ({
    product:
      item.product && typeof item.product === "object" && "name" in item.product
        ? (item.product as unknown as Record<string, unknown>)
        : String(item.product),
    quantity: item.quantity,
    price: item.price,
    total: item.total,
  })),
  subtotal: order.subtotal,
  shippingCost: order.shippingCost,
  totalAmount: order.totalAmount,
  status: order.status,
  shippingAddress: order.shippingAddress,
  note: order.note,
  cancelReason: order.cancelReason,
  createdAt: order.createdAt,
});
