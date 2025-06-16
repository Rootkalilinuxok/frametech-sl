import { ColumnDef } from "@tanstack/react-table";
import { DataTableColumnHeader } from "@/components/data-table/data-table-column-header";
import { Checkbox } from "@/components/ui/checkbox";

export interface ReceiptRow {
  id: number;
  data: string;
  ora: string;
  intestazione: string;
  nazione: string;
  valuta: string;
  totale: string;
  iva: string;
  tip_mancia: string;
  cambio: string;
  totale_euro: string;
  percentuale: string;
  image: string;
  editing: boolean;
}

export const columns: ColumnDef<ReceiptRow>[] = [
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
    size: 80,
  },
  {
    accessorKey: "data",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Data" />,
    size: 100,
  },
  {
    accessorKey: "ora",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Ora" />,
    size: 80,
  },
  {
    accessorKey: "intestazione",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Intestazione" />,
    size: 220,
  },
  {
    accessorKey: "nazione",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Nazione" />,
    size: 100,
  },
  {
    accessorKey: "valuta",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Valuta" />,
    size: 90,
  },
  {
    accessorKey: "totale",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Totale" />,
    size: 110,
  },
  {
    accessorKey: "iva",
    header: ({ column }) => <DataTableColumnHeader column={column} title="IVA" />,
    size: 80,
  },
  {
    accessorKey: "tip_mancia",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Tip/Mancia" />,
    size: 110,
  },
  {
    accessorKey: "cambio",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Cambio" />,
    size: 90,
  },
  {
    accessorKey: "totale_euro",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Totale (€)" />,
    size: 120,
  },
  {
    accessorKey: "percentuale",
    header: ({ column }) => <DataTableColumnHeader column={column} title="+ %" />,
    size: 70,
  },
  {
    accessorKey: "image",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Immagine" />,
    cell: ({ row }) => row.original.image ? (
      <img src={row.original.image} alt="img" className="max-w-[50px]" />
    ) : null,
    size: 100,
  },
];
