import { Router } from 'express';
import { ProductRequestController } from './product-request.controller';
import { ProductRequestService } from './product-request.service';
import { ProductRequestRepository } from './product-request.repository';
import { validate } from '../../shared/middleware/validate.middleware';
import {
  authenticate,
  authorize,
} from '../../shared/middleware/auth.middleware';
import { asyncHandler } from '../../shared/middleware/error-handler.middleware';
import {
  createProductRequestSchema,
  updateProductRequestStatusSchema,
} from './product-request.schema';

const repository = new ProductRequestRepository();
const service = new ProductRequestService(repository);
const controller = new ProductRequestController(service);

const router = Router();

// Public — anyone can submit a missing-product request
router.post(
  '/',
  validate({ body: createProductRequestSchema }),
  asyncHandler(controller.create),
);

// Admin
router.get(
  '/',
  authenticate,
  authorize('ADMIN', 'CALL_MANAGER'),
  asyncHandler(controller.getAll),
);
router.get(
  '/:id',
  authenticate,
  authorize('ADMIN', 'CALL_MANAGER'),
  asyncHandler(controller.getOne),
);
router.patch(
  '/:id/status',
  authenticate,
  authorize('ADMIN', 'CALL_MANAGER'),
  validate({ body: updateProductRequestStatusSchema }),
  asyncHandler(controller.updateStatus),
);
router.delete(
  '/:id',
  authenticate,
  authorize('ADMIN', 'CALL_MANAGER'),
  asyncHandler(controller.remove),
);

export default router;
