// src/app/(main)/dashboard/costi/_components/data-table.tsx
"use client";

/* eslint-disable max-lines */

import * as React from "react";
import {
  KeyboardSensor,
  MouseSensor,
  TouchSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
  type UniqueIdentifier,
} from "@dnd-kit/core";
import { arrayMove } from "@dnd-kit/sortable";
import { getCoreRowModel } from "@tanstack/react-table";
import { Plus } from "lucide-react";
import { ReceiptImageModal } from "./ReceiptImageModal";

import { DataTable as DataTableNew } from "@/components/data-table/data-table";
import { DataTablePagination } from "@/components/data-table/data-table-pagination";
import { DataTableViewOptions } from "@/components/data-table/data-table-view-options";
import { withDndColumn } from "@/components/data-table/table-utils";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent } from "@/components/ui/tabs";
import { useDataTableInstance } from "@/hooks/use-data-table-instance";
import { costiColumns, type CostiRow } from "./columns";

// IMPORT UTILITY AUTOMAZIONI
import {
  fetchExchangeRate,
  calcEuro,
  normalizeCurrency,
  toAlpha3Country,
  getCurrencyForCountry,
} from "@/utils/currency";

export function DataTable({ data: initialData }: { data: CostiRow[] }) {
  const dndEnabled = true;
  const [data, setData] = React.useState<CostiRow[]>(() => initialData);

  // Colonne con o senza colonna DnD
  const columns = dndEnabled ? withDndColumn(costiColumns) : costiColumns;

  // Sensori drag-and-drop
  const sensors = useSensors(
    useSensor(MouseSensor, {}),
    useSensor(TouchSensor, {}),
    useSensor(KeyboardSensor, {})
  );

  // Lista di UniqueIdentifier per l’ordinamento
  const dataIds = React.useMemo<UniqueIdentifier[]>(
    () => data.map((row) => row.id),
    [data]
  );

  // FUNZIONE DI UPDATE per automazioni NAZIONE/VALUTA/CAMBIO/TOTALE €
  const updateData = (
    rowIndex: number,
    columnId: string,
    value: unknown
  ) => {
    setData((old) => {
      const newData = [...old];
      let row = { ...newData[rowIndex] };

      // Aggiorna il valore della cella grezzo
      (row as any)[columnId] = value;

      // 1) Se cambio country: converti in alpha-3 e popola currency
      if (columnId === "country") {
        const alpha3 = toAlpha3Country(String(value));
        row.country = alpha3;
        row.currency = getCurrencyForCountry(alpha3);
      }
      // 2) Se cambio currency manualmente: normalizza alpha-3
      else if (columnId === "currency") {
        row.currency = normalizeCurrency(String(value));
      }

      // Quando cambiano country o currency, reset e poi fetch asynchronous
      if (columnId === "country" || columnId === "currency") {
        // Imposta cambio a 1 per EUR, 0 temporaneo altrimenti
        row.exchangeRate = row.currency === "EUR" ? 1 : 0;
        // Ricalcola Totale € in attesa del fetch
        row.totalEur = calcEuro(
          Number(row.total ?? 0),
          Number(row.tip ?? 0),
          Number(row.exchangeRate ?? 1),
          Number(row.percent ?? 0)
        );
        newData[rowIndex] = row;

        if (row.currency && row.currency !== "EUR") {
         console.log("[DEBUG] Richiesta cambio per valuta:", row.currency);
          fetchExchangeRate(row.currency).then((rate) => {
            setData((currData) => {
              const updated = [...currData];
              const r = { ...updated[rowIndex] };
              r.exchangeRate = rate;
              r.totalEur = calcEuro(
                Number(r.total ?? 0),
                Number(r.tip ?? 0),
                Number(rate),
                Number(r.percent ?? 0)
              );
              updated[rowIndex] = r;
              return updated;
            });
          });
        }
      } else {
        // Ricalcolo Totale € per qualsiasi altra modifica
        row.totalEur = calcEuro(
          Number(row.total ?? 0),
          Number(row.tip ?? 0),
          Number(row.exchangeRate ?? 1),
          Number(row.percent ?? 0)
        );
        newData[rowIndex] = row;
      }

      return newData;
    });
  };

  // Istanza della tabella
  const table = useDataTableInstance({
    data,
    columns,
    getRowId: (row) => row.id.toString(),
    getCoreRowModel: getCoreRowModel(),
    meta: { updateData, openImage }, // per l'editabilità
  });

  // Drag end handler
  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;
    if (active.id !== over?.id) {
      setData((current) => {
        const oldIndex = dataIds.indexOf(active.id);
        const newIndex = dataIds.indexOf(over!.id);
        return arrayMove(current, oldIndex, newIndex);
      });
    }
  }
  
    // Filtri UI
  const [filtro, setFiltro] = React.useState<string>("");
  const [showPeriodo, setShowPeriodo] = React.useState(false);
  const [showArchivia, setShowArchivia] = React.useState(false);
  const [showReport, setShowReport] = React.useState(false);
  const [showCronologia, setShowCronologia] = React.useState(false);

  // ----------- UPLOAD LOGICA -----------
  const fileInputRef = React.useRef<HTMLInputElement>(null);
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  const [warnings, setWarnings] = React.useState<{ filename: string; reason: string }[]>([]);
  const [uploadProgress, setUploadProgress] = React.useState<number>(0);
  // Stato per visualizzazione pop-up immagine scontrino
  const [viewer, setViewer] = React.useState<{ url: string; name: string } | null>(null);
