/* More actions
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
export interface ReceiptRow {
  id: string;
  date: string; // YYYY-MM-DD
  time?: string; // HH:mm
  name: string; // intestazione / fornitore
  country?: string; // IT, FR, US …
  currency: string; // codice ISO (EUR, USD …)
  tip?: number; // eventuale mancia
  total: number; // importo originale
  exchange_rate?: number; // cambio verso EUR (1 unit currency = ? EUR)
  total_eur: number; // importo convertito in €
  percent?: number; // campo libero (+%)
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
//  Definizione colonne
// ────────────────────────────────────────────────────────────
export const dashboardColumns: ColumnDef<ReceiptRow>[] = [
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
    cell: ({ row }) => fmtDate(row.original.date),
    size: 110,
  },
  {
    accessorKey: "time",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Ora" />,
    cell: ({ row }) => fmtTime(row.original.time),
    size: 80,
  },
  {
    accessorKey: "name",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Nome" />,
    cell: ({ row }) => row.original.name,
    size: 220,
  },
  {
    accessorKey: "country",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Nazione" />,
    cell: ({ row }) => row.original.country ?? "—",
    size: 100,
  },
  {
    accessorKey: "currency",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Valuta" />,
    cell: ({ row }) => row.original.currency,
    size: 90,
  },
  {
    accessorKey: "tip",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Tip/Mancia" />,
    cell: ({ row }) => fmtNum(row.original.tip),
    size: 110,
  },
  {
    accessorKey: "total",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Totale" />,
    cell: ({ row }) => fmtCurr(row.original.total, row.original.currency),
    size: 110,
  },
  {
    accessorKey: "exchange_rate",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Cambio" />,
    cell: ({ row }) => (row.original.exchange_rate ? row.original.exchange_rate.toFixed(4) : "—"),
    size: 90,
  },
  {
    accessorKey: "total_eur",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Totale (€)" />,
    cell: ({ row }) => fmtCurr(row.original.total_eur, "EUR"),
    size: 120,
  },
  {
    accessorKey: "percent",
    header: ({ column }) => <DataTableColumnHeader column={column} title="+ %" />,
    cell: ({ row }) => (row.original.percent !== undefined ? row.original.percent + "%" : "—"),
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
