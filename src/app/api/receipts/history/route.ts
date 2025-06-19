import { NextRequest, NextResponse } from "next/server";
import { eq, and, gte, lte } from "drizzle-orm";
import { db } from "@/lib/db";
import { receiptsLive } from "@/lib/schema";

// Funzione per filtrare per periodo se richiesto
export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);

  const from = searchParams.get("from");
  const to = searchParams.get("to");

  // Costruisci condizioni dinamiche
  let where = undefined;
  if (from && to) {
    where = and(
      gte(receiptsLive.createdAt, from),
      lte(receiptsLive.createdAt, to + "T23:59:59.999Z")
    );
  }

  // Query Drizzle (prende tutto se where è undefined)
  const rows = await db
    .select()
    .from(receiptsLive)
    .where(where)
    .orderBy(receiptsLive.createdAt);

  return NextResponse.json(rows);
}
