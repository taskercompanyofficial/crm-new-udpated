"use client";
import React from "react";
import { ComplaintsColumns } from "../columns/complaint-column";
import { DataTable } from "../table/data-table";
import SelectInput from "../table/filters/select-input";
import TableFacedFilter from "../table/table-faced-filter";
import { ComplaintStatusOptions } from "@/lib/otpions";
import SearchInput from "../table/filters/search-input";
import CreateBtn from "../table/create-btn";
import { Edit, Eye } from "lucide-react";
import { Button } from "../ui/button";
import { useSession } from "next-auth/react";

export default function ComplaintsTable({
  data,
  role,
}: {
  data: any;
  role: string;
}) {
  const deletable = role === "administrator" ? true : false;
  return (
    <DataTable
      columns={ComplaintsColumns()}
      data={data.data}
      FacedFilter={
        <TableFacedFilter>
          <SearchInput />
          <SelectInput
            param="status"
            label="Select Status"
            options={ComplaintStatusOptions}
          />
        </TableFacedFilter>
      }
      Create={
        <CreateBtn Label="Add New Complaint" href="/crm/complaints/create" />
      }
      View={View}
      Update={Update}
      deletePermission={deletable}
    />
  );
}

const Update = ({ row }: { row: any }) => {
  const { data, status } = useSession();
  const role = data?.user.role;
  return (
    <Button
      variant="ghost"
      size="sm"
      className="flex w-full items-center justify-between"
      onClick={() => window.open(`/crm/complaints/edit/${row.id}`, "_blank")}
      disabled={row.status === 'closed' && role !== "administrator"}
    >
      Update
      <Edit />
    </Button>
  );
};

const View = ({ row }: { row: any }) => {
  return (
    <Button
      variant="ghost"
      size="sm"
      className="flex w-full items-center justify-between"
      onClick={() => window.open(`/crm/complaints/${row.id}`, "_blank")}
    >
      View
      <Eye />
    </Button>
  );
};
