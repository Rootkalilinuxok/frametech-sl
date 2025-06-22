import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { TrendingUp, TrendingDown } from "lucide-react";

export type KpiItem = {
  title: string;
  value: string;
  delta?: string;
  trend?: "up" | "down";
  message?: string;
  subtext?: string;
};

interface KpiCardGroupProps {
  items: KpiItem[];
}

export function KpiCardGroup({ items }: KpiCardGroupProps) {
  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
      {items.map((item, index) => (
        <Card key={index}>
          <CardHeader>
            <CardTitle className="text-muted-foreground text-sm font-medium">{item.title}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{item.value}</div>
            {item.delta && item.trend && (
              <div className={`mt-2 flex items-center ${item.trend === "up" ? "text-green-500" : "text-red-500"}`}>
                {item.trend === "up" ? (
                  <TrendingUp className="mr-1 h-4 w-4" />
                ) : (
                  <TrendingDown className="mr-1 h-4 w-4" />
                )}
                {item.delta}
              </div>
            )}
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
