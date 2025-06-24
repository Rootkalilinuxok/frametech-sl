import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { IncomingForm } from "formidable";
import { Readable } from "stream";
import fs from "fs/promises";

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
    uploadDir: "/tmp",
  });

  const stream = Readable.fromWeb(req.body as any) as any;

  const { files } = await new Promise<{ fields: any; files: any }>((resolve, reject) => {
    form.parse(stream, (err, fields, files) => {
      if (err) reject(err);
      else resolve({ fields, files });
    });
  });

  try {
    const file = Array.isArray(files.file) ? files.file[0] : files.file;
    const fileBuffer = await fs.readFile(file.filepath);

    const { data, error } = await supabase.storage
      .from("receipts")
      .upload(`uploads/${file.originalFilename}`, fileBuffer, {
        contentType: file.mimetype,
      });

    if (error) {
      console.error("Upload failed:", error);
      return NextResponse.json({ error: "Upload to Supabase failed" }, { status: 500 });
    }

    return NextResponse.json({ success: true, path: data.path });
  } catch (err: any) {
    console.error("Errore in upload API:", err.message);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
