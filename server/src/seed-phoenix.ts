import dotenv from "dotenv";
import { readFileSync } from "fs";
import { resolve } from "path";
import { connectDatabase, disconnectDatabase } from "./config/database";
import { CategoryModel } from "./modules/categories/category.schema";
import { ProductModel } from "./modules/products/product.schema";
import { logger } from "./shared/utils/logger";

dotenv.config();

const SEED_FILE = resolve(__dirname, "../seeds/phoenix-products.json");

interface PhoenixProduct {
  sku: string;
  category: string;
  categoryKey: string;
  vehicleBrand: string | null;
  oem: string | null;
  material: string | null;
  application: string | null;
  dimensions?: {
    height?: number;
    outerDiameter?: number;
    innerDiameter?: number;
    threadSize?: string;
    inletDiameter?: number;
    outletDiameter?: number;
  };
  remark: string | null;
  crossReferences: { partNumber: string; manufacturer: string }[];
  sourceFiles: string[];
}

function slugify(s: string): string {
  return s
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "")
    .replace(/[\s_]+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");
}

function tf(value: string) {
  return { uz: value, ru: value, en: value, kz: value };
}

async function seedCategories(items: PhoenixProduct[]) {
  const unique = new Map<string, string>();
  for (const p of items) {
    if (!unique.has(p.categoryKey)) unique.set(p.categoryKey, p.category);
  }

  const ids = new Map<string, string>();
  let created = 0;
  let skipped = 0;
  let order = 0;
  for (const [key, name] of unique) {
    const existing = await CategoryModel.findOne({ slug: key }).lean();
    if (existing) {
      ids.set(key, String(existing._id));
      skipped++;
      continue;
    }
    const doc = await CategoryModel.create({
      name: tf(name),
      description: tf(`${name} — auto-imported from Phoenix Catalogue 2024`),
      slug: key,
      isActive: true,
      sortOrder: order++,
    });
    ids.set(key, String(doc._id));
    created++;
  }
  logger.info(
    { created, skipped, total: unique.size },
    "✓ Categories ready",
  );
  return ids;
}

async function seedProducts(
  items: PhoenixProduct[],
  categoryIds: Map<string, string>,
) {
  const existingSkus = new Set<string>(
    (await ProductModel.find({}, { sku: 1 }).lean()).map((p: any) => p.sku),
  );

  const docsToInsert: any[] = [];
  let skipped = 0;
  for (const p of items) {
    const sku = p.sku.toUpperCase();
    if (existingSkus.has(sku)) {
      skipped++;
      continue;
    }
    const categoryId = categoryIds.get(p.categoryKey);
    if (!categoryId) {
      logger.warn({ sku, key: p.categoryKey }, "no category for product");
      continue;
    }

    const slug = slugify(p.sku);
    const nameValue = `Phoenix ${p.sku}`;

    const specifications: any[] = [];
    if (p.material) {
      specifications.push({ key: tf("Material"), value: tf(p.material) });
    }
    if (p.dimensions?.height) {
      specifications.push({ key: tf("Height (mm)"), value: tf(String(p.dimensions.height)) });
    }
    if (p.dimensions?.outerDiameter) {
      specifications.push({ key: tf("Outer Diameter (mm)"), value: tf(String(p.dimensions.outerDiameter)) });
    }
    if (p.dimensions?.innerDiameter) {
      specifications.push({ key: tf("Inner Diameter (mm)"), value: tf(String(p.dimensions.innerDiameter)) });
    }
    if (p.dimensions?.threadSize) {
      specifications.push({ key: tf("Thread Size"), value: tf(p.dimensions.threadSize) });
    }
    if (p.dimensions?.inletDiameter) {
      specifications.push({ key: tf("Inlet Diameter (mm)"), value: tf(String(p.dimensions.inletDiameter)) });
    }
    if (p.dimensions?.outletDiameter) {
      specifications.push({ key: tf("Outlet Diameter (mm)"), value: tf(String(p.dimensions.outletDiameter)) });
    }
    if (p.remark) {
      specifications.push({ key: tf("Remark"), value: tf(p.remark) });
    }

    docsToInsert.push({
      name: tf(nameValue),
      description: tf(p.application || nameValue),
      slug,
      sku,
      oem: p.oem || undefined,
      crossReferences: p.crossReferences,
      material: p.material || undefined,
      application: p.application || undefined,
      dimensions: p.dimensions,
      vehicleBrand: p.vehicleBrand || undefined,
      price: 0,
      category: categoryId,
      images: [],
      specifications,
      stock: 100,
      isActive: true,
      isFeatured: false,
    });
  }

  if (docsToInsert.length === 0) {
    logger.info({ skipped }, "No new products to insert");
    return { created: 0, skipped };
  }

  // Insert in chunks to avoid 16MB BSON limit + give clear progress
  const CHUNK = 500;
  let created = 0;
  for (let i = 0; i < docsToInsert.length; i += CHUNK) {
    const chunk = docsToInsert.slice(i, i + CHUNK);
    const res = await ProductModel.insertMany(chunk, { ordered: false });
    created += res.length;
    logger.info(
      { inserted: res.length, totalDone: created, totalToDo: docsToInsert.length },
      "Chunk inserted",
    );
  }
  return { created, skipped };
}

async function main() {
  await connectDatabase();
  try {
    const raw = readFileSync(SEED_FILE, "utf-8");
    const items: PhoenixProduct[] = JSON.parse(raw);
    logger.info({ count: items.length, file: SEED_FILE }, "Loaded seed file");

    const categoryIds = await seedCategories(items);
    const result = await seedProducts(items, categoryIds);

    console.log("\n========== PHOENIX SEED COMPLETE ==========");
    console.log(`Categories: ${categoryIds.size}`);
    console.log(`Products created: ${result.created}`);
    console.log(`Products skipped (already exist): ${result.skipped}`);
    console.log("==========================================\n");
  } catch (err) {
    logger.error({ err }, "Phoenix seed failed");
    throw err;
  } finally {
    await disconnectDatabase();
  }
}

main()
  .then(() => process.exit(0))
  .catch((err) => {
    console.error(err);
    process.exit(1);
  });
