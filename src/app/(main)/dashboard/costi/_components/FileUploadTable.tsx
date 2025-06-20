"use client";

import React, { useRef, useState } from "react";
import { Button } from "@/components/ui/button";

type ReceiptRow = {
  id: string;
  date: string;           // YYYY-MM-DD
  time?: string;          // HH:mm
  name: string;
  country?: string;
  currency: string;
  tip?: number;
  total: number;
  exchange_rate?: number;
  total_eur: number;
  percent?: number;
};

export default function FileUploadTable() {
  const [rows, setRows] = useState<ReceiptRow[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleUploadClick = () => fileInputRef.current?.click();

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;
    setLoading(true);
    setError(null);

    try {
      const formData = new FormData();
      for (let i = 0; i < files.length; i++) {
        formData.append("files", files[i]);
      }
      const res = await fetch("/api/ocr", {
        method: "POST",
        body: formData,
      });
      if (!res.ok) throw new Error("Errore durante l'analisi OCR");
      const newRows: ReceiptRow[] = await res.json();
      setRows((prev) => [...prev, ...newRows]);
    } catch (err: any) {
      setError(err.message || "Errore sconosciuto");
    } finally {
      setLoading(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  const handleArchive = (rowId: string) => {
    setRows((prev) => prev.filter((r) => r.id !== rowId));
    // TODO: Qui puoi fare chiamata API per archiviazione su DB
  };

  return (
    <div className="p-4 bg-white rounded-md shadow max-w-full overflow-x-auto">
      <div className="flex items-center mb-4 gap-4">
        <Button variant="outline" onClick={handleUploadClick} disabled={loading}>
          Carica file
        </Button>
        <input
          type="file"
          ref={fileInputRef}
          style={{ display: "none" }}
          multiple
          accept=".pdf,.jpg,.jpeg,.png,.doc,.docx,.xls,.xlsx"
          onChange={handleFileChange}
        />
        {loading && <span>Analisi OCR/GPT in corso...</span>}
        {error && <span className="text-red-500">{error}</span>}
      </div>

      <table className="min-w-[900px] w-full border text-sm">
        <thead className="bg-gray-100">
          <tr>
            <th className="border p-2">File ID</th>
            <th className="border p-2">Data</th>
            <th className="border p-2">Ora</th>
            <th className="border p-2">Intestazione</th>
            <th className="border p-2">Nazione</th>
            <th className="border p-2">Valuta</th>
            <th className="border p-2">Mancia</th>
            <th className="border p-2">Totale</th>
            <th className="border p-2">Cambio</th>
            <th className="border p-2">Totale EUR</th>
            <th className="border p-2">%</th>
            <th className="border p-2">Azioni</th>
          </tr>
        </thead>
        <tbody>
          {rows.length === 0 && (
            <tr>
              <td colSpan={12} className="p-4 text-center text-gray-500">
                Nessun file caricato
              </td>
            </tr>
          )}
          {rows.map((r) => (
            <tr key={r.id} className="hover:bg-gray-50">
              <td className="border p-2">{r.id}</td>
              <td className="border p-2">{r.date}</td>
              <td className="border p-2">{r.time ?? ""}</td>
              <td className="border p-2">{r.name}</td>
              <td className="border p-2">{r.country ?? ""}</td>
              <td className="border p-2">{r.currency}</td>
              <td className="border p-2">{r.tip !== undefined ? r.tip : ""}</td>
              <td className="border p-2">{r.total}</td>
              <td className="border p-2">{r.exchange_rate !== undefined ? r.exchange_rate : ""}</td>
              <td className="border p-2">{r.total_eur}</td>
              <td className="border p-2">{r.percent !== undefined ? r.percent : ""}</td>
              <td className="border p-2">
                <Button variant="ghost" size="sm" onClick={() => handleArchive(r.id)}>
                  Archivia
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
