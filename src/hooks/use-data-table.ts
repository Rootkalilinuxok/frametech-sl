"use client";

import { 
  useReactTable,
  getCoreRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  type ColumnDef,
  type RowData
} from "@tanstack/react-table";

interface UseDataTableProps<TData extends RowData> {
  data: TData[];
  columns: ColumnDef<TData>[];
  getRowId?: (row: TData) => string;
}

export function useDataTable<TData extends RowData>({
  data,
  columns,
  getRowId,
}: UseDataTableProps<TData>) {
  const table = useReactTable({
    data,
    columns,
    getRowId,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
  });

  return { table };
}
