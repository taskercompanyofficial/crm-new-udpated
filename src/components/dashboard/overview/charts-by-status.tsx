"use client";
import { Suspense } from "react";
import { 
  CheckCircle, 
  XCircle, 
  AlertCircle, 
  FileText, 
  ArrowUp, 
  ArrowDown, 
  Minus,
  Clock
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Empty } from "antd";
import { Badge } from "@/components/ui/badge";

interface StatusData {
  count: number;
  trend?: string;
  data?: any[];
}

interface ComplaintStatusData {
  open_and_pending: {
    opened: StatusData;
    "in-progress": StatusData;
  };
  others: {
    closed: StatusData;
    rejected: StatusData;
    total: StatusData;
  };
}

interface ComplaintStatusProps {
  complaintStatusData?: ComplaintStatusData;
}

function LoadingSkeleton() {
  return (
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
      {[...Array(4)].map((_, index) => (
        <Card key={index} className="rounded-xl shadow-lg">
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <Skeleton className="h-4 w-[140px]" />
              <Skeleton className="h-5 w-5 rounded-full" />
            </div>
          </CardHeader>
          <CardContent>
            <Skeleton className="mb-4 h-8 w-20" />
            <Skeleton className="h-[50px] w-full" />
          </CardContent>
          <CardFooter>
            <Skeleton className="h-4 w-32" />
          </CardFooter>
        </Card>
      ))}
    </div>
  );
}

function NoDataDisplay() {
  return (
    <Card className="col-span-full p-6">
      <div className="flex flex-col items-center justify-center text-center">
        <Empty
          image={Empty.PRESENTED_IMAGE_SIMPLE}
          description={
            <div>
              <h3 className="mt-4 text-lg font-semibold text-gray-900">No Complaint Data Available</h3>
              <p className="mt-2 text-sm text-gray-600">There are currently no complaints recorded in the system.</p>
            </div>
          }
        />
      </div>
    </Card>
  );
}

function getTrendIcon(trend: string) {
  if (!trend) return <Minus className="h-4 w-4" />;
  
  const value = parseFloat(trend);
  if (value > 0) return <ArrowUp className="h-4 w-4 text-red-500" />;
  if (value < 0) return <ArrowDown className="h-4 w-4 text-green-500" />;
  return <Minus className="h-4 w-4 text-gray-400" />;
}

function getTrendText(trend: string) {
  if (!trend) return "No change";
  
  const value = parseFloat(trend);
  if (value === 0) return "No change";
  
  const absValue = Math.abs(value);
  if (value > 0) return `${absValue}% increase`;
  return `${absValue}% decrease`;
}

