import React from "react";
import { ColumnDef } from "@tanstack/react-table";
import { Checkbox } from "@/components/ui/checkbox";
import { formatDate, getImageUrl } from "@/lib/utils";
import { Progress } from "@/components/ui/progress";
import { BrandsType } from "@/types";
import { DataTableColumnHeader } from "../table/data-table-column-header";
import { Avatar, AvatarImage, AvatarFallback } from "../ui/avatar";
import { StatusBadge } from "../table/status-badge";

export const BrandsColumns = (): ColumnDef<BrandsType>[] => [
  {
    id: "select",
    header: ({ table }) => (
      <Checkbox
        checked={
          table.getIsAllPageRowsSelected() ||
          (table.getIsSomePageRowsSelected() && "indeterminate")
        }
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label="Select all"
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label="Select row"
      />
    ),
    enableSorting: false,
    enableHiding: false,
  },
  

  {
    accessorKey: "image",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Brand Image" />
    ),
    cell: ({ row }) => {
      const path = String(row.getValue("image"));

      return (
        <>
          <Avatar>
            <AvatarImage src={getImageUrl(path)} />
            <AvatarFallback>
              {path.charAt(0).toUpperCase()}
            </AvatarFallback>
          </Avatar>
        </>
      );
    },
  },
  {
    accessorKey: "name",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Brand Name" />
    ),
  },
  {
    accessorKey: "open",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Open Complaints" />
    ),
  },
  {
    accessorKey: "closed_today",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Closed In Today" />
    ),
  },
  {
    accessorKey: "others",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Other Complaints" />
    ),
  },
  {
    accessorKey: "progress",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Progress" />
    ),
    cell: ({ row }) => {
      // Ensure progress is a number
      const progress = Number(row.getValue("progress")) || 0;

      return <Progress value={progress} />;
    },
  },
  {
    accessorKey: "created_at",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Created At" />
    ),
    cell: ({ cell }) => formatDate(cell.getValue() as Date),
  },
  {
    accessorKey: "updated_at",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Updated At" />
    ),
    cell: ({ cell }) => formatDate(cell.getValue() as Date),
  },
  {
    accessorKey: "status",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Status" />
    ),
    cell: ({ cell }) => <StatusBadge status={cell.getValue() as string} />,
  },
];
