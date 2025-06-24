/* eslint-disable max-lines */
import * as React from "react";
import { ColumnDef, RowData, Row, Table } from "@tanstack/react-table";
import { DataTableColumnHeader } from "@/components/data-table/data-table-column-header";
import { SectionRowActions } from "@/components/table/row-actions";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";


/* eslint-disable react-hooks/rules-of-hooks, max-lines */

// ────────────────────────────────────────────────────────────
//  Fix TypeScript: estendi TableMeta per updateData
// ────────────────────────────────────────────────────────────
declare module "@tanstack/react-table" {
  interface TableMeta<TData extends RowData> {
    updateData: (rowIndex: number, columnId: string, value: any) => void;
    openImage?: (props: { url: string; name: string }) => void;
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

interface CellProps {
  row: Row<CostiRow>;
  table: Table<CostiRow>;
}

// ────────────────────────────────────────────────────────────
//  Celle editabili
// ────────────────────────────────────────────────────────────

export function NameCell({ row, table }: CellProps) {
  // Usa il campo image_url restituito dal backend (DB)
  const imageUrl = (row.original as any).image_url;
  const [value, setValue] = React.useState(row.original.name);

  React.useEffect(() => {
    setValue(row.original.name);
  }, [row.original.name]);

  if (imageUrl) {
    return (
      <Button
        variant="link"
        className="p-0 text-blue-700 underline"
        onClick={() => {
          if (table.options.meta?.openImage) {
            table.options.meta.openImage({ url: imageUrl, name: row.original.name });
          }
        }}
      >
        {row.original.name}
      </Button>
    );
  }

  return (
    <input
      className="input input-sm w-full rounded border px-2 py-1"
      value={value}
      onChange={(e) => setValue(e.target.value)}
      onBlur={() => {
        if (value !== row.original.name) {
          table.options.meta?.updateData(row.index, "name", value);
        }
      }}
    />
  );
}

export function DateCell({ row, table }: CellProps) {
  const [value, setValue] = React.useState(row.original.date ?? "");
  React.useEffect(() => {
    setValue(row.original.date ?? "");
  }, [row.original.date]);
  return (
    <input
      type="date"
      className="input input-sm rounded border px-2 py-1"
      style={{ width: "120px", minWidth: "110px", maxWidth: "130px" }}
      value={value}
      onChange={(e) => setValue(e.target.value)}
      onBlur={() => {
        if (value !== (row.original.date ?? "")) {
          table.options.meta?.updateData(row.index, "date", value);
        }
      }}
    />
  );
}

export function TimeCell({ row, table }: CellProps) {
  const [value, setValue] = React.useState(row.original.time ?? "");
  React.useEffect(() => {
    setValue(row.original.time ?? "");
  }, [row.original.time]);
  return (
    <input
      type="time"
      className="input input-sm rounded border px-2 py-1"
      style={{ width: "90px", minWidth: "80px", maxWidth: "100px" }}
      value={value}
      onChange={(e) => setValue(e.target.value)}
      onBlur={() => {
        if (value !== (row.original.time ?? "")) {
          table.options.meta?.updateData(row.index, "time", value);
        }
      }}
    />
  );
}


export function CountryCell({ row, table }: CellProps) {
  const [value, setValue] = React.useState(row.original.country ?? "");
  React.useEffect(() => {
    setValue(row.original.country ?? "");
  }, [row.original.country]);
  return (
    <input
      className="input input-sm w-full rounded border px-2 py-1"
      value={value}
      onChange={(e) => setValue(e.target.value)}
      onBlur={() => {
        if (value !== (row.original.country ?? "")) {
          table.options.meta?.updateData(row.index, "country", value || undefined);
        }
      }}
    />
  );
}

export function CurrencyCell({ row, table }: CellProps) {
  const [value, setValue] = React.useState(row.original.currency);
  React.useEffect(() => {
    setValue(row.original.currency);
  }, [row.original.currency]);
  return (
    <input
      className="input input-sm w-full rounded border px-2 py-1"
      value={value}
      onChange={(e) => setValue(e.target.value)}
      onBlur={() => {
        if (value !== row.original.currency) {
          table.options.meta?.updateData(row.index, "currency", value);
        }
      }}
    />
  );
}

export function TipCell({ row, table }: CellProps) {
  const [value, setValue] = React.useState(row.original.tip ?? "");
  React.useEffect(() => {
    setValue(row.original.tip ?? "");
  }, [row.original.tip]);
  return (
    <input
      type="number"
      className="input input-sm w-full rounded border px-2 py-1"
      value={value}
      onChange={(e) => setValue(e.target.value)}
      onBlur={() => {
        const num = value === "" ? undefined : Number(value);
        if (num !== row.original.tip) {
          table.options.meta?.updateData(row.index, "tip", num);
        }
      }}
    />
  );
}

export function TotalCell({ row, table }: CellProps) {
  const [value, setValue] = React.useState(row.original.total);
  React.useEffect(() => {
    setValue(row.original.total);
  }, [row.original.total]);
  return (
    <input
      type="number"
      className="input input-sm w-full rounded border px-2 py-1"
      value={value}
      onChange={(e) => setValue(Number(e.target.value))}
      onBlur={() => {
        if (value !== row.original.total) {
          table.options.meta?.updateData(row.index, "total", value);
        }
      }}
    />
  );
}

export function ExchangeRateCell({ row, table }: CellProps) {
  const [value, setValue] = React.useState(row.original.exchange_rate ?? "");
  React.useEffect(() => {
    setValue(row.original.exchange_rate ?? "");
  }, [row.original.exchange_rate]);
  return (
    <input
      type="number"
      step="0.0001"
      className="input input-sm w-full rounded border px-2 py-1"
      value={value}
      onChange={(e) => setValue(e.target.value)}
      onBlur={() => {
        const num = value === "" ? undefined : Number(value);
        if (num !== row.original.exchange_rate) {
          table.options.meta?.updateData(row.index, "exchange_rate", num);
        }
      }}
    />
  );
}

export function TotalEurCell({ row, table }: CellProps) {
  const [value, setValue] = React.useState(row.original.total_eur);
  React.useEffect(() => {
    setValue(row.original.total_eur);
  }, [row.original.total_eur]);
  return (
    <input
      type="number"
      className="input input-sm w-full rounded border px-2 py-1"
      value={value}
      onChange={(e) => setValue(Number(e.target.value))}
      onBlur={() => {
        if (value !== row.original.total_eur) {
          table.options.meta?.updateData(row.index, "total_eur", value);
        }
      }}
    />
  );
}

export function PercentCell({ row, table }: CellProps) {
  const [value, setValue] = React.useState(row.original.percent ?? "");
  React.useEffect(() => {
    setValue(row.original.percent ?? "");
  }, [row.original.percent]);
  return (
    <input
      type="number"
      step="0.01"
      className="input input-sm w-full rounded border px-2 py-1"
      value={value}
      onChange={(e) => setValue(e.target.value)}
      onBlur={() => {
        const num = value === "" ? undefined : Number(value);
        if (num !== row.original.percent) {
          table.options.meta?.updateData(row.index, "percent", num);
        }
      }}
    />
  );
}

// ────────────────────────────────────────────────────────────
//  Definizione colonne (EDITABILI e AUTO-REGOLABILI)
// ────────────────────────────────────────────────────────────
export const costiColumns: ColumnDef<CostiRow>[] = [
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
    minSize: 60,
    maxSize: 110,
  },
  {
    accessorKey: "date",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Data" />,
    cell: DateCell,
    minSize: 110,
    maxSize: 130,
  },
  {
    accessorKey: "time",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Ora" />,
    cell: TimeCell,
    minSize: 80,
    maxSize: 100,
  },
  {
    accessorKey: "name",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Nome" />,
    cell: NameCell,
    minSize: 60, // "Nome"
    maxSize: 260,
  },
  {
    accessorKey: "country",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Nazione" />,
    cell: CountryCell,
    minSize: 80, // "Nazione"
    maxSize: 180,
  },
  {
    accessorKey: "currency",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Valuta" />,
    cell: CurrencyCell,
    minSize: 80, // "Valuta"
    maxSize: 180,
  },
  {
    accessorKey: "tip",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Tip/Mancia" />,
    cell: TipCell,
    minSize: 100, // "Tip/Mancia"
    maxSize: 180,
  },
  {
    accessorKey: "total",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Totale" />,
    cell: TotalCell,
    minSize: 80, // "Totale"
    maxSize: 180,
  },
  {
    accessorKey: "exchange_rate",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Cambio" />,
    cell: ExchangeRateCell,
    minSize: 80, // "Cambio"
    maxSize: 180,
  },
  {
    accessorKey: "total_eur",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Totale (€)" />,
    cell: TotalEurCell,
    minSize: 90, // "Totale (€)"
    maxSize: 180,
  },
  {
    accessorKey: "percent",
    header: ({ column }) => <DataTableColumnHeader column={column} title="+ %" />,
    cell: PercentCell,
    minSize: 60, // "+ %"
    maxSize: 110,
  },
  {
    id: "actions",
    header: () => <span className="sr-only">Azioni</span>,
    cell: ({ row }) => <SectionRowActions row={row.original} />,
    enableSorting: false,
    enableHiding: false,
    minSize: 60,
    maxSize: 90,
  },
];
