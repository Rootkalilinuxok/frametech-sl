import { TrendingDown, TrendingUp } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Card, CardAction, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";

export interface KpiItem {
  title: string;
  value: string;
  delta?: string;
  trend: "up" | "down";
  message: string;
  subtext: string;
}

interface KpiCardGroupProps {
  readonly items: KpiItem[];
}

export function KpiCardGroup({ items }: KpiCardGroupProps) {
  return (
    <div className="*:data-[slot=card]:from-primary/5 *:data-[slot=card]:to-card dark:*:data-[slot=card]:bg-card grid grid-cols-1 gap-4 *:data-[slot=card]:bg-gradient-to-t *:data-[slot=card]:shadow-xs @xl/main:grid-cols-2 @5xl/main:grid-cols-4">
      {items.map((item) => (
        <Card key={item.title} className="@container/card">
          <CardHeader>
            <CardDescription>{item.title}</CardDescription>
            <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">{item.value}</CardTitle>
            {item.delta && (
              <CardAction>
                <Badge variant="outline">
                  {item.trend === "up" ? <TrendingUp /> : <TrendingDown />}
                  {item.delta}
                </Badge>
              </CardAction>
            )}
          </CardHeader>
          <CardFooter className="flex-col items-start gap-1.5 text-sm">
            <div className="line-clamp-1 flex gap-2 font-medium">
              {item.message}{" "}
              {item.trend === "up" ? <TrendingUp className="size-4" /> : <TrendingDown className="size-4" />}
            </div>
            <div className="text-muted-foreground">{item.subtext}</div>
          </CardFooter>
        </Card>
      ))}
    </div>
  );
}
