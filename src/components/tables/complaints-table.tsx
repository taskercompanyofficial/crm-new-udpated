"use client";
import { ComplaintsColumns } from "../columns/complaint-column";
import { DataTable } from "../table/data-table";
import SelectInput from "../table/filters/select-input";
import TableFacedFilter from "../table/table-faced-filter";
import { ComplaintStatusOptions } from "@/lib/otpions";
import SearchInput from "../table/filters/search-input";
import CreateBtn from "../table/create-btn";
import { Edit, Eye, Feather, Redo2, RefreshCw } from "lucide-react";
import { Button as ShadcnButton } from "../ui/button";
import { useSession } from "next-auth/react";
import useFetch from "@/hooks/usefetch";
import { API_URL } from "@/lib/apiEndPoints";
import { dataTypeIds } from "@/types";
import { Button, message } from "antd";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import Remarks from "@/app/crm/complaints/components/remarks";

export default function ComplaintsTable({
  data,
  role,
}: {
  data: any;
  role: string;
}) {
  const deletable = role === "administrator";
  const { data: brandsData, isLoading: brandsLoading } = useFetch<
    dataTypeIds[]
  >(`${API_URL}/crm/fetch-authorized-brands`);
  const { data: branchesData, isLoading: branchesLoading } = useFetch<
    dataTypeIds[]
  >(`${API_URL}/crm/fetch-branches`);
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
              <SelectInput
                param="brand_id"
                label="Select Brand"
                options={brandsData}
              />
              <SelectInput
                param="branch_id"
                label="Select Branch"
                options={branchesData}
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

  return (
    <Button
      type="text"
      block
      className="flex items-center justify-between px-3 py-2 hover:bg-gray-100"
      onClick={() => window.open(`/crm/complaints/${row.id}/edit`, "_blank")}
      disabled={row.status === "closed" && role !== "administrator"}
      icon={<Edit className="h-4 w-4" />}
    >
      <span>Update</span>
    </Button>
  );
};

const View = ({ row }: { row: any }) => {
  const { data } = useSession();
  const role = data?.user.role;

  const handleReopen = async () => {
    try {
      const response = await fetch(`${API_URL}/crm/complaints/${row.id}/reopen`, {
        method: 'POST'
      });
      if (response.ok) {
        message.success('Case reopened successfully');
        window.location.reload();
      } else {
        message.error('Failed to reopen case');
      }
    } catch (error) {
      message.error('Error reopening case');
    }
  };

  return (
    <div className="flex w-full flex-col gap-1">
      <Button
        type="text"
        block
        className="flex items-center justify-between px-3 py-2 hover:bg-gray-100"
        onClick={() =>
          window.open(`/crm/complaints/duplicate/${row.id}`, "_blank")
        }
        icon={<Redo2 className="h-4 w-4" />}
      >
        <span>Duplicate</span>
      </Button>

      <Button
        type="text"
        block
        className="flex items-center justify-between px-3 py-2 hover:bg-gray-100"
        onClick={() => window.open(`/crm/complaints/${row.id}`, "_blank")}
        icon={<Eye className="h-4 w-4" />}
      >
        <span>View</span>
      </Button>
      <Dialog>
        <DialogTrigger asChild>
          <Button
            type="text"
            block
            className="flex items-center justify-between px-3 py-2 hover:bg-gray-100"
            icon={<Feather className="h-4 w-4" />}
          >
            <span>Get Feedback</span>
          </Button>
        </DialogTrigger>
        <DialogContent fullscreen>
          <Remarks complaintId={row.id} />
        </DialogContent>
      </Dialog>
      {(row.status === "closed" || row.status === "cancelled") && role === "administrator" && (
        <Dialog>
          <DialogTrigger asChild>
            <Button
              type="text"
              block
              className="flex items-center justify-between px-3 py-2 hover:bg-gray-100"
              icon={<RefreshCw className="h-4 w-4" />}
            >
              <span>Reopen Case</span>
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Reopen Case</DialogTitle>
              <DialogDescription>
                Are you sure you want to reopen this case?
              </DialogDescription>
            </DialogHeader>
            <DialogFooter>
              <ShadcnButton variant="outline" onClick={() => {
                const dialog = document.querySelector('[role="dialog"]');
                if (dialog) {
                  dialog.dispatchEvent(new Event('close'));
                }
              }}>
                Cancel
              </ShadcnButton>
              <ShadcnButton onClick={handleReopen}>
                Confirm
              </ShadcnButton>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
};
