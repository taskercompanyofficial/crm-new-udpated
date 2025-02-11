"use client";
import { Button } from "@/components/ui/button";
import React from "react";
import { Printer, FileDown, FileText } from "lucide-react";

interface ActionBtnsProps {
  userId: string;
  params: string;
}

export default function ActionBtns({ userId, params }: ActionBtnsProps) {
  const handlePrint = () => {
    window.print();
  };

  const handleExportPDF = async ({
    userId,
    params,
  }: {
    userId: string;
    params: string;
  }) => {
    try {
      const response = await fetch(
        `/api/crm/attendance/export-pdf/${userId}?${params}`,
      );
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "attendance-report.pdf";
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (error) {
      console.error("Error exporting PDF:", error);
    }
  };

  const handleExportCSV = async ({
    userId,
    params,
  }: {
    userId: string;
    params: string;
  }) => {
    try {
      const response = await fetch(
        `/api/crm/attendance/export-csv/${userId}?${params}`,
      );
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "attendance-report.csv";
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (error) {
      console.error("Error exporting CSV:", error);
    }
  };

  return (
    <div className="flex gap-2">
      <Button
        variant="outline"
        size="sm"
        onClick={handlePrint}
        className="flex items-center gap-2"
      >
        <Printer className="h-4 w-4" />
        Print
      </Button>
      <Button
        variant="outline"
        size="sm"
        onClick={() => handleExportPDF({ userId, params })}
        className="flex items-center gap-2"
      >
        <FileDown className="h-4 w-4" />
        Export PDF
      </Button>
      <Button
        variant="outline"
        size="sm"
        onClick={() => handleExportCSV({ userId, params })}
        className="flex items-center gap-2"
      >
        <FileText className="h-4 w-4" />
        Export CSV
      </Button>
    </div>
  );
}
