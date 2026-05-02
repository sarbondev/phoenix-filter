import { Router } from "express";
import { HeroContentController } from "./hero-content.controller";
import { HeroContentService } from "./hero-content.service";
import { HeroContentRepository } from "./hero-content.repository";
import { validate } from "../../shared/middleware/validate.middleware";
import {
  authenticate,
  authorize,
} from "../../shared/middleware/auth.middleware";
import { asyncHandler } from "../../shared/middleware/error-handler.middleware";
import { updateHeroContentSchema } from "./hero-content.schema";

const repo = new HeroContentRepository();
const service = new HeroContentService(repo);
const controller = new HeroContentController(service);

const router = Router();

router.get("/", asyncHandler(controller.get));

router.patch(
  "/",
  authenticate,
  authorize("ADMIN"),
  validate({ body: updateHeroContentSchema }),
  asyncHandler(controller.update),
);

export default router;
