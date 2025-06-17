// src/app/(main)/dashboard/costi/page.tsx

import { SectionCards } from "./_components/section-cards";
import { DataTable } from "./_components/data-table";
import { costiColumns, CostiRow } from "./_components/columns";
import rawData from "./_components/data.json";

// Funzione di mapping per adattare i tuoi dati alla struttura CostiRow
function mapToCostiRow(item: any): CostiRow {
  return {
    id: String(item.id),
    date: "2025-01-01",              // Inserisci una data reale qui se disponibile
    name: item.header,
    currency: "EUR",                 // Personalizza se serve
    total: Number(item.target) || 0, // O altro campo numerico
    total_eur: Number(item.target) || 0,
    time: undefined,                 // O usa item.time se esiste
    country: undefined,
    tip: undefined,
    exchange_rate: undefined,
    percent: undefined,
  };
}

const costiData: CostiRow[] = Array.isArray(rawData) ? rawData.map(mapToCostiRow) : [];

export default function CostiPage() {
  return (
    <div className="flex flex-col gap-8">
      <SectionCards />
      <DataTable columns={costiColumns} data={costiData} />
    </div>
  );
}
