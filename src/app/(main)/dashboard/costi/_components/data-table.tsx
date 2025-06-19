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

// Import di getCoreRowModel da TanStack React-Table

// [IMPORTA QUI IL COMPONENTE DEL CALENDARIO E HISTORYTABLE QUANDO PRONTI]
// import { Calendar } from "@/components/ui/calendar";
// import HistoryTable from "./HistoryTable";

export function DataTable({ data: initialData }: { data: CostiRow[] }) {
  const dndEnabled = true;

  // Stato locale dei dati, per drag-and-drop e per editabilità
  const [data, setData] = React.useState<CostiRow[]>(() => initialData);

  // Colonne con o senza colonna DnD
  const columns = dndEnabled ? withDndColumn(costiColumns) : costiColumns;

  // Sensori drag-and-drop
  const sensors = useSensors(useSensor(MouseSensor, {}), useSensor(TouchSensor, {}), useSensor(KeyboardSensor, {}));

  // Lista di UniqueIdentifier per l’ordinamento
  const dataIds = React.useMemo<UniqueIdentifier[]>(() => data.map((row) => row.id), [data]);

  // FUNZIONE DI UPDATE per rendere editabili le celle
  const updateData = (rowIndex: number, columnId: string, value: any) => {
    setData((old) => old.map((row, index) => (index === rowIndex ? { ...row, [columnId]: value } : row)));
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

  const openUploadDialog = () => {
    // TODO: implementa popup upload file
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
          <Button variant="outline" size="sm" onClick={openUploadDialog}>
            <svg className="mr-1 h-5 w-5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M4 16v2a2 2 0 002 2h12a2 2 0 002-2v-2M7 10l5-5m0 0l5 5m-5-5v12"
              />
            </svg>
            <span className="sr-only">Upload</span>
          </Button>
        </div>
        <div className="flex items-center gap-2">
          <DataTableViewOptions table={table} />
          <Button variant="outline" size="sm">
            <Plus />
            <span className="hidden lg:inline">Aggiungi Sezione</span>
          </Button>
        </div>
      </div>

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
