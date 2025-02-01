import { buildQueryParams } from '@/actions/get-url-params'
import DataFetcher from '@/components/table/DataFetcher'
import ComplaintsTable from '@/components/tables/complaints-table'
import { API_URL, COMPLAINTS } from '@/lib/apiEndPoints'
import { getUserDetails } from '@/lib/getUserDetails'
import React from 'react'

export default async function page({searchParams}:{searchParams:any}) {
const {userDetails} = await getUserDetails();
  const params = buildQueryParams(
  {
    q:searchParams?.q,
    status:searchParams.status,
    brand_id:searchParams.brand_id
  }
)
  return (
    <div className="">
      <DataFetcher role={userDetails?.role || "user"} endPoint={`${API_URL + COMPLAINTS}?${params}`} pageEndPoint="/complaints" Table={ComplaintsTable} />
    </div>
  )
}
