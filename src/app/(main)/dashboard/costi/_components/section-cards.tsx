import { KpiCardGroup, type KpiItem } from "../../_components/kpi-card-group";

export function SectionCards() {
  const items: KpiItem[] = [
    {
      title: "Total Revenue",
      value: "$1,250.00",
      delta: "+0%",
      trend: "up",
      message: "Trending up this month",
      subtext: "Visitors for the last 6 months",
    },
    {
      title: "New Customers",
      value: "1,234",
      delta: "+0%",
      trend: "down",
      message: "Down 20% this period",
      subtext: "Acquisition needs attention",
    },
    {
      title: "Active Accounts",
      value: "45,678",
      delta: "+0%",
      trend: "up",
      message: "Strong user retention",
      subtext: "Engagement exceed targets",
    },
    {
      title: "Growth Rate",
      value: "4.5%",
      delta: "+0%",
      trend: "up",
      message: "Steady performance increase",
      subtext: "Meets growth projections",
    },
  ];

  return <KpiCardGroup items={items} />;
}
