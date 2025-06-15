import { SectionCardsCosti } from "./_components/section-cards-costi";
import type { ReceiptRow } from "../andamento/_components/columns";
import { DataTable } from "../andamento/_components/data-table";
import data from "../andamento/_components/data.json";

export default function Page() {
  return (
    <div className="@container/main flex flex-col gap-4 md:gap-6">
      <SectionCardsCosti />
      <DataTable data={data as unknown as ReceiptRow[]} />
    </div>
  );
}
