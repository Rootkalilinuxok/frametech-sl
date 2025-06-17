// src/app/(main)/dashboard/costi/page.tsx

import { SectionCards } from "./_components/section-cards";
import { DataTable } from "./_components/data-table";
import { costiColumns } from "./_components/columns";
import costiData from "./_components/data.json";

export default function CostiPage() {
  return (
    <div className="flex flex-col gap-8">
      <SectionCards />
      <DataTable columns={costiColumns} data={costiData} />
    </div>
  );
}
