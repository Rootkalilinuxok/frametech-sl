// src/app/api/ocr/route.ts

import { NextRequest, NextResponse } from "next/server";
import { v1 as vision } from "@google-cloud/vision";
import { Buffer } from "buffer";

export const runtime = "nodejs";

export async function POST(req: NextRequest) {
  // Carica la service account key JSON da env (incollata come stringa senza spazi/ritorni a capo)
  const key = process.env.GOOGLE_APPLICATION_CREDENTIALS_JSON;
  if (!key) {
    return NextResponse.json({ error: "Google service account key missing" }, { status: 500 });
  }

  // Ricevi file come base64
  const { fileBase64, filename } = await req.json();
  if (!fileBase64) {
    return NextResponse.json({ error: "No file uploaded" }, { status: 400 });
  }

  // Inizializza client Vision
  const client = new vision.ImageAnnotatorClient({
    credentials: JSON.parse(key)
  });

  // Decodifica base64 in buffer
  const buffer = Buffer.from(fileBase64, "base64");

  // OCR
  const [result] = await client.textDetection({ image: { content: buffer } });

  // Recupera testo principale e tutte le righe (blocchi)
  const text = result.textAnnotations?.[0]?.description || "";
  const lines = text ? text.split(/\r?\n/).filter(l => l.trim().length > 0) : [];

  return NextResponse.json({
    text,        // tutto il testo OCR estratto
    lines,       // ogni riga come array
    filename     // nome file, utile per debug/log
  });
}
