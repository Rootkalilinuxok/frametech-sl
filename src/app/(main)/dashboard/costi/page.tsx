import { SectionCards } from "./_components/section-cards";
import { DataTable } from "./_components/data-table";
import type { CostiRow } from "./_components/columns";

type ApiRow = {
  id: string;
  date: string;
  time?: string;
  name: string;
  country?: string;
  currency: string;
  tip?: number | null;
  total: number | string;
  exchangeRate?: number | null;
  totalEur?: number | null;
  percent?: number | null;
};

// Mapping function: adatta l'oggetto dal backend a CostiRow
function mapRow(row: ApiRow): CostiRow {
  return {
    id: row.id,
    date: row.date,
    time: row.time || "",
    name: row.name,
    country: row.country || "",
    currency: row.currency,
    tip: row.tip ?? 0,
    total: Number(row.total ?? 0),
    exchange_rate: row.exchangeRate ?? 0,
    total_eur: row.totalEur ?? 0,
    percent: row.percent ?? 0,
  };
}

async function getRows(): Promise<CostiRow[]> {
  // Next.js App Router: process.env.VERCEL_URL solo su Vercel, fallback su localhost
  const baseUrl =
    process.env.VERCEL_URL
      ? `https://${process.env.VERCEL_URL}`
      : "http://localhost:3000";

  const res = await fetch(`${baseUrl}/api/receipts/history`, { cache: "no-store" });
  if (!res.ok) {
    const text = await res.text();
    throw new Error("Errore fetch dati costi: " + res.status + " - " + text);
  }
  const apiRows: ApiRow[] = await res.json();
  return apiRows.map(mapRow);
}

export default async function Page() {
  const data = await getRows();
  return (
    <div className="@container/main flex flex-col gap-4 md:gap-6">
      <SectionCards />
      <DataTable data={data} />
    </div>
  );
}
