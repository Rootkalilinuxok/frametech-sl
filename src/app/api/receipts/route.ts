import { NextRequest, NextResponse } from "next/server";

import { db } from "@/lib/db";
import { receiptsLive } from "@/lib/schema";

// eslint-disable-next-line complexity
export async function POST(req: NextRequest) {
  const data = await req.json();

  const row = {
    id: data.id,
    date: data.date ? new Date(data.date) : undefined,
    time: data.time ?? null,
    name: data.name,
    country: data.country ?? null,
    currency: data.currency,
    total: data.total,
    tip: data.tip ?? null,
    exchangeRate: data.exchange_rate ?? null,
    totalEur: data.total_eur ?? null,
    percent: data.percent ?? null,
    paymentMethod: data.payment_method ?? null,
    status: data.status import { NextRequest, NextResponse } from "next/server";

import { db } from "@/lib/db";
import { receiptsLive } from "@/lib/schema";

// eslint-disable-next-line complexity
export async function POST(req: NextRequest) {
  const data = await req.json();

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
    imageUrl: data.imageUrl ?? null,         
    percent: data.percent ?? null,
    paymentMethod: data.paymentMethod ?? null,
    status: data.status ?? "new",
    sourceHash: data.sourceHash ?? data.id,
  } as typeof receiptsLive.$inferInsert;

  await db.insert(receiptsLive).values(row);
  return NextResponse.json({ success: true });
}
?? "new",
    sourceHash: data.source_hash ?? data.id,
  } as typeof receiptsLive.$inferInsert;

  await db.insert(receiptsLive).values(row);
  return NextResponse.json({ success: true });
}
