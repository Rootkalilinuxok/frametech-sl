// Questo file è per la NUOVA pagina "/costi"
// Path suggerito: `/app/costi/page.tsx`

import { DataTable } from "./_components/data-table";
import data from "./_components/data.json";
import { SectionCards } from "./_components/section-cards";

export default function CostiPage() {
  return (
    <div className="container mx-auto py-6 space-y-6">
      {/* Titolo della pagina specifica */}
      <h1 className="text-2xl font-bold">Gestione Costi</h1>
      
      {/* Sezione Cards (KPI) */}
      <SectionCards className="mb-8" />
      
      {/* Sezione Tabella */}
      <div className="space-y-2">
        <h2 className="text-xl font-semibold">Dettaglio Transazioni</h2>
        <DataTable data={data} editable={true} />
      </div>
    </div>
  );
}
