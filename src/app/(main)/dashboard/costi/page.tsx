import { ChartAreaInteractive } from "../andamento/_components/chart-area-interactive";
import type { CostiRow } from "./_components/columns";
import { DataTable } from "./_components/data-table";
import { SectionCards } from "./_components/section-cards";

type ApiRow = {
  id: string;
  date: string | Date;
  time?: string | null;
  name: string;
  country?: string | null;
  currency: string;
  total: string;
  tip?: string | null;
  exchangeRate?: string | null;
  totalEur?: string | null;
  percent?: string | null;
};

function mapRow(row: ApiRow): CostiRow {
  const toNum = (val?: string | null) => (val === null || val === undefined ? undefined : Number(val));

  return {
    id: row.id,
    date: row.date instanceof Date ? row.date.toISOString().slice(0, 10) : row.date.slice(0, 10),
    time: row.time ?? undefined,
    name: row.name,
    country: row.country ?? undefined,
    currency: row.currency,
    tip: toNum(row.tip),
    total: Number(row.total),
    exchange_rate: toNum(row.exchangeRate),
    total_eur: row.totalEur === null || row.totalEur === undefined ? Number(row.total) : Number(row.totalEur),
    percent: toNum(row.percent),
  };
}

async function getRows(): Promise<CostiRow[]> {
  const baseUrl = process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : "http://localhost:3000";
  console.log("[COSTI] Chiamata API receipts/history →", `${baseUrl}/api/receipts/history`);
  const res = await fetch(`${baseUrl}/api/receipts/history`, {
    cache: "no-store",
  });

  if (!res.ok) {
    let body: string | undefined;
    try {
      body = await res.text();
    } catch {
      // ignore
    }
    const message = body?.trim() ?? `Request failed with status ${res.status}`;
    console.error("[COSTI] Response NOT ok:", message);
    throw new Error(`Failed to fetch receipts history: ${message}`);
  }

  let rows: ApiRow[];
  try {
    rows = (await res.json()) as ApiRow[];
    console.log("[COSTI] API response (raw):", rows);
  } catch (err) {
    console.error("[COSTI] Errore parsing JSON dalla response:", err);
    throw new Error("Errore parsing JSON dalla response API costi");
  }

  if (!rows || !Array.isArray(rows)) {
    console.error("[COSTI] La risposta NON è un array valido!", rows);
    throw new Error("La risposta NON è un array valido!");
  }

  const mapped = rows.map(mapRow);
  console.log("[COSTI] Mappato in CostiRow[]:", mapped);
  return mapped;
}

export { getRows };

export default async function Page() {
  try {
    const data = await getRows();
    console.log("[COSTI] DataTable riceve dati:", data);
    return (
      <div className="@container/main flex flex-col gap-4 md:gap-6">
        <SectionCards />
        <ChartAreaInteractive />
        <DataTable data={data} />
      </div>
    );
  } catch (err) {
    console.error("Failed to load receipts history:", err);
    return <p>Errore nel caricamento dei dati</p>;
  }
}
