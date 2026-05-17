import dotenv from "dotenv";
import bcrypt from "bcryptjs";
import mongoose from "mongoose";
import { connectDatabase, disconnectDatabase } from "./config/database";
import { env } from "./config/env";
import { UserModel } from "./modules/users/user.schema";
import { logger } from "./shared/utils/logger";

dotenv.config();

const ADMIN_PHONE = process.env.SEED_ADMIN_PHONE ?? "+998901234567";
const ADMIN_PASSWORD = process.env.SEED_ADMIN_PASSWORD ?? "AdminPass123";
const ADMIN_NAME = process.env.SEED_ADMIN_NAME ?? "Administrator";

async function run() {
  if (env.NODE_ENV === "production") {
    console.error(
      "\n❌ Refusing to run seed in production — this command drops the database.\n",
    );
    process.exit(1);
  }

  await connectDatabase();
  try {
    const dbName = mongoose.connection.db?.databaseName;
    logger.warn({ db: dbName }, "Dropping database");
    await mongoose.connection.dropDatabase();
    logger.info({ db: dbName }, "Database dropped");

    const hashed = await bcrypt.hash(ADMIN_PASSWORD, 12);
    const admin = await UserModel.create({
      phoneNumber: ADMIN_PHONE,
      password: hashed,
      name: ADMIN_NAME,
      role: "ADMIN",
    });

    logger.info(
      { userId: String(admin._id), phoneNumber: admin.phoneNumber },
      "Admin user created",
    );

    console.log("\n========== DATABASE RESET ==========");
    console.log(`DB:       ${dbName}`);
    console.log(`Phone:    ${admin.phoneNumber}`);
    console.log(`Password: ${ADMIN_PASSWORD}`);
    console.log(`Name:     ${admin.name}`);
    console.log("====================================\n");
  } finally {
    await disconnectDatabase();
  }
}

run()
  .then(() => process.exit(0))
  .catch((err) => {
    const message = err instanceof Error ? err.message : String(err);
    logger.error({ error: message }, "Seed failed");
    console.error("\nError:", message);
    process.exit(1);
  });
