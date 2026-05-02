import { Router } from "express";
import { HomeContentController } from "./home-content.controller";
import { HomeContentService } from "./home-content.service";
import { HomeContentRepository } from "./home-content.repository";
import { validate } from "../../shared/middleware/validate.middleware";
import {
  authenticate,
  authorize,
} from "../../shared/middleware/auth.middleware";
import { asyncHandler } from "../../shared/middleware/error-handler.middleware";
import { updateHomeContentSchema } from "./home-content.schema";

const repo = new HomeContentRepository();
const service = new HomeContentService(repo);
const controller = new HomeContentController(service);

const router = Router();

router.get("/", asyncHandler(controller.get));

router.patch(
  "/",
  authenticate,
  authorize("ADMIN"),
  validate({ body: updateHomeContentSchema }),
  asyncHandler(controller.update),
);

export default router;
