import { NextRequest, NextResponse } from "next/server";
import { v1 as vision } from "@google-cloud/vision";
import { OpenAI } from "openai";
import { v4 as uuidv4 } from "uuid";

// For Node.js streaming FormData parsing
import { Readable } from "stream";
import formidable from "formidable";
import fs from "fs/promises";

export const runtime = "nodejs";
export const maxDuration = 300; // fino a 5 minuti per batch grandi

// Utility per leggere un file in Buffer
async function bufferFromFile(filepath: string) {
  return fs.readFile(filepath);
}

// --------- OCR + GPT Handler ---------
export async function POST(req: NextRequest) {
  // Parse FormData
  const form = formidable({ multiples: true, keepExtensions: true });
  const files: any[] = await new Promise((resolve, reject) => {
    form.parse(Readable.from(Buffer.from(await req.arrayBuffer())), (err, fields, files) => {
      if (err) reject(err);
      const f = Array.isArray(files.files) ? files.files : [files.files];
      resolve(f);
    });
  });

  // Check env
  const key = process.env.GOOGLE_APPLICATION_CREDENTIALS_JSON;
  const openaiKey = process.env.OPENAI_API_KEY;
  if (!key || !openaiKey) {
    return NextResponse.json({ error: "API keys missing" }, { status: 500 });
  }
  const ocrClient = new vision.ImageAnnotatorClient({ credentials: JSON.parse(key) });
  const openai = new OpenAI({ apiKey: openaiKey });

  const processed: any[] = [];
  const warnings: { filename: string, reason: string }[] = [];

  for (const file of files) {
    try {
      // --- SOLO IMMAGINI E PDF ---
      if (!file.mimetype?.match(/(image\/|pdf)/)) {
        warnings.push({ filename: file.originalFilename, reason: "Formato non supportato" });
        continue;
      }

      const buffer = await bufferFromFile(file.filepath);

      // --- OCR GOOGLE VISION ---
      let ocrResult;
      if (file.mimetype === "application/pdf") {
        // Per PDF: invio diretto
        [ocrResult] = await ocrClient.documentTextDetection({ image: { content: buffer } });
      } else {
        [ocrResult] = await ocrClient.textDetection({ image: { content: buffer } });
      }
      const text = ocrResult.textAnnotations?.[0]?.description || ocrResult.fullTextAnnotation?.text || "";

      // Valutazione leggibilità minima
      if (!text || text.length < 8) {
        warnings.push({ filename: file.originalFilename, reason: "File non leggibile (OCR vuoto o troppo breve)" });
        continue;
      }

      // --- GPT-4o: estrai struttura dati ---
      const prompt = [
        { role: "system", content: `
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
` },
        { role: "user", content: `Testo OCR (estrai tutti i dati che trovi, massima accuratezza):\n\n${text}` }
      ];

      const gptRes = await openai.chat.completions.create({
        model: "gpt-4o",
        messages: prompt,
        response_format: { type: "json_object" }
      });

      let dati;
      try {
        dati = JSON.parse(gptRes.choices[0].message.content || "{}");
      } catch (e) {
        warnings.push({ filename: file.originalFilename, reason: "Risposta GPT non leggibile" });
        continue;
      }

      // Genera id univoco se mancante
      dati.id = dati.id || uuidv4();
      // Se date o total sono assenti, metti warning
      if (!dati.date || !dati.total) {
        warnings.push({ filename: file.originalFilename, reason: "Campi principali non trovati: date o total" });
      }
      // Allego nome file
      dati.filename = file.originalFilename;

      processed.push(dati);
    } catch (err: any) {
      warnings.push({ filename: file.originalFilename, reason: err.message || "Errore sconosciuto durante OCR/GPT" });
      continue;
    }
  }

  // Cleanup files
  for (const f of files) {
    try { await fs.unlink(f.filepath); } catch { /* ignore */ }
  }

  return NextResponse.json({ rows: processed, warnings });
}
