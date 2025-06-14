import { KpiCardGroup, type KpiItem } from "../_components/kpi-card-group";

export default async function Page() {
  const res = await fetch("/api/dashboard/costi-metrics");
  const data: {
    totalRevenue: number;
    newCustomers: number;
    activeAccounts: number;
    growthRate: string;
  } = await res.json();

  const items: KpiItem[] = [
    {
      title: "Total Revenue",
      value: data.totalRevenue.toLocaleString("it-IT", {
        style: "currency",
        currency: "EUR",
      }),
      delta: data.growthRate,
      trend: data.growthRate.startsWith("-") ? "down" : "up",
      message: data.growthRate.startsWith("-") ? "Trending down this month" : "Trending up this month",
      subtext: "Aggregated from receipts",
    },
    {
      title: "New Customers",
      value: data.newCustomers.toLocaleString("it-IT"),
      trend: "up",
      message: "Customers so far",
      subtext: "Distinct contacts in receipts",
    },
    {
      title: "Active Accounts",
      value: data.activeAccounts.toLocaleString("it-IT"),
      trend: "up",
      message: "Total receipts logged",
      subtext: "Entries in receipts_live",
    },
    {
      title: "Growth Rate",
      value: data.growthRate,
      delta: data.growthRate,
      trend: data.growthRate.startsWith("-") ? "down" : "up",
      message: data.growthRate.startsWith("-") ? "Growth trending down" : "Growth trending up",
      subtext: "Compared to last period",
    },
  ];

  return (
    <div className="@container/main flex flex-col gap-4 md:gap-6">
      <KpiCardGroup items={items} />
    </div>
  );
}
