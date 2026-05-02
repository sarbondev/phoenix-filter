import express, { Application, Request, Response } from "express";
import path from "path";
import cors from "cors";
import helmet from "helmet";
import rateLimit from "express-rate-limit";
import { env } from "./config/env";
import { globalErrorHandler } from "./shared/middleware/error-handler.middleware";
import { requestLogger } from "./shared/middleware/request-logger.middleware";
import { localeMiddleware } from "./shared/middleware/locale.middleware";
import authRoutes from "./modules/auth/auth.routes";
import productRoutes from "./modules/products/product.routes";
import userRoutes from "./modules/users/user.routes";
import categoryRoutes from "./modules/categories/category.routes";
import orderRoutes from "./modules/orders/order.routes";
import cartRoutes from "./modules/cart/cart.routes";
import reviewRoutes from "./modules/reviews/review.routes";
import dashboardRoutes from "./modules/dashboard/dashboard.routes";
import seedRoutes from "./modules/auth/seed.routes";
import uploadRoutes from "./modules/upload/upload.routes";
import blogRoutes from "./modules/blogs/blog.routes";
import partnerRoutes from "./modules/partners/partner.routes";
import industryRoutes from "./modules/industries/industry.routes";
import productRequestRoutes from "./modules/product-requests/product-request.routes";
import siteSettingsRoutes from "./modules/site-settings/site-settings.routes";
import heroContentRoutes from "./modules/hero-content/hero-content.routes";
import homeContentRoutes from "./modules/home-content/home-content.routes";
import certificateRoutes from "./modules/certificates/certificate.routes";
import faqRoutes from "./modules/faq/faq.routes";

export const createApp = (): Application => {
  const app = express();

  // ── Security ───────────────────────────────────────────────────────────────
  app.use(helmet());
  app.use(
    cors({
      origin:
        env.NODE_ENV === "production"
          ? process.env["ALLOWED_ORIGINS"]?.split(",")
          : "*",
      methods: ["GET", "POST", "PATCH", "PUT", "DELETE", "OPTIONS"],
      allowedHeaders: ["Content-Type", "Authorization"],
    }),
  );
  app.use(
    rateLimit({
      windowMs: env.RATE_LIMIT_WINDOW_MS,
      max: env.RATE_LIMIT_MAX_REQUESTS,
      standardHeaders: true,
      legacyHeaders: false,
      message: {
        success: false,
        message: "Too many requests, please try again later.",
      },
    }),
  );

  // ── Parsing ────────────────────────────────────────────────────────────────
  app.use(express.json({ limit: "10mb" }));
  app.use(express.urlencoded({ extended: true }));

  // ── Static files ─────────────────────────────────────────────────────────
  app.use("/uploads", express.static(path.join(process.cwd(), "uploads")));

  // ── Locale ───────────────────────────────────────────────────────────────
  app.use(localeMiddleware);

  // ── Logging ────────────────────────────────────────────────────────────────
  app.use(requestLogger);

  // ── Health check ───────────────────────────────────────────────────────────
  app.get("/health", (_req: Request, res: Response) => {
    res.json({
      status: "ok",
      timestamp: new Date().toISOString(),
      env: env.NODE_ENV,
      version: process.env["npm_package_version"] ?? "1.0.0",
    });
  });

  // ── Routes ─────────────────────────────────────────────────────────────────
  const api = env.API_PREFIX;
  app.use(`${api}/auth`, authRoutes);
  app.use(`${api}/users`, userRoutes);
  app.use(`${api}/categories`, categoryRoutes);
  app.use(`${api}/products`, productRoutes);
  app.use(`${api}/orders`, orderRoutes);
  app.use(`${api}/cart`, cartRoutes);
  app.use(`${api}/reviews`, reviewRoutes);
  app.use(`${api}/dashboard`, dashboardRoutes);
  app.use(`${api}/seed`, seedRoutes);
  app.use(`${api}/upload`, uploadRoutes);
  app.use(`${api}/blogs`, blogRoutes);
  app.use(`${api}/partners`, partnerRoutes);
  app.use(`${api}/industries`, industryRoutes);
  app.use(`${api}/product-requests`, productRequestRoutes);
  app.use(`${api}/site-settings`, siteSettingsRoutes);
  app.use(`${api}/hero-content`, heroContentRoutes);
  app.use(`${api}/home-content`, homeContentRoutes);
  app.use(`${api}/certificates`, certificateRoutes);
  app.use(`${api}/faq`, faqRoutes);
  // ── 404 ────────────────────────────────────────────────────────────────────
  app.use((_req: Request, res: Response) => {
    res.status(404).json({ success: false, message: "Route not found" });
  });

  // ── Global error handler (must be last) ───────────────────────────────────
  app.use(globalErrorHandler);

  return app;
};
