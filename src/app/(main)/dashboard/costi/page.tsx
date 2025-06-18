// src/app/(main)/dashboard/costi/page.tsx
"use client";

import React from "react";
// Usiamo gli stessi 4 box di KPI di Andamento
import { SectionCards } from "../andamento/_components/section-cards";
// La tabella “costi” con i vincoli di larghezza
import DataTableResizable, { CostRow } from "./_components/DataTableResizable";
// I dati di esempio
import data from "./_components/data.json";

export default function CostiPage() {
  // Cast dei dati al tipo corretto
  const rows = data as CostRow[];

  return (
    <div className="@container/main flex flex-col gap-6 p-6">
      {/* Griglia responsive 1–2–4 colonne per i KPI cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <SectionCards />
      </div>

      {/* Titolo facoltativo */}
      <h1 className="text-2xl font-bold">Dashboard Costi</h1>

      {/* La tabella dei costi, con tutti i parametri di DataTableResizable */}
      <DataTableResizable data={rows} />
    </div>
  );
}