function StatusContent({ complaintStatusData }: ComplaintStatusProps) {
  const router = useRouter();

  if (!complaintStatusData || Object.keys(complaintStatusData).length === 0) {
    return (
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        <NoDataDisplay />
      </div>
    );
  }

  const today = new Date();
  const todayStr = today.toISOString().split("T")[0];
  
  const items = [
    {
      title: "Active Complaints",
      icon: <AlertCircle className="h-5 w-5 text-amber-500" />,
      data: {
        count:
          (complaintStatusData?.open_and_pending.opened.count || 0) +
          (complaintStatusData?.open_and_pending["in-progress"].count || 0),
        trend: "0%",
      },
      status: "active",
      color: {
        text: "text-amber-600",
        bg: "bg-amber-50",
        border: "border-amber-200",
      },
      tooltip: "Open and in-progress complaints",
      details: {
        open: complaintStatusData?.open_and_pending.opened.count || 0,
        inProgress:
          complaintStatusData?.open_and_pending["in-progress"].count || 0,
      },
      queryUrl: `/crm/complaints?filters=[{"id":"status","condition":"in","value":"open.in-progress"},{"id":"updated_at","condition":"like","value":"${todayStr}"}]`,
    },
    {
      title: "Closed Complaints",
      icon: <CheckCircle className="h-5 w-5 text-emerald-600" />,
      data: complaintStatusData?.others.closed,
      status: "closed",
      color: {
        text: "text-emerald-600",
        bg: "bg-emerald-50",
        border: "border-emerald-200",
      },
      tooltip: "Successfully resolved complaints",
      queryUrl: `/crm/complaints?filters=[{"id":"status","condition":"in","value":"open.closed.amount-pending.feedback-pending.completed.pending-by-brand"},{"id":"updated_at","condition":"like","value":"${todayStr}"}]`,
    },
    {
      title: "Rejected Complaints",
      icon: <XCircle className="h-5 w-5 text-red-600" />,
      data: complaintStatusData?.others.rejected,
      status: "cancelled",
      color: {
        text: "text-red-600",
        bg: "bg-red-50",
        border: "border-red-200",
      },
      tooltip: "Complaints marked as invalid or rejected",
      queryUrl: `/crm/complaints?filters=[{"id":"status","condition":"in","value":"cancelled"},{"id":"updated_at","condition":"like","value":"${todayStr}"}]`,
    },
    {
      title: "Total Complaints",
      icon: <FileText className="h-5 w-5 text-blue-600" />,
      data: complaintStatusData?.others.total,
      status: "all",
      color: {
        text: "text-blue-600",
        bg: "bg-blue-50",
        border: "border-blue-200",
      },
      tooltip: "Total number of complaints received",
      queryUrl: `/crm/complaints?filters=[{"id":"created_at","condition":"like","value":"${todayStr}"}]`,
    },
  ];

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {items.map((item, index) => (
        <Card
          key={index}
          className={`group relative cursor-pointer overflow-hidden rounded-xl shadow-md transition-all duration-300 hover:shadow-lg ${item.color.border}`}
          onClick={() => window.open(item.queryUrl, '_blank')}
        >
          <div className={`absolute top-0 h-1 w-full ${item.color.bg}`} />
          
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <CardTitle className="group/tooltip relative text-sm font-medium text-gray-800 transition-colors duration-200 group-hover:text-gray-900">
                {item.title}
                <span className="absolute -top-2 left-0 z-50 w-max rounded bg-gray-800 px-2 py-1 text-xs text-white opacity-0 transition-opacity group-hover/tooltip:opacity-100">
                  {item.tooltip}
                </span>
              </CardTitle>
              <Badge className={`${item.color.bg} ${item.color.text}`}>
                {item.icon}
              </Badge>
            </div>
          </CardHeader>

          <CardContent>
            <div className="flex items-end justify-between">
              <div>
                <div className={`text-3xl font-bold ${item.color.text} transition-all duration-300 group-hover:scale-105`}>
                  {(item.data?.count || 0) > 0 ? item.data?.count : 0}
                </div>
                
                {item.details && item.data?.count > 0 && (
                  <div className="mt-2 flex flex-col gap-1 text-xs text-gray-500">
                    <div className="flex items-center gap-2">
                      <div className="flex h-2 w-2 rounded-full bg-indigo-500"></div>
                      <Link
                        href={`/crm/complaints?filters=[{"id":"status","condition":"like","value":"open"},{"id":"created_at","condition":"like","value":"${todayStr}"}]`}
                        className="text-indigo-600"
                        onClick={(e) => e.stopPropagation()}
                      >
                        {item.details.open} open
                      </Link>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="h-2 w-2 rounded-full bg-amber-500"></div>
                      <Link
                        href={`/crm/complaints?filters=[{"id":"status","condition":"not in","value":"open.closed.amount-pending.feedback-pending.cancelled.completed.pending-by-brand"},{"id":"created_at","condition":"like","value":"${todayStr}"}]`}
                        className="text-amber-600"
                        onClick={(e) => e.stopPropagation()}
                      >
                        {item.details.inProgress} in progress
                      </Link>
                    </div>
                  </div>
                )}
              </div>
              
              {!item.details && (item.data?.count || 0) === 0 && (
                <div className="mt-2 scale-75">
                  <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} description="No data" />
                </div>
              )}
            </div>
          </CardContent>
          
          <CardFooter className={`flex items-center gap-2 border-t ${item.color.border} py-2 text-xs font-medium`}>
            <Clock className="h-3 w-3 text-gray-400" />
            <span className="text-gray-500">Updated today</span>
            <div className="flex-1"></div>
            <div className="flex items-center gap-1">
              {getTrendIcon(item.data?.trend || "0%")}
              <span className={item.data?.trend && parseFloat(item.data.trend) > 0 ? "text-red-500" : 
                            item.data?.trend && parseFloat(item.data.trend) < 0 ? "text-green-500" : 
                            "text-gray-400"}>
                {getTrendText(item.data?.trend || "0%")}
              </span>
            </div>
          </CardFooter>
        </Card>
      ))}
    </div>
  );
}

export default function ComplaintStatus({
  complaintStatusData,
}: ComplaintStatusProps) {
  return (
    <Suspense fallback={<LoadingSkeleton />}>
      <StatusContent complaintStatusData={complaintStatusData} />
    </Suspense>
  );
}