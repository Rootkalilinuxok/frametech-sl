import { NextRequest, NextResponse } from "next/server";
import { v1 as vision } from "@google-cloud/vision";
import { Buffer } from "buffer";

export const runtime = "nodejs";

export async function POST(req: NextRequest) {
  const key = process.env.GOOGLE_APPLICATION_CREDENTIALS_JSON;
  if (!key) {
    return NextResponse.json({ error: "Google service account key missing" }, { status: 500 });
  }

  const { fileBase64, filename } = await req.json();
  if (!fileBase64) {
    return NextResponse.json({ error: "No file uploaded" }, { status: 400 });
  }

  const client = new vision.ImageAnnotatorClient({
    credentials: JSON.parse(key)
  });

  const buffer = Buffer.from(fileBase64, "base64");

  const [result] = await client.textDetection({ image: { content: buffer } });

  const text = result.textAnnotations?.[0]?.description || "";
  const lines = text ? text.split(/\r?\n/).filter(l => l.trim().length > 0) : [];

  return NextResponse.json({
    text,
    lines,
    filename
  });
}
