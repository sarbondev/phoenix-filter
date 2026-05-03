import dotenv from "dotenv";
import { connectDatabase, disconnectDatabase } from "../config/database";
import { ProductModel } from "../modules/products/product.schema";
import { logger } from "../shared/utils/logger";

dotenv.config();

async function main() {
  await connectDatabase();
  try {
    // Phoenix-imported products use Phoenix part numbers (NA-, NF-, NO-, NAC-, NE-, NC-, NHV-, ...).
    // Match all SKUs starting with N + letter(s) + dash, which is the Phoenix naming pattern
    // and won't collide with auto-generated FS-XXXXXX SKUs from the regular product flow.
    const filter = { sku: { $regex: "^N[A-Z]{1,3}[-\\.]" } };

    const before = await ProductModel.countDocuments(filter);
    const result = await ProductModel.updateMany(filter, {
      $set: { isActive: true, stock: 100 },
    });
    logger.info(
      { matched: before, modified: result.modifiedCount },
      "Activated Phoenix-imported products",
    );
    console.log(
      `\nActivated ${result.modifiedCount}/${before} Phoenix products (isActive=true, stock=100)\n`,
    );
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
