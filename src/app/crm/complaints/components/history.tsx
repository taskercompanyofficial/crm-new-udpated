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
import useFetch from "@/hooks/usefetch";
import { API_URL } from "@/lib/apiEndPoints";
import { Clock, ArrowUpRight, ArrowDownRight, FileText } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ComplaintHistoryEntry {
  id: number;
  complaint_id: number;
  user_id: number;
  description: string;
  data: string;
  created_at: string;
  updated_at: string;
  user: {
    id: number;
    full_name: string;
    username: string;
    role: string;
    [key: string]: any;
  };
}

export default function History({ id, token }: { id?: number; token: string }) {
  const { data: historyData, error, isLoading } = useFetch<ComplaintHistoryEntry[]>(
    `${API_URL}/crm/complaint-history/${id}`,
    token,
  );

  const getIcon = (description: string) => {
    if (description.includes("status")) {
      return <ArrowUpRight className="w-4 h-4 text-blue-500" />;
    } else if (description.includes("remark")) {
      return <Clock className="w-4 h-4 text-green-500" />;
    } else if (description.includes("file")) {
      return <ArrowDownRight className="w-4 h-4 text-purple-500" />;
    } else {
      return <FileText className="w-4 h-4 text-orange-500" />;
    }
  };

  const truncateText = (text: string, limit: number) => {
    const words = text.split(' ');
    if (words.length > limit) {
      return words.slice(0, limit).join(' ') + '...';
    }
    return text;
  };

  if (error) {
    return <div>Error loading history</div>;
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold">Complaint History</h2>
        <span className="text-sm text-muted-foreground">
          {isLoading ? "-" : historyData?.length || 0} events
        </span>
      </div>

      <Separator />

      <ScrollArea className="h-[500px]">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Event</TableHead>
              <TableHead>User</TableHead>
              <TableHead>Description</TableHead>
              <TableHead>Actions</TableHead>
              <TableHead>Timestamp</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              // Loading skeleton rows
              [...Array(5)].map((_, i) => (
                <TableRow key={i}>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 bg-gray-200 rounded animate-pulse" />
                      <div className="w-16 h-3 bg-gray-200 rounded animate-pulse" />
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="w-24 h-3 bg-gray-200 rounded animate-pulse" />
                  </TableCell>
                  <TableCell>
                    <div className="w-32 h-3 bg-gray-200 rounded animate-pulse" />
                  </TableCell>
                  <TableCell>
                    <div className="w-20 h-6 bg-gray-200 rounded animate-pulse" />
                  </TableCell>
                  <TableCell>
                    <div className="h-3 bg-gray-200 rounded w-28 animate-pulse" />
                  </TableCell>
                </TableRow>
              ))
            ) : (
              historyData?.map((entry) => (
                <TableRow key={entry.id}>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      {getIcon(entry.description)}
                      <span className="text-xs">{entry.description.split(":")[0]}</span>
                    </div>
                  </TableCell>
                  <TableCell className="text-xs font-medium">{entry.user.full_name}</TableCell>
                  <TableCell className="max-w-[200px] text-xs">
                    {truncateText(entry.description, 20)}
                  </TableCell>
                  <TableCell>
                    <Button variant="outline" size="sm" className="text-xs">
                      See Details
                    </Button>
                  </TableCell>
                  <TableCell className="text-xs whitespace-nowrap text-muted-foreground">
                    {new Date(entry.created_at).toLocaleString()}
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </ScrollArea>

      {/* History explanation */}
      <div className="p-4 mt-4 rounded-lg bg-slate-50 dark:bg-slate-900">
        <h3 className="mb-2 font-semibold">History Tracking:</h3>
        <ol className="pl-4 text-sm list-decimal text-muted-foreground">
          <li>Automatically tracks all important changes and events</li>
          <li>Records status changes, edits, remarks, and file uploads</li>
          <li>Shows detailed field-level changes with before/after values</li>
          <li>Maintains complete audit trail with timestamps</li>
          <li>
            Helps monitor complaint progression and modifications over time
          </li>
        </ol>
      </div>
    </div>
  );
}
