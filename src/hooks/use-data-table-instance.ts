import {
  useReactTable,
  getCoreRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  type RowData,
  type TableOptions,
} from "@tanstack/react-table";

export function useDataTableInstance<TData extends RowData>({
  data,
  columns,
  getRowId,
  ...tableOptions
}: TableOptions<TData>) {
  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getRowId: getRowId ?? ((row: TData) => String((row as { id: string | number }).id)),
    ...tableOptions,
  });

  return table;
}
