import { NextRequest, NextResponse } from "next/server";
import { OpenAI } from "openai";
import { v4 as uuidv4 } from "uuid";
import { ChatCompletionMessageParam } from "openai/resources/chat/completions";

export const runtime = "nodejs";
export const maxDuration = 60;

export async function POST(req: NextRequest) {
  const { base64, fileName, mimeType } = await req.json();
  const apiKey = process.env.GOOGLE_API_KEY;
  const openaiKey = process.env.OPENAI_API_KEY;

  if (!apiKey || !openaiKey) {
    return NextResponse.json({ error: "API key(s) missing" }, { status: 500 });
  }

  // Chiamata REST Google Vision OCR
  const visionEndpoint = `https://vision.googleapis.com/v1/images:annotate?key=${apiKey}`;
  const body = {
    requests: [
      {
        image: { content: base64 },
        features: [
          { type: mimeType === "application/pdf" ? "DOCUMENT_TEXT_DETECTION" : "TEXT_DETECTION", maxResults: 1 }
        ]
      }
    ]
  };

  const visionRes = await fetch(visionEndpoint, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body)
  });

  if (!visionRes.ok) {
    return NextResponse.json({ error: "Vision API Error" }, { status: 500 });
  }

  const visionData = await visionRes.json();
  const response = visionData?.responses?.[0];
  const text =
    response?.fullTextAnnotation?.text ||
    response?.textAnnotations?.[0]?.description ||
    "";

  if (!text || text.length < 8) {
    return NextResponse.json({ error: "OCR vuoto o non leggibile", filename: fileName }, { status: 200 });
  }

  // GPT extraction
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
  "exchange_rate": null, // opzionale, numero
  "total_eur": 0,        // numero
  "percent": null        // opzionale, numero
}
Se non riesci a trovare un campo, lascia stringa vuota o null, MA il JSON deve essere sempre valido e conforme!
`
    },
    {
      role: "user",
      content: `Testo OCR (estrai tutti i dati che trovi, massima accuratezza):\n\n${text}`
    }
  ];

  const gptRes = await openai.chat.completions.create({
    model: "gpt-4o",
    messages: prompt,
    response_format: { type: "json_object" }
  });

  let dati;
  try {
    dati = JSON.parse(gptRes.choices[0].message.content || "{}");
  } catch {
    dati = {};
  }
  dati.id = dati.id || uuidv4();
  dati.filename = fileName;

  try {
    await fetch(`${req.nextUrl.origin}/api/receipts`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(dati),
    });
  } catch (err) {
    console.error("Failed to persist OCR result", err);
  }

  return NextResponse.json(dati);
}
