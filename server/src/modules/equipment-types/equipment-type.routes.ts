import { Router } from "express";
import { EquipmentTypeController } from "./equipment-type.controller";
import { EquipmentTypeService } from "./equipment-type.service";
import { EquipmentTypeRepository } from "./equipment-type.repository";
import { validate } from "../../shared/middleware/validate.middleware";
import { authenticate, authorize } from "../../shared/middleware/auth.middleware";
import { asyncHandler } from "../../shared/middleware/error-handler.middleware";
import {
  createEquipmentTypeSchema,
  updateEquipmentTypeSchema,
} from "./equipment-type.schema";

const repository = new EquipmentTypeRepository();
const service = new EquipmentTypeService(repository);
const controller = new EquipmentTypeController(service);

const router = Router();

router.get("/", asyncHandler(controller.getActive));
router.get("/slug/:slug", asyncHandler(controller.getBySlug));

router.get(
  "/all",
  authenticate,
  authorize("ADMIN"),
  asyncHandler(controller.getAll),
);
router.get(
  "/:id",
  authenticate,
  authorize("ADMIN"),
  asyncHandler(controller.getOne),
);
router.post(
  "/",
  authenticate,
  authorize("ADMIN"),
  validate({ body: createEquipmentTypeSchema }),
  asyncHandler(controller.create),
);
router.patch(
  "/:id",
  authenticate,
  authorize("ADMIN"),
  validate({ body: updateEquipmentTypeSchema }),
  asyncHandler(controller.update),
);
router.delete(
  "/:id",
  authenticate,
  authorize("ADMIN"),
  asyncHandler(controller.remove),
);

export default router;
