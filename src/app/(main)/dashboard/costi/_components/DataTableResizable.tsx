import React from 'react';
import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from '@tanstack/react-table';

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

const columns: ColumnDef<CostRow>[] = [
  {
    id: 'select',
    header: ({ table }) => (
      <input
        type="checkbox"
        checked={table.getIsAllRowsSelected()}
        onChange={table.getToggleAllRowsSelectedHandler()}
        aria-label="Seleziona tutto"
      />
    ),
    cell: ({ row }) => (
      <input
        type="checkbox"
        checked={row.getIsSelected()}
        onChange={row.getToggleSelectedHandler()}
        aria-label="Seleziona riga"
      />
    ),
    enableSorting: false,
    enableHiding: false,
    enableResizing: true,
    size: CHAR_WIDTH * 3,
    minSize: CHAR_WIDTH * 3,
    maxSize: CHAR_WIDTH * 3,
  },
  {
    accessorKey: 'name',
    header: 'Nome',
    enableResizing: true,
    enableHiding: false,
    size: CHAR_WIDTH * 12,
    minSize: CHAR_WIDTH * 8,
    maxSize: CHAR_WIDTH * 20,
  },
  {
    accessorKey: 'country',
    header: 'Nazione',
    enableResizing: true,
    enableHiding: false,
    size: CHAR_WIDTH * 4,
    minSize: CHAR_WIDTH * 3,
    maxSize: CHAR_WIDTH * 4,
  },
  {
    accessorKey: 'currency',
    header: 'Valuta',
    enableResizing: true,
    enableHiding: false,
    size: CHAR_WIDTH * 4,
    minSize: CHAR_WIDTH * 3,
    maxSize: CHAR_WIDTH * 4,
  },
  {
    accessorKey: 'tip',
    header: 'Tip/Mancia',
    enableResizing: true,
    enableHiding: false,
    size: CHAR_WIDTH * 6,
    minSize: CHAR_WIDTH * 4,
    maxSize: CHAR_WIDTH * 10,
  },
  {
    accessorKey: 'total',
    header: 'Totale',
    enableResizing: true,
    enableHiding: false,
    size: CHAR_WIDTH * 6,
    minSize: CHAR_WIDTH * 4,
    maxSize: CHAR_WIDTH * 10,
  },
  {
    accessorKey: 'exchangeRate',
    header: 'Cambio',
    enableResizing: true,
    enableHiding: false,
    size: CHAR_WIDTH * 5,
    minSize: CHAR_WIDTH * 4,
    maxSize: CHAR_WIDTH * 6,
  },
  {
    accessorKey: 'totalEur',
    header: 'Totale (€)',
    enableResizing: true,
    enableHiding: false,
    size: CHAR_WIDTH * 6,
    minSize: CHAR_WIDTH * 4,
    maxSize: CHAR_WIDTH * 10,
  },
  {
    accessorKey: 'percent',
    header: '+ %',
    enableResizing: true,
    enableHiding: false,
    size: CHAR_WIDTH * 4,
    minSize: CHAR_WIDTH * 3,
    maxSize: CHAR_WIDTH * 4,
  },
  {
    id: 'actions',
    header: () => <span className="sr-only">Azioni</span>,
    cell: ({ row }) => (
      <button onClick={() => alert(`ID: ${row.original.id}`)}>Modifica</button>
    ),
    enableSorting: false,
    enableHiding: false,
    enableResizing: true,
    size: CHAR_WIDTH * 6,
    minSize: CHAR_WIDTH * 4,
    maxSize: CHAR_WIDTH * 6,
  },
];

export function DataTable({ data }: { data: CostRow[] }) {
  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    columnResizeMode: 'onChange',
  });

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full border-collapse">
        <thead>
          {table.getHeaderGroups().map(headerGroup => (
            <tr key={headerGroup.id}>
              {headerGroup.headers.map(header => (
                <th
                  key={header.id}
                  style={{
                    width: header.getSize(),
                    minWidth: header.column.columnDef.minSize,
                    maxWidth: header.column.columnDef.maxSize,
                  }}
                >
                  {header.isPlaceholder
                    ? null
                    : flexRender(
                        header.column.columnDef.header,
                        header.getContext()
                      )}
                </th>
              ))}
            </tr>
          ))}
        </thead>
        <tbody>
          {table.getRowModel().rows.map(row => (
            <tr key={row.id}>
              {row.getVisibleCells().map(cell => (
                <td
                  key={cell.id}
                  style={{
                    width: cell.column.getSize(),
                    minWidth: cell.column.columnDef.minSize,
                    maxWidth: cell.column.columnDef.maxSize,
                  }}
                >
                  {flexRender(
                    cell.column.columnDef.cell,
                    cell.getContext()
                  )}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

// Dati di esempio e rendering del componente
const MOCK_DATA: CostRow[] = [
  {
    id: 1,
    name: 'Mario Rossi',
    country: 'IT',
    currency: 'EUR',
    tip: 2,
    total: 20,
    exchangeRate: 1,
    totalEur: 20,
    percent: 10,
  },
  {
    id: 2,
    name: 'John Doe',
    country: 'US',
    currency: 'USD',
    tip: 5,
    total: 50,
    exchangeRate: 0.9,
    totalEur: 45,
    percent: 15,
  },
];

export default function Example() {
  return <DataTable data={MOCK_DATA} />;
}
