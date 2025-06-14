import { db } from "@/lib/db";
import { receiptsLive } from "@/lib/schema";
import { sum, eq } from "drizzle-orm";

export async function GET() {
  const total = await db
    .select({ value: sum(receiptsLive.totalEur) })
    .from(receiptsLive)
    .where(eq(receiptsLive.status, "new"));

  return Response.json([
    {
      title: "Costo totale",
      value: total[0]?.value ?? 0,
      delta: "+0%",
      subtitle: "Spese mese in corso",
      footer: "Dati live",
    },
  ]);
}
