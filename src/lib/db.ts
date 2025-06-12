import { Pool } from "@vercel/postgres";
import { drizzle } from "drizzle-orm/vercel-postgres";

const pool = new Pool({ connectionString: process.env.DATABASE_URL });

export const db = drizzle(pool);
