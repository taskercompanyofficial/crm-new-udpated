"use client";

import { ScrollArea } from "@/components/ui/scroll-area";
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
import { Clock, ArrowUpRight, FileText, AlertCircle, Edit } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Badge } from "@/components/ui/badge";

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

interface ComplaintData {
  id: number;
  complain_num: string;
  applicant_name: string;
  applicant_phone: string;
  applicant_adress: string;
  description: string;
  product: string;
  status: string;
  priority: string;
  complaint_type: string;
  working_details: string;
  [key: string]: any;
}

export default function History({
  id,
  token,
}: {
  id?: number;
  token: string;
}) {
  const { data: historyData, error, isLoading } = useFetch<ComplaintHistoryEntry[]>(
    `${API_URL}/crm/complaint-history/${id}`,
    token
  );

  const getEventType = (description: string) => {
    if (description.includes("status changed")) {
      return "Status Change";
    } else if (description.includes("Priority changed")) {
      return "Priority Change";
    } else if (description.includes("Serial number")) {
      return "Serial Number Update";
    } else if (description.includes("no field changes")) {
      return "Review";
    } else {
      return "Update";
    }
  };

  const getIcon = (description: string) => {
    if (description.includes("status")) {
      return <ArrowUpRight className="w-4 h-4 text-blue-500" />;
    } else if (description.includes("Priority")) {
      return <AlertCircle className="w-4 h-4 text-orange-500" />;
    } else if (description.includes("Serial")) {
      return <Edit className="w-4 h-4 text-purple-500" />;
    } else if (description.includes("no field changes")) {
      return <Clock className="w-4 h-4 text-gray-500" />;
    } else {
      return <FileText className="w-4 h-4 text-green-500" />;
    }
  };

  const truncateText = (text: string, limit: number) => {
    const words = text.split(" ");
    if (words.length > limit) {
      return words.slice(0, limit).join(" ") + "...";
    }
    return text;
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleString('en-US', {
      month: 'numeric',
      day: 'numeric',
      year: 'numeric',
      hour: 'numeric',
      minute: 'numeric',
      hour12: true
    });
  };

  if (error) {
    return <div>Error loading history</div>;
  }

  return (
    <ScrollArea className="h-[500px]">
      <Table>
        <TableHead>
          <TableRow>
            <TableHeader>Event</TableHeader>
            <TableHeader>User</TableHeader>
            <TableHeader>Description</TableHeader>
            <TableHeader>Actions</TableHeader>
            <TableHeader>Timestamp</TableHeader>
          </TableRow>
        </TableHead>
        <TableBody>
          {isLoading && (
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
          )}

          {!isLoading && historyData?.length === 0 && (
            <TableRow>
              <TableCell colSpan={5} className="text-center text-sm text-muted-foreground">
                No history found for this complaint.
              </TableCell>
            </TableRow>
          )}

          {!isLoading && historyData && historyData?.length > 0 &&
            historyData.map((entry) => (
              <TableRow key={entry.id}>
                <TableCell>
                  <div className="flex items-center gap-2">
                    {getIcon(entry.description)}
                    <span className="text-xs font-medium">{getEventType(entry.description)}</span>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 rounded-full bg-blue-100 flex items-center justify-center">
                      <span className="text-xs font-medium text-blue-600">
                        {entry.user.full_name.charAt(0)}
                      </span>
                    </div>
                    <span className="text-xs font-medium">{entry.user.full_name}</span>
                  </div>
                </TableCell>
                <TableCell className="max-w-[200px] text-xs">
                  {entry.description.includes(":") 
                    ? entry.description
                    : truncateText(entry.description, 20)}
                </TableCell>
                <TableCell>
                  <ComplaintDetails entry={entry} />
                </TableCell>
                <TableCell className="text-xs whitespace-nowrap text-muted-foreground">
                  {formatDate(entry.created_at)}
                </TableCell>
              </TableRow>
            ))}
        </TableBody>
      </Table>
    </ScrollArea>
  );
}

const ComplaintDetails = ({ entry }: { entry: ComplaintHistoryEntry }) => {
  const complaintData: ComplaintData = JSON.parse(entry.data);
  
  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="outline" size="sm" className="text-xs">
          View Details
        </Button>
      </SheetTrigger>
      <SheetContent className="overflow-y-auto">
        <SheetHeader>
          <SheetTitle>Complaint Details</SheetTitle>
          <SheetDescription>
            Complaint #{complaintData.complain_num} - {formatTimestamp(entry.created_at)}
          </SheetDescription>
        </SheetHeader>
        <div className="mt-6 space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="text-sm font-medium">Complaint Status</h3>
            <Badge variant={getBadgeVariant(complaintData.status)}>
              {complaintData.status}
            </Badge>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div>
              <h3 className="text-sm font-medium">Applicant Details</h3>
              <div className="text-sm mt-2 space-y-1">
                <p><span className="text-muted-foreground">Name:</span> {complaintData.applicant_name}</p>
                <p><span className="text-muted-foreground">Phone:</span> {complaintData.applicant_phone}</p>
                <p><span className="text-muted-foreground">Address:</span> {complaintData.applicant_adress}</p>
              </div>
            </div>
            
            <div>
              <h3 className="text-sm font-medium">Complaint Details</h3>
              <div className="text-sm mt-2 space-y-1">
                <p><span className="text-muted-foreground">Product:</span> {complaintData.product}</p>
                <p><span className="text-muted-foreground">Type:</span> {complaintData.complaint_type}</p>
                <p><span className="text-muted-foreground">Priority:</span> {complaintData.priority}</p>
              </div>
            </div>
          </div>
          
          <div>
            <h3 className="text-sm font-medium">Description</h3>
            <p className="text-sm mt-2">{complaintData.description}</p>
          </div>
          
          <div>
            <h3 className="text-sm font-medium">Working Details</h3>
            <p className="text-sm mt-2">{complaintData.working_details}</p>
          </div>
          
          <div>
            <h3 className="text-sm font-medium">Change History</h3>
            <div className="text-sm mt-2">
              <p>{entry.description}</p>
            </div>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
};

const formatTimestamp = (timestamp: string) => {
  const date = new Date(timestamp);
  return date.toLocaleString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: 'numeric',
    minute: 'numeric',
    hour12: true
  });
};

const getBadgeVariant = (status: string) => {
  switch (status.toLowerCase()) {
    case 'open':
      return 'default';
    case 'in progress':
      return 'secondary';
    case 'resolved':
      return 'success';
    case 'closed':
      return 'outline';
    default:
      return 'default';
  }
};