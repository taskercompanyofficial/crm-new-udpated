"use client";
import React, { Suspense } from "react";
import {
  AreaChart,
  Area,
  Tooltip as ReTooltip,
  ResponsiveContainer,
} from "recharts";
import { CheckCircle, XCircle, AlertCircle, BarChart2 } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useRouter } from "next/navigation";
import Link from "next/link";

interface ChartData {
  date: string;
  count: number;
}

interface StatusData {
  count: number;
  trend?: string;
  data?: ChartData[];
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

interface ChartsByStatusProps {
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
            <Skeleton className="mt-2 h-4 w-32" />
            <Skeleton className="mt-3 h-1 w-full" />
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

function ChartContent({ complaintStatusData }: ChartsByStatusProps) {
  const router = useRouter();

  const items = [
    {
      title: "Active Complaints",
      icon: (
        <div className="flex gap-2">
          <CheckCircle className="h-5 w-5 text-indigo-600" />
          <AlertCircle className="h-5 w-5 text-amber-600" />
        </div>
      ),
      data: {
        count:
          (complaintStatusData?.open_and_pending.opened.count || 0) +
          (complaintStatusData?.open_and_pending["in-progress"].count || 0),
        trend: complaintStatusData?.open_and_pending.opened.trend,
        data: complaintStatusData?.open_and_pending.opened.data,
      },
      status: "active",
      color: {
        text: "text-indigo-600",
        border: "rgb(99, 102, 241)",
        background: "rgba(99, 102, 241, 0.1)",
      },
      tooltip: "Open and in-progress complaints",
      details: {
        open: complaintStatusData?.open_and_pending.opened.count || 0,
        inProgress:
          complaintStatusData?.open_and_pending["in-progress"].count || 0,
      },
    },
    {
      title: "Closed Complaints",
      icon: <XCircle className="h-5 w-5 text-emerald-600" />,
      data: complaintStatusData?.others.closed,
      status: "closed",
      color: {
        text: "text-emerald-600",
        border: "rgb(34, 197, 94)",
        background: "rgba(34, 197, 94, 0.1)",
      },
      tooltip: "Successfully resolved complaints",
    },
    {
      title: "Rejected Complaints",
      icon: <AlertCircle className="h-5 w-5 text-red-600" />,
      data: complaintStatusData?.others.rejected,
      status: "cancelled",
      color: {
        text: "text-red-600",
        border: "rgb(244, 63, 94)",
        background: "rgba(244, 63, 94, 0.1)",
      },
      tooltip: "Complaints marked as invalid or rejected",
    },
    {
      title: "Total Complaints",
      icon: <BarChart2 className="h-5 w-5 text-violet-600" />,
      data: complaintStatusData?.others.total,
      status: "all",
      color: {
        text: "text-violet-600",
        border: "rgb(139, 92, 246)",
        background: "rgba(139, 92, 246, 0.1)",
      },
      tooltip: "Total number of complaints received",
    },
  ];

  return (
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
      {items.map((item, index) => (
        <Card
          key={index}
          className="group relative cursor-pointer overflow-hidden rounded-xl shadow-lg transition-all duration-300 hover:scale-105"
          onClick={() => {
            const today = new Date();
            const todayStr = today.toISOString().split("T")[0];
            if (item.status === "closed") {
              router.push(
                `/crm/complaints?filters=[{"id":"status","condition":"in","value":"open.closed.amount-pending.feedback-pending.cancelled.completed.pending-by-brand"},{"id":"created_at","condition":"like","value":"${todayStr}"}]`,
              );
            } else if (item.status === "cancelled") {
              router.push(
                `/crm/complaints?filters=[{"id":"status","condition":"in","value":"cancelled"},{"id":"created_at","condition":"like","value":"${todayStr}"}]`,
              );
            } else if (item.status === "all") {
              router.push(
                `/crm/complaints?filters=[{"id":"created_at","condition":"like","value":"${todayStr}"}]`,
              );
            }
          }}
        >
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-transparent to-white/5 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />

          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <CardTitle className="group/tooltip relative text-sm font-medium text-gray-800 transition-colors duration-200 group-hover:text-gray-900">
                {item.title}
                <span className="absolute -top-2 left-0 z-50 w-max rounded bg-gray-800 px-2 py-1 text-xs text-white opacity-0 transition-opacity group-hover/tooltip:opacity-100">
                  {item.tooltip}
                </span>
              </CardTitle>
              <div className="transform transition-transform duration-300 group-hover:rotate-12 group-hover:scale-110">
                {item.icon}
              </div>
            </div>
          </CardHeader>

          <CardContent>
            <div
              className={`text-2xl font-bold ${item.color.text} transition-all duration-300 group-hover:scale-110`}
            >
              {item.data?.count ?? 0}
              {item.details && (
                <div className="mt-1 text-xs font-normal text-gray-500">
                  <Link
                    href={`/crm/complaints?filters=[{"id":"status","condition":"like","value":"open"}]`}
                    className="text-indigo-600"
                  >
                    {item.details.open} open
                  </Link>
                  {" • "}
                  <Link
                    href={`/crm/complaints?filters=[{"id":"status","condition":"not in","value":"open.closed.amount-pending.feedback-pending.cancelled.completed.pending-by-brand"}]`}
                    className="text-amber-600"
                  >
                    {item.details.inProgress} in progress
                  </Link>
                </div>
              )}
            </div>

            <div className="mt-2 h-[50px] transition-transform duration-300 group-hover:translate-y-1">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={item.data?.data ?? []}>
                  <defs>
                    <linearGradient
                      id={`gradient-${index}`}
                      x1="0"
                      y1="0"
                      x2="0"
                      y2="1"
                    >
                      <stop
                        offset="0%"
                        stopColor={item.color.border}
                        stopOpacity={0.8}
                      />
                      <stop
                        offset="100%"
                        stopColor={item.color.border}
                        stopOpacity={0.2}
                      />
                    </linearGradient>
                  </defs>
                  <ReTooltip
                    content={({ active, payload }) => {
                      if (active && payload && payload.length) {
                        return (
                          <div className="rounded-lg border border-gray-200 bg-white/90 p-2 shadow-lg backdrop-blur-sm">
                            <p className="text-sm font-medium">{`Date: ${payload[0].payload.date}`}</p>
                            <p className="text-sm font-medium">{`Count: ${payload[0].payload.count}`}</p>
                          </div>
                        );
                      }
                      return null;
                    }}
                  />
                  <Area
                    type="monotone"
                    dataKey="count"
                    stroke={item.color.border}
                    fill={`url(#gradient-${index})`}
                    strokeWidth={2}
                    animationDuration={1000}
                    animationEasing="ease-in-out"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>

            <p
              className={`mt-2 flex items-center gap-1 text-xs font-medium ${
                (item.data?.trend ?? "").startsWith("-")
                  ? "text-red-600"
                  : "text-emerald-600"
              } transition-all duration-300 group-hover:gap-2`}
            >
              <span>{item.data?.trend ?? "0%"}</span>
              <span className="transition-transform duration-300 group-hover:translate-x-1">
                from last month
              </span>
            </p>

            <div className="mt-3 h-1 w-full rounded-full bg-gray-100">
              <div
                className="h-1 rounded-full transition-all duration-500 ease-out"
                style={{
                  width: `${((item.data?.count ?? 0) / (complaintStatusData?.others.total.count || 1)) * 100}%`,
                  backgroundColor: item.color.border,
                }}
              />
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

export default function ChartsByStatus({
  complaintStatusData,
}: ChartsByStatusProps) {
  return (
    <Suspense fallback={<LoadingSkeleton />}>
      <ChartContent complaintStatusData={complaintStatusData} />
    </Suspense>
  );
}
