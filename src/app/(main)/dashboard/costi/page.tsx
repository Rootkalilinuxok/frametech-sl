import type { ReceiptRow } from "./costi/_components/columns";
import { DataTable } from "./costi/_components/data-table";
import data from "./costi/_components/data.json";
import { SectionCards } from "./costi/_components/section-cards";

export default function Page() {
  return (
    <div className="@container/main flex flex-col gap-4 md:gap-6">
      <SectionCards />
      <ChartAreaInteractive />
      <DataTable data={data as unknown as ReceiptRow[]} />
    </div>
  );
}
