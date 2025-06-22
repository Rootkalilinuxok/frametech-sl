export default async function Page() {
  const data = [
    { id: "1", date: "2024-01-01", name: "Test", currency: "EUR", total: 10 }
  ];
  console.log("[COSTI] DATI FORZATI:", data);
  return (
    <div className="@container/main flex flex-col gap-4 md:gap-6">
      <SectionCards />
      <ChartAreaInteractive />
      <DataTable data={data as any} />
    </div>
  );
}
