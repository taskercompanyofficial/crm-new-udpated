"use client";

import React, { Suspense } from "react";
import { TrendingUp, BarChart2, AlertCircle, RefreshCcw } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Bar,
  BarChart,
  CartesianGrid,
  XAxis,
  YAxis,
  LabelList,
  Tooltip,
  Legend,
} from "recharts";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";

type ChartConfigKey =
  | "feedback_pending"
  | "pending_by_brand"
  | "on_hold"
  | "open_count"
  | "in_progress"
  | "total";

const chartConfig: Record<ChartConfigKey, { label: string; color: string }> = {
  feedback_pending: { label: "Feedback Pending", color: "#ffcd56" },
  pending_by_brand: { label: "Pending by Brand", color: "#4bc0c0" },
  on_hold: { label: "On Hold", color: "#9966ff" },
  open_count: { label: "Open Installations", color: "#ff6384" },
  in_progress: { label: "In Progress", color: "#36a2eb" },
  total: { label: "Total", color: "#ff9f40" },
};

const brandColors = [
  "#8884d8",
  "#82ca9d",
  "#ffc658", 
  "#ff7c43",
  "#a4de6c",
  "#d0ed57",
];

function LoadingSkeleton() {
  return (
    <Card className="col-span-4 border-0 shadow-sm">
      <CardHeader className="pb-2">
        <div className="flex items-center gap-2">
          <BarChart2 className="h-4 w-4" />
          <CardTitle className="text-sm font-medium text-muted-foreground">
            Installation Status by Brand
          </CardTitle>
        </div>
      </CardHeader>
      <CardContent>
        <Skeleton className="h-[200px] w-full" />
      </CardContent>
    </Card>
  );
}

interface BrandData {
  total_open_installations: {
    count: number;
    label: string;
    color: string;
  };
  feedback_pending: {
    count: number;
    label: string;
    color: string;
  };
  pending_by_brand: {
    count: number;
    label: string;
    color: string;
  };
  on_hold: {
    count: number;
    label: string;
    color: string;
  };
  brand_data: {
    brand: string;
    brand_id: number;
    total_count: number;
    open_count: number;
    in_progress: number;
  }[];
}

function NoDataDisplay({ onRefresh }: { onRefresh: () => void }) {
  return (
    <Card>
      <CardContent className="flex h-[400px] flex-col items-center justify-center gap-4">
        <AlertCircle className="h-16 w-16 text-muted-foreground/50" />
        <div className="text-center">
          <h3 className="text-lg font-semibold">No Data Available</h3>
          <p className="text-sm text-muted-foreground">
            There are currently no installation records to display.
          </p>
        </div>
        <Button variant="outline" onClick={onRefresh} className="gap-2">
          <RefreshCcw className="h-4 w-4" />
          Refresh Data
        </Button>
      </CardContent>
    </Card>
  );
}

function ChartContent({ data }: { data: BrandData }) {
  const router = useRouter();

  if (!data || !data.brand_data || data.brand_data.length === 0) {
    return <NoDataDisplay onRefresh={() => router.refresh()} />;
  }

  const chartData = [
    {
      name: "Overview",
      total_open_installations: data.total_open_installations.count,
      feedback_pending: data.feedback_pending.count,
      pending_by_brand: data.pending_by_brand.count,
      on_hold: data.on_hold.count,
    },
    ...data.brand_data.map((item, index) => ({
      name: item.brand,
      brand_id: item.brand_id,
      open_count: item.open_count,
      in_progress: item.in_progress,
      total: item.total_count,
      color: brandColors[index % brandColors.length],
    })),
  ];

  const handleBarClick = (data: any, dataKey: ChartConfigKey) => {
    const filters = encodeURIComponent(
      JSON.stringify([
        {
          id: "complaint_type",
          condition: "like",
          value: "%installation%",
        },
      ]),
    );

    let url = data.brand_id
      ? `/crm/complaints?brand_id=${data.brand_id}&status=${dataKey}&filters=${filters}`
      : `/crm/complaints?filters=${filters}`;

    router.push(url);
  };

  return (
    <Card className="shadow-xl">
      <CardHeader>
        <div className="flex items-center gap-2">
          <BarChart2 className="h-5 w-5" />
          <CardTitle>Installation Status</CardTitle>
        </div>
      </CardHeader>
      <CardContent className="h-[300px]">
        <ChartContainer className="h-[350px] w-full" config={chartConfig}>
          <BarChart width={600} height={300} data={chartData}>
            <CartesianGrid vertical={false} strokeDasharray="3 3" />
            <XAxis
              dataKey="name"
              tickLine={false}
              axisLine={false}
              height={50}
            />
            <YAxis
              tickLine={false}
              axisLine={false}
              tickFormatter={(value) => value.toLocaleString()}
            />
            <Tooltip />

            <Bar
              dataKey="total_open_installations"
              name={data.total_open_installations.label}
              fill={data.total_open_installations.color}
              radius={[4, 4, 0, 0]}
              onClick={(data) => handleBarClick(data, "total")}
            >
              <LabelList dataKey="total_open_installations" position="top" fill="black" />
            </Bar>

            <Bar
              dataKey="feedback_pending"
              name={data.feedback_pending.label}
              fill={data.feedback_pending.color}
              radius={[4, 4, 0, 0]}
              onClick={(data) => handleBarClick(data, "feedback_pending")}
            >
              <LabelList dataKey="feedback_pending" position="top" fill="black" />
            </Bar>

            <Bar
              dataKey="pending_by_brand"
              name={data.pending_by_brand.label}
              fill={data.pending_by_brand.color}
              radius={[4, 4, 0, 0]}
              onClick={(data) => handleBarClick(data, "pending_by_brand")}
            >
              <LabelList dataKey="pending_by_brand" position="top" fill="black" />
            </Bar>

            <Bar
              dataKey="on_hold"
              name={data.on_hold.label}
              fill={data.on_hold.color}
              radius={[4, 4, 0, 0]}
              onClick={(data) => handleBarClick(data, "on_hold")}
            >
              <LabelList dataKey="on_hold" position="top" fill="black" />
            </Bar>

            <Bar
              dataKey="open_count"
              name="Open Installations"
              stackId="brand"
              fill={chartConfig.open_count.color}
              radius={[4, 4, 0, 0]}
              onClick={(data) => handleBarClick(data, "open_count")}
            >
              <LabelList dataKey="open_count" position="inside" fill="white" />
            </Bar>
            <Bar
              dataKey="in_progress"
              name="In Progress"
              stackId="brand"
              fill={chartConfig.in_progress.color}
              radius={[4, 4, 0, 0]}
              onClick={(data) => handleBarClick(data, "in_progress")}
            >
              <LabelList dataKey="in_progress" position="inside" fill="white" />
            </Bar>
          </BarChart>
        </ChartContainer>
      </CardContent>
      <CardFooter className="flex-col items-start gap-2 text-sm">
        <div className="flex gap-2 font-medium leading-none">
          Installation Status Overview <TrendingUp className="h-4 w-4" />
        </div>
        <div className="leading-none text-muted-foreground">
          Showing installations by status across all brands. Click on bars to
          view details.
        </div>
      </CardFooter> 
    </Card>
  );
}

export default function ComplaintsByBrand({ data }: { data: BrandData }) {
  return (
    <Suspense fallback={<LoadingSkeleton />}>
      <ChartContent data={data} />
    </Suspense>
  );
}
