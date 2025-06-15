import { sum, count, countDistinct } from "drizzle-orm/sql";

import { receiptsLive } from "@/lib/schema";

export async function GET() {
  if (!process.env.DATABASE_URL) {
    return Response.json({
      totalRevenue: 0,
      newCustomers: 0,
      activeAccounts: 0,
      growthRate: "+0%",
    });
  }

  const { db } = await import("@/lib/db");
  const [row] = await db
    .select({
      totalEur: sum(receiptsLive.totalEur),
      total: sum(receiptsLive.total),
      newCustomers: countDistinct(receiptsLive.name),
      activeAccounts: count(receiptsLive.id),
    })
    .from(receiptsLive);

  const metrics = {
    totalRevenue: Number(row?.totalEur ?? row?.total ?? 0),
    newCustomers: Number(row?.newCustomers ?? 0),
    activeAccounts: Number(row?.activeAccounts ?? 0),
    growthRate: "+0%",
  };

  return Response.json(metrics);
}
