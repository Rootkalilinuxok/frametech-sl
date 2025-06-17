import * as React from "react";
import { ColumnDef, type RowData } from "@tanstack/react-table";

import { DataTableColumnHeader } from "@/components/data-table/data-table-column-header";
import { SectionRowActions } from "@/components/table/row-actions";
import { Checkbox } from "@/components/ui/checkbox";

// ────────────────────────────────────────────────────────────
//  Fix TypeScript: estendi TableMeta per updateData
// ────────────────────────────────────────────────────────────
declare module '@tanstack/react-table' {
  interface TableMeta<TData extends RowData> {
    updateData: (rowIndex: number, columnId: string, value: any) => void;
  }
}

// ────────────────────────────────────────────────────────────
//  Tipi
// ────────────────────────────────────────────────────────────
export interface CostiRow {
  id: string;
  date: string; // YYYY-MM-DD
  time?: string; // HH:mm
  name: string;
  country?: string;
  currency: string;
  tip?: number;
  total: number;
  exchange_rate?: number;
  total_eur: number;
  percent?: number;
}

// ────────────────────────────────────────────────────────────
//  Helpers
// ────────────────────────────────────────────────────────────
const fmtDate = (d: string) => new Date(d).toLocaleDateString("it-IT");
const fmtTime = (t?: string) => t ?? "—";
const fmtCurr = (val: number, curr = "EUR") =>
  Intl.NumberFormat("it-IT", { style: "currency", currency: curr }).format(val);
const fmtNum = (val?: number) => val ?? "—";

