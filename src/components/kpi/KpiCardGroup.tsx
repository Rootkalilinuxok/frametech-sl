import { Card, CardContent } from "@/components/ui/card";

interface CardDef {
  title: string;
  value: string | number;
  delta: string;
  subtitle: string;
  footer: string;
}

interface Props {
  data: CardDef[];
}

export function KpiCardGroup({ data }: Props) {
  return (
    <div className="grid gap-4 md:grid-cols-4">
      {data.map((c) => (
        <Card key={c.title}>
          <CardContent className="p-6">
            <h3 className="text-sm font-medium text-muted-foreground">
              {c.title}
            </h3>
            <div className="flex items-center justify-between">
              <span className="text-3xl font-bold">{c.value}</span>
              <span className="rounded-md bg-muted px-2 py-0.5 text-xs">
                {c.delta}
              </span>
            </div>
            <p className="mt-3 text-sm">{c.subtitle}</p>
            <p className="text-xs text-muted-foreground">{c.footer}</p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
