"use client"
import React from 'react'
import { ComplaintsColumns } from '../columns/complaint-column'
import { DataTable } from '../table/data-table'
import { Skeleton } from '../ui/skeleton'
import SelectInput from '../table/filters/select-input'
import TableFacedFilter from '../table/table-faced-filter'
import { ComplaintStatusOptions } from '@/lib/otpions'
import SearchInput from '../table/filters/search-input'
import useFetch from '@/hooks/usefetch'
import { API_URL } from '@/lib/apiEndPoints'
import { dataTypeIds } from '@/types'
import CreateBtn from '../table/create-btn'
export default function ComplaintsTable({ data }: { data: any }) {
  const { data: brandsData, isLoading } = useFetch<dataTypeIds[]>(
    API_URL + "/crm/fetch-authorized-brands",
  );
  return (
      <DataTable columns={ComplaintsColumns()} data={data}  FacedFilter={
        <TableFacedFilter
        >
          <SearchInput />
          {isLoading ? (
            <Skeleton className="h-8 w-[200px]" />
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
      Create={<CreateBtn Label="Add New Complaint" href="/authenticated/complaints/create" />}
      /> 
  )
}

