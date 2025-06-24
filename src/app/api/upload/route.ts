import { NextResponse } from "next/server";
import { IncomingForm } from "formidable";
import { Readable } from "stream";
import { supabase } from "@/lib/supabase";

export const config = {
  api: {
    bodyParser: false,
  },
};

export async function POST(req: Request) {
  try {
    const contentType = req.headers.get("content-type") || "";
    if (!contentType.includes("multipart/form-data")) {
      return NextResponse.json({ error: "Tipo contenuto non valido" }, { status: 400 });
    }

    const buffer = Buffer.from(await req.arrayBuffer());
    const stream = Readable.from(buffer) as any;

    const form = new IncomingForm({ multiples: false, keepExtensions: true });

    const { fields, files } = await new Promise<any>((resolve, reject) => {
      form.parse(stream, (err: any, fields: any, files: any) => {
        if (err) reject(err);
        else resolve({ fields, files });
      });
    });

    const file = Array.isArray(files.file) ? files.file[0] : files.file;
    const fileBuffer = await file.toBuffer?.();
    const fileName = `${crypto.randomUUID()}_${file.originalFilename}`;

    const { error } = await supabase.storage
      .from("receipts")
      .upload(fileName, fileBuffer, {
        contentType: file.mimetype,
      });

    if (error) {
      console.error("Supabase upload error:", error);
      return NextResponse.json({ error: "Upload su Supabase fallito" }, { status: 500 });
    }

    const { data } = supabase.storage.from("receipts").getPublicUrl(fileName);
    return NextResponse.json({ success: true, url: data.publicUrl, fileName });
  } catch (err) {
    console.error("Errore upload:", err);
    return NextResponse.json({ error: "Errore interno" }, { status: 500 });
  }
}
