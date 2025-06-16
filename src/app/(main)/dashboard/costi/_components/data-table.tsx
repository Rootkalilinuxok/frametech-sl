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
                key={col.id || col.accessorKey}
                className="px-4 py-2 text-left font-bold"
              >
                {col.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, rowIdx) => (
            <tr key={row.id}>
              {staticColumns.map((col) => {
                if (col.cell) {
                  return (
                    <td key={col.id || col.accessorKey} className="px-4 py-2 border-t">
                      {col.cell({ row })}
                    </td>
                  );
                }

                const accessor = col.accessorKey as keyof ReceiptRow;
                return (
                  <td key={accessor} className="px-4 py-2 border-t">
                    {editable ? (
                      <input
                        className="bg-transparent w-full outline-none"
                        type="text"
                        value={row[accessor] ?? ""}
                        onChange={(e) =>
                          handleCellChange(rowIdx, accessor, e.target.value)
                        }
                      />
                    ) : (
                      <span>{row[accessor]}</span>
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
