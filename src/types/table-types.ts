import { RowData } from "@tanstack/react-table";

// Usando "type" e tutte le proprietà desiderate
export type SectionRow = RowData & {
  id: number;
  header: string;
  type: string;
  status: string;
  target: string;
  limit: string;
  reviewer: string;
};
