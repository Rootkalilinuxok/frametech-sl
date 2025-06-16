"use client";

import { useDataTableInstance } from "@/hooks/use-data-table-instance";
import { DataTable as DataTableComponent } from "@/components/data-table/data-table";
import { DataTablePagination } from "@/components/data-table/data-table-pagination";
import { DataTableViewOptions } from "@/components/data-table/data-table-view-options";
import { dashboardColumns, type SectionRow } from "./columns";

export function DataTable({ data }: { data: SectionRow[] }) {
  const table = useDataTableInstance({
    data,
    columns: dashboardColumns,
    getRowId: (row) => row.id.toString(),
  });

  return (
    <div className="space-y-4">
      <DataTableViewOptions table={table} />
      <div className="rounded-lg border">
        <DataTableComponent table={table} />
      </div>
      <DataTablePagination table={table} />
    </div>
  );
}
