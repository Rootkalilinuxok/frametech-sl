import type { ReceiptRow } from "./src/app/(main)/dashboard/costi/_components/columns";
import { DataTable } from "./src/app/(main)/dashboard/costi/_components/data-table";
import data from "./src/app/(main)/dashboard/costi/_components/data.json";
import { SectionCards } from "./src/app/(main)/dashboard/costi/_components/section-cards";

export default function Page() {
  return (
    <div className="@container/main flex flex-col gap-4 md:gap-6">
      <SectionCards />
      <ChartAreaInteractive />
      <DataTable data={data as unknown as ReceiptRow[]} />
    </div>
  );
}
