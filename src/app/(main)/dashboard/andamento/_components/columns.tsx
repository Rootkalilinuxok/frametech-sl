/*
  Colonne per la tabella "Costi" (receipts_live) – **versione 2**
  ───────────────────────────────────────────────────────────────
  Ordine richiesto dall’utente:
    1. ID
    2. Data
    3. Ora
    4. Nome
    5. Nazione
    6. Valuta
    7. Totale (importo originale)
    8. Tip / Mancia
    9. Cambio
   10. Totale (€)
   11. + % (eventuale maggiorazione / IVA / mark‑up)

  Plus:   • colonna selezione (checkbox) all’inizio
          • colonna Azioni alla fine
  ───────────────────────────────────────────────────────────────

  Dipendenze: TanStack React‑Table v8  ·  shadcn/ui (DataTableColumnHeader)
*/

import { ColumnDef } from "@tanstack/react-table";

import { DataTableColumnHeader } from "@/components/data-table/data-table-column-header";
import { SectionRowActions } from "@/components/table/row-actions";
import { Checkbox } from "@/components/ui/checkbox";

// ────────────────────────────────────────────────────────────
//  Tipi
// ────────────────────────────────────────────────────────────
export interface SectionRow {
  id: number;
  header: string;
  type: string;
  status: string;
  target: string;
  limit: string;
  reviewer: string;
}

// ────────────────────────────────────────────────────────────
//  Definizione colonne
// ────────────────────────────────────────────────────────────
export const dashboardColumns: ColumnDef<SectionRow>[] = [
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
    size: 80,
  },
  {
    accessorKey: "header",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Header" />,
    cell: ({ row }) => row.original.header,
    size: 220,
  },
  {
    accessorKey: "type",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Type" />,
    cell: ({ row }) => row.original.type,
    size: 150,
  },
  {
    accessorKey: "status",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Status" />,
    cell: ({ row }) => row.original.status,
    size: 150,
  },
  {
    accessorKey: "target",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Target" />,
    cell: ({ row }) => row.original.target,
    size: 90,
  },
  {
    accessorKey: "limit",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Limit" />,
    cell: ({ row }) => row.original.limit,
    size: 90,
  },
  {
    accessorKey: "reviewer",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Reviewer" />,
    cell: ({ row }) => row.original.reviewer,
    size: 180,
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
