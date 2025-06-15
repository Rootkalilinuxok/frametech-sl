"use client";
import { useState } from "react";
import { columns as staticColumns, ReceiptRow } from "./columns";

interface DataTableProps {
  data: ReceiptRow[];
}

export function DataTable({ data }: DataTableProps) {
  const [rows, setRows] = useState<ReceiptRow[]>(data);

  // Modifica il valore di una cella
  const handleCellChange = (
    rowIndex: number,
    key: keyof ReceiptRow,
    value: string
  ) => {
    setRows((prevRows) =>
      prevRows.map((row, idx) =>
        idx === rowIndex ? { ...row, [key]: value } : row
      )
    );
  };

  return (
    <div className="overflow-x-auto rounded-md border bg-background">
      <table className="min-w-full text-sm">
        <thead>
          <tr>
            {staticColumns.map((col) => (
              <th
                key={col.accessorKey as string}
                className="px-4 py-2 text-left font-bold"
              >
                {col.header as string}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, rowIdx) => (
            <tr key={row.id}>
              {staticColumns.map((col) => {
                // Gestione campo immagine come anteprima, il resto editabile come input testo
                if (col.accessorKey === "image") {
                  return (
                    <td
                      key={col.accessorKey as string}
                      className="px-4 py-2 border-t"
                    >
                      {row.image ? (
                        <img
                          src={row.image}
                          alt="img"
                          style={{ maxWidth: 50 }}
                        />
                      ) : (
                        ""
                      )}
                    </td>
                  );
                } else {
                  return (
                    <td
                      key={col.accessorKey as string}
                      className="px-4 py-2 border-t"
                    >
                      <input
                        className="bg-transparent w-full outline-none"
                        type="text"
                        value={row[col.accessorKey as keyof ReceiptRow] ?? ""}
                        onChange={(e) =>
                          handleCellChange(
                            rowIdx,
                            col.accessorKey as keyof ReceiptRow,
                            e.target.value
                          )
                        }
                      />
                    </td>
                  );
                }
              })}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
