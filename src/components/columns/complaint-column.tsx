import ReadMore from "@/components/custom/readmore";
import { DataTableColumnHeader } from "@/components/table/data-table-column-header";
import Status from "@/components/table/status";
import { Checkbox } from "@/components/ui/checkbox";
import { formatDate } from "@/lib/utils";
import { ComplaintsType } from "@/types";
import { ColumnDef } from "@tanstack/react-table";
import Link from "next/link";
import { Priority } from "../table/priority";

export const ComplaintsColumns = (): ColumnDef<ComplaintsType>[] => [
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
    header: ({ column }) => <DataTableColumnHeader column={column} title="#" />,
    cell: ({ row, table }) => {
      const pageSize = table.getState().pagination.pageSize;
      const pageIndex = table.getState().pagination.pageIndex;
      const rowIndex = row.index;
      return pageIndex * pageSize + rowIndex + 1;
    },
  },
  {
    accessorKey: "tat",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Job Age" />
    ),
  },
  {
    accessorKey: "complain_num",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Complaint Number" />
    ),
    cell: ({ row }) => {
      const complaint_num = row.getValue("complain_num") as string;
      const id = row.getValue("id") as number;
      return (
        <Link
          href={`/crm/complaints/${id}`}
          className="underline"
          target="_blank"
        >
          {complaint_num}
        </Link>
      );
    },
  },
  {
    accessorKey: "applicant_name",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Applicant Name" />
    ),
  },
  {
    accessorKey: "brand_complaint_no",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Brand Complaint No" />
    ),
  },
  {
    accessorKey: "applicant_phone",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Applicant Phone" />
    ),
  },
  {
    accessorKey: "applicant_whatsapp",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Applicant Whatsapp" />
    ),
  },
  {
    accessorKey: "applicant_adress",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Applicant Address" />
    ),
    cell: ({ row }) => {
      const applicant_adress = row.getValue("applicant_adress") as string;
      return <ReadMore text={applicant_adress} />;
    },
  },
  {
    accessorKey: "description",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Description" />
    ),
    cell: ({ row }) => {
      const description = row.getValue("description") as string;
      return <ReadMore text={description} />;
    },
  },
  {
    accessorKey: "reviews",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Reviews" />
    ),
    cell: ({ row }) => {
      const reviews = row.getValue("reviews") as string;
      return <ReadMore text={reviews} />;
    },
  },
  {
    accessorKey: "technician",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="AssignedTechnition" />
    ),
  },
  {
    accessorKey: "brand",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Brand Name" />
    ),
    cell: ({ row }) => {
      const brand = row.original.brand;
      return <span>{brand?.name}</span>;
    },
  },
  {
    accessorKey: "branch_id",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Branch Name" />
    ),
    cell: ({ row }) => {
      const branch = row.original.branch;
      return <span>{branch?.name}</span>;
    },
  },
  {
    accessorKey: "extra_numbers",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Extra Numbers" />
    ),
  },
  {
    accessorKey: "dealer",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Dealer" />
    )
  },
  {
    accessorKey: "reference_by",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Reference By" />
    ),
  },
  {
    accessorKey: "product",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Product" />
    ),
  },
  {
    accessorKey: "model",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Model" />
    ),
    cell: ({ row }) => {
      const model = row.getValue("model") as string;
      return <ReadMore text={model} />;
    },
  },
  {
    accessorKey: "serial_number_ind",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Serial Number (IND)" />
    ),
  },
  {
    accessorKey: "serial_number_oud",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Serial Number (OUD)" />
    ),
  },
  {
    accessorKey: "mq_nmb",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="MQ Number" />
    ),
  },
  {
    accessorKey: "product_type",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Product Type" />
    ),
  },
  {
    accessorKey: "p_date",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Purchase Date" />
    ),
    cell: ({ cell }) => formatDate(cell.getValue() as Date),
  },
  {
    accessorKey: "amount",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Amount" />
    ),
  },
  {
    accessorKey: "complaint_type",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Complaint Type" />
    ),
  },
  {
    accessorKey: "provided_services",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Provided Services" />
    ),
  },
  {
    accessorKey: "warranty_type",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Warranty Type" />
    ),
  },
  {
    accessorKey: "working_details",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Working Details" />
    ),
    cell: ({ row }) => {
      const working_details = row.getValue("working_details") as string;
      return <ReadMore text={working_details} />;
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
    cell: ({ row }) => {
      const status = String(row.getValue("status"));
      return <Status status={status} />;
    },
  },
  {
    accessorKey: "priority",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Priority" />
    ),
    cell: ({ row }) => {
      const status = String(row.getValue("priority"));
      return <Priority priority={status} />;
    },
  },
];
