"use client";
import React from "react";
import { BrandsColumns } from "../columns/brands-column";
import { DataTable } from "../table/data-table";
import SelectInput from "../table/filters/select-input";
import TableFacedFilter from "../table/table-faced-filter";
import { StatusOptions } from "@/lib/otpions";
import SearchInput from "../table/filters/search-input";
import CreateBtn from "../table/create-btn";
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
import BrandsForm from "../forms/brands-form";
export default function BrandsTable({ data }: { data: any }) {
  return (
    <DataTable
      columns={BrandsColumns()}
      data={data}
      FacedFilter={
        <TableFacedFilter>
          <SearchInput />
          <SelectInput
            param="status"
            label="Select Status"
            options={StatusOptions}
          />
        </TableFacedFilter>
      }
      Create={<Create />}
      Update={Update}
      deletePermission
    />
  );
}

const Create = () => {
  return (
    <Credenza>
      <CredenzaTrigger asChild>
        <Button className="flex w-full items-center gap-1 sm:w-fit">
          <Plus />
          Add New Brand
        </Button>
      </CredenzaTrigger>
      <CredenzaContent className="sm:max-w-[425px]">
        <CredenzaHeader>
          <CredenzaTitle>Add Brand</CredenzaTitle>
          <CredenzaDescription>
            Add a new brand to access complaints via custom brands.
          </CredenzaDescription>
        </CredenzaHeader>
        <BrandsForm />
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
            Update Your existing Brand {row.name}
          </CredenzaDescription>
        </CredenzaHeader>
        <BrandsForm row={row} />
      </CredenzaContent>
    </Credenza>
  );
};
