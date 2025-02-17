import { buildQueryParams } from "@/actions/get-url-params";
import DataFetcher from "@/components/table/DataFetcher";
import StaffTable from "@/components/tables/staff-table";
import { API_URL, WORKERS } from "@/lib/apiEndPoints";
import { getUserDetails } from "@/lib/getUserDetails";
import React from "react";

export default async function page({ searchParams }: { searchParams: any }) {
  const { userDetails } = await getUserDetails();
  const params = buildQueryParams({
    q: searchParams?.q,
    status: searchParams.status,
    brand_id: searchParams.brand_id,
  });
  return (
    <div className="space-y-2">s
      <DataFetcher
        role={userDetails?.role || "user"}
        endPoint={`${API_URL + WORKERS}?${params}`}
        pageEndPoint="/complaints"
        Table={StaffTable}
      />
    </div>
  );
}
