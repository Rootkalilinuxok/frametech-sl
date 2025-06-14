import { KpiCardGroup } from "@/components/kpi/KpiCardGroup";
import useSWR from "swr";

const fetcher = (url: string) => fetch(url).then((r) => r.json());

export default function Costi() {
  const { data, isLoading } = useSWR("/api/dashboard/costi-metrics", fetcher);

  return (
    <main className="p-4 md:p-8 flex flex-col gap-6">
      {isLoading ? <p>Loading…</p> : <KpiCardGroup data={data} />}
      {/* qui sotto la DataTable costi */}
    </main>
  );
}
