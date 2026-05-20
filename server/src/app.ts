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
import directionRoutes from "./modules/directions/direction.routes";
import orderRoutes from "./modules/orders/order.routes";
import cartRoutes from "./modules/cart/cart.routes";
import reviewRoutes from "./modules/reviews/review.routes";
import dashboardRoutes from "./modules/dashboard/dashboard.routes";
import uploadRoutes from "./modules/upload/upload.routes";
import blogRoutes from "./modules/blogs/blog.routes";
import partnerRoutes from "./modules/partners/partner.routes";
import industryRoutes from "./modules/industries/industry.routes";
import productRequestRoutes from "./modules/product-requests/product-request.routes";
import siteSettingsRoutes from "./modules/site-settings/site-settings.routes";
import homeContentRoutes from "./modules/home-content/home-content.routes";
import certificateRoutes from "./modules/certificates/certificate.routes";
import faqRoutes from "./modules/faq/faq.routes";
import presentationRoutes from "./modules/presentations/presentation.routes";
import equipmentTypeRoutes from "./modules/equipment-types/equipment-type.routes";
import filterSearchRoutes from "./modules/filter-search/filter-search.routes";

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
  // Tight body limits — file uploads go through Multer (5MB) on a separate
  // route. JSON payloads here should never approach 100KB.
  app.use(express.json({ limit: "100kb" }));
  app.use(express.urlencoded({ extended: true, limit: "100kb" }));

  // ── Static files ─────────────────────────────────────────────────────────
  // Served with hardened headers: no MIME sniffing, isolating CSP, and any
  // legacy SVG/HTML is forced to download instead of rendering inline.
  app.use(
    "/uploads",
    express.static(path.join(process.cwd(), "uploads"), {
      setHeaders: (res, filePath) => {
        res.setHeader("X-Content-Type-Options", "nosniff");
        res.setHeader("Cross-Origin-Resource-Policy", "same-site");
        res.setHeader(
          "Content-Security-Policy",
          "default-src 'none'; img-src 'self'; style-src 'unsafe-inline'; sandbox",
        );
        const lower = filePath.toLowerCase();
        if (lower.endsWith(".svg") || lower.endsWith(".html") || lower.endsWith(".htm")) {
          res.setHeader("Content-Disposition", "attachment");
        }
      },
    }),
  );

  // ── Locale ───────────────────────────────────────────────────────────────
  app.use(localeMiddleware);

  // ── Logging ────────────────────────────────────────────────────────────────
  app.use(requestLogger);

  // ── Health check ───────────────────────────────────────────────────────────
  // Minimal — load balancers only need a 2xx. No env/version disclosure.
  app.get("/health", (_req: Request, res: Response) => {
    res.json({ status: "ok" });
  });

  // ── Routes ─────────────────────────────────────────────────────────────────
  const api = env.API_PREFIX;
  app.use(`${api}/auth`, authRoutes);
  app.use(`${api}/users`, userRoutes);
  app.use(`${api}/directions`, directionRoutes);
  app.use(`${api}/categories`, categoryRoutes);
  app.use(`${api}/products`, productRoutes);
  app.use(`${api}/orders`, orderRoutes);
  app.use(`${api}/cart`, cartRoutes);
  app.use(`${api}/reviews`, reviewRoutes);
  app.use(`${api}/dashboard`, dashboardRoutes);
  app.use(`${api}/upload`, uploadRoutes);
  app.use(`${api}/blogs`, blogRoutes);
  app.use(`${api}/partners`, partnerRoutes);
  app.use(`${api}/industries`, industryRoutes);
  app.use(`${api}/product-requests`, productRequestRoutes);
  app.use(`${api}/site-settings`, siteSettingsRoutes);
  app.use(`${api}/home-content`, homeContentRoutes);
  app.use(`${api}/certificates`, certificateRoutes);
  app.use(`${api}/faq`, faqRoutes);
  app.use(`${api}/presentations`, presentationRoutes);
  app.use(`${api}/equipment-types`, equipmentTypeRoutes);
  app.use(`${api}/filter-search`, filterSearchRoutes);
  // ── 404 ────────────────────────────────────────────────────────────────────
  app.use((_req: Request, res: Response) => {
    res.status(404).json({ success: false, message: "Route not found" });
  });

  // ── Global error handler (must be last) ───────────────────────────────────
  app.use(globalErrorHandler);

  return app;
};
