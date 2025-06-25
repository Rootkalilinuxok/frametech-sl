import { NextRequest, NextResponse } from "next/server";
import { and, gte, lte } from "drizzle-orm";

import { db } from "@/lib/db";
import { receiptsLive } from "@/lib/schema";

// Funzione per filtrare per periodo se richiesto
export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);

  const from = searchParams.get("from");
  const to = searchParams.get("to");

  let where = undefined;
  if (from && to) {
    const fromDate = new Date(from + "T00:00:00.000Z");
    const toDate = new Date(to + "T23:59:59.999Z");
    where = and(gte(receiptsLive.createdAt, fromDate), lte(receiptsLive.createdAt, toDate));
  }

  try {
    const rows = await db
      .select({
        id: receiptsLive.id,
        date: receiptsLive.date,
        time: receiptsLive.time,
        name: receiptsLive.name,
        country: receiptsLive.country,
        currency: receiptsLive.currency,
        tip: receiptsLive.tip,
        total: receiptsLive.total,
        exchangeRate: receiptsLive.exchangeRate,
        totalEur: receiptsLive.totalEur,
        percent: receiptsLive.percent,
        imageUrl: receiptsLive.imageUrl,
      })
      .from(receiptsLive)
      .where(where)
      .orderBy(receiptsLive.createdAt);

    return NextResponse.json(rows);
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Database error" }, { status: 500 });
  }
}
