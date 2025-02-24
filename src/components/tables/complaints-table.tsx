"use client";
import React from "react";
import { ComplaintsColumns } from "../columns/complaint-column";
import { DataTable } from "../table/data-table";
import SelectInput from "../table/filters/select-input";
import TableFacedFilter from "../table/table-faced-filter";
import { ComplaintStatusOptions } from "@/lib/otpions";
import SearchInput from "../table/filters/search-input";
import CreateBtn from "../table/create-btn";
import { Edit, Eye, MessageSquare, Redo2 } from "lucide-react";
import { Button } from "../ui/button";
import { useSession } from "next-auth/react";
import Remarks from "@/app/crm/complaints/components/remarks";
import {
  Credenza,
  CredenzaContent,
  CredenzaDescription,
  CredenzaHeader,
  CredenzaTitle,
  CredenzaTrigger,
} from "@/components/custom/credenza";
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
      disabled={row.status === "closed" && role !== "administrator"}
    >
      Update
      <Edit />
    </Button>
  );
};

const View = ({ row }: { row: any }) => {
  return (
    <>
      <Button
        variant="ghost"
        size="sm"
        className="flex w-full items-center justify-between"
        onClick={() =>
          window.open(`/crm/complaints/duplicate/${row.id}`, "_blank")
        }
      >
        Duplicate
        <Redo2 />
      </Button>
      <Button
        variant="ghost"
        size="sm"
        className="flex w-full items-center justify-between"
        onClick={() => window.open(`/crm/complaints/${row.id}`, "_blank")}
      >
        View
        <Eye />
      </Button>
      <Credenza>
        <CredenzaTrigger asChild>
          <Button
            variant="ghost"
            size="sm"
            className="flex w-full items-center justify-between"
          >
            Remarks
            <MessageSquare />
          </Button>
        </CredenzaTrigger>
        <CredenzaContent className="sm:max-w-[425px]">
          <CredenzaHeader>
            <CredenzaTitle>Update {row.complain_num} Remarks</CredenzaTitle>
            <CredenzaDescription>
              Update Your existing Complaint Remarks {row.complain_num}
            </CredenzaDescription>
          </CredenzaHeader>
          <Remarks complaintId={row.id} />
        </CredenzaContent>
      </Credenza>
    </>
  );
};

