import { createPool } from "@vercel/postgres";
import { drizzle } from "drizzle-orm/vercel-postgres";

const pool = createPool({ connectionString: process.env.DATABASE_URL });

export const db = drizzle(pool);
