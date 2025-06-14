import { db } from "@/lib/db";
import { receiptsLive } from "@/lib/schema";
import { sum, count, countDistinct } from "drizzle-orm/sql";

export async function GET() {
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
