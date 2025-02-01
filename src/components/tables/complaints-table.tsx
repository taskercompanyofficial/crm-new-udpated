"use client"
import React from 'react'
import { ComplaintsColumns } from '../columns/complaint-column'
import { DataTable } from '../table/data-table'
import SelectInput from '../table/filters/select-input'
import TableFacedFilter from '../table/table-faced-filter'
import { ComplaintStatusOptions } from '@/lib/otpions'
import SearchInput from '../table/filters/search-input'
import CreateBtn from '../table/create-btn'
export default function ComplaintsTable({ data }: { data: any }) {

  return (
      <DataTable columns={ComplaintsColumns()} data={data}  FacedFilter={
        <TableFacedFilter
        >
          <SearchInput />
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

