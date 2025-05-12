"use client";

import React, { Suspense } from "react";
import { TrendingUp, BarChart2 } from "lucide-react";
import {
  Card,
  CardContent,
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
import {
  Bar,
  BarChart,
  CartesianGrid,
  XAxis,
  YAxis,
  LabelList,
} from "recharts";
import ErrorNoData from "@/components/custom/no-data";
import { Empty } from "antd";

type ChartConfigKey =
  | "feedback_pending"
  | "pending_by_brand"
  | "on_hold"
  | "open_count"
  | "in_progress"
  | "total"
  | string;

// Updated professional colors
const chartConfig = {
  feedback_pending: { label: "Feedback Pending", color: "hsl(280, 70%, 50%)" }, // Purple
  pending_by_brand: { label: "Pending by Brand", color: "hsl(200, 70%, 50%)" }, // Blue
  on_hold: { label: "On Hold", color: "hsl(30, 70%, 50%)" }, // Orange
  open_count: { label: "Open Installations", color: "hsl(145, 63%, 42%)" }, // Professional Green
  in_progress: { label: "In Progress", color: "hsl(216, 71%, 50%)" }, // Professional Blue
  total: { label: "Total", color: "hsl(252, 56%, 57%)" }, // Royal Purple
} satisfies ChartConfig;

const brandColors = [
  "hsl(280, 70%, 50%)", // Purple
  "hsl(200, 70%, 50%)", // Blue
  "hsl(30, 70%, 50%)", // Orange
  "hsl(145, 63%, 42%)", // Green
  "hsl(216, 71%, 50%)", // Deep Blue
  "hsl(252, 56%, 57%)", // Royal Purple
] as const;

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

interface ChartDataItem {
  name: string;
  value?: number;
  color?: string;
  brand_id?: number;
  open_count?: number;
  in_progress?: number;
  total?: number;
  total_open_installations?: number;
  feedback_pending?: number;
  pending_by_brand?: number;
  on_hold?: number;
}

function ChartContent({ data }: { data: BrandData }) {
  // Calculate optimal bar size based on number of data points
  const totalBars = data.brand_data.length + 4; // Adding 4 for the status bars
  const maxBarWidth = 40; // Maximum width for bars
  const minBarWidth = 24; // Minimum width for bars
  const calculatedBarSize = Math.max(
    minBarWidth,
    Math.min(maxBarWidth, Math.floor(600 / totalBars)),
  );

  const chartData: ChartDataItem[] = [
    {
      name: "Total Open Installations",
      value: data.total_open_installations.count,
      color: data.total_open_installations.color,
      total_open_installations: data.total_open_installations.count,
    },
    {
      name: "Feedback Pending",
      value: data.feedback_pending.count,
      color: data.feedback_pending.color,
      feedback_pending: data.feedback_pending.count,
    },
    {
      name: "Pending by Brand",
      value: data.pending_by_brand.count,
      color: data.pending_by_brand.color,
      pending_by_brand: data.pending_by_brand.count,
    },
    {
      name: "On Hold",
      value: data.on_hold.count,
      color: data.on_hold.color,
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

  const handleBarClick = (data: ChartDataItem, dataKey: ChartConfigKey) => {
    let url = data.brand_id
      ? `/crm/complaints?brand_id=${data.brand_id}&${dataKey}`
      : `/crm/complaints?${dataKey}`;

    window.open(url, "_blank");
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-2">
          <BarChart2 className="h-5 w-5" />
          <CardTitle>Installation Status</CardTitle>
        </div>
      </CardHeader>
      <CardContent className="h-[300px]">
        <ChartContainer config={chartConfig} className="h-[300px] w-full">
          <BarChart accessibilityLayer data={chartData} margin={{ left: 2 }}>
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="name"
              tickLine={false}
              axisLine={false}
              interval={0}
              className="uppercase"
              textAnchor="middle"
              height={60}
              fontSize={10}
              fontWeight={600}
              tickFormatter={(value) => {
                const words = value.split(" ");
                if (words.length > 1) {
                  return words.map((word: string) => word[0]).join("");
                }
                return value;
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
              dataKey="total_open_installations"
              name={data.total_open_installations.label}
              fill={chartConfig.total.color}
              radius={[4, 4, 0, 0]}
              barSize={calculatedBarSize}
              className="cursor-pointer"
              onClick={(data) =>
                handleBarClick(
                  data as ChartDataItem,
                  'filters=[{"id":"status","condition":"not in","value":"closed.amount-pending.feedback-pending.cancelled.completed.pending-by-brand"}, {"id":"complaint_type","condition":"like","value":"%installation%"}]',
                )
              }
            >
              <LabelList
                dataKey="total_open_installations"
                position="top"
                fill="black"
                offset={10}
              />
            </Bar>
            <Bar
              dataKey="feedback_pending"
              name={data.feedback_pending.label}
              fill={chartConfig.feedback_pending.color}
              radius={[4, 4, 0, 0]}
              barSize={calculatedBarSize}
              onClick={(data) =>
                handleBarClick(
                  data as ChartDataItem,
                  'filters=[{"id":"status","condition":"like","value":"feedback-pending"}, {"id":"complaint_type","condition":"like","value":"%installation%"}]',
                )
              }
              className="cursor-pointer"
            >
              <LabelList
                dataKey="feedback_pending"
                position="top"
                fill="black"
                offset={10}
              />
            </Bar>
            <Bar
              dataKey="pending_by_brand"
              name={data.pending_by_brand.label}
              fill={chartConfig.pending_by_brand.color}
              radius={[4, 4, 0, 0]}
              barSize={calculatedBarSize}
              onClick={(data) =>
                handleBarClick(
                  data as ChartDataItem,
                  'filters=[{"id":"status","condition":"like","value":"pending-by-brand"}, {"id":"complaint_type","condition":"like","value":"%installation%"}]',
                )
              }
              className="cursor-pointer"
            >
              <LabelList
                dataKey="pending_by_brand"
                position="top"
                fill="black"
                offset={10}
              />
            </Bar>
            <Bar
              dataKey="on_hold"
              name={data.on_hold.label}
              fill={chartConfig.on_hold.color}
              radius={[4, 4, 0, 0]}
              barSize={calculatedBarSize}
              onClick={(data) =>
                handleBarClick(
                  data as ChartDataItem,
                  'filters=[{"id":"status","condition":"like","value":"hold"}, {"id":"complaint_type","condition":"like","value":"%installation%"}]',
                )
              }
              className="cursor-pointer"
            >
              <LabelList
                dataKey="on_hold"
                position="top"
                fill="black"
                offset={10}
              />
            </Bar>
            <Bar
              dataKey="open_count"
              name="Open Installations"
              stackId="brand"
              fill={chartConfig.open_count.color}
              barSize={calculatedBarSize}
              onClick={(data) =>
                handleBarClick(
                  data as ChartDataItem,
                  'filters=[{"id":"status","condition":"like","value":"open"}, {"id":"complaint_type","condition":"like","value":"%installation%"}]',
                )
              }
              className="cursor-pointer"
            >
              <LabelList
                dataKey="open_count"
                position="inside"
                fill="white"
                offset={10}
              />
            </Bar>
            <Bar
              dataKey="in_progress"
              name="In Progress"
              stackId="brand"
              fill={chartConfig.in_progress.color}
              radius={[4, 4, 0, 0]}
              barSize={calculatedBarSize}
              onClick={(data) =>
                handleBarClick(
                  data as ChartDataItem,
                  'filters=[{"id":"status","condition":"not in","value":"open.closed.amount-pending.feedback-pending.cancelled.completed.pending-by-brand"}, {"id":"complaint_type","condition":"like","value":"%installation%"}]',
                )
              }
              className="cursor-pointer"
            >
              <LabelList
                dataKey="in_progress"
                position="inside"
                fill="white"
                offset={10}
              />
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
  if (!data || !data.brand_data || data.brand_data.length === 0) {
    return
    <Card>
      <CardContent>
        <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} description="No data" className="scale-50" />
      </CardContent>
    </Card>
  }
  return (
    <Suspense fallback={<LoadingSkeleton />}>
      <ChartContent data={data} />
    </Suspense>
  );
}
