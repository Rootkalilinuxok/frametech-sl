import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { receiptsLive } from "@/lib/schema";
import { toAlpha3Country, getCurrencyForCountry } from "@/utils/currency";

export async function POST(req: NextRequest) {
  const data = await req.json();

  // Trasforma in ISO alpha-3 e ricava la valuta
  const countryAlpha3 = data.country
    ? toAlpha3Country(data.country as string)
    : null;
  const currencyCode = countryAlpha3
    ? getCurrencyForCountry(countryAlpha3)
    : null;

  // Costruiamo l'oggetto in modo da accettare sia snake_case che camelCase
  const row = {
    id: data.id,
    date: data.date ? new Date(data.date) : undefined,
    time: data.time ?? null,
    name: data.name,
    country: countryAlpha3,
    currency: currencyCode,
    total: data.total,
    tip: data.tip ?? null,
    exchangeRate: data.exchangeRate ?? null,
    totalEur: data.totalEur ?? null,
    percent: null,                          // punto 1: sempre vuoto
    paymentMethod: data.paymentMethod ?? null,
    status: data.status ?? "new",

    sourceHash: data.sourceHash ?? data.source_hash ?? data.id,
    imageUrl: data.imageUrl   ?? data.image_url   ?? null,
  } as typeof receiptsLive.$inferInsert;

  await db.insert(receiptsLive).values(row);
  return NextResponse.json({ success: true });
}
