import { Router } from 'express';
import { PresentationController } from './presentation.controller';
import { PresentationService } from './presentation.service';
import { PresentationRepository } from './presentation.repository';
import { validate } from '../../shared/middleware/validate.middleware';
import { authenticate, authorize } from '../../shared/middleware/auth.middleware';
import { asyncHandler } from '../../shared/middleware/error-handler.middleware';
import { createPresentationSchema, updatePresentationSchema } from './presentation.schema';

const repository = new PresentationRepository();
const service = new PresentationService(repository);
const controller = new PresentationController(service);

const router = Router();

// Admin only — presentations are admin-managed resources
router.get('/', authenticate, authorize('ADMIN'), asyncHandler(controller.getAll));
router.get('/:id', authenticate, authorize('ADMIN'), asyncHandler(controller.getOne));
router.post(
  '/',
  authenticate,
  authorize('ADMIN'),
  validate({ body: createPresentationSchema }),
  asyncHandler(controller.create),
);
router.patch(
  '/:id',
  authenticate,
  authorize('ADMIN'),
  validate({ body: updatePresentationSchema }),
  asyncHandler(controller.update),
);
router.delete('/:id', authenticate, authorize('ADMIN'), asyncHandler(controller.remove));

export default router;