function openImage(obj: { url: string; name: string }) {
  setViewer(obj);
}
function closeImage() {
  setViewer(null);
}


  const openUploadDialog = () => fileInputRef.current?.click();

 const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
  const files = e.target.files;
  if (!files || files.length === 0) return;

  setLoading(true);
  setError(null);
  setWarnings([]);
  setUploadProgress(0);

  const newRows: CostiRow[] = [];
  const warningList: { filename: string; reason: string }[] = [];
  let current = 0;

  for (const file of Array.from(files)) {
    // 1. UPLOAD file a /api/upload
    let publicUrl = "";
    try {
      const formData = new FormData();
      formData.append("file", file);
      const uploadRes = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });
      const uploadJson = await uploadRes.json();
      if (!uploadJson.url) throw new Error("Upload fallito");
      publicUrl = uploadJson.url;
    } catch {
      warningList.push({ filename: file.name, reason: "Upload fallito" });
      continue;
    }

    // 2. Converti in base64 per OCR
    const base64 = await new Promise<string>((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve((reader.result as string).split(",")[1]);
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });

    // 3. Invia a /api/ocr, passando anche imageUrl!
    try {
      const res = await fetch("/api/ocr", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          base64,
          fileName: file.name,
          mimeType: file.type,
          imageUrl: publicUrl,  // ← QUESTA È LA CHIAVE!
        }),
      });

      if (!res.ok) throw new Error(`Errore OCR (${file.name})`);
      let dati = await res.json();
      dati = {
        ...dati,
        exchangeRate:
          dati.exchangeRate ?? dati.exchange_rate ?? null,
        totalEur: dati.totalEur ?? dati.total_eur ?? null,
      };
      // Mostra solo l’URL pubblico (NON usare più createObjectURL)
      

      if (!dati || !dati.id) {
  warningList.push({ filename: file.name, reason: "Dati non estratti o mancanti" });
} else {
  // Salva in database anche l'imageUrl appena ...
  await fetch("/api/receipts/save", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ ...dati, imageUrl: publicUrl }),
  });

  // Aggiorna lo stato locale per mostrare correttamente il link cliccabile
  newRows.push({ ...dati, imageUrl: publicUrl });

      }
    } catch (err: unknown) {
      const error = err as Error;
      warningList.push({ filename: file.name, reason: error.message ?? "Errore sconosciuto" });
    }

    // Aggiorna barra avanzamento per ogni file
    current++;
    setUploadProgress(Math.round((current / files.length) * 100));
  }

  setData((prev) => [...prev, ...newRows]);
  setWarnings(warningList);
  setLoading(false);
  setTimeout(() => setUploadProgress(0), 500);
  if (fileInputRef.current) fileInputRef.current.value = "";
};


  const handleFiltroChange = (value: string) => {
    if (value === "periodo") setShowPeriodo(true);
    else if (value === "archivia") setShowArchivia(true);
    else if (value === "report") setShowReport(true);
    else if (value === "cronologia") setShowCronologia(true);
    setFiltro(""); // Reset...
  };

  const archiveSelected = async () => {
    const ids = table.getFilteredSelectedRowModel().rows.map((r) => r.original.id);
    try {
      if (ids.length > 0) {
        await fetch("/api/receipts/archive", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ ids }) });
        setData((prev) => prev.filter((row) => !ids.includes(row.id)));
      }
    } catch (err) {
      console.error(err);
    } finally {
      setShowArchivia(false);
    }
  };
  
    // ----------- CLEAR RIGHE SELEZIONATE -----------
  const selectedRowIds = table.getFilteredSelectedRowModel().rows.map((r) => r.original.id);
  function clearSelectedRows() {
    setData((prev) =>
      prev.map((row) =>
        selectedRowIds.includes(row.id)
          ? { ...row, date: "", time: "", name: "", country: "", currency: "", tip: 0, total: 0, exchangeRate: 0, totalEur: 0, percent: 0 }
          : row
      )
    );
  }

  return (
    <>
      {viewer && (
        <ReceiptImageModal
          imageUrl={viewer.url}
          fileName={viewer.name}
          onClose={closeImage}
        />
      )}

      <Tabs defaultValue="filtri" className="w-full flex-col gap-6">
        <div className="flex items-center justify-between">
          <div className="mb-4 flex items-center gap-2">
            {/* MENU FILTRI */}
            <Select value={filtro} onValueChange={handleFiltroChange}>
              <SelectTrigger size="sm" className="flex w-fit">
                <SelectValue placeholder="Filtri" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="periodo">Periodo</SelectItem>
                <SelectItem value="archivia">Archivia</SelectItem>
                <SelectItem value="report">Report</SelectItem>
                <SelectItem value="cronologia">Cronologia</SelectItem>
              </SelectContent>
            </Select>

            {/* UPLOAD */}
            <Button variant="outline" size="sm" onClick={openUploadDialog} disabled={loading}>
              <svg className="mr-1 h-5 w-5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M4 16v2a2 2 0 002 2h12a2 2 0 002-2v-2M7 10l5-5m0 0l5 5m-5-5v12"
                />
              </svg>
              <span className="sr-only">Upload</span>
            </Button>
            <input
              type="file"
              ref={fileInputRef}
              style={{ display: "none" }}
              multiple
              accept=".pdf,.jpg,.jpeg,.png"
              onChange={handleFileChange}
            />

            {/* ELIMINA RIGHE SELEZIONATE */}
            <Button
              variant="destructive"
              size="sm"
              onClick={clearSelectedRows}
              disabled={selectedRowIds.length === 0}
            >
              Elimina
            </Button>

            {uploadProgress > 0 && uploadProgress < 100 && (
              <div className="ml-2 flex w-[140px] items-center gap-2">
                <div className="h-2 flex-1 rounded bg-gray-200">
                  <div className="h-2 rounded bg-blue-500" style={{ width: `${uploadProgress}%` }}></div>
                </div>
                <span className="min-w-[30px] text-xs text-blue-700">{uploadProgress}%</span>
              </div>
            )}
            {loading && uploadProgress === 100 && <span className="ml-2 text-sm text-blue-500">Analisi in corso...</span>}
            {error && <span className="ml-2 text-sm text-red-500">{error}</span>}
          </div>
          <div className="flex items-center gap-2">
            <DataTableViewOptions table={table} />
            <Button variant="outline" size="sm">
              <Plus />
              <span className="hidden lg:inline">Aggiungi Sezione</span>
            </Button>
          </div>
        </div>

        {/* WARNING */}
        {warnings.length > 0 && (
          <div className="mb-2 rounded border border-yellow-300 bg-yellow-100 p-2 text-yellow-700">
            <b>Attenzione:</b>
            <ul className="ml-4 list-disc">
              {warnings.map((w, i) => (
                <li key={i}>
                  <b>{w.filename}</b>: {w.reason}
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Popup-dialog per il filtro "Periodo" */}
        {showPeriodo && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
            <div className="bg-background w-full max-w-md rounded-lg p-6 shadow-lg">
              <h2 className="mb-2 font-bold">Seleziona periodo</h2>
              {/* Inserisci qui il componente Calendar oppure una form custom */}
              {/* <Calendar ... /> */}
              <Button onClick={() => setShowPeriodo(false)} variant="outline" className="mt-4 w-full">
                Chiudi
              </Button>
            </div>
          </div>
        )}

        {/* Popup-dialog per il filtro "Archivia" */}
        {showArchivia && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
            <div className="bg-background w-full max-w-md rounded-lg p-6 shadow-lg">
              <h2 className="mb-2 font-bold">Archivia file selezionati</h2>
              <p>Confermi di voler archiviare i file selezionati?</p>
              <div className="mt-4 flex gap-2">
                <Button onClick={() => setShowArchivia(false)} variant="outline">
                  Annulla
                </Button>
                <Button variant="default" onClick={archiveSelected}>
                  Conferma archiviazione
                </Button>
              </div>
            </div>
          </div>
        )}

        {/* Popup-dialog per il filtro "Report" */}
        {showReport && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
            <div className="bg-background w-full max-w-md rounded-lg p-6 shadow-lg">
              <h2 className="mb-2 font-bold">Genera Report</h2>
              <p>Scegli il formato di esportazione:</p>
              <div className="mt-4 flex gap-2">
                <Button variant="outline" onClick={() => setShowReport(false)}>
                  Annulla
                </Button>
                <Button
                  variant="default"
                  onClick={() => {
                    /* Export PDF */ setShowReport(false);
                  }}
                >
                  PDF
                </Button>
                <Button
                  variant="default"
                  onClick={() => {
                    /* Export Excel */ setShowReport(false);
                  }}
                >
                  Excel
                </Button>
                <Button
                  variant="default"
                  onClick={() => {
                    /* Export Word */ setShowReport(false);
                  }}
                >
                  Word
                </Button>
              </div>
            </div>
          </div>
        )}
		
		 {/* Popup/dialog per il filtro "Cronologia" */}
      {showCronologia && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="bg-background max-h-[80vh] w-full max-w-3xl overflow-y-auto rounded-lg p-6 shadow-lg">
            <h2 className="mb-2 font-bold">Cronologia caricamenti</h2>
            {/* Qui puoi importare e visualizzare il componente HistoryTable */}
            {/* <HistoryTable /> */}
            <Button onClick={() => setShowCronologia(false)} variant="outline" className="mt-4 w-full">
              Chiudi
            </Button>
          </div>
        </div>
      )}

      {/* TABELLA */}
      <TabsContent value="filtri" className="relative flex flex-col gap-4 overflow-auto">
        <div className="overflow-hidden rounded-lg border">
          <DataTableNew
            dndEnabled={dndEnabled}
            table={table}
            columns={columns}
            dataIds={dataIds}
            handleDragEnd={handleDragEnd}
            sensors={sensors}
            sortableId={React.useId()}
          />
        </div>
        <DataTablePagination table={table} />
      </TabsContent>

      {/* Altri Tabs (puoi eliminarli se non ti servono più) */}
      <TabsContent value="past-performance" className="flex flex-col">
        <div className="aspect-video w-full flex-1 rounded-lg border border-dashed" />
      </TabsContent>
      <TabsContent value="key-personnel" className="flex flex-col">
        <div className="aspect-video w-full flex-1 rounded-lg border border-dashed" />
      </TabsContent>
      <TabsContent value="focus-documents" className="flex flex-col">
        <div className="aspect-video w-full flex-1 rounded-lg border border-dashed" />
      </TabsContent>
    </Tabs>
    </>
  );
}
