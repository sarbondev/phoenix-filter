import { Router, Request, Response } from "express";
import bcrypt from "bcryptjs";
import { UserModel } from "../users/user.schema";
import { CategoryModel } from "../categories/category.schema";
import { ProductModel } from "../products/product.schema";
import { geminiService } from "../../shared/services/gemini.service";
import { logger } from "../../shared/utils/logger";

const router = Router();

/**
 * POST /api/seed/admin
 * Creates the first ADMIN user if none exists.
 * Body: { phoneNumber, password, name }
 */
router.post("/admin", async (req: Request, res: Response) => {
  try {
    const adminExists = await UserModel.findOne({ role: "ADMIN" });
    if (adminExists) {
      res.status(409).json({
        success: false,
        message: "Admin user already exists. Use login instead.",
      });
      return;
    }

    const { phoneNumber, password, name } = req.body as {
      phoneNumber?: string;
      password?: string;
      name?: string;
    };

    if (!phoneNumber || !password || !name) {
      res.status(400).json({
        success: false,
        message: "phoneNumber, password, and name are required",
      });
      return;
    }

    const hashed = await bcrypt.hash(password, 12);
    const user = await UserModel.create({
      phoneNumber: phoneNumber.startsWith('+') ? phoneNumber : '+' + phoneNumber.replace(/[^\d]/g, ""),
      password: hashed,
      name,
      role: "ADMIN",
    });

    logger.info({ userId: String(user._id) }, "Seed: Admin user created");

    res.status(201).json({
      success: true,
      message: "Admin user created successfully. You can now login.",
      data: {
        id: String(user._id),
        phoneNumber: user.phoneNumber,
        name: user.name,
        role: user.role,
      },
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    res.status(500).json({ success: false, message });
  }
});

/**
 * POST /api/seed/migrate-phones
 * Adds '+' prefix to all phone numbers that don't have it.
 */
router.post("/migrate-phones", async (_req: Request, res: Response) => {
  try {
    const users = await UserModel.find({ phoneNumber: { $not: /^\+/ } });
    let updated = 0;
    for (const user of users) {
      user.phoneNumber = "+" + user.phoneNumber;
      await user.save();
      updated++;
    }
    res.json({ success: true, message: `Migrated ${updated} phone numbers` });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    res.status(500).json({ success: false, message });
  }
});

/**
 * POST /api/seed/retranslate
 * Re-translates all categories and products using Gemini.
 */
router.post("/retranslate", async (_req: Request, res: Response) => {
  try {
  let count = 0;

  // Re-translate categories
  const categories = await CategoryModel.find();
  for (const cat of categories) {
    try {
      const source = cat.name.en || cat.name.uz || cat.name.ru;
      const descSource = cat.description.en || cat.description.uz || cat.description.ru;
      if (!source) continue;

      const translations = await geminiService.translate(
        { name: source, description: descSource },
        { context: "filter-system factory product category" },
      );
      cat.name = translations.name as any;
      cat.description = translations.description as any;
      await cat.save();
      count++;
      logger.info({ id: cat._id, name: translations.name.en }, "Re-translated category");
    } catch (err) {
      logger.error({ id: cat._id, err }, "Failed to re-translate category");
    }
  }

  // Re-translate products
  const products = await ProductModel.find();
  for (const prod of products) {
    try {
      const source = prod.name.en || prod.name.uz || prod.name.ru;
      const descSource = prod.description.en || prod.description.uz || prod.description.ru;
      if (!source) continue;

      const fields: Record<string, string> = { name: source, description: descSource };
      if (prod.tags?.en || prod.tags?.uz) fields.tags = prod.tags.en || prod.tags.uz || prod.tags.ru;

      const translations = await geminiService.translate(fields, {
        context: "filter-system factory product",
      });
      prod.name = translations.name as any;
      prod.description = translations.description as any;
      if (translations.tags) prod.tags = translations.tags as any;
      if (translations.tags) prod.tags = translations.tags as any;
      await prod.save();
      count++;
      logger.info({ id: prod._id, name: translations.name.en }, "Re-translated product");
    } catch (err) {
      logger.error({ id: prod._id, err }, "Failed to re-translate product");
    }
  }

  res.json({ success: true, message: `Re-translated ${count} items` });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    res.status(500).json({ success: false, message });
  }
});

export default router;
