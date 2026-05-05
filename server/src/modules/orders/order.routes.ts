import { Router } from 'express';
import { OrderController } from './order.controller';
import { OrderService } from './order.service';
import { OrderRepository } from './order.repository';
import { ProductRepository } from '../products/product.repository';
import { validate } from '../../shared/middleware/validate.middleware';
import { authenticate, authorize } from '../../shared/middleware/auth.middleware';
import { asyncHandler } from '../../shared/middleware/error-handler.middleware';
import { createOrderSchema, updateOrderStatusSchema } from './order.schema';

const orderRepository = new OrderRepository();
const productRepository = new ProductRepository();
const orderService = new OrderService(orderRepository, productRepository);
const orderController = new OrderController(orderService);

const router = Router();

// Customer routes
router.post(
  '/',
  authenticate,
  validate({ body: createOrderSchema }),
  asyncHandler(orderController.create as any),
);
router.get('/my', authenticate, asyncHandler(orderController.getMyOrders as any));
router.get('/my/:id', authenticate, asyncHandler(orderController.getOne as any));
// Lookup the customer's own order by its human-friendly number (used by the
// post-checkout confirmation page so it's bookmarkable).
router.get(
  '/by-number/:orderNumber',
  authenticate,
  asyncHandler(orderController.getByNumber as any),
);

// Admin routes
router.get(
  '/',
  authenticate,
  authorize('ADMIN', 'CALL_MANAGER'),
  asyncHandler(orderController.getAll),
);
router.get(
  '/stats',
  authenticate,
  authorize('ADMIN', 'CALL_MANAGER'),
  asyncHandler(orderController.getStats),
);
router.patch(
  '/:id/status',
  authenticate,
  authorize('ADMIN', 'CALL_MANAGER'),
  validate({ body: updateOrderStatusSchema }),
  asyncHandler(orderController.updateStatus),
);

export default router;
