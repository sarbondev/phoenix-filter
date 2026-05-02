import { Router } from "express";
import { SiteSettingsController } from "./site-settings.controller";
import { SiteSettingsService } from "./site-settings.service";
import { SiteSettingsRepository } from "./site-settings.repository";
import { validate } from "../../shared/middleware/validate.middleware";
import {
  authenticate,
  authorize,
} from "../../shared/middleware/auth.middleware";
import { asyncHandler } from "../../shared/middleware/error-handler.middleware";
import { updateSiteSettingsSchema } from "./site-settings.schema";

const repo = new SiteSettingsRepository();
const service = new SiteSettingsService(repo);
const controller = new SiteSettingsController(service);

const router = Router();

// Public — homepage uses this
router.get("/", asyncHandler(controller.get));

// Admin
router.patch(
  "/",
  authenticate,
  authorize("ADMIN"),
  validate({ body: updateSiteSettingsSchema }),
  asyncHandler(controller.update),
);

export default router;
