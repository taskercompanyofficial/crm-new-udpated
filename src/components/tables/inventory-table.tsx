"use client";
import React from "react";
import { DataTable } from "../table/data-table";
import TableFacedFilter from "../table/table-faced-filter";
import { InventoryColumns } from "../columns/inventory-column";
import { Button } from "@/components/ui/button";
import {
  Credenza,
  CredenzaContent,
  CredenzaDescription,
  CredenzaHeader,
  CredenzaTitle,
  CredenzaTrigger,
} from "@/components/custom/credenza";
import { Edit, Plus } from "lucide-react";
import InventoryForm from "../forms/inventory-form";
export default function InventoryTable({ data }: { data: any }) {
  const newData = data?.data || [];
  return (
    <div className="space-y-4">
      <DataTable
        columns={InventoryColumns()}
        data={newData}
        FacedFilter={<TableFacedFilter />}
        Create={<Create />}
        Update={Update}
        deletePermission
      />
    </div>
  );
}

const Create = () => {
  return (
    <Credenza>
      <CredenzaTrigger asChild>
        <Button className="flex w-full items-center gap-1 sm:w-fit">
          <Plus />
          Add New Item
        </Button>
      </CredenzaTrigger>
      <CredenzaContent className="h-[70%] overflow-y-auto bg-white sm:max-w-[600px]">
        <CredenzaHeader>
          <CredenzaTitle>Add Item</CredenzaTitle>
          <CredenzaDescription>
            Add a new item to your inventory.
          </CredenzaDescription>
        </CredenzaHeader>
        <InventoryForm />
      </CredenzaContent>
    </Credenza>
  );
};
const Update = ({ row }: { row: any }) => {
  return (
    <Credenza>
      <CredenzaTrigger asChild>
        <Button
          variant="ghost"
          size="sm"
          className="flex w-full items-center justify-between"
        >
          Update
          <Edit />
        </Button>
      </CredenzaTrigger>
      <CredenzaContent className="sm:max-w-[425px]">
        <CredenzaHeader>
          <CredenzaTitle>Update {row.name}</CredenzaTitle>
          <CredenzaDescription>
            Update Your existing Item {row.name}
          </CredenzaDescription>
        </CredenzaHeader>
        <InventoryForm row={row} />
      </CredenzaContent>
    </Credenza>
  );
};
