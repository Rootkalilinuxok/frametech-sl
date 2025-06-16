"use client";
import { useState } from "react";
import { columns as staticColumns, type ReceiptRow } from "./columns";

interface DataTableProps {
  data: ReceiptRow[];
  editable?: boolean;
}

export function DataTable({ data, editable = true }: DataTableProps) {
  const [rows, setRows] = useState<ReceiptRow[]>(data);

  const handleCellChange = (
    rowIndex: number,
    key: keyof ReceiptRow,
    value: string
  ) => {
    if (!editable) return;
    
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
                if (col.cell) {
                  return <td key={col.accessorKey as string}>{col.cell({ row })}</td>;
                }

                return (
                  <td
                    key={col.accessorKey as string}
                    className="px-4 py-2 border-t"
                  >
                    {editable ? (
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
                    ) : (
                      <span>{row[col.accessorKey as keyof ReceiptRow]}</span>
                    )}
                  </td>
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
