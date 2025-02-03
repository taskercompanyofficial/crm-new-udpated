"use client";
import { usePathname } from "next/navigation";
import { DateRangePicker } from "./date-range-picker";

export function PageHeader() {
  const pathname = usePathname();
  return (
    <div className="flex items-center justify-between">
      <div className="">
        <h1 className="text-2xl font-bold">Dashboard</h1>
        <p className="text-sm text-gray-500">
          Welcome to the dashboard. Here you can view the status of your
          complaints and see the latest complaints.
        </p>
      </div>
      <DateRangePicker />
    </div>
  );
}
