// src/app/(main)/dashboard/_components/kpi-card-group.tsx
// v2 – adds optional `href` and a `render` prop to customise how each card
// is wrapped (e.g. with <Link>) so every page can decide its own behaviour.

import Link from "next/link";
import { TrendingDown, TrendingUp } from "lucide-react";

import {
  Badge,
  Card,
  CardAction,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui";

export interface KpiItem {
  title: string;
  value: string;
  delta?: string;
  trend?: "up" | "down"; // made optional for very simple KPI
  message?: string;
  subtext?: string;
  /**
   * Optional link. If provided and `render` isn’t, the card is wrapped
   * automatically with <Link href={href}>…</Link>.
   */
  href?: string;
}

interface KpiCardGroupProps {
  readonly items: KpiItem[];
  /**
   * Optional custom renderer (wrap, add tooltip, etc.).
   * Receives the computed JSX `card` and the original `item`.
   */
  render?: (args: { card: JSX.Element; item: KpiItem }) => JSX.Element;
  /** tailwind classes to override the default grid */
  className?: string;
}

export function KpiCardGroup({ items, render, className = "" }: KpiCardGroupProps) {
  return (
    <div
      className={`*:data-[slot=card]:from-primary/5 *:data-[slot=card]:to-card dark:*:data-[slot=card]:bg-card grid grid-cols-1 gap-4 *:data-[slot=card]:bg-gradient-to-t *:data-[slot=card]:shadow-xs @xl/main:grid-cols-2 @5xl/main:grid-cols-4 ${className}`}
    >
      {items.map((item) => {
        const card = (
          <Card key={item.title} className="@container/card">
            <CardHeader>
              <CardDescription>{item.title}</CardDescription>
              <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
                {item.value}
              </CardTitle>
              {item.delta && (
                <CardAction>
                  <Badge variant="outline">
                    {item.trend === "down" ? <TrendingDown /> : <TrendingUp />}
                    {item.delta}
                  </Badge>
                </CardAction>
              )}
            </CardHeader>
            {(item.message || item.subtext) && (
              <CardFooter className="flex-col items-start gap-1.5 text-sm">
                {item.message && (
                  <div className="line-clamp-1 flex gap-2 font-medium">
                    {item.message}
                    {item.trend === "down" ? (
                      <TrendingDown className="size-4" />
                    ) : (
                      <TrendingUp className="size-4" />
                    )}
                  </div>
                )}
                {item.subtext && <div className="text-muted-foreground">{item.subtext}</div>}
              </CardFooter>
            )}
          </Card>
        );

        // Custom render overrides everything
        if (render) return render({ card, item });
        // Default: wrap with Link if href provided, else plain card
        return item.href ? (
          <Link key={item.title} href={item.href} className="block">
            {card}
          </Link>
        ) : (
          card
        );
      })}
    </div>
  );
}
