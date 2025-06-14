export async function GET() {
  return Response.json({
    overview: [
      {
        title: "Total Revenue",
        value: "$1,250.00",
        delta: "+0%",
        subtitle: "Trending up this month",
        footer: "Visitors for the last 6 months",
      },
      {
        title: "New Customers",
        value: "1,234",
        delta: "-20%",
        subtitle: "Down 20% this period",
        footer: "Acquisition needs attention",
      },
      {
        title: "Active Accounts",
        value: "45,678",
        delta: "+12.5%",
        subtitle: "Strong user retention",
        footer: "Engagement exceed targets",
      },
      {
        title: "Growth Rate",
        value: "4.5%",
        delta: "+4.5%",
        subtitle: "Steady performance increase",
        footer: "Meets growth projections",
      },
    ],
  });
}
