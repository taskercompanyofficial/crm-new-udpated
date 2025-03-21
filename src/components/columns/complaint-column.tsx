import React from "react";
import { ColumnDef } from "@tanstack/react-table";
import { Checkbox } from "@/components/ui/checkbox";
import { ComplaintsType } from "@/types";
import { formatDate } from "@/lib/utils";
import { DataTableColumnHeader } from "@/components/table/data-table-column-header";
import Status from "@/components/table/status";
import Link from "next/link";
import ReadMore from "@/components/custom/readmore";
import { ComplaintStatusOptions } from "@/lib/otpions";

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
    accessorKey: "customer_info",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Customer Information" />
    ),
    cell: ({ row }) => {
      const name = row.getValue("applicant_name") as string;
      const email = row.getValue("applicant_email") as string;
      const phone = row.getValue("applicant_phone") as string;
      const whatsapp = row.getValue("applicant_whatsapp") as string;
      
      return (
        <div className="space-y-1">
          <div className="font-medium">{name}</div>
          {email && <div className="text-sm text-muted-foreground">{email}</div>}
          {phone && <div className="text-sm">📞 {phone}</div>}
          {whatsapp && <div className="text-sm">📱 {whatsapp}</div>}
        </div>
      );
    },
  },
  {
    accessorKey: "location_details",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Location & Reference" />
    ),
    cell: ({ row }) => {
      const address = row.getValue("applicant_adress") as string;
      const branch = row.getValue("branch_id") as string;
      const reference = row.getValue("reference_by") as string;
      
      return (
        <div className="space-y-1">
          <div className="text-sm"><ReadMore text={address} /></div>
          {branch && <div className="text-sm text-muted-foreground">Branch: {branch}</div>}
          {reference && <div className="text-sm text-muted-foreground">Ref: {reference}</div>}
        </div>
      );
    },
  },
  {
    accessorKey: "product_details",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Product Details" />
    ),
    cell: ({ row }) => {
      const product = row.getValue("product") as string;
      const brand = row.getValue("brand_id") as string;
      const model = row.getValue("model") as string;
      const productType = row.getValue("product_type") as string;
      
      return (
        <div className="space-y-1">
          <div className="font-medium">{product}</div>
          {brand && <div className="text-sm text-muted-foreground">Brand: {brand}</div>}
          {model && <div className="text-sm"><ReadMore text={model} /></div>}
          {productType && <div className="text-sm text-muted-foreground">Type: {productType}</div>}
        </div>
      );
    },
  },
  {
    accessorKey: "serial_numbers",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Serial Numbers" />
    ),
    cell: ({ row }) => {
      const serialInd = row.getValue("serial_number_ind") as string;
      const serialOud = row.getValue("serial_number_oud") as string;
      const mqNumber = row.getValue("mq_nmb") as string;
      
      return (
        <div className="space-y-1">
          {serialInd && <div className="text-sm">IND: {serialInd}</div>}
          {serialOud && <div className="text-sm">OUD: {serialOud}</div>}
          {mqNumber && <div className="text-sm">MQ: {mqNumber}</div>}
        </div>
      );
    },
  },
  {
    accessorKey: "complaint_details",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Complaint Details" />
    ),
    cell: ({ row }) => {
      const description = row.getValue("description") as string;
      const complaintType = row.getValue("complaint_type") as string;
      const brandComplaintNo = row.getValue("brand_complaint_no") as string;
      
      return (
        <div className="space-y-1">
          <div className="text-sm"><ReadMore text={description} /></div>
          {complaintType && <div className="text-sm text-muted-foreground">Type: {complaintType}</div>}
          {brandComplaintNo && <div className="text-sm text-muted-foreground">Brand Ref: {brandComplaintNo}</div>}
        </div>
      );
    },
  },
  {
    accessorKey: "service_info",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Service Information" />
    ),
    cell: ({ row }) => {
      const technician = row.getValue("technician") as string;
      const providedServices = row.getValue("provided_services") as string;
      const warrantyType = row.getValue("warranty_type") as string;
      const workingDetails = row.getValue("working_details") as string;
      
      return (
        <div className="space-y-1">
          {technician && <div className="text-sm font-medium">Tech: {technician}</div>}
          {providedServices && <div className="text-sm">Services: {providedServices}</div>}
          {warrantyType && <div className="text-sm">Warranty: {warrantyType}</div>}
          {workingDetails && <div className="text-sm"><ReadMore text={workingDetails} /></div>}
        </div>
      );
    },
  },
  {
    accessorKey: "purchase_info",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Purchase & Payment" />
    ),
    cell: ({ row }) => {
      const purchaseDate = row.getValue("p_date") as Date;
      const amount = row.getValue("amount") as string | number;
      
      return (
        <div className="space-y-1">
          {purchaseDate && <div className="text-sm">Date: {formatDate(purchaseDate)}</div>}
          {amount && <div className="text-sm">Amount: {amount}</div>}
        </div>
      );
    },
  },
  {
    accessorKey: "feedback",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Feedback" />
    ),
    cell: ({ row }) => {
      const happyCallRemarks = row.getValue("happy_call_remarks") as string;
      
      return (
        <div className="space-y-1">
          {happyCallRemarks ? <ReadMore text={happyCallRemarks} /> : <span className="text-muted-foreground text-sm">No feedback</span>}
        </div>
      );
    },
  },
  {
    accessorKey: "dates",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Timestamps" />
    ),
    cell: ({ row }) => {
      const createdAt = row.getValue("created_at") as Date;
      const updatedAt = row.getValue("updated_at") as Date;
      
      return (
        <div className="space-y-1">
          <div className="text-sm">Created: {formatDate(createdAt)}</div>
          <div className="text-sm text-muted-foreground">Updated: {formatDate(updatedAt)}</div>
        </div>
      );
    },
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
