import { ChartAreaInteractive } from "./_components/chart-area-interactive";
import type { ReceiptRow } from "./_components/columns";
import { DataTable } from "./_components/data-table";
import data from "./_components/data.json";
import { KpiCardGroup } from "@/components/kpi/KpiCardGroup";
import useSWR from "swr";

const fetcher = (url: string) => fetch(url).then((r) => r.json());

export default function Andamento() {
  const { data: metrics } = useSWR("/api/dashboard/metrics", fetcher);

  return (
    <main className="p-4 md:p-8 flex flex-col gap-6">
      <KpiCardGroup data={metrics?.overview ?? []} />
      <ChartAreaInteractive />
      <DataTable data={data as unknown as ReceiptRow[]} />
    </main>
  );
}
