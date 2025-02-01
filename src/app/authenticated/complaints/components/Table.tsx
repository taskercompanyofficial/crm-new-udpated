"use client";
import TableFacedFilter from "@/components/table/table-faced-filter";
import { DataTable } from "@/components/table/data-table";
import SelectInput from "@/components/table/filters/select-input";
import { ComplaintStatusOptions } from "@/lib/otpions";
import SearchInput from "@/components/table/filters/search-input";
import { ComplaintsColumns } from "@/components/columns/complaint-column";
import CreateComplaint from "../create/create";
import useFetch from "@/hooks/usefetch";
import { API_URL } from "@/lib/apiEndPoints";
import { dataTypeIds } from "@/types";
import Skeleton from "react-loading-skeleton";

export default function Table({
  endPoint,
  data,
}: {
  endPoint: string;
  data: any;
}) {
  const { data: brandsData, isLoading } = useFetch<dataTypeIds[]>(
    API_URL + "/crm/fetch-authorized-brands",
  );
  return (
    <DataTable
      data={data.data}
      endPoint={endPoint}
      columns={ComplaintsColumns()}
      pagination={data.pagination}
      FacedFilter={
        <TableFacedFilter>
          <SearchInput />
          {isLoading ? (
            <Skeleton className="w-full h-10" />
          ) : (
            <SelectInput
              param="brand_id"
              label="Select Brand"
              options={brandsData}
            />
          )}
          <SelectInput
            param="status"
            label="Select Status"
            options={ComplaintStatusOptions}
          />
        </TableFacedFilter>
      }
      Create={<CreateComplaint />}
    />
  );
}
