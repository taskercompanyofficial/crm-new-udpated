import React, { Suspense } from "react";
import ChartsByStatus from "./charts-by-status";
import { API_URL } from "@/lib/apiEndPoints";
import OtherStatusComplaints from "./other-status-complaints";
import { Card } from "@/components/ui/card";
import { fetchData } from "@/hooks/fetchData";
import { AttendanceStatus } from "../Attendance-status";
import ComplaintsByBrand from "./complaints-by-brand-chart";

export default async function OverviewTab() {
  let complaintStatusData, complaintStatusForBar, complaintStatusByBrands;

  try {
    complaintStatusData = await fetchData({
      endPoint: API_URL + "/crm/dashboard-chart-data",
    });
  } catch (error) {
    console.error("Error fetching complaint status data:", error);
    complaintStatusData = { data: [] }; // Fallback to empty data
  }

  try {
    complaintStatusForBar = await fetchData({
      endPoint: API_URL + "/crm/dashboard-status-data",
    });
  } catch (error) {
    console.error("Error fetching complaint status for bar chart:", error);
    complaintStatusForBar = { data: [] }; // Fallback to empty data
  }

  try {
    complaintStatusByBrands = await fetchData({
      endPoint: API_URL + "/crm/dashboard-complaints-by-brand",
    });
  } catch (error) {
    console.error("Error fetching complaint status by brands:", error);
    complaintStatusByBrands = { data: [] }; // Fallback to empty data
  }

  return (
    <div className="space-y-8 antialiased">
      <ChartsByStatus complaintStatusData={complaintStatusData.data} />
      <div className="grid grid-cols-5 gap-4">
        <div className="col-span-3">
          <OtherStatusComplaints data={complaintStatusForBar.data} />
        </div>
        <div className="col-span-2">
          <AttendanceStatus />
        </div>
      </div>
      <ComplaintsByBrand data={complaintStatusByBrands?.data} />
    </div>
  );
}
