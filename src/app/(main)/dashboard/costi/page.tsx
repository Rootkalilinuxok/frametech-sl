import { SectionCards } from "./_components/section-cards";
import { ChartAreaInteractive } from "./_components/chart-area-interactive";
import { DataTable } from "./_components/data-table";
import data from "./_components/data.json";
import type { CostiRow } from "./_components/columns";

export default function Page() {
  return (
    <div className="@container/main flex flex-col gap-4 md:gap-6">
      <SectionCards />
      <ChartAreaInteractive />
      <DataTable data={data as unknown as CostiRow[]} />
    </div>
  );
}
