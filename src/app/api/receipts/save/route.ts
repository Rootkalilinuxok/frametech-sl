import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { receiptsLive } from "@/lib/schema"; // <-- Assicurati che questa sia la tua tabella Drizzle
import { eq } from "drizzle-orm";

export async function POST(req: Request) {
  try {
    const body = await req.json();

    if (!body.id) {
      return NextResponse.json({ error: "ID mancante" }, { status: 400 });
    }

    // Esegui update, non insert, perché l’ID è già stato generato
    await db
      .update(receiptsLive)
      .set({
        date: body.date,
        time: body.time,
        name: body.name,
        country: body.country,
        currency: body.currency,
        tip: body.tip,
        total: body.total,
        exchangeRate: body.exchange_rate,
        totalEur: body.total_eur,

        percent: body.percent,
        image_url: body.image_url, // 👈 salva qui il link pubblico
      })
      .where(eq(receiptsLive.id, body.id));

    return NextResponse.json({ success: true });
  } catch (err: any) {
    console.error("Errore API save:", err.message);
    return NextResponse.json({ error: "Errore salvataggio dati" }, { status: 500 });
  }
}
