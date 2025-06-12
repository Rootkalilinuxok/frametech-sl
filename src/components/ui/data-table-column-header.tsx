/*
  DataTableColumnHeader – header cliccabile con ordinamento ▲▼
  Compatibile con TanStack React‑Table v8 e shadcn/ui
*/

import { Column } from "@tanstack/react-table";
import { ArrowUpDown } from "lucide-react";
import { cn } from "@/lib/utils";

interface Props<TData, TValue> {
  column: Column<TData, TValue>;
  title: string;
}

export function DataTableColumnHeader<TData, TValue>({
  column,
  title,
}: Props<TData, TValue>) {
  // Se la colonna non è ordinabile, mostra solo il titolo
  if (!column.getCanSort()) return <span>{title}</span>;

  return (
    <button
      className={cn("flex select-none items-center gap-1")}
      onClick={column.getToggleSortingHandler()}
    >
      {title}
      <ArrowUpDown
        className={cn(
          "h-4 w-4 transition",
          column.getIsSorted() ? "opacity-100" : "opacity-30"
        )}
      />
    </button>
  );
}
