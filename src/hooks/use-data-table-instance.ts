import {
  useReactTable,
  getCoreRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  type RowData,
  type TableOptions,
} from "@tanstack/react-table";

// Generic helper that forwards all options (including `meta`)
// to the underlying `useReactTable` hook. `TMeta` preserves
// the type of `table.options.meta` for consumers.
export function useDataTableInstance<
  TData extends RowData,
  TMeta = unknown
>({ data, columns, getRowId, ...tableOptions }: TableOptions<TData> & {
  meta?: TMeta;
}) {
  const table = useReactTable({
    ...tableOptions,
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getRowId: getRowId ?? ((row: TData) => String((row as { id: string | number }).id)),
  });

  // L'istanza restituita avrà `table.options.meta` tipizzata
  // con `TMeta`, così i componenti possono accedere a funzioni
  // come `updateData` senza cast.

  return table;
}
