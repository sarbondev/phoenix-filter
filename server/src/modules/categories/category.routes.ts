import { Router } from 'express';
import { CategoryController } from './category.controller';
import { CategoryService } from './category.service';
import { CategoryRepository } from './category.repository';
import { validate } from '../../shared/middleware/validate.middleware';
import { authenticate, authorize } from '../../shared/middleware/auth.middleware';
import { asyncHandler } from '../../shared/middleware/error-handler.middleware';
import { createCategorySchema, updateCategorySchema } from './category.schema';

const categoryRepository = new CategoryRepository();
const categoryService = new CategoryService(categoryRepository);
const categoryController = new CategoryController(categoryService);

const router = Router();

// Public routes
router.get('/', asyncHandler(categoryController.getAll));
router.get('/slug/:slug', asyncHandler(categoryController.getBySlug));
router.get('/:id', asyncHandler(categoryController.getOne));

// Admin routes
router.post(
  '/',
  authenticate,
  authorize('ADMIN'),
  validate({ body: createCategorySchema }),
  asyncHandler(categoryController.create),
);
router.patch(
  '/:id',
  authenticate,
  authorize('ADMIN'),
  validate({ body: updateCategorySchema }),
  asyncHandler(categoryController.update),
);
router.delete(
  '/:id',
  authenticate,
  authorize('ADMIN'),
  asyncHandler(categoryController.remove),
);

export default router;
