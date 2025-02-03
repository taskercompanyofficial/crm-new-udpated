import React from "react";
import OverviewTab from "@/components/dashboard/overview/overview-tab";
import { PageHeader } from "@/components/custom/page-header";

export default function DashboardPage() {
  return (
    <div className="space-y-8 antialiased">
      <PageHeader />
      <OverviewTab />
      
    </div>
  );
}
