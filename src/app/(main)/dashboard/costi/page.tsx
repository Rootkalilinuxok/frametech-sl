import { KpiCardGroup, KpiMetric } from "@/components/kpi-card-group";

export default async function Page() {
  const res = await fetch("/api/dashboard/costi-metrics");
  const metrics: KpiMetric[] = await res.json();

  return (
    <div className="@container/main flex flex-col gap-4 md:gap-6">
      <KpiCardGroup metrics={metrics} />
    </div>
  );
}
