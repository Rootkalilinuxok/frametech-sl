import { KpiCardGroup, type KpiItem } from "@/components/kpi-card-group";

export function SectionCards() {
  const items: KpiItem[] = [
    {
      title: "Totale Costi",
      value: "€ 8.340,00",
      delta: "+4%",
      trend: "up" as const,
      message: "Incremento previsto",
      subtext: "Costi fissi e variabili inclusi",
    },
    {
      title: "Nuove Spese",
      value: "17",
      delta: "-2%",
      trend: "down" as const,
      message: "Contenimento spese",
      subtext: "Rispetto al mese scorso",
    },
    {
      title: "Fatture da pagare",
      value: "5",
      delta: "+0%",
      trend: "up" as const,
      message: "Da saldare entro il mese",
      subtext: "Verifica scadenze",
    },
    {
      title: "Budget Restante",
      value: "€ 2.500,00",
      delta: "-15%",
      trend: "down" as const,
      message: "Margine ridotto",
      subtext: "Rispetta i limiti di spesa",
    },
  ];

  return <KpiCardGroup items={items} />;
}
