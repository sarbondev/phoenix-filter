import { Router } from "express";
import { FaqController } from "./faq.controller";
import { FaqService } from "./faq.service";
import { FaqRepository } from "./faq.repository";
import { validate } from "../../shared/middleware/validate.middleware";
import {
  authenticate,
  authorize,
} from "../../shared/middleware/auth.middleware";
import { asyncHandler } from "../../shared/middleware/error-handler.middleware";
import { createFaqSchema, updateFaqSchema } from "./faq.schema";

const repo = new FaqRepository();
const service = new FaqService(repo);
const controller = new FaqController(service);

const router = Router();

router.get("/", asyncHandler(controller.getActive));

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
  validate({ body: createFaqSchema }),
  asyncHandler(controller.create),
);
router.patch(
  "/:id",
  authenticate,
  authorize("ADMIN"),
  validate({ body: updateFaqSchema }),
  asyncHandler(controller.update),
);
router.delete(
  "/:id",
  authenticate,
  authorize("ADMIN"),
  asyncHandler(controller.remove),
);

export default router;
