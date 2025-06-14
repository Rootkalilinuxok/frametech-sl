import { ChartAreaInteractive } from "./_components/chart-area-interactive";
import type { ReceiptRow } from "./_components/columns";
import { DataTable } from "./_components/data-table";
import data from "./_components/data.json";
import { SectionCards } from "./_components/section-cards";

export default function Page() {
  return (
    <main className="relative min-h-screen bg-[url('/images/sfondo-matrix.jpg')] bg-cover bg-center bg-no-repeat">
      {/* Overlay nero semitrasparente */}
      <div className="absolute inset-0 bg-black/60 z-0" />

      {/* Contenuto visibile sopra lo sfondo */}
      <div className="relative z-10 @container/main flex flex-col gap-4 md:gap-6 px-4 py-6">
        <SectionCards />
        <ChartAreaInteractive />
        <DataTable data={data as unknown as ReceiptRow[]} />
      </div>
    </main>
  );
}
