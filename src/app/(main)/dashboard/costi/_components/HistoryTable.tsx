"use client";
import React, { useEffect, useState } from "react";
import { format } from "date-fns";
import { Calendar } from "@/components/ui/calendar";
import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Table, TableHead, TableHeader, TableBody, TableRow, TableCell } from "@/components/ui/table";
import { DownloadIcon } from "@radix-ui/react-icons";

// Tipi dati: devono rispecchiare receiptsLive da schema.ts
type HistoryRow = {
  id: string;           // UUID reale
  date: string | null;  // Data documento (può essere null)
  time?: string | null;
  name: string;
  country?: string | null;
  currency: string;
  total: string;
  tip?: string | null;
  exchangeRate?: string | null;
  totalEur?: string | null;
  percent?: string | null;
  paymentMethod?: string | null;
  status?: string;
  sourceHash?: string;
  createdAt: string;     // Data caricamento (timestamp ISO)
};

type Period = { from: Date | null; to: Date | null };

export default function HistoryTable() {
  const [data, setData] = useState<HistoryRow[]>([]);
  const [period, setPeriod] = useState<Period>({ from: null, to: null });
  const [loading, setLoading] = useState(false);

  // Carica dati all'avvio o al cambio periodo
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      let url = "/api/receipts/history";
      if (period.from && period.to) {
        const from = period.from.toISOString().slice(0, 10);
        const to = period.to.toISOString().slice(0, 10);
        url += `?from=${from}&to=${to}`;
      }
      const res = await fetch(url);
      const rows: HistoryRow[] = await res.json();
      setData(rows);
      setLoading(false);
    };
    fetchData();
  }, [period]);

  // ID progressivo formattato a 4 cifre
  const visibleRows = data
    .sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime())
    .map((row, idx) => ({
      ...row,
      displayId: String(idx + 1).padStart(4, "0"),
      displayDate: row.createdAt ? format(new Date(row.createdAt), "dd/MM/yyyy HH:mm") : "",
    }));

  // Export dati visibili (CSV)
  const exportCSV = () => {
    const header = [
      "ID cronologico",
      "Data caricamento",
      "Nome",
      "Valuta",
      "Totale",
      "Intestazione",
      "Data documento",
      "Ora",
      "Nazione"
    ];
    const rows = visibleRows.map(row =>
      [
        row.displayId,
        row.displayDate,
        row.name,
        row.currency,
        row.total,
        row.name,
        row.date ? format(new Date(row.date), "dd/MM/yyyy") : "",
        row.time || "",
        row.country || ""
      ].join(";")
    );
    const csvContent = [header.join(";"), ...rows].join("\n");
    const blob = new Blob([csvContent], { type: "text/csv" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = `Cronologia_caricamenti_${new Date().toISOString().slice(0,10)}.csv`;
    link.click();
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-4 mb-2">
        <Popover>
          <PopoverTrigger asChild>
            <Button variant="outline">
              Seleziona periodo
            </Button>
          </PopoverTrigger>
          <PopoverContent>
            <div className="flex flex-col gap-2">
              <Calendar
                mode="range"
                selected={{
                  from: period.from || undefined,
                  to: period.to || undefined
                }}
                onSelect={({ from, to }) => setPeriod({ from: from || null, to: to || null })}
                numberOfMonths={2}
              />
              <Button
                onClick={() => setPeriod({ from: null, to: null })}
                variant="ghost"
                size="sm"
              >
                Cancella filtro
              </Button>
            </div>
          </PopoverContent>
        </Popover>
        <Button onClick={exportCSV} variant="outline" size="sm">
          <DownloadIcon className="mr-2" /> Esporta CSV
        </Button>
        {loading && <span>Caricamento…</span>}
      </div>

      <div className="overflow-x-auto rounded border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>ID</TableHead>
              <TableHead>Data caricamento</TableHead>
              <TableHead>Nome</TableHead>
              <TableHead>Valuta</TableHead>
              <TableHead>Totale</TableHead>
              <TableHead>Intestazione</TableHead>
              <TableHead>Data doc.</TableHead>
              <TableHead>Ora</TableHead>
              <TableHead>Nazione</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {visibleRows.length === 0 && !loading && (
              <TableRow>
                <TableCell colSpan={9} className="text-center text-muted-foreground">
                  Nessun caricamento trovato.
                </TableCell>
              </TableRow>
            )}
            {visibleRows.map((row) => (
              <TableRow key={row.id}>
                <TableCell>{row.displayId}</TableCell>
                <TableCell>{row.displayDate}</TableCell>
                <TableCell>{row.name}</TableCell>
                <TableCell>{row.currency}</TableCell>
                <TableCell>{row.total}</TableCell>
                <TableCell>{row.name}</TableCell>
                <TableCell>{row.date ? format(new Date(row.date), "dd/MM/yyyy") : ""}</TableCell>
                <TableCell>{row.time || ""}</TableCell>
                <TableCell>{row.country || ""}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
