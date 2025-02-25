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

  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.shiftKey) && e.altKey && e.key.toLowerCase() === 'e') {
        window.open(`/crm/complaints/edit/${row.id}`, "_blank");
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [row.id]);

  return (
    <Button
      variant="ghost"
      size="sm"
      className="flex w-full items-center justify-between px-3 py-2 transition-colors hover:bg-gray-100"
      onClick={() => window.open(`/crm/complaints/edit/${row.id}`, "_blank")}
      disabled={row.status === "closed" && role !== "administrator"}
    >
      <span className="mr-2">Update </span>
      <span>(<Kbd>Ctrl</Kbd>+<Kbd>Alt</Kbd>+<Kbd>E</Kbd>)</span>
    </Button>
  );
};

const View = ({ row }: { row: any }) => {
  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.shiftKey) && e.altKey) {
        if (e.key.toLowerCase() === 'n') {
          window.open(`/crm/complaints/duplicate/${row.id}`, "_blank");
        } else if (e.key.toLowerCase() === 'o') {
          window.open(`/crm/complaints/${row.id}`, "_blank");
        } else if (e.key.toLowerCase() === 'f') {
          document.querySelector<HTMLButtonElement>('[data-remarks-trigger]')?.click();
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [row.id]);

  return (
    <div className="flex w-full flex-col gap-1">
      <Button
        variant="ghost"
        size="sm"
        className="flex w-full items-center justify-between px-3 py-2 transition-colors hover:bg-gray-100"
        onClick={() =>
          window.open(`/crm/complaints/duplicate/${row.id}`, "_blank")
        }
      >
        <span className="mr-2">Duplicate </span>
        <span>(<Kbd>Ctrl</Kbd>+<Kbd>Alt</Kbd>+<Kbd>N</Kbd>)</span>
      </Button>

      <Button
        variant="ghost"
        size="sm"
        className="flex w-full items-center justify-between px-3 py-2 transition-colors hover:bg-gray-100"
        onClick={() => window.open(`/crm/complaints/${row.id}`, "_blank")}
      >
        <span className="mr-2">View </span>
        <span>(<Kbd>Ctrl</Kbd>+<Kbd>Alt</Kbd>+<Kbd>O</Kbd>)</span>
      </Button>

      <Credenza>
        <CredenzaTrigger asChild>
          <Button
            variant="ghost"
            size="sm"
            className="flex w-full items-center justify-between px-3 py-2 transition-colors hover:bg-gray-100"
            data-remarks-trigger
          >
            <span className="mr-2">Remarks </span>
            <span>(<Kbd>Ctrl</Kbd>+<Kbd>Alt</Kbd>+<Kbd>F</Kbd>)</span>
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
