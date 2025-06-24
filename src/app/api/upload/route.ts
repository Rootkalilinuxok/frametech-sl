import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { IncomingForm } from "formidable-serverless";
import fs from "fs";
import { promisify } from "util";
import path from "path";

// Config globale (no edge runtime!)
export const config = {
  api: {
    bodyParser: false,
  },
};

const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_KEY!
);

export async function POST(req: NextRequest) {
  const form = new IncomingForm({
    keepExtensions: true,
    uploadDir: "/tmp", // necessario su Vercel
  });

  const parseForm = () =>
    new Promise<{ fields: any; files: any }>((resolve, reject) => {
      form.parse(req as any, (err: any, fields: any, files: any) => {
        if (err) reject(err);
        else resolve({ fields, files });
      });
    });

  try {
    const { files } = await parseForm();
    const file = files.file[0] ?? files.file;

    const fileBuffer = await promisify(fs.readFile)(file.filepath);
    const { data, error } = await supabase.storage
      .from("receipts")
      .upload(`uploads/${file.originalFilename}`, fileBuffer, {
        contentType: file.mimetype,
      });

    if (error) {
      console.error(error);
      return NextResponse.json({ error: "Upload to Supabase failed" }, { status: 500 });
    }

    return NextResponse.json({ success: true, path: data.path });
  } catch (err: any) {
    console.error("Errore in upload API:", err.message);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
