import path from "path";

import { createPool } from "@vercel/postgres";
import { drizzle } from "drizzle-orm/vercel-postgres";
import { migrate } from "drizzle-orm/vercel-postgres/migrator";

const databaseUrl = process.env.DATABASE_URL;
if (!databaseUrl) {
  throw new Error("DATABASE_URL not configured");
}

const pool = createPool({ connectionString: databaseUrl });

export const db = drizzle(pool);

const migrationsFolder = path.join(process.cwd(), "drizzle");

if (process.env.NODE_ENV !== "production") {
  try {
    await migrate(db, { migrationsFolder });
  } catch (error) {
    console.error("Failed to run database migrations", error);
    throw error;
  }
}
