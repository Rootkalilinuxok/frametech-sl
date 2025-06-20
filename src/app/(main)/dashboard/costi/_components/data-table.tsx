"use client";

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
import { CalendarIcon, ArchiveIcon, FileIcon, ClockIcon } from "@radix-ui/react-icons";
import { getCoreRowModel } from "@tanstack/react-table";
import { Plus } from "lucide-react";

import { DataTable as DataTableNew } from "@/components/data-table/data-table";
import { DataTablePagination } from "@/components/data-table/data-table-pagination";
import { DataTableViewOptions } from "@/components/data-table/data-table-view-options";
import { withDndColumn } from "@/components/data-table/table-utils";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent } from "@/components/ui/tabs";
import { useDataTableInstance } from "@/hooks/use-data-table-instance";
import { costiColumns, type CostiRow } from "./columns";

export function DataTable({ data: initialData }: { data: CostiRow[] }) {
  const dndEnabled = true;

  // Stato locale dei dati, per drag-and-drop e per editabilità
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
  const dataIds = React.useMemo<UniqueIdentifier[]>(() => data.map((row) => row.id), [data]);

  // FUNZIONE DI UPDATE per rendere editabili le celle
  const updateData = (rowIndex: number, columnId: string, value: any) => {
    setData((old) =>
      old.map((row, index) => (index === rowIndex ? { ...row, [columnId]: value } : row))
    );
  };

  // Istanza della tabella: include getCoreRowModel e la funzione updateData nel meta
  const table = useDataTableInstance({
    data,
    columns,
    getRowId: (row) => row.id.toString(),
    getCoreRowModel: getCoreRowModel(),
    meta: { updateData }, // fondamentale per l'editabilità!
  });

  // Handler per terminare il drag
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

  const openUploadDialog = () => fileInputRef.current?.click();

  // Barra avanzamento upload
  const uploadWithProgress = (formData: FormData) => {
    return new Promise<Response>((resolve, reject) => {
      const xhr = new XMLHttpRequest();
      xhr.open("POST", "/api/ocr", true);

      xhr.upload.onprogress = function (event) {
        if (event.lengthComputable) {
          const percent = Math.round((event.loaded / event.total) * 100);
          setUploadProgress(percent);
        }
      };

      xhr.onload = function () {
        setUploadProgress(100);
        resolve(new Response(xhr.response, { status: xhr.status }));
      };

      xhr.onerror = function () {
        reject(new Error("Errore di rete durante l'upload"));
      };

      xhr.responseType = "text";
      xhr.send(formData);
    });
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;
    setLoading(true);
    setError(null);
    setWarnings([]);
    setUploadProgress(0);

    try {
      const formData = new FormData();
      for (let i = 0; i < files.length; i++) {
        formData.append("files", files[i]);
      }

      // Barra upload via xhr
      const res = await uploadWithProgress(formData);

      if (!res.ok) throw new Error("Errore durante l'analisi OCR");
      const text = await res.text();
      const json = JSON.parse(text);
      const { rows, warnings } = json;
      if (Array.isArray(rows)) setData((prev) => [...prev, ...rows]);
      if (Array.isArray(warnings) && warnings.length > 0) setWarnings(warnings);
    } catch (err: any) {
      setError(err.message || "Errore sconosciuto");
    } finally {
      setLoading(false);
      setTimeout(() => setUploadProgress(0), 800);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  const handleFiltroChange = (value: string) => {
    if (value === "periodo") setShowPeriodo(true);
    else if (value === "archivia") setShowArchivia(true);
    else if (value === "report") setShowReport(true);
    else if (value === "cronologia") setShowCronologia(true);
    setFiltro(""); // Reset per poter riselezionare un filtro
  };

  return (
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
          {uploadProgress > 0 && uploadProgress < 100 && (
            <div className="ml-2 flex items-center gap-2 w-[140px]">
              <div className="flex-1 h-2 bg-gray-200 rounded">
                <div
                  className="h-2 bg-blue-500 rounded"
                  style={{ width: `${uploadProgress}%` }}
                ></div>
              </div>
              <span className="text-xs text-blue-700 min-w-[30px]">{uploadProgress}%</span>
            </div>
          )}
          {loading && uploadProgress === 100 && (
            <span className="ml-2 text-sm text-blue-500">Analisi in corso...</span>
          )}
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
        <div className="mb-2 p-2 rounded bg-yellow-100 text-yellow-700 border border-yellow-300">
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

      {/* Popup/dialog per il filtro "Periodo" */}
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

      {/* Popup/dialog per il filtro "Archivia" */}
      {showArchivia && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="bg-background w-full max-w-md rounded-lg p-6 shadow-lg">
            <h2 className="mb-2 font-bold">Archivia file selezionati</h2>
            <p>Confermi di voler archiviare i file selezionati?</p>
            <div className="mt-4 flex gap-2">
              <Button onClick={() => setShowArchivia(false)} variant="outline">
                Annulla
              </Button>
              <Button
                variant="default"
                onClick={() => {
                  // TODO: logica archiviazione
                  setShowArchivia(false);
                }}
              >
                Conferma archiviazione
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Popup/dialog per il filtro "Report" */}
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
  );
}
