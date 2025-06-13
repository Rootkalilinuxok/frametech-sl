import { Pool } from "@vercel/postgres";
import { drizzle } from "drizzle-orm/vercel-postgres";

const pool = new Pool({ connectionString: process.env.DATABASE_URL });

// Drizzle types expect a VercelPgClient instance; cast for simplicity
export const db = drizzle(pool as any);
