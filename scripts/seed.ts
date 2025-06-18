import { db } from "@/lib/db";
import { receiptsLive } from "@/lib/schema";
import type { InferInsertModel } from "drizzle-orm";

const seedData: InferInsertModel<typeof receiptsLive>[] = [
  {
    date: new Date("2025-06-12"),
    time: "13:15",
    name: "Ristorante Da Mario",
    country: "IT",
    currency: "EUR",
    total: 45.5,
    totalEur: 45.5,
    exchangeRate: 1,
    percent: 10,
    paymentMethod: "Carta",
    sourceHash: "seed-1",
  },
];

await db.insert(receiptsLive).values(seedData);
console.log("Seed OK");
process.exit(0);
