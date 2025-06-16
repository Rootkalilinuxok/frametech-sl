"use client";

import { useDataTable } from "@/hooks/use-data-table";
import { DataTable as DataTableNew } from "@/components/data-table/data-table";
import { DataTablePagination } from "@/components/data-table/data-table-pagination";
import { DataTableViewOptions } from "@/components/data-table/data-table-view-options";
import { columns, type ReceiptRow } from "./columns";

interface DataTableProps {
  data: ReceiptRow[];
}

export function DataTable({ data }: DataTableProps) {
  const { table } = useDataTableInstance({
  data,
  columns,
  getRowId: (row) => row.id.toString(), // Ora funzionerà correttamente
  enableRowSelection: true
});


  return (
    <div className="space-y-4">
      <DataTableViewOptions table={table} />
      <div className="overflow-hidden rounded-lg border">
        <DataTableNew table={table} columns={columns} />
      </div>
      <DataTablePagination table={table} />
    </div>
  );
}
