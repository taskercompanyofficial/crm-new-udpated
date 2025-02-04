import React from "react";
import { ColumnDef } from "@tanstack/react-table";
import { Checkbox } from "@/components/ui/checkbox";
import { WorkersType } from "@/types";
import { formatDate } from "@/lib/utils";
import { DataTableColumnHeader } from "@/components/table/data-table-column-header";
import Status from "@/components/table/status";

export const StaffCoulmns = (): ColumnDef<WorkersType>[] => [
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
    accessorKey: "id",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="ID" />
    ),
  },
  {
    accessorKey: "full_name",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Worker Name" />
    ),
  },
  {
    accessorKey: "father_name",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Father Name" />
    ),
  },
  {
    accessorKey: "contact_email",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Contact Email" />
    ),
  },
  {
    accessorKey: "phone_number",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Phone Number" />
    ),
  },
  {
    accessorKey: "secondary_phone_number",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Secondary Phone Number" />
    ),
  },
  {
    accessorKey: "full_address",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Full Address" />
    ),
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
    cell: ({ row }) => {
      const status = String(row.getValue("status"));
      return <Status status={status} />;
    },
  },
];
