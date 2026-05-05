import { Router } from "express";
import { UserController } from "./user.controller";
import { UserService } from "./user.service";
import { UserRepository } from "./user.repository";
import { validate } from "../../shared/middleware/validate.middleware";
import {
  authenticate,
  authorize,
} from "../../shared/middleware/auth.middleware";
import { asyncHandler } from "../../shared/middleware/error-handler.middleware";
import { adminCreateUserSchema, updateUserSchema } from "./user.schema";

const userRepository = new UserRepository();
const userService = new UserService(userRepository);
const userController = new UserController(userService);

const router = Router();

router.use(authenticate, authorize("ADMIN"));

router.get("/", asyncHandler(userController.getAll));
router.get("/:id", asyncHandler(userController.getOne));
router.post(
  "/",
  validate({ body: adminCreateUserSchema }),
  asyncHandler(userController.create),
);
router.patch(
  "/:id",
  validate({ body: updateUserSchema }),
  asyncHandler(userController.update),
);
router.delete("/:id", asyncHandler(userController.remove));

export default router;
