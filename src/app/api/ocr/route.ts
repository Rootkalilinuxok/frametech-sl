import { createHash } from "crypto";
import { NextRequest, NextResponse } from "next/server";
import type { InferInsertModel } from "drizzle-orm";
import { OpenAI } from "openai";
import { ChatCompletionMessageParam } from "openai/resources/chat/completions";
import { v4 as uuidv4 } from "uuid";

import { db } from "@/lib/db";
import { receiptsLive } from "@/lib/schema";

export const runtime = "nodejs";
export const maxDuration = 60;

// Hash univoco riga
function generateSourceHash(dati: Record<string, unknown>) {
  return createHash("sha256")
    .update(JSON.stringify(dati) + (dati.filename ?? ""))
    .digest("hex");
}

function numOrNull(value: unknown): string | null {
  return value !== null && value !== undefined ? (Number(value) as unknown as string) : null;
}

// eslint-disable-next-line complexity
async function callVisionAPI(apiKey: string, base64: string, mimeType: string) {
  const endpoint = `https://vision.googleapis.com/v1/images:annotate?key=${apiKey}`;
  const type = mimeType === "application/pdf" ? "DOCUMENT_TEXT_DETECTION" : "TEXT_DETECTION";
  const body = {
    requests: [
      {
        image: { content: base64 },
        features: [{ type, maxResults: 1 }],
      },
    ],
  };

  const res = await fetch(endpoint, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });

  if (!res.ok) {
    throw new Error("Vision API Error");
  }

  const data = await res.json();
  const response = data.responses?.[0];
  if (response?.fullTextAnnotation?.text) {
    return response.fullTextAnnotation.text;
  }
  if (response?.textAnnotations?.[0]?.description) {
    return response.textAnnotations[0].description;
  }
  return "";
}

async function extractWithGPT(openaiKey: string, text: string, fileName: string) {
  const openai = new OpenAI({ apiKey: openaiKey });
  const prompt: ChatCompletionMessageParam[] = [
    {
      role: "system",
      content: `
Sei un sistema per l'estrazione di dati di ricevute, fatture o scontrini.
Dato un testo OCR (anche disordinato o rumoroso), restituisci **solo** e **sempre** un oggetto JSON, campi:
{
  "id": "",
  "date": "",       // formato YYYY-MM-DD
  "time": "",       // formato HH:mm, opzionale
  "name": "",
  "country": "",    // opzionale
  "currency": "",
  "tip": null,      // opzionale, numero
  "total": 0,       // numero
  "exchangeRate": null, // opzionale, numero (ATTENZIONE: camelCase!)
  "totalEur": 0,        // numero (camelCase!)
  "percent": null       // opzionale, numero
}
Se non riesci a trovare un campo, lascia stringa vuota o null, MA il JSON deve essere sempre valido e conforme!
`,
    },
    {
      role: "user",
      content: `Testo OCR (estrai tutti i dati che trovi, massima accuratezza):\n\n${text}`,
    },
  ];

  const gptRes = await openai.chat.completions.create({
    model: "gpt-4o",
    messages: prompt,
    response_format: { type: "json_object" },
  });

  let dati;
  try {
    dati = JSON.parse(gptRes.choices[0].message.content ?? "{}");
  } catch {
    dati = {};
  }
  dati.id = dati.id ?? uuidv4();
  dati.filename = fileName;
  return dati;
}

async function persistReceipt(dati: Record<string, unknown>) {
  try {
    const row: InferInsertModel<typeof receiptsLive> = {
      date: dati.date ? new Date(dati.date as string) : new Date(),
      time: (dati.time as string | null) ?? null,
      name: dati.name as string,
      country: (dati.country as string | undefined) ?? null,
      currency: dati.currency as string,
      total: Number(dati.total as string) as unknown as string,
      tip: numOrNull(dati.tip),
      exchangeRate: numOrNull(dati.exchangeRate),
      totalEur: numOrNull(dati.totalEur),
      percent: numOrNull(dati.percent),
      paymentMethod: "",
      status: "new",
      sourceHash: generateSourceHash(dati),
      // createdAt lasciato al defaultNow()
    };
    await db.insert(receiptsLive).values(row);
  } catch (err) {
    console.error("Failed to persist OCR result in DB", err);
  }
}

export async function POST(req: NextRequest) {
  const { base64, fileName, mimeType } = await req.json();
  const apiKey = process.env.GOOGLE_API_KEY;
  const openaiKey = process.env.OPENAI_API_KEY;

  if (!apiKey || !openaiKey) {
    return NextResponse.json({ error: "API key(s) missing" }, { status: 500 });
  }

  try {
    const text = await callVisionAPI(apiKey, base64, mimeType);
    if (!text || text.length < 8) {
      return NextResponse.json({ error: "OCR vuoto o non leggibile", filename: fileName }, { status: 200 });
    }

    const dati = await extractWithGPT(openaiKey, text, fileName);
    await persistReceipt(dati);
    return NextResponse.json(dati);
  } catch (err) {
    const message = (err as Error).message;
    if (message === "Vision API Error") {
      return NextResponse.json({ error: message }, { status: 500 });
    }
    console.error(err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}