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

if (process.env.RUN_MIGRATIONS === "true") {
  const migrationsFolder = path.join(process.cwd(), "drizzle");
  await migrate(db, { migrationsFolder });
}
