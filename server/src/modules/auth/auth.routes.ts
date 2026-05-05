import { Router } from "express";
import rateLimit from "express-rate-limit";
import { AuthController } from "./auth.controller";
import { AuthService } from "./auth.service";
import { UserRepository } from "../users/user.repository";
import { validate } from "../../shared/middleware/validate.middleware";
import { authenticate } from "../../shared/middleware/auth.middleware";
import { asyncHandler } from "../../shared/middleware/error-handler.middleware";
import { createUserSchema, loginSchema, updateProfileSchema, changePasswordSchema } from "../users/user.schema";

const userRepository = new UserRepository();
const authService = new AuthService(userRepository);
const authController = new AuthController(authService);

const router = Router();

// Stricter limit on credential-handling endpoints to slow brute-force.
// Keyed by IP + phoneNumber so a single attacker can't try many accounts
// from one IP, and a single account can't be hammered from many IPs.
const credentialLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,
  standardHeaders: true,
  legacyHeaders: false,
  keyGenerator: (req) => {
    const phone = (req.body && (req.body as { phoneNumber?: string }).phoneNumber) ?? "";
    return `${req.ip}|${phone}`;
  },
  message: {
    success: false,
    message: "Too many attempts. Please try again later.",
  },
});

router.post(
  "/register",
  credentialLimiter,
  validate({ body: createUserSchema }),
  asyncHandler(authController.register),
);

router.post(
  "/login",
  credentialLimiter,
  validate({ body: loginSchema }),
  asyncHandler(authController.login),
);

router.get("/me", authenticate, asyncHandler(authController.me));

router.patch(
  "/profile",
  authenticate,
  validate({ body: updateProfileSchema }),
  asyncHandler(authController.updateProfile),
);

router.post(
  "/change-password",
  authenticate,
  validate({ body: changePasswordSchema }),
  asyncHandler(authController.changePassword),
);

export default router;
