import { buildQueryParams } from '@/actions/get-url-params'
import DataFetcher from '@/components/table/DataFetcher'
import ComplaintsTable from '@/components/tables/complaints-table'
import { API_URL, COMPLAINTS } from '@/lib/apiEndPoints'
import React from 'react'

export default function page({searchParams}:{searchParams:any}) {
const params = buildQueryParams(
  {
    q:searchParams?.q,
    status:searchParams.status,
    brand_id:searchParams.brand_id
  }
)
  return (
    <div className="">
      <DataFetcher endPoint={`${API_URL + COMPLAINTS}?${params}`} pageEndPoint="/complaints" role="complaints" Table={ComplaintsTable} />
    </div>
  )
}
