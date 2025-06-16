import { ColumnDef } from "@tanstack/react-table";
import { TableCellViewer } from "./table-cell-viewer";
import Image from "next/image";

export type ReceiptRow = {
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
};

export const columns: ColumnDef<ReceiptRow>[] = [
  {
    id: "select",
    header: ({ table }) => (
      <input
        type="checkbox"
        checked={table.getIsAllRowsSelected()}
        onChange={table.getToggleAllRowsSelectedHandler()}
        aria-label="Seleziona tutte le righe"
        className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
      />
    ),
    cell: ({ row }) => (
      <input
        type="checkbox"
        checked={row.getIsSelected()}
        onChange={row.getToggleSelectedHandler()}
        aria-label="Seleziona riga"
        className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
      />
    ),
    size: 40,
  },
  {
    accessorKey: "id",
    header: "ID",
    size: 80,
  },
  {
    accessorKey: "data",
    header: "Data",
    cell: ({ getValue }) => {
      const value = getValue() as string;
      return new Date(value).toLocaleDateString('it-IT');
    },
    size: 100,
  },
  {
    accessorKey: "ora",
    header: "Ora",
    size: 80,
  },
  {
    accessorKey: "intestazione",
    header: "Intestazione",
    cell: ({ row }) => (
      <TableCellViewer
        item={{
          header: row.original.intestazione,
          type: "",
          status: "",
          target: "",
          limit: "",
          reviewer: "",
        }}
      />
    ),
    size: 200,
  },
  {
    accessorKey: "nazione",
    header: "Nazione",
    size: 100,
  },
  {
    accessorKey: "valuta",
    header: "Valuta",
    size: 80,
  },
  {
    accessorKey: "totale",
    header: "Totale",
    cell: ({ getValue }) => {
      const value = getValue() as string;
      return parseFloat(value).toLocaleString('it-IT', {
        style: 'currency',
        currency: 'EUR'
      });
    },
    size: 120,
  },
  {
    accessorKey: "iva",
    header: "IVA",
    size: 80,
  },
  {
    accessorKey: "tip_mancia",
    header: "Tip/Mancia",
    size: 100,
  },
  {
    accessorKey: "cambio",
    header: "Cambio",
    size: 80,
  },
  {
    accessorKey: "totale_euro",
    header: "Totale (€)",
    cell: ({ getValue }) => {
      const value = getValue() as string;
      return parseFloat(value).toLocaleString('it-IT', {
        style: 'currency',
        currency: 'EUR'
      });
    },
    size: 120,
  },
  {
    accessorKey: "percentuale",
    header: "Percentuale",
    cell: ({ getValue }) => {
      const value = getValue() as string;
      return `${value}%`;
    },
    size: 80,
  },
  {
    accessorKey: "image",
    header: "Immagine",
    cell: ({ row }) =>
      row.original.image ? (
        <div className="relative h-10 w-10">
          <Image
            src={row.original.image}
            alt="Receipt"
            fill
            className="rounded object-cover"
            sizes="(max-width: 40px)"
          />
        </div>
      ) : (
        <span className="text-muted-foreground">Nessuna immagine</span>
      ),
    size: 100,
  },
  {
    id: "actions",
    cell: ({ row }) => {
      return (
        <button 
          onClick={() => console.log('Edit row', row.original)}
          className="text-primary hover:text-primary-dark"
        >
          Modifica
        </button>
      );
    },
    size: 80,
  },
] as const;
