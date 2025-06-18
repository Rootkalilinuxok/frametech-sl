"use client";

import * as React from "react";

import data from "./_components/data.json";
import DataTable, { CostRow } from "./_components/DataTableResizable";
import { SectionCards } from "./_components/section-cards";

export default function CostiPage() {
  const rows: CostRow[] = data as unknown as CostRow[];

  return (
    <div className="@container/main flex flex-col gap-4 p-6 md:gap-6">
      <SectionCards />
      <h1 className="mb-2 text-2xl font-bold">Dashboard Costi</h1>
      <DataTable data={rows} />
    </div>
  );
}
