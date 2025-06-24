import { NextRequest, NextResponse } from "next/server";
import { v4 as uuidv4 } from "uuid";
import fs from "fs/promises";
import path from "path";

// Imposta il path alla cartella pubblica receipts
const RECEIPTS_PATH = path.join(process.cwd(), "public", "receipts");

export const maxDuration = 60; // Vercel, max tempo funzione
export const runtime = "nodejs";

export async function POST(req: NextRequest) {
  try {
    // Verifica che sia multipart/form-data
    if (!req.headers.get("content-type")?.includes("multipart/form-data")) {
      return NextResponse.json({ error: "Content-Type must be multipart/form-data" }, { status: 400 });
    }

    // Parse della form (usa Web API)
    const formData = await req.formData();
    const file = formData.get("file") as File;
    if (!file) {
      return NextResponse.json({ error: "Missing file" }, { status: 400 });
    }

    // Genera nome univoco
    const ext = file.name.split('.').pop() || "jpg";
    const fileName = `${uuidv4()}.${ext}`;
    const filePath = path.join(RECEIPTS_PATH, fileName);

    // Leggi il contenuto
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    // Salva nella cartella pubblica
    await fs.writeFile(filePath, buffer);

    // URL pubblica (come accedi in frontend)
    const publicUrl = `/receipts/${fileName}`;

    // Puoi opzionalmente salvare questa URL su DB qui...

    // Risposta con URL pubblica
    return NextResponse.json({ success: true, url: publicUrl, fileName });
  } catch (err) {
    console.error("Errore upload file:", err);
    return NextResponse.json({ error: "Upload error" }, { status: 500 });
  }
}
