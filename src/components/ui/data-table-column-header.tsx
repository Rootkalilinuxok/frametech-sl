// src/components/ui/data-table-column-header.tsx
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
