"use client";

import Link from "next/link";
import { KpiCardGroup, type KpiItem } from "../_components/kpi-card-group";

/**
 * Build absolute URL for server‑side fetch that also works in the browser.
 */
function absoluteUrl(path: string) {
  if (typeof window === "undefined") {
    const base = process.env.VERCEL_URL
      ? `https://${process.env.VERCEL_URL}`
      : "http://localhost:3000";
    return `${base}${path}`;
  }
  return path; // relative ok in browser
}

export default async function CostiPage() {
  // Fetch KPI metrics
  const res = await fetch(absoluteUrl("/api/dashboard/costi-metrics"), {
    cache: "no-store",
  });

  if (!res.ok) {
    throw new Error(`API error (${res.status}) while loading costi metrics`);
  }

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
      href: "/dashboard/costi/revenue", // ✔ rende cliccabile la card
    },
    {
      title: "New Customers",
      value: data.newCustomers.toLocaleString("it-IT"),
      trend: "up",
      message: "Customers so far",
      subtext: "Distinct contacts in receipts",
      href: "/dashboard/costi/customers",
    },
    {
      title: "Active Accounts",
      value: data.activeAccounts.toLocaleString("it-IT"),
      trend: "up",
      message: "Total receipts logged",
      subtext: "Entries in receipts_live",
      href: "/dashboard/costi/accounts",
    },
    {
      title: "Growth Rate",
      value: data.growthRate,
      delta: data.growthRate,
      trend: data.growthRate.startsWith("-") ? "down" : "up",
      message: data.growthRate.startsWith("-") ? "Growth trending down" : "Growth trending up",
      subtext: "Compared to last period",
      href: "/dashboard/costi/growth",
    },
  ];

  return (
    <main className="relative min-h-screen w-full overflow-auto bg-[url('/images/sfondo-matrix.jpg')] bg-cover bg-center bg-no-repeat">
      {/* overlay per rendere leggibile il testo */}
      <div className="pointer-events-none fixed inset-0 -z-10 bg-black/40" aria-hidden />

      <section className="@container/main mx-auto flex max-w-7xl flex-col gap-6 p-6">
        <h1 className="text-3xl font-semibold text-white">Costi – KPI</h1>

        {/* quattro riquadri KPI cliccabili */}
        <KpiCardGroup
          items={items}
          render={(item) => (
            <Link href={item.href ?? "#"} className="block">
              {item.card}
            </Link>
          )}
        />
      </section>
    </main>
  );
}
