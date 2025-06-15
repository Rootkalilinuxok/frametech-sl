import Link from "next/link";
import { TrendingDown, TrendingUp } from "lucide-react";

// Assicurati che il path sia corretto in base alla tua struttura shadcn/ui!
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardAction,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

// Tipizzazione oggetto KPI
export interface KpiItem {
  title: string;
  value: string;
  delta?: string;
  trend?: "up" | "down";
  message?: string;
  subtext?: string;
  href?: string; // link opzionale
}

interface KpiCardGroupProps {
  readonly items: KpiItem[];
  /** custom wrapper per card */
  render?: (args: { card: JSX.Element; item: KpiItem }) => JSX.Element;
  className?: string;
}

export function KpiCardGroup({ items, render, className = "" }: KpiCardGroupProps) {
  return (
    <div
      className={`*:data-[slot=card]:from-primary/5 *:data-[slot=card]:to-card dark:*:data-[slot=card]:bg-card grid grid-cols-1 gap-4 *:data-[slot=card]:bg-gradient-to-t *:data-[slot=card]:shadow-xs @xl/main:grid-cols-2 @5xl/main:grid-cols-4 ${className}`}
    >
      {items.map((item) => {
        const card = (
          <Card key={item.title} className="@container/card" data-slot="card">
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
                {item.subtext && (
                  <div className="text-muted-foreground">{item.subtext}</div>
                )}
              </CardFooter>
            )}
          </Card>
        );

        // custom render (se presente)
        if (render) return render({ card, item });
        // altrimenti, autolink se c'è href
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
