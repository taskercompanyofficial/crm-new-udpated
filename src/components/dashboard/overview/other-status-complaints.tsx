"use client";
import React, { Suspense } from "react";
import {
  TrendingUp,
  BarChart2,
} from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { Skeleton } from "@/components/ui/skeleton";
import { ComplaintStatusOptions } from "@/lib/otpions";
import {
  Bar,
  BarChart,
  CartesianGrid,
  LabelList,
  XAxis,
  YAxis,
} from "recharts";
import { useRouter } from "next/navigation";
import ErrorNoData from "@/components/custom/no-data";

function LoadingSkeleton() {
  return (
    <Card className="col-span-4 border-0 shadow-sm">
      <CardHeader className="pb-2">
        <div className="flex items-center gap-2">
          <BarChart2 className="h-4 w-4" />
          <CardTitle className="text-sm font-medium text-muted-foreground">
            Complaints by Status
          </CardTitle>
        </div>
      </CardHeader>
      <CardContent>
        <Skeleton className="h-[200px] w-full" />
      </CardContent>
    </Card>
  );
}

function ChartContent({ data }: { data: Record<string, { count: number }> }) {
  const router = useRouter();

  const statusColors = Object.fromEntries(
    ComplaintStatusOptions.map((option) => [
      option.value,
      `rgba(${option.color}, 0.8)`,
    ]),
  );

  const chartData = data
    ? Object.entries(data)
        .map(([status, details]) => ({
          status,
          statusLabel:
            ComplaintStatusOptions.find((opt) => opt.value === status)?.label ||
            status,
          count: details?.count || 0,
          fill: statusColors[status] || "rgba(180, 180, 180, 0.8)",
        }))
        .sort((a, b) => b.count - a.count)
    : [];

  const chartConfig = {
    count: {
      label: "Number of Complaints",
      color: "hsl(var(--chart-1))",
    },
  } satisfies ChartConfig;

  const totalComplaints = chartData.reduce((sum, item) => sum + item.count, 0);

  // Handle navigation for any chart element click
  const handleStatusClick = (status: string) => {
    if (status) {
      router.push(`/crm/complaints?status=${status}`);
    }
  };

  // Custom click handler for XAxis ticks
  const handleXAxisClick = (event: any) => {
    // The event payload from recharts doesn't directly contain the status
    // We need to find which tick was clicked and map it to our data
    if (event && event.value) {
      const clickedItem = chartData.find(item => 
        item.statusLabel === event.value || 
        item.statusLabel.split(" ").map((word: string) => word[0]).join("") === event.value
      );
      
      if (clickedItem) {
        handleStatusClick(clickedItem.status);
      }
    }
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-2">
          <BarChart2 className="h-5 w-5" />
          <CardTitle>Complaints by Status</CardTitle>
        </div>
        <CardDescription>
          Total complaints: {totalComplaints.toLocaleString()}
        </CardDescription>
      </CardHeader>
      <CardContent className="h-[200px]">
        <ChartContainer config={chartConfig} className="h-[200px] w-full">
          <BarChart 
            accessibilityLayer 
            data={chartData} 
            margin={{ left: 2 }}
          >
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="statusLabel"
              tickLine={false}
              axisLine={false}
              interval={0}
              className="uppercase cursor-pointer"
              tickFormatter={(value) => {
                return value
                  .split(" ")
                  .map((word: string) => word[0])
                  .join("");
              }}
              onClick={(data) => {
                // Using the custom handler for XAxis clicks
                handleXAxisClick(data);
              }}
            />
            <YAxis
              tickLine={false}
              axisLine={false}
              tickFormatter={(value) => value.toLocaleString()}
              fontSize={11}
              fill="#888"
            />
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent indicator="dashed" />}
            />
            <Bar
              dataKey="count"
              fill="var(--color-count)"
              radius={[4, 4, 0, 0]}
              barSize={24}
              onClick={(data) => {
                if (data && data.status) {
                  handleStatusClick(data.status);
                }
              }}
              className="cursor-pointer hover:opacity-80 transition-opacity duration-300"
            >
              <LabelList
                position="top"
                offset={12}
                className="fill-foreground"
                fontSize={12}
                formatter={(value: number) => value.toLocaleString()}
              />
            </Bar>
          </BarChart>
        </ChartContainer>
      </CardContent>
      <CardFooter className="flex-col items-start gap-2 text-sm">
        <div className="flex gap-2 font-medium leading-none">
          Current month complaints overview <TrendingUp className="h-4 w-4" />
        </div>
        <div className="leading-none text-muted-foreground">
          Showing total complaints by their current status
        </div>
      </CardFooter>
    </Card>
  );
}

export default function OtherStatusComplaints({
  data,
}: {
  data: Record<string, { count: number }>;
}) {
  if (!data || Object.keys(data).length === 0) {
    return <ErrorNoData />;
  }
  return (
    <Suspense fallback={<LoadingSkeleton />}>
      <ChartContent data={data} />
    </Suspense>
  );
}
