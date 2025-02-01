"use client";

import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Clock, ArrowUpRight, ArrowDownRight, FileText } from "lucide-react";

interface HistoryEntry {
  id: string;
  type: "status_change" | "remark_added" | "file_uploaded" | "edit_made";
  description: string;
  timestamp: string;
  user: string;
  details?: string;
  changes?: {
    field: string;
    from: string;
    to: string;
  }[];
}

export default function History() {
  // This would normally come from an API
  const dummyHistory: HistoryEntry[] = [
    {
      id: "1", 
      type: "status_change",
      description: "Status changed from 'Pending' to 'In Progress'",
      timestamp: "2024-02-15 10:30 AM",
      user: "John Smith",
      details: "Technician assigned"
    },
    {
      id: "2",
      type: "edit_made",
      description: "Complaint details updated",
      timestamp: "2024-02-15 11:00 AM", 
      user: "John Smith",
      changes: [
        {
          field: "description",
          from: "Device not working",
          to: "Device not powering on"
        },
        {
          field: "technician",
          from: "Unassigned",
          to: "Mike Wilson"
        }
      ]
    },
    {
      id: "3",
      type: "remark_added",
      description: "New remark added",
      timestamp: "2024-02-15 11:45 AM",
      user: "Sarah Johnson",
      details: "Initial diagnosis complete. Parts ordered."
    },
    {
      id: "4",
      type: "file_uploaded",
      description: "Diagnostic report uploaded",
      timestamp: "2024-02-15 02:15 PM",
      user: "Mike Wilson",
      details: "diagnostic_report_15022024.pdf"
    }
  ];

  const getIcon = (type: HistoryEntry["type"]) => {
    switch (type) {
      case "status_change":
        return <ArrowUpRight className="h-4 w-4 text-blue-500" />;
      case "remark_added":
        return <Clock className="h-4 w-4 text-green-500" />;
      case "file_uploaded":
        return <ArrowDownRight className="h-4 w-4 text-purple-500" />;
      case "edit_made":
        return <FileText className="h-4 w-4 text-orange-500" />;
    }
  };

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold">Complaint History</h2>
        <span className="text-sm text-muted-foreground">
          {dummyHistory.length} events
        </span>
      </div>

      <Separator />

      <ScrollArea className="h-[500px]">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Event</TableHead>
              <TableHead>User</TableHead>
              <TableHead>Details</TableHead>
              <TableHead>Timestamp</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {dummyHistory.map((entry) => (
              <TableRow key={entry.id}>
                <TableCell>
                  <div className="flex items-center gap-2">
                    {getIcon(entry.type)}
                    <span>{entry.description}</span>
                  </div>
                </TableCell>
                <TableCell className="font-medium">{entry.user}</TableCell>
                <TableCell className="max-w-[300px]">
                  {entry.changes ? (
                    <div className="space-y-1">
                      {entry.changes.map((change, idx) => (
                        <div key={idx} className="text-sm">
                          <span className="font-medium">{change.field}:</span>{" "}
                          <span className="text-red-500 line-through">{change.from}</span>{" "}
                          <span className="text-green-500">{change.to}</span>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <span className="truncate">{entry.details}</span>
                  )}
                </TableCell>
                <TableCell className="text-muted-foreground whitespace-nowrap">
                  {entry.timestamp}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </ScrollArea>

      {/* History explanation */}
      <div className="mt-4 rounded-lg bg-slate-50 p-4 dark:bg-slate-900">
        <h3 className="mb-2 font-semibold">History Tracking:</h3>
        <ol className="list-decimal pl-4 text-sm text-muted-foreground">
          <li>Automatically tracks all important changes and events</li>
          <li>Records status changes, edits, remarks, and file uploads</li>
          <li>Shows detailed field-level changes with before/after values</li>
          <li>Maintains complete audit trail with timestamps</li>
          <li>Helps monitor complaint progression and modifications over time</li>
        </ol>
      </div>
    </div>
  );
}
