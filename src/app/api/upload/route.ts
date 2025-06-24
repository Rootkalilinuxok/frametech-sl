import { NextResponse } from "next/server";
import { Readable } from "stream";
import { IncomingForm } from "formidable";
import { supabase } from "@/lib/supabase"; // cambia se il tuo file è altrove

export const config = {
  api: {
    bodyParser: false,
  },
};

export async function POST(req: Request) {
  try {
    const buffers: Buffer[] = [];
    const reader = req.body?.getReader();
    if (!reader) return NextResponse.json({ error: "Body not readable" }, { status: 400 });

    let chunk = await reader.read();
    while (!chunk.done) {
      buffers.push(Buffer.from(chunk.value));
      chunk = await reader.read();
    }

    const stream = Readable.from(Buffer.concat(buffers));

    const form = new IncomingForm({ multiples: false });
    const { fields, files } = await new Promise<any>((resolve, reject) => {
      form.parse(stream as any, (err, fields, files) => {
        if (err) reject(err);
        else resolve({ fields, files });
      });
    });

    const file = files.file;
    if (!file) return NextResponse.json({ error: "File mancante" }, { status: 400 });

    const uploadedFile = Array.isArray(file) ? file[0] : file;
    const fileBuffer = await uploadedFile.toBuffer?.();
    const fileName = `${crypto.randomUUID()}_${uploadedFile.originalFilename}`;

    const { error } = await supabase.storage
      .from("receipts")
      .upload(fileName, fileBuffer, {
        contentType: uploadedFile.mimetype,
      });

    if (error) {
      console.error("Supabase upload error:", error);
      return NextResponse.json({ error: "Supabase upload error" }, { status: 500 });
    }

    const { data } = supabase.storage.from("receipts").getPublicUrl(fileName);
    return NextResponse.json({ success: true, url: data.publicUrl, fileName });
  } catch (err) {
    console.error("Upload failed:", err);
    return NextResponse.json({ error: "Upload error" }, { status: 500 });
  }
}