// ────────────────────────────────────────────────────────────
//  Definizione colonne (EDITABILI)
// ────────────────────────────────────────────────────────────
export const costiColumns: ColumnDef<CostiRow>[] = [
  // Checkbox di selezione (fissa)
  {
    id: "select",
    header: ({ table }) => (
      <Checkbox
        checked={table.getIsAllPageRowsSelected()}
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label="Seleziona tutto"
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label="Seleziona riga"
      />
    ),
    enableSorting: false,
    enableHiding: false,
    size: 40,
  },
  {
    accessorKey: "id",
    header: ({ column }) => <DataTableColumnHeader column={column} title="ID" />,
    cell: ({ row }) => row.original.id,
    size: 140,
  },
  {
    accessorKey: "date",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Data" />,
    cell: ({ row, table }) => {
      const [value, setValue] = React.useState(row.original.date);
      React.useEffect(() => { setValue(row.original.date); }, [row.original.date]);
      return (
        <input
          type="date"
          className="input input-sm border rounded px-2 py-1"
          value={value}
          onChange={e => setValue(e.target.value)}
          onBlur={() => {
            if (value !== row.original.date) {
              table.options.meta?.updateData(row.index, "date", value);
            }
          }}
        />
      );
    },
    size: 110,
  },
  {
    accessorKey: "time",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Ora" />,
    cell: ({ row, table }) => {
      const [value, setValue] = React.useState(row.original.time ?? "");
      React.useEffect(() => { setValue(row.original.time ?? ""); }, [row.original.time]);
      return (
        <input
          type="time"
          className="input input-sm border rounded px-2 py-1"
          value={value}
          onChange={e => setValue(e.target.value)}
          onBlur={() => {
            if (value !== (row.original.time ?? "")) {
              table.options.meta?.updateData(row.index, "time", value);
            }
          }}
        />
      );
    },
    size: 80,
  },
  {
    accessorKey: "name",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Nome" />,
    cell: ({ row, table }) => {
      const [value, setValue] = React.useState(row.original.name);
      React.useEffect(() => { setValue(row.original.name); }, [row.original.name]);
      return (
        <input
          className="input input-sm border rounded px-2 py-1"
          value={value}
          onChange={e => setValue(e.target.value)}
          onBlur={() => {
            if (value !== row.original.name) {
              table.options.meta?.updateData(row.index, "name", value);
            }
          }}
        />
      );
    },
    size: 220,
  },
  {
    accessorKey: "country",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Nazione" />,
    cell: ({ row, table }) => {
      const [value, setValue] = React.useState(row.original.country ?? "");
      React.useEffect(() => { setValue(row.original.country ?? ""); }, [row.original.country]);
      return (
        <input
          className="input input-sm border rounded px-2 py-1"
          value={value}
          onChange={e => setValue(e.target.value)}
          onBlur={() => {
            if (value !== (row.original.country ?? "")) {
              table.options.meta?.updateData(row.index, "country", value || undefined);
            }
          }}
        />
      );
    },
    size: 100,
  },
  {
    accessorKey: "currency",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Valuta" />,
    cell: ({ row, table }) => {
      const [value, setValue] = React.useState(row.original.currency);
      React.useEffect(() => { setValue(row.original.currency); }, [row.original.currency]);
      return (
        <input
          className="input input-sm border rounded px-2 py-1"
          value={value}
          onChange={e => setValue(e.target.value)}
          onBlur={() => {
            if (value !== row.original.currency) {
              table.options.meta?.updateData(row.index, "currency", value);
            }
          }}
        />
      );
    },
    size: 90,
  },
  {
    accessorKey: "tip",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Tip/Mancia" />,
    cell: ({ row, table }) => {
      const [value, setValue] = React.useState(row.original.tip ?? "");
      React.useEffect(() => { setValue(row.original.tip ?? ""); }, [row.original.tip]);
      return (
        <input
          type="number"
          className="input input-sm border rounded px-2 py-1"
          value={value}
          onChange={e => setValue(e.target.value)}
          onBlur={() => {
            const num = value === "" ? undefined : Number(value);
            if (num !== row.original.tip) {
              table.options.meta?.updateData(row.index, "tip", num);
            }
          }}
        />
      );
    },
    size: 110,
  },
  {
    accessorKey: "total",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Totale" />,
    cell: ({ row, table }) => {
      const [value, setValue] = React.useState(row.original.total);
      React.useEffect(() => { setValue(row.original.total); }, [row.original.total]);
      return (
        <input
          type="number"
          className="input input-sm border rounded px-2 py-1"
          value={value}
          onChange={e => setValue(Number(e.target.value))}
          onBlur={() => {
            if (value !== row.original.total) {
              table.options.meta?.updateData(row.index, "total", value);
            }
          }}
        />
      );
    },
    size: 110,
  },
  {
    accessorKey: "exchange_rate",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Cambio" />,
    cell: ({ row, table }) => {
      const [value, setValue] = React.useState(row.original.exchange_rate ?? "");
      React.useEffect(() => { setValue(row.original.exchange_rate ?? ""); }, [row.original.exchange_rate]);
      return (
        <input
          type="number"
          step="0.0001"
          className="input input-sm border rounded px-2 py-1"
          value={value}
          onChange={e => setValue(e.target.value)}
          onBlur={() => {
            const num = value === "" ? undefined : Number(value);
            if (num !== row.original.exchange_rate) {
              table.options.meta?.updateData(row.index, "exchange_rate", num);
            }
          }}
        />
      );
    },
    size: 90,
  },
  {
    accessorKey: "total_eur",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Totale (€)" />,
    cell: ({ row, table }) => {
      const [value, setValue] = React.useState(row.original.total_eur);
      React.useEffect(() => { setValue(row.original.total_eur); }, [row.original.total_eur]);
      return (
        <input
          type="number"
          className="input input-sm border rounded px-2 py-1"
          value={value}
          onChange={e => setValue(Number(e.target.value))}
          onBlur={() => {
            if (value !== row.original.total_eur) {
              table.options.meta?.updateData(row.index, "total_eur", value);
            }
          }}
        />
      );
    },
    size: 120,
  },
  {
    accessorKey: "percent",
    header: ({ column }) => <DataTableColumnHeader column={column} title="+ %" />,
    cell: ({ row, table }) => {
      const [value, setValue] = React.useState(row.original.percent ?? "");
      React.useEffect(() => { setValue(row.original.percent ?? ""); }, [row.original.percent]);
      return (
        <input
          type="number"
          step="0.01"
          className="input input-sm border rounded px-2 py-1"
          value={value}
          onChange={e => setValue(e.target.value)}
          onBlur={() => {
            const num = value === "" ? undefined : Number(value);
            if (num !== row.original.percent) {
              table.options.meta?.updateData(row.index, "percent", num);
            }
          }}
        />
      );
    },
    size: 70,
  },
  // Azioni (fissa a destra)
  {
    id: "actions",
    header: () => <span className="sr-only">Azioni</span>,
    cell: ({ row }) => <SectionRowActions row={row.original} />,
    enableSorting: false,
    enableHiding: false,
    size: 60,
  },
];
