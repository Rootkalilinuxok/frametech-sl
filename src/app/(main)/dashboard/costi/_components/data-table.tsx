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
import { Plus } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CalendarIcon, ArchiveIcon, FileIcon, ClockIcon } from "@radix-ui/react-icons";

import { useDataTableInstance } from "@/hooks/use-data-table-instance";
import { DataTable as DataTableNew } from "@/components/data-table/data-table";
import { DataTablePagination } from "@/components/data-table/data-table-pagination";
import { DataTableViewOptions } from "@/components/data-table/data-table-view-options";
import { withDndColumn } from "@/components/data-table/table-utils";

import {
  costiColumns,
  type CostiRow,
} from "./columns";

// Import di getCoreRowModel da TanStack React-Table
import { getCoreRowModel } from "@tanstack/react-table";

// [IMPORTA QUI IL COMPONENTE DEL CALENDARIO E HISTORYTABLE QUANDO PRONTI]
// import { Calendar } from "@/components/ui/calendar";
// import HistoryTable from "./HistoryTable";

export function DataTable({ data: initialData }: { data: CostiRow[] }) {
  const dndEnabled = true;

  // Stato locale dei dati, per drag-and-drop e per editabilità
  const [data, setData] = React.useState<CostiRow[]>(() => initialData);

  // Colonne con o senza colonna DnD
  const columns = dndEnabled
    ? withDndColumn(costiColumns)
    : costiColumns;

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

  // FUNZIONE DI UPDATE per rendere editabili le celle
  const updateData = (rowIndex: number, columnId: string, value: any) => {
    setData((old) =>
      old.map((row, index) =>
        index === rowIndex ? { ...row, [columnId]: value } : row
      )
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
  const [filtro, setFiltro] = React.useState<string>("filtri");
  const [showPeriodo, setShowPeriodo] = React.useState(false);
  const [showArchivia, setShowArchivia] = React.useState(false);
  const [showReport, setShowReport] = React.useState(false);
  const [showCronologia, setShowCronologia] = React.useState(false);

  const handleFiltroChange = (value: string) => {
    setFiltro(value);
    if (value === "periodo") setShowPeriodo(true);
    else if (value === "archivia") setShowArchivia(true);
    else if (value === "report") setShowReport(true);
    else if (value === "cronologia") setShowCronologia(true);
  };

  return (
    <Tabs defaultValue="filtri" className="w-full flex-col gap-6">
      <div className="flex items-center justify-between">
        <Label htmlFor="filtri-selector" className="sr-only">
          Filtri
        </Label>
        <Select value={filtro} onValueChange={handleFiltroChange}>
          <SelectTrigger size="sm" id="filtri-selector" className="flex w-fit">
            <SelectValue placeholder="Filtri" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="periodo">
              <CalendarIcon className="mr-2" /> Periodo
            </SelectItem>
            <SelectItem value="archivia">
              <ArchiveIcon className="mr-2" /> Archivia
            </SelectItem>
            <SelectItem value="report">
              <FileIcon className="mr-2" /> Report
            </SelectItem>
            <SelectItem value="cronologia">
              <ClockIcon className="mr-2" /> Cronologia
            </SelectItem>
          </SelectContent>
        </Select>
        <TabsList className="hidden @4xl/main:flex">
          <TabsTrigger value="filtri">Filtri</TabsTrigger>
        </TabsList>
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
        <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-50">
          <div className="bg-background rounded-lg shadow-lg p-6 max-w-md w-full">
            <h2 className="font-bold mb-2">Seleziona periodo</h2>
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
        <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-50">
          <div className="bg-background rounded-lg shadow-lg p-6 max-w-md w-full">
            <h2 className="font-bold mb-2">Archivia file selezionati</h2>
            <p>Confermi di voler archiviare i file selezionati?</p>
            <div className="flex gap-2 mt-4">
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
        <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-50">
          <div className="bg-background rounded-lg shadow-lg p-6 max-w-md w-full">
            <h2 className="font-bold mb-2">Genera Report</h2>
            <p>Scegli il formato di esportazione:</p>
            <div className="flex gap-2 mt-4">
              <Button variant="outline" onClick={() => setShowReport(false)}>
                Annulla
              </Button>
              <Button variant="default" onClick={() => { /* Export PDF */ setShowReport(false); }}>
                PDF
              </Button>
              <Button variant="default" onClick={() => { /* Export Excel */ setShowReport(false); }}>
                Excel
              </Button>
              <Button variant="default" onClick={() => { /* Export Word */ setShowReport(false); }}>
                Word
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Popup/dialog per il filtro "Cronologia" */}
      {showCronologia && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-50">
          <div className="bg-background rounded-lg shadow-lg p-6 max-w-3xl w-full overflow-y-auto max-h-[80vh]">
            <h2 className="font-bold mb-2">Cronologia caricamenti</h2>
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
