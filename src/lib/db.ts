import { createPool } from "@vercel/postgres";
import { drizzle } from "drizzle-orm/vercel-postgres";

const databaseUrl = process.env.DATABASE_URL;
if (!databaseUrl) {
  throw new Error("DATABASE_URL not configured");
}

const pool = createPool({ connectionString: databaseUrl });

export const db = drizzle(pool);
