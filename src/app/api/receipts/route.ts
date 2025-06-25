import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { receiptsLive } from "@/lib/schema";

export async function POST(req: NextRequest) {
  const data = await req.json();

  // Costruiamo l'oggetto in modo da accettare sia snake_case che camelCase
  const row = {
    id: data.id,
    date: data.date ? new Date(data.date) : undefined,
    time: data.time ?? null,
    name: data.name,
    country: data.country ?? null,
    currency: data.currency,
    total: data.total,
    tip: data.tip ?? null,
    exchangeRate: data.exchangeRate ?? null,
    totalEur: data.totalEur ?? null,
    percent: data.percent ?? null,
    percent: null,
    paymentMethod: data.paymentMethod ?? null,
    status: data.status ?? "new",

    sourceHash: data.sourceHash ?? data.source_hash ?? data.id,
    imageUrl: data.imageUrl   ?? data.image_url   ?? null,
  } as typeof receiptsLive.$inferInsert;

  await db.insert(receiptsLive).values(row);
  return NextResponse.json({ success: true });
}
