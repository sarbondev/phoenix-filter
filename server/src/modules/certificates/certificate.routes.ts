import { Router } from "express";
import { CertificateController } from "./certificate.controller";
import { CertificateService } from "./certificate.service";
import { CertificateRepository } from "./certificate.repository";
import { validate } from "../../shared/middleware/validate.middleware";
import {
  authenticate,
  authorize,
} from "../../shared/middleware/auth.middleware";
import { asyncHandler } from "../../shared/middleware/error-handler.middleware";
import {
  createCertificateSchema,
  updateCertificateSchema,
} from "./certificate.schema";

const repo = new CertificateRepository();
const service = new CertificateService(repo);
const controller = new CertificateController(service);

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
  validate({ body: createCertificateSchema }),
  asyncHandler(controller.create),
);
router.patch(
  "/:id",
  authenticate,
  authorize("ADMIN"),
  validate({ body: updateCertificateSchema }),
  asyncHandler(controller.update),
);
router.delete(
  "/:id",
  authenticate,
  authorize("ADMIN"),
  asyncHandler(controller.remove),
);

export default router;
