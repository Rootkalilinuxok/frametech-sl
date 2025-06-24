import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

// Connessione a Supabase
const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_KEY!
);

export async function POST(req: NextRequest) {
  try {
    // Estrai form-data dalla richiesta
    const formData = await req.formData();
    const file = formData.get("file") as File | null;

    if (!file) {
      return NextResponse.json({ error: "Nessun file caricato" }, { status: 400 });
    }

    // Converti il file in buffer
    const buffer = Buffer.from(await file.arrayBuffer());

    // Esegui upload nel bucket Supabase "receipts"
    const { data, error } = await supabase.storage
      .from("receipts")
      .upload(`uploads/${file.name}`, buffer, {
        contentType: file.type,
      });

    if (error) {
      console.error("Errore durante l'upload:", error.message);
      return NextResponse.json({ error: "Upload to Supabase failed" }, { status: 500 });
    }

    // Ottieni URL pubblico del file caricato
    const { data: urlInfo } = supabase.storage
      .from("receipts")
      .getPublicUrl(data.path);

    // Ritorna URL al client per salvarlo nel DB
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
