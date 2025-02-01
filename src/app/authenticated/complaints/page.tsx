import DataFetcher from '@/components/table/DataFetcher'
import ComplaintsTable from '@/components/tables/complaints-table'
import { API_URL, COMPLAINTS } from '@/lib/apiEndPoints'
import React from 'react'

export default function page() {
  return (
    <div className="">
      <DataFetcher endPoint={API_URL + COMPLAINTS} pageEndPoint="/complaints" role="complaints" Table={ComplaintsTable} />
    </div>
  )
}
