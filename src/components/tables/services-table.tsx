"use client";
import React from "react";
import { DataTable } from "../table/data-table";
import SelectInput from "../table/filters/select-input";
import TableFacedFilter from "../table/table-faced-filter";
import { StatusOptions } from "@/lib/otpions";
import SearchInput from "../table/filters/search-input";
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
import { ServicesColumns } from "../columns/services-coulumn";
import ServicesForm from "../forms/services-form";
export default function ServicesTable({ data }: { data: any }) {
    return (
        <div className="space-y-4">
            <DataTable
                columns={ServicesColumns()}
                data={data.data}
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
        </div>
    );
}

const Create = () => {
    return (
        <Credenza>
            <CredenzaTrigger asChild>
                <Button className="flex w-full items-center gap-1 sm:w-fit">
                    <Plus />
                    Add New Service
                </Button>
            </CredenzaTrigger>
            <CredenzaContent className="sm:max-w-[425px]">
                <CredenzaHeader>
                    <CredenzaTitle>Add Service</CredenzaTitle>
                    <CredenzaDescription>
                        Add a new service to access complaints via custom services.
                    </CredenzaDescription>
                </CredenzaHeader>
                <ServicesForm />
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
                    <CredenzaTitle>Update Service</CredenzaTitle>
                    <CredenzaDescription>
                        Update Your existing Service {row.name}
                    </CredenzaDescription>
                </CredenzaHeader>
                <ServicesForm row={row} />
            </CredenzaContent>
        </Credenza>
    );
};
