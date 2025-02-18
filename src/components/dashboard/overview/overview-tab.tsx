import React, { Suspense } from "react";
import ChartsByStatus from "./charts-by-status";
import { API_URL } from "@/lib/apiEndPoints";
import OtherStatusComplaints from "./other-status-complaints";
import { fetchData } from "@/hooks/fetchData";
import { AttendanceStatus } from "../Attendance-status";
import ComplaintsByBrand from "./complaints-by-brand-chart";
import { getUserDetails } from "@/lib/getUserDetails";
import Announcement from "../Accouncment";

export default async function OverviewTab() {
  const { userDetails } = await getUserDetails();
  const complaintStatusData = await fetchData({
    endPoint: API_URL + "/crm/dashboard-chart-data",
  });
  const complaintStatusForBar = await fetchData({
    endPoint: API_URL + "/crm/dashboard-status-data",
  });
  const complaintStatusByBrands = await fetchData({
    endPoint: API_URL + "/crm/dashboard-complaints-by-brand",
  });
  const dailyAttendanceStats = await fetchData({
    endPoint: API_URL + "/crm/daily-attendance-stats",
  });
  return (
    <div className="space-y-8 antialiased">
      <Announcement username={userDetails?.full_name} />
      <ChartsByStatus complaintStatusData={complaintStatusData.data} />

      <OtherStatusComplaints data={complaintStatusForBar.data} />
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-5">
        <div className="col-span-3">
          <ComplaintsByBrand data={complaintStatusByBrands?.data} />
        </div>
        <div className="col-span-2">
          <AttendanceStatus data={dailyAttendanceStats.data} />
        </div>
      </div>
    </div>
  );
}
