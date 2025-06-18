// src/app/(main)/dashboard/costi/page.tsx
"use client";

import React from "react";
// Importa i KPI-cards **dalla cartella costi** (indipendenti da Andamento!)
import { SectionCards } from "./_components/section-cards";
// La tabella resizable dei costi
import DataTableResizable, { CostRow } from "./_components/DataTableResizable";
// I dati JSON
import data from "./_components/data.json";

export default function CostiPage() {
  const rows = data as CostRow[];

  return (
    <div className="@container/main flex flex-col gap-6 p-6">
      {/* Griglia responsive 1–2–4 colonne */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <SectionCards />
      </div>

      <h1 className="text-2xl font-bold mt-4">Dashboard Costi</h1>

      {/* Solo la tabella: nessun grafico */}
      <DataTableResizable data={rows} />
    </div>
  );
}
