"use client";
import React from "react";
import { ComplaintsColumns } from "../columns/complaint-column";
import { DataTable } from "../table/data-table";
import SelectInput from "../table/filters/select-input";
import TableFacedFilter from "../table/table-faced-filter";
import { ComplaintStatusOptions } from "@/lib/otpions";
import SearchInput from "../table/filters/search-input";
import CreateBtn from "../table/create-btn";
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
import { Kbd } from "../ui/kbd";

export default function ComplaintsTable({
  data,
  role,
}: {
  data: any;
  role: string;
}) {
  const deletable = role === "administrator";

  return (
    <div className="w-full overflow-hidden">
      <DataTable
        columns={ComplaintsColumns()}
        data={data.data}
        FacedFilter={
          <TableFacedFilter>
            <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
              <SearchInput />
              <SelectInput
                param="status"
                label="Select Status"
                options={ComplaintStatusOptions}
              />
            </div>
          </TableFacedFilter>
        }
        Create={
          <CreateBtn Label="Add New Complaint" href="/crm/complaints/create" />
        }
        View={View}
        Update={Update}
        deletePermission={deletable}
      />
    </div>
  );
}

const Update = ({ row }: { row: any }) => {
  const { data } = useSession();
  const role = data?.user.role;

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.altKey && e.key === 'e') {
      window.open(`/crm/complaints/edit/${row.id}`, "_blank");
    }
  };

  return (
    <Button
      variant="ghost"
      size="sm"
      className="flex w-full items-center justify-between px-3 py-2 transition-colors hover:bg-gray-100"
      onClick={() => window.open(`/crm/complaints/edit/${row.id}`, "_blank")}
      onKeyDown={handleKeyPress}
      disabled={row.status === "closed" && role !== "administrator"}
    >
      <span className="mr-2">Update (<Kbd>Alt</Kbd>+<Kbd>E</Kbd>)</span>
      <span>Edit</span>
    </Button>
  );
};

const View = ({ row }: { row: any }) => {
  const handleDuplicateKeyPress = (e: React.KeyboardEvent) => {
    if (e.altKey && e.key === 'n') {
      window.open(`/crm/complaints/duplicate/${row.id}`, "_blank");
    }
  };

  const handleViewKeyPress = (e: React.KeyboardEvent) => {
    if (e.altKey && e.key === 'o') {
      window.open(`/crm/complaints/${row.id}`, "_blank");
    }
  };

  const handleRemarksKeyPress = (e: React.KeyboardEvent) => {
    if (e.altKey && e.key === 'f') {
      const button = e.currentTarget as HTMLButtonElement;
      button.click();
    }
  };

  return (
    <div className="flex w-full flex-col gap-1">
      <Button
        variant="ghost"
        size="sm"
        className="flex w-full items-center justify-between px-3 py-2 transition-colors hover:bg-gray-100"
        onClick={() =>
          window.open(`/crm/complaints/duplicate/${row.id}`, "_blank")
        }
        onKeyDown={handleDuplicateKeyPress}
      >
        <span className="mr-2">Duplicate <Kbd>Alt</Kbd>+<Kbd>N</Kbd></span>
        <span>New</span>
      </Button>

      <Button
        variant="ghost"
        size="sm"
        className="flex w-full items-center justify-between px-3 py-2 transition-colors hover:bg-gray-100"
        onClick={() => window.open(`/crm/complaints/${row.id}`, "_blank")}
        onKeyDown={handleViewKeyPress}
      >
        <span className="mr-2">View <Kbd>Alt</Kbd>+<Kbd>O</Kbd></span>
        <span>Open</span>
      </Button>

      <Credenza>
        <CredenzaTrigger asChild>
          <Button
            variant="ghost"
            size="sm"
            className="flex w-full items-center justify-between px-3 py-2 transition-colors hover:bg-gray-100"
            onKeyDown={handleRemarksKeyPress}
          >
            <span className="mr-2">Remarks <Kbd>Alt</Kbd>+<Kbd>F</Kbd></span>
            <span>Remarks</span>
          </Button>
        </CredenzaTrigger>
        <CredenzaContent className="w-[95vw] max-w-4xl p-4 sm:w-[80vw]">
          <CredenzaHeader>
            <CredenzaTitle className="text-lg font-semibold">
              Update {row.complain_num} Remarks
            </CredenzaTitle>
            <CredenzaDescription className="text-sm text-gray-600">
              Update Your existing Complaint Remarks {row.complain_num}
            </CredenzaDescription>
          </CredenzaHeader>
          <div className="mt-4">
            <Remarks complaintId={row.id} />
          </div>
        </CredenzaContent>
      </Credenza>
    </div>
  );
};
