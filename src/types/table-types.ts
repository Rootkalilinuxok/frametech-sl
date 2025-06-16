import { RowData, Table } from "@tanstack/react-table";

export interface SectionRow extends RowData {
  id: number;
  header: string;
  type: string;
  status: string;
  target: string;
  limit: string;
  reviewer: string;
}
