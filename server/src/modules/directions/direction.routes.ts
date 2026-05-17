import { Router } from "express";
import { DirectionController } from "./direction.controller";
import { DirectionService } from "./direction.service";
import { DirectionRepository } from "./direction.repository";
import { validate } from "../../shared/middleware/validate.middleware";
import { authenticate, authorize } from "../../shared/middleware/auth.middleware";
import { asyncHandler } from "../../shared/middleware/error-handler.middleware";
import { createDirectionSchema, updateDirectionSchema } from "./direction.schema";

const directionRepository = new DirectionRepository();
const directionService = new DirectionService(directionRepository);
const directionController = new DirectionController(directionService);

const router = Router();

router.get("/", asyncHandler(directionController.getAll));
router.get("/slug/:slug", asyncHandler(directionController.getBySlug));
router.get("/:id", asyncHandler(directionController.getOne));

router.post(
  "/",
  authenticate,
  authorize("ADMIN"),
  validate({ body: createDirectionSchema }),
  asyncHandler(directionController.create),
);
router.patch(
  "/:id",
  authenticate,
  authorize("ADMIN"),
  validate({ body: updateDirectionSchema }),
  asyncHandler(directionController.update),
);
router.delete(
  "/:id",
  authenticate,
  authorize("ADMIN"),
  asyncHandler(directionController.remove),
);

export default router;
