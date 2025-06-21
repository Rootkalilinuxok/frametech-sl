import { createPool } from "@vercel/postgres";
import { drizzle } from "drizzle-orm/vercel-postgres";
import { migrate } from "drizzle-orm/vercel-postgres/migrator";
import path from "path";

const databaseUrl = process.env.DATABASE_URL;
if (!databaseUrl) {
  throw new Error("DATABASE_URL not configured");
}

const pool = createPool({ connectionString: databaseUrl });

export const db = drizzle(pool);

const migrationsFolder = path.join(process.cwd(), "drizzle");
await migrate(db, { migrationsFolder });
