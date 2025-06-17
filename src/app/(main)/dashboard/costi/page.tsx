"use client";

import * as React from "react";
import DataTable, { CostRow } from "./_components/DataTableResizable";
import data from "./_components/data.json";
import { SectionCards } from "./_components/section-cards";

export default function CostiPage() {
  const rows: CostRow[] = data as unknown as CostRow[];

  return (
    <div className="@container/main flex flex-col gap-4 md:gap-6 p-6">
      <SectionCards />
      <h1 className="text-2xl font-bold mb-2">Dashboard Costi</h1>
      <DataTable data={rows} />
    </div>
  );
}
