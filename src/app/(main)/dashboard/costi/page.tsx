import { SectionCards } from "./_components/section-cards";
import { DataTable } from "./_components/data-table";
import type { CostiRow } from "./_components/columns";

// Tipo che rappresenta la risposta della tua API (adattalo se cambiano i nomi/campi)
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

// Funzione di mapping: converte una riga da API a CostiRow per la tabella
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

// Funzione async che chiama la tua API (usa path corretto!)
// ATTENZIONE: se la tua API risponde su /dashboard/costi/api/receipts/history va usato questo!
async function getRows(): Promise<CostiRow[]> {
  const res = await fetch("/dashboard/costi/api/receipts/history", { cache: "no-store" });
  if (!res.ok) {
    const text = await res.text();
    throw new Error("Errore fetch dati costi: " + res.status + " - " + text);
  }
  const apiRows: ApiRow[] = await res.json();
  return apiRows.map(mapRow);
}

// Componente principale della pagina
export default async function Page() {
  const data = await getRows();
  return (
    <div className="@container/main flex flex-col gap-4 md:gap-6">
      <SectionCards />
      <DataTable data={data} />
    </div>
  );
}
