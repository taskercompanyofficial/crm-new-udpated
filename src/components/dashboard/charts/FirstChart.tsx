import React, { Suspense } from "react";
import { Card, CardContent, CardTitle, CardHeader } from "@/components/ui/card";
import { ClipboardList, Code, XCircle, AlertTriangle } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

// Define types for the status configuration
type StatusConfigType = {
  [key: string]: { icon: JSX.Element; description: string; bgColor: string };
};

type ComplaintData = {
  status: string;
  count: number;
};

const statusConfig: StatusConfigType = {
  open: {
    icon: <Code className="h-4 w-4" />,
    description: "Complaints currently open and unresolved.",
    bgColor: "bg-blue-100",
  },
  closed: {
    icon: <XCircle className="h-4 w-4" />,
    description: "Complaints resolved and closed.",
    bgColor: "bg-green-100",
  },
  cancelled: {
    icon: <AlertTriangle className="h-4 w-4" />,
    description: "Complaints canceled by users or admins.",
    bgColor: "bg-yellow-100",
  },
  total: {
    icon: <ClipboardList className="h-4 w-4" />,
    description: "Total complaints created or updated in the range.",
    bgColor: "bg-gray-100",
  },
};

// Skeleton loader component

// Chart component
function ComplaintsChart({
  complaintsInRange,
}: {
  complaintsInRange: ComplaintData[];
}) {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {complaintsInRange.map((item) => (
        <Card key={item.status} className={statusConfig[item.status]?.bgColor} >
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              {item.status.charAt(0).toUpperCase() + item.status.slice(1)}{" "}
              Complaints
            </CardTitle>
            {statusConfig[item.status]?.icon || null}
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{item.count}</div>
            <p className="text-xs text-muted-foreground">
              {statusConfig[item.status]?.description ||
                "No description available."}
            </p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

// Wrapper component using Suspense
export default function FirstChart({ data }: { data: any }) {
  return (
    <Suspense
      fallback={
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Skeleton className="h-[200px] w-full" />
          <Skeleton className="h-[200px] w-full" />
          <Skeleton className="h-[200px] w-full" />
          <Skeleton className="h-[200px] w-full" />
        </div>
      }
    >
      <ComplaintsChart complaintsInRange={data.complaints_in_range || []} />
    </Suspense>
  );
}
