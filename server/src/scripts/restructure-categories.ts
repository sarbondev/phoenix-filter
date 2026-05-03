import dotenv from "dotenv";
import { connectDatabase, disconnectDatabase } from "../config/database";
import { CategoryModel } from "../modules/categories/category.schema";
import { logger } from "../shared/utils/logger";

dotenv.config();

function tf(uz: string, ru: string, en: string, kz: string) {
  return { uz, ru, en, kz };
}

const AVTO = {
  slug: "avto",
  name: tf("Avto", "Авто", "Auto", "Авто"),
  description: tf(
    "Avtomobil va og'ir texnika uchun filterlar",
    "Фильтры для автомобилей и спецтехники",
    "Filters for vehicles and heavy equipment",
    "Көліктер мен ауыр техникаға арналған сүзгілер",
  ),
};

const MAISHIY = {
  slug: "maishiy",
  name: tf("Maishiy", "Бытовые", "Household", "Тұрмыстық"),
  description: tf(
    "Uy va maishiy filterlar",
    "Фильтры для дома и быта",
    "Filters for home and household use",
    "Үй және тұрмыстық сүзгілер",
  ),
};

// All currently-imported Phoenix slugs that should sit under "avto".
const AVTO_CHILD_SLUGS = [
  "air-filter-european",
  "air-filter-japanese",
  "air-filter-korean",
  "air-filter-usa",
  "cabin-air-filter",
  "channel-air-filter",
  "eco-oil-fuel-cartridge",
  "heavy-duty-air-filter",
  "heavy-duty-cabin-air-filter",
  "heavy-duty-fuel-filter",
  "heavy-duty-oil-filter",
  "in-tank-fuel-filter",
  "inline-fuel-filter",
  "lpg-filter",
  "spin-on-oil-european",
  "spin-on-oil-japan-korea",
  "spin-on-oil-usa",
  "transmission-filter",
];

async function ensureRoot(spec: typeof AVTO, sortOrder: number) {
  const existing = await CategoryModel.findOne({ slug: spec.slug });
  if (existing) {
    logger.info({ slug: spec.slug, id: String(existing._id) }, "root exists");
    return existing;
  }
  const created = await CategoryModel.create({
    slug: spec.slug,
    name: spec.name,
    description: spec.description,
    parent: null,
    isActive: true,
    sortOrder,
  });
  logger.info({ slug: spec.slug, id: String(created._id) }, "root created");
  return created;
}

async function main() {
  await connectDatabase();
  try {
    const avto = await ensureRoot(AVTO, 0);
    const maishiy = await ensureRoot(MAISHIY, 1);

    const result = await CategoryModel.updateMany(
      { slug: { $in: AVTO_CHILD_SLUGS } },
      { $set: { parent: avto._id } },
    );

    logger.info(
      { matched: result.matchedCount, modified: result.modifiedCount },
      "Re-parented child categories under Avto",
    );

    console.log("\n========== CATEGORY RESTRUCTURE COMPLETE ==========");
    console.log(`Root categories: 2 (Avto, Maishiy)`);
    console.log(`Children re-parented under Avto: ${result.modifiedCount}/${AVTO_CHILD_SLUGS.length}`);
    console.log(`Avto id:    ${String(avto._id)}`);
    console.log(`Maishiy id: ${String(maishiy._id)}`);
    console.log("===================================================\n");
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
