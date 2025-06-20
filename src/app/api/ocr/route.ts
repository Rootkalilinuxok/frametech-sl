import { NextRequest, NextResponse } from "next/server";
import { v1 as vision } from "@google-cloud/vision";
import { OpenAI } from "openai";
import { v4 as uuidv4 } from "uuid";
import { ChatCompletionMessageParam } from "openai/resources/chat/completions";

export const runtime = "nodejs";
export const maxDuration = 60;

export async function POST(req: NextRequest) {
  const formData = await req.formData();
  const files = formData.getAll("files");

  if (!files || files.length === 0) {
    return NextResponse.json({ error: "Nessun file inviato" }, { status: 400 });
  }

  const key = process.env.GOOGLE_APPLICATION_CREDENTIALS_JSON;
  const openaiKey = process.env.OPENAI_API_KEY;
  if (!key || !openaiKey) {
    return NextResponse.json({ error: "API keys missing" }, { status: 500 });
  }

  const ocrClient = new vision.ImageAnnotatorClient({ credentials: JSON.parse(key) });
  const openai = new OpenAI({ apiKey: openaiKey });

  const processed: any[] = [];
  const warnings: { filename: string; reason: string }[] = [];

  for (const file of files) {
    try {
      if (
        !(file instanceof File) ||
        !file.type.match(/(image\/|pdf)/)
      ) {
        warnings.push({
          filename: (file as any)?.name || "unknown",
          reason: "Formato non supportato",
        });
        continue;
      }

      const arrayBuffer = await file.arrayBuffer();
      const buffer = Buffer.from(arrayBuffer);

      let ocrResult;
      if (file.type === "application/pdf") {
        [ocrResult] = await ocrClient.documentTextDetection({ image: { content: buffer } });
      } else {
        [ocrResult] = await ocrClient.textDetection({ image: { content: buffer } });
      }
      const text =
        ocrResult.textAnnotations?.[0]?.description ||
        ocrResult.fullTextAnnotation?.text ||
        "";

      if (!text || text.length < 8) {
        warnings.push({
          filename: file.name,
          reason: "File non leggibile (OCR vuoto o troppo breve)",
        });
        continue;
      }

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
        dati = JSON.parse(gptRes.choices[0].message.content || "{}");
      } catch (e) {
        warnings.push({ filename: file.name, reason: "Risposta GPT non leggibile" });
        continue;
      }

      dati.id = dati.id || uuidv4();
      if (!dati.date || !dati.total) {
        warnings.push({
          filename: file.name,
          reason: "Campi principali non trovati: date o total",
        });
      }
      dati.filename = file.name;

      processed.push(dati);
    } catch (err: any) {
      warnings.push({
        filename: (file as any)?.name || "unknown",
        reason: err.message || "Errore sconosciuto durante OCR/GPT",
      });
      continue;
    }
  }

  return NextResponse.json({ rows: processed, warnings });
}
