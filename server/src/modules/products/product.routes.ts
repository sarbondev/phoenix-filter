import { Router } from 'express';
import { ProductController } from './product.controller';
import { ProductService } from './product.service';
import { ProductRepository } from './product.repository';
import { validate } from '../../shared/middleware/validate.middleware';
import { authenticate, authorize } from '../../shared/middleware/auth.middleware';
import { asyncHandler } from '../../shared/middleware/error-handler.middleware';
import { createProductSchema, updateProductSchema, productQuerySchema } from './product.schema';
import { z } from 'zod';

const objectIdSchema = z.object({
  id: z.string().regex(/^[a-f0-9]{24}$/, 'Invalid id'),
});
const slugParamSchema = z.object({
  slug: z.string().min(1).max(300).regex(/^[a-z0-9-]+$/),
});

const productRepository = new ProductRepository();
const productService = new ProductService(productRepository);
const productController = new ProductController(productService);

const router = Router();

// Public routes
router.get('/', validate({ query: productQuerySchema }), asyncHandler(productController.getAll));
router.get(
  '/slug/:slug',
  validate({ params: slugParamSchema }),
  asyncHandler(productController.getBySlug),
);

// Admin routes
router.get(
  '/admin/all',
  authenticate,
  authorize('ADMIN'),
  validate({ query: productQuerySchema }),
  asyncHandler(productController.getAllAdmin),
);

// Parameterized route must come after /slug/:slug and /admin/all
router.get(
  '/:id',
  validate({ params: objectIdSchema }),
  asyncHandler(productController.getOne),
);
router.post(
  '/',
  authenticate,
  authorize('ADMIN'),
  validate({ body: createProductSchema }),
  asyncHandler(productController.create),
);
router.patch(
  '/:id',
  authenticate,
  authorize('ADMIN'),
  validate({ params: objectIdSchema, body: updateProductSchema }),
  asyncHandler(productController.update),
);
router.delete(
  '/:id',
  authenticate,
  authorize('ADMIN'),
  validate({ params: objectIdSchema }),
  asyncHandler(productController.remove),
);

export default router;
