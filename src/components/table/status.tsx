import { ComplaintStatusOptions, StatusOptions } from "@/lib/otpions";
import React from "react";

export default function Status({ status }: { status: string }) {
  const attendanceOptions = [
    {
      value: "checked_in",
      label: "Checked In",
      color: "46, 204, 113",
    },
    {
      value: "checked_out",
      label: "Checked Out",
      color: "52, 152, 219",
    },
    {
      value: "absent",
      label: "Absent",
      color: "234, 84, 85",
    },
  ];

  // Try to find status in attendance options first, then complaint options
  const statusOption =
    attendanceOptions.find((option) => option.value === status) ||
    ComplaintStatusOptions.find((option) => option.value === status) ||
    StatusOptions.find((option) => option.value === status) ||
    attendanceOptions[0]; // Fallback to first attendance option if not found

  return (
    <div
      className="rounded px-2 py-0.5 text-xs text-white shadow"
      style={{ backgroundColor: `rgb(${statusOption.color})` }}
    >
      {statusOption.label}
    </div>
  );
}
