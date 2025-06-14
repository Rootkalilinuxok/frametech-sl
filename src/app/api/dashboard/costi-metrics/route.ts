import { NextResponse } from "next/server";

export interface CostMetric {
  title: string;
  value: string;
  delta: string;
  deltaType: "increase" | "decrease";
  comment: string;
  subcomment: string;
}

export async function GET() {
  const metrics: CostMetric[] = [
    {
      title: "Total Costs",
      value: "$12,340",
      delta: "+5%",
      deltaType: "increase",
      comment: "Up from last month",
      subcomment: "Total expenses for the last 30 days",
    },
    {
      title: "New Expenses",
      value: "45",
      delta: "-3%",
      deltaType: "decrease",
      comment: "Fewer bills this month",
      subcomment: "Compared to previous period",
    },
    {
      title: "Avg. Cost",
      value: "$275",
      delta: "+2%",
      deltaType: "increase",
      comment: "Average per item",
      subcomment: "All expenses in database",
    },
    {
      title: "Recurring Costs",
      value: "$2,500",
      delta: "+10%",
      deltaType: "increase",
      comment: "More subscriptions",
      subcomment: "Monthly recurring charges",
    },
  ];

  return NextResponse.json(metrics);
}
