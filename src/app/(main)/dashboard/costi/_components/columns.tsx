import { ColumnDef } from "@tanstack/react-table";

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
    accessorKey: "id",
    header: "ID",
  },
  {
    accessorKey: "data",
    header: "Data",
  },
  {
    accessorKey: "ora",
    header: "Ora",
  },
  {
    accessorKey: "intestazione",
    header: "Intestazione",
  },
  {
    accessorKey: "nazione",
    header: "Nazione",
  },
  {
    accessorKey: "valuta",
    header: "Valuta",
  },
  {
    accessorKey: "totale",
    header: "Totale",
  },
  {
    accessorKey: "iva",
    header: "IVA",
  },
  {
    accessorKey: "tip_mancia",
    header: "Tip/Mancia",
  },
  {
    accessorKey: "cambio",
    header: "Cambio",
  },
  {
    accessorKey: "totale_euro",
    header: "Totale (€)",
  },
  {
    accessorKey: "percentuale",
    header: "Percentuale",
  },
  {
    accessorKey: "image",
    header: "Immagine",
    cell: ({ row }) =>
      row.original.image ? (
        <img src={row.original.image} alt="img" style={{ maxWidth: 50 }} />
      ) : null,
  },
];
