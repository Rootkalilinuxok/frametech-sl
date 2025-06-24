import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_KEY!
);

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get("file") as File | null;

    if (!file) {
      return NextResponse.json({ error: "Nessun file caricato" }, { status: 400 });
    }

    const buffer = Buffer.from(await file.arrayBuffer());

    const { data, error } = await supabase.storage
      .from("receipts")
      .upload(`uploads/${file.name}`, buffer, {
        contentType: file.type,
      });

    if (error) {
      console.error("Errore durante l'upload:", error.message);
      return NextResponse.json({ error: "Upload to Supabase failed" }, { status: 500 });
    }

    const { data: urlInfo } = supabase.storage
      .from("receipts")
      .getPublicUrl(data.path);

    return NextResponse.json({ success: true, url: urlInfo.publicUrl });
  } catch (err: any) {
    console.error("Errore API:", err.message);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
