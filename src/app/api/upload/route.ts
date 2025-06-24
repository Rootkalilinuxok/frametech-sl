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

    // Genera nome file univoco
    const uniqueName = `${Date.now()}-${file.name}`;

    const { data, error } = await supabase.storage
      .from("receipts")
      .upload(`uploads/${uniqueName}`, buffer, {
        contentType: file.type,
        upsert: false, // evitiamo sovrascritture
      });

    if (error) {
      console.error("Errore durante l'upload:", error.message);
      return NextResponse.json({ error: "Upload to Supabase failed" }, { status: 500 });
    }

    const { data: urlInfo } = supabase.storage
      .from("receipts")
      .getPublicUrl(data.path);

    return NextResponse.json({
      success: true,
      url: urlInfo.publicUrl,
      filename: file.name,
      path: data.path,
      mimetype: file.type
    });
  } catch (err: any) {
    console.error("Errore API:", err.message);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
