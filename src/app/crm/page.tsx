import React from "react";
import OverviewTab from "@/components/dashboard/overview/overview-tab";

export default function DashboardPage() {
  return (
    <div className="space-y-8 antialiased">
      <div className="">
        <h1 className="text-2xl font-bold">Dashboard</h1>
        <p className="text-sm text-gray-500">
          Welcome to the dashboard. Here you can view the status of your
          complaints and see the latest complaints.
        </p>
      </div>
      <OverviewTab />
    </div>
  );
}
