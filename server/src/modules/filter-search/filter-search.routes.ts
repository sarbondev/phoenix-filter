import { Router } from "express";
import { FilterSearchController } from "./filter-search.controller";
import { FilterSearchService } from "./filter-search.service";
import { ProductRepository } from "../products/product.repository";
import { ProductRequestRepository } from "../product-requests/product-request.repository";
import { validate } from "../../shared/middleware/validate.middleware";
import { asyncHandler } from "../../shared/middleware/error-handler.middleware";
import {
  oemSearchSchema,
  analogSearchSchema,
  sizeSearchSchema,
  machineSearchSchema,
  photoSearchSchema,
} from "./filter-search.schema";

const productRepository = new ProductRepository();
const productRequestRepository = new ProductRequestRepository();
const service = new FilterSearchService(productRepository, productRequestRepository);
const controller = new FilterSearchController(service);

const router = Router();

router.post(
  "/oem",
  validate({ body: oemSearchSchema }),
  asyncHandler(controller.byOem),
);
router.post(
  "/analog",
  validate({ body: analogSearchSchema }),
  asyncHandler(controller.byAnalog),
);
router.post(
  "/size",
  validate({ body: sizeSearchSchema }),
  asyncHandler(controller.bySize),
);
router.post(
  "/machine",
  validate({ body: machineSearchSchema }),
  asyncHandler(controller.byMachine),
);
router.post(
  "/photo",
  validate({ body: photoSearchSchema }),
  asyncHandler(controller.byPhoto),
);

export default router;
