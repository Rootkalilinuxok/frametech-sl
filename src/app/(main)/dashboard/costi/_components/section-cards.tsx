import { KpiCardGroup } from "@/app/(main)/dashboard/andamento/_components/kpi-card-group"; // se lo condividi, altrimenti duplica anche questo file!

const kpiItems = [
  {
    title: "Totale Costi",
    value: "€ 8.340,00",
    delta: "+4%",
    trend: "up",
    message: "Incremento previsto",
    subtext: "Costi fissi e variabili inclusi",
  },
  {
    title: "Nuove Spese",
    value: "17",
    delta: "-2%",
    trend: "down",
    message: "Contenimento spese",
    subtext: "Rispetto al mese scorso",
  },
  {
    title: "Fatture da pagare",
    value: "5",
    delta: "+0%",
    trend: "up",
    message: "Da saldare entro il mese",
    subtext: "Verifica scadenze",
  },
  {
    title: "Budget Restante",
    value: "€ 2.500,00",
    delta: "-15%",
    trend: "down",
    message: "Margine ridotto",
    subtext: "Rispetta i limiti di spesa",
  },
];

export function SectionCards() {
  return <KpiCardGroup items={kpiItems} />;
}
