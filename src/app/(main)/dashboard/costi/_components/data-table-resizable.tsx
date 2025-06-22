"use client";

import React, { useMemo } from "react";

import { ColumnDef, flexRender, getCoreRowModel, useReactTable } from "@tanstack/react-table";

import { DataTableColumnHeader } from "@/components/data-table/data-table-column-header";
import { Checkbox } from "@/components/ui/checkbox";

const CHAR_WIDTH = 8;

export interface CostRow {
  id: number;
  name: string;
  country: string;
  currency: string;
  tip: number;
  total: number;
  exchangeRate: number;
  totalEur: number;
  percent: number;
}

export default function DataTableResizable({ data }: { data: CostRow[] }) {
  const columns = useMemo<ColumnDef<CostRow>[]>(
    () => [
      {
        id: "select",
        header: ({ table }) => (
          <Checkbox
            checked={table.getIsAllRowsSelected()}
            onCheckedChange={table.getToggleAllRowsSelectedHandler()}
            aria-label="Seleziona tutto"
          />
        ),
        cell: ({ row }) => (
          <Checkbox
            checked={row.getIsSelected()}
            onCheckedChange={row.getToggleSelectedHandler()}
            aria-label="Seleziona riga"
          />
        ),
        enableSorting: false,
        enableHiding: false,
        enableResizing: true,
        minSize: CHAR_WIDTH * 4,
        maxSize: CHAR_WIDTH * 6,
      },
      {
        accessorKey: "name",
        header: ({ column }) => <DataTableColumnHeader column={column} title="Nome" />,
        enableResizing: true,
        enableHiding: false,
        minSize: CHAR_WIDTH * 16, // ADATTIVA E LARGA
        maxSize: CHAR_WIDTH * 40,
      },
      {
        accessorKey: "country",
        header: ({ column }) => <DataTableColumnHeader column={column} title="Nazione" />,
        enableResizing: true,
        enableHiding: false,
        minSize: CHAR_WIDTH * 8,
        maxSize: CHAR_WIDTH * 20,
      },
      {
        accessorKey: "currency",
        header: ({ column }) => <DataTableColumnHeader column={column} title="Valuta" />,
        enableResizing: true,
        enableHiding: false,
        minSize: CHAR_WIDTH * 8,
        maxSize: CHAR_WIDTH * 16,
      },
      {
        accessorKey: "tip",
        header: ({ column }) => <DataTableColumnHeader column={column} title="Tip/Mancia" />,
        enableResizing: true,
        enableHiding: false,
        minSize: CHAR_WIDTH * 10,
        maxSize: CHAR_WIDTH * 18,
      },
      {
        accessorKey: "total",
        header: ({ column }) => <DataTableColumnHeader column={column} title="Totale" />,
        enableResizing: true,
        enableHiding: false,
        minSize: CHAR_WIDTH * 12, // PIU’ SPAZIO
        maxSize: CHAR_WIDTH * 28,
      },
      {
        accessorKey: "exchangeRate",
        header: ({ column }) => <DataTableColumnHeader column={column} title="Cambio" />,
        enableResizing: true,
        enableHiding: false,
        minSize: CHAR_WIDTH * 10,
        maxSize: CHAR_WIDTH * 18,
      },
      {
        accessorKey: "totalEur",
        header: ({ column }) => <DataTableColumnHeader column={column} title="Totale (€)" />,
        enableResizing: true,
        enableHiding: false,
        minSize: CHAR_WIDTH * 12, // PIU’ SPAZIO
        maxSize: CHAR_WIDTH * 28,
      },
      {
        accessorKey: "percent",
        header: ({ column }) => <DataTableColumnHeader column={column} title="+ %" />,
        enableResizing: true,
        enableHiding: false,
        minSize: CHAR_WIDTH * 8,
        maxSize: CHAR_WIDTH * 16,
      },
      {
        id: "actions",
        header: () => <span className="sr-only">Azioni</span>,
        cell: () => (
          <button onClick={() => {}} className="text-sm underline">
            Modifica
          </button>
        ),
        enableSorting: false,
        enableHiding: false,
        enableResizing: true,
        minSize: CHAR_WIDTH * 10,
        maxSize: CHAR_WIDTH * 18,
      },
    ],
    [],
  );

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    columnResizeMode: "onChange",
  });

  return (
    <div className="overflow-x-auto">
      <table className="w-full table-auto border-collapse">
        <thead>
          {table.getHeaderGroups().map((hg) => (
            <tr key={hg.id}>
              {hg.headers.map((header) => (
                <th
                  key={header.id}
                  style={{
                    minWidth: header.column.columnDef.minSize,
                    maxWidth: header.column.columnDef.maxSize,
                  }}
                  className="px-4 py-2 text-left font-bold"
                >
                  {!header.isPlaceholder && flexRender(header.column.columnDef.header, header.getContext())}
                </th>
              ))}
            </tr>
          ))}
        </thead>
        <tbody>
          {table.getRowModel().rows.map((row) => (
            <tr key={row.id}>
              {row.getVisibleCells().map((cell) => (
                <td
                  key={cell.id}
                  style={{
                    minWidth: cell.column.columnDef.minSize,
                    maxWidth: cell.column.columnDef.maxSize,
                  }}
                  className="border-t px-4 py-2"
                >
                  {flexRender(cell.column.columnDef.cell, cell.getContext())}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
