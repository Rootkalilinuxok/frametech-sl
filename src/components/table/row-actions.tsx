"use client";

import { Copy, Edit, MoreHorizontal, Trash } from "lucide-react";

import type { ReceiptRow } from "@/app/(main)/dashboard/andamento/_components/columns";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export function SectionRowActions({ row }: { row: ReceiptRow }) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="size-8 p-0">
          <MoreHorizontal className="size-4" />
          <span className="sr-only">Open menu</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-40">
        <DropdownMenuLabel>Actions</DropdownMenuLabel>
        <DropdownMenuItem onClick={() => navigator.clipboard.writeText(row.id.toString())}>
          <Copy className="size-4" />
          <span>Copy ID</span>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem>
          <Edit className="size-4" />
          <span>Edit</span>
        </DropdownMenuItem>
        <DropdownMenuItem variant="destructive">
          <Trash className="size-4" />
          <span>Delete</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
