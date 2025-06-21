import { NextRequest, NextResponse } from "next/server";

import { inArray } from "drizzle-orm";

import { db } from "@scr/lib/db";
import { receiptsLive, receiptsArchive } from "@scr/lib/schema";

export async function POST(req: NextRequest) {
  const { ids } = await req.json();
  if (!Array.isArray(ids) || ids.length === 0) {
    return NextResponse.json({ error: "Invalid ids" }, { status: 400 });
  }

  const rows = await db.select().from(receiptsLive).where(inArray(receiptsLive.id, ids));

  if (rows.length > 0) {
    await db.insert(receiptsArchive).values(rows);
    await db.delete(receiptsLive).where(inArray(receiptsLive.id, ids));
  }

  return NextResponse.json({ success: true });
}
