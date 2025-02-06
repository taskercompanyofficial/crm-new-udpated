import { buildQueryParams } from "@/actions/get-url-params";
import { PageHeader } from "@/components/custom/page-header";
import DataFetcher from "@/components/table/DataFetcher";
import ComplaintsTable from "@/components/tables/complaints-table";
import { API_URL, COMPLAINTS } from "@/lib/apiEndPoints";
import { getUserDetails } from "@/lib/getUserDetails";
import React from "react";

export default async function page({ searchParams }: { searchParams: any }) {
  const { userDetails } = await getUserDetails();
  const params = buildQueryParams({
    q: searchParams?.q,
    status: searchParams.status,
    brand_id: searchParams.brand_id,
    filters: searchParams.filters,
    logic: searchParams.logic,
    sort: searchParams.sort,
    page: searchParams.page,
    per_page: searchParams.per_page,
  });
  return (
    <div className="space-y-2">
      <PageHeader />
      <DataFetcher
        role={userDetails?.role || "user"}
        endPoint={`${API_URL + COMPLAINTS}?${params}`}
        pageEndPoint="/complaints"
        Table={ComplaintsTable}
      />
    </div>
  );
}
