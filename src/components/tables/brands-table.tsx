"use client"
import React from 'react'
import { BrandsColumns } from '../columns/brands-column'
import { DataTable } from '../table/data-table'
import SelectInput from '../table/filters/select-input'
import TableFacedFilter from '../table/table-faced-filter'
import { StatusOptions } from '@/lib/otpions'
import SearchInput from '../table/filters/search-input'
import CreateBtn from '../table/create-btn'
export default function BrandsTable({ data }: { data: any }) {

  return (
      <DataTable columns={BrandsColumns()} data={data}  FacedFilter={
        <TableFacedFilter
        >
          <SearchInput />
          <SelectInput
            param="status"
            label="Select Status"
            options={StatusOptions}
          />
        </TableFacedFilter>
      }
      Create={<CreateBtn Label="Add New Brand" href="/authenticated/brands/create" />}
      /> 
  )
}

