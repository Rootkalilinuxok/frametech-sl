import { TrendingDown, TrendingUp } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Card, CardAction, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";

export interface KpiMetric {
  title: string;
  value: string;
  delta: string;
  deltaType: "increase" | "decrease";
  comment: string;
  subcomment: string;
}

export function KpiCardGroup({ metrics }: { metrics: KpiMetric[] }) {
  return (
    <div className="*:data-[slot=card]:from-primary/5 *:data-[slot=card]:to-card dark:*:data-[slot=card]:bg-card grid grid-cols-1 gap-4 *:data-[slot=card]:bg-gradient-to-t *:data-[slot=card]:shadow-xs @xl/main:grid-cols-2 @5xl/main:grid-cols-4">
      {metrics.map((metric, index) => (
        <Card className="@container/card" key={index}>
          <CardHeader>
            <CardDescription>{metric.title}</CardDescription>
            <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">{metric.value}</CardTitle>
            <CardAction>
              <Badge variant="outline">
                {metric.deltaType === "increase" ? <TrendingUp /> : <TrendingDown />}
                {metric.delta}
              </Badge>
            </CardAction>
          </CardHeader>
          <CardFooter className="flex-col items-start gap-1.5 text-sm">
            <div className="line-clamp-1 flex gap-2 font-medium">
              {metric.comment}
              {metric.deltaType === "increase" ? (
                <TrendingUp className="size-4" />
              ) : (
                <TrendingDown className="size-4" />
              )}
            </div>
            <div className="text-muted-foreground">{metric.subcomment}</div>
          </CardFooter>
        </Card>
      ))}
    </div>
  );
}
