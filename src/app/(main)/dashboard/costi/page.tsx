import { SectionCards } from "./_components/section-cards";
import { DataTable } from "./_components/data-table";
import type { CostiRow } from "./_components/columns";

// Tipo che rappresenta la risposta della tua API (modifica se cambiano i campi)
type ApiRow = {
  id: string;
  date: string;
  time?: string;
  name: string;
  country?: string;
  currency: string;
  tip?: number | string | null;
  total: number | string | null;
  exchangeRate?: number | string | null;
  totalEur?: number | string | null;
  percent?: number | string | null;
};

// Mapping da risposta API a CostiRow (modifica se serve)
function mapRow(row: ApiRow): CostiRow {
  return {
    id: row.id,
    date: row.date ? row.date.slice(0, 10) : "",
    time: row.time ?? "",
    name: row.name ?? "",
    country: row.country ?? "",
    currency: row.currency ?? "",
    tip: row.tip !== null && row.tip !== undefined ? Number(row.tip) : 0,
    total: row.total !== null && row.total !== undefined ? Number(row.total) : 0,
    exchange_rate:
      row.exchangeRate !== null && row.exchangeRate !== undefined
        ? Number(row.exchangeRate)
        : 0,
    total_eur:
      row.totalEur !== null && row.totalEur !== undefined
        ? Number(row.totalEur)
        : 0,
    percent: row.percent !== null && row.percent !== undefined ? Number(row.percent) : 0,
  };
}

// Funzione async per recuperare i dati costi dalla API
async function getRows(): Promise<CostiRow[]> {
  // Prendi la base URL dal .env oppure fallback a localhost (dev)
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";
  // Usare sempre l'URL ASSOLUTO nei Server Component/SSR!
  const url = `${baseUrl}/api/receipts/history`;

  const res = await fetch(url, { cache: "no-store" });

  if (!res.ok) {
    const text = await res.text();
    // Errore gestito: sarà visibile come stacktrace dettagliata solo in dev!
    throw new Error("Errore fetch dati costi: " + res.status + " - " + text);
  }

  const apiRows: ApiRow[] = await res.json();
  return apiRows.map(mapRow);
}

// Componente server principale della pagina
export default async function Page() {
  const data = await getRows();

  return (
    <div className="@container/main flex flex-col gap-4 md:gap-6">
      <SectionCards />
      <DataTable data={data} />
    </div>
  );
}
