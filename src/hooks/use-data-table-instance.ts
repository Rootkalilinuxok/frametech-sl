import {
  useReactTable,
  getCoreRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  type ColumnDef,
  type Row,
  type RowData,
  type TableOptions,
} from "@dnd-kit/core";

interface UseDataTableInstanceProps<TData extends RowData> extends TableOptions<TData> {
  columns: ColumnDef<TData>[];
  data: TData[];
  getRowId?: (row: TData, index: number) => string;
  enableRowSelection?: boolean;
}

export function useDataTableInstance<TData extends RowData>({
  columns,
  data,
  getRowId,
  enableRowSelection,
  ...tableOptions
}: UseDataTableInstanceProps<TData>) {
  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    ...tableOptions,
    getRowId: getRowId
      ? (row: TData, index: number) => getRowId(row, index)
      : (row: TData) => String((row as { id: string | number }).id),
    enableRowSelection,
  });

  return { table };
}
