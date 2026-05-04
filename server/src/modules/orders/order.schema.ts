import { Schema, model } from 'mongoose';
import { z } from 'zod';
import { IOrder } from './order.entity';

const orderItemSchema = new Schema(
  {
    product: { type: Schema.Types.ObjectId, ref: 'Product', required: true },
    quantity: { type: Number, required: true, min: 1 },
    price: { type: Number, required: true, min: 0 },
    total: { type: Number, required: true, min: 0 },
  },
  { _id: false },
);

const shippingAddressSchema = new Schema(
  {
    fullName: { type: String, required: true },
    phoneNumber: { type: String, required: true },
    region: { type: String, required: true },
    district: { type: String, required: true },
    address: { type: String, required: true },
    note: { type: String },
  },
  { _id: false },
);

const orderMongoSchema = new Schema<IOrder>(
  {
    orderNumber: { type: String, required: true, unique: true },
    user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    items: [orderItemSchema],
    subtotal: { type: Number, required: true, min: 0 },
    shippingCost: { type: Number, required: true, default: 0, min: 0 },
    totalAmount: { type: Number, required: true, min: 0 },
    status: {
      type: String,
      enum: ['PENDING', 'CONFIRMED', 'PROCESSING', 'SHIPPED', 'DELIVERED', 'CANCELLED'],
      default: 'PENDING',
    },
    shippingAddress: { type: shippingAddressSchema, required: true },
    note: { type: String },
    cancelReason: { type: String },
  },
  { timestamps: true, versionKey: false },
);

orderMongoSchema.index({ orderNumber: 1 });
orderMongoSchema.index({ user: 1, createdAt: -1 });
orderMongoSchema.index({ status: 1 });

export const OrderModel = model<IOrder>('Order', orderMongoSchema);

// Zod schemas
const orderItemInputSchema = z.object({
  product: z.string().min(1),
  quantity: z.number().int().min(1),
});

const shippingAddressInputSchema = z.object({
  fullName: z.string().min(1).max(200),
  phoneNumber: z.string().min(1).max(20),
  region: z.string().min(1).max(200),
  district: z.string().min(1).max(200),
  address: z.string().min(1).max(500),
  note: z.string().max(500).optional(),
});

export const createOrderSchema = z.object({
  items: z.array(orderItemInputSchema).min(1),
  shippingAddress: shippingAddressInputSchema,
  note: z.string().max(500).optional(),
});
export type CreateOrderDto = z.infer<typeof createOrderSchema>;

export const updateOrderStatusSchema = z.object({
  status: z.enum(['PENDING', 'CONFIRMED', 'PROCESSING', 'SHIPPED', 'DELIVERED', 'CANCELLED']),
  cancelReason: z.string().max(500).optional(),
});
export type UpdateOrderStatusDto = z.infer<typeof updateOrderStatusSchema>;
