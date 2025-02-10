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
  LabelList,
  XAxis,
  YAxis,
} from "recharts";
import { useRouter } from "next/navigation";
import { ComplaintStatusOptions } from "@/lib/otpions";
import { Button } from "@/components/ui/button";

function LoadingSkeleton() {
  return (
    <Card className="col-span-4 border-0 shadow-sm">
      <CardHeader className="pb-2">
        <div className="flex items-center gap-2">
          <BarChart2 className="h-4 w-4" />
          <CardTitle className="text-sm font-medium text-muted-foreground">
            Brand Distribution Analysis
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
  total_installations: number;
  active_installations: number;
  brand_data: {
    brand: string;
    brand_id: number;
    count: number;
    status_counts: {
      [key: string]: number;
    };
  }[];
}

function NoDataDisplay({ onRefresh }: { onRefresh: () => void }) {
  return (
    <Card >
      <CardContent className="flex h-[400px] flex-col items-center justify-center gap-4">
        <AlertCircle className="h-16 w-16 text-muted-foreground/50" />
        <div className="text-center">
          <h3 className="text-lg font-semibold">No Data Available</h3>
          <p className="text-sm text-muted-foreground">
            There are currently no installation records to display.
          </p>
        </div>
        <Button
          variant="outline"
          onClick={onRefresh}
          className="gap-2"
        >
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

  // Get unique statuses across all brands
  const allStatuses = Array.from(new Set(
    data.brand_data.flatMap(brand => Object.keys(brand.status_counts))
  ));

  const statusColors = Object.fromEntries(
    ComplaintStatusOptions.map((option) => [
      option.value,
      `rgba(${option.color}, 0.8)`,
    ]),
  );

  const chartConfig: ChartConfig = {
    total: {
      label: "Total Installations",
      color: "hsl(var(--chart-1))",
    },
    active: {
      label: "Active Installations",
      color: "hsl(var(--chart-2))",
    },
    ...allStatuses.reduce((acc, status) => ({
      ...acc,
      [status]: {
        label: ComplaintStatusOptions.find(opt => opt.value === status)?.label || status,
        color: statusColors[status] || "rgba(180, 180, 180, 0.8)"
      }
    }), {})
  };

  // Create summary data for overall counts
  const summaryData = [
    {
      brand: "Overall",
      total_installations: data.total_installations,
      active_installations: data.active_installations,
    },
  ];

  // Transform data to show brand-wise installations with status counts
  const brandData = data.brand_data.map((item) => ({
    brand: item.brand,
    brand_id: item.brand_id,
    ...item.status_counts,
  }));

  // Combine summary and brand data
  const chartData = [...summaryData, ...brandData];

  const handleBarClick = (data: any, dataKey: string) => {
    console.log(dataKey);
    const filters = encodeURIComponent(JSON.stringify([{
      id: "complaint_type",
      condition: "like",
      value: "%installation%"
    }]));

    let url = '';
    if (dataKey === 'total_installations' || dataKey === 'active_installations') {
      // For total/active, include brand_id if available
      url = data.brand_id
        ? `/crm/complaints?brand_id=${data.brand_id}&filters=${filters}`
        : `/crm/complaints?filters=${filters}`;
    } else {
      if (!data.brand_id || !dataKey) return;
      url = `/crm/complaints?brand_id=${data.brand_id}&status=${dataKey}&filters=${filters}`;
    }

    console.log(url);
    router.push(url);
  };

  return (
    <Card className="shadow-xl">
      <CardHeader>
        <div className="flex items-center gap-2">
          <BarChart2 className="h-5 w-5" />
          <CardTitle>Brand Distribution Analysis</CardTitle>
        </div>
        <CardDescription className="text-lg font-semibold">
          Total Installations: {data.total_installations.toLocaleString()} | Active Installations: {data.active_installations.toLocaleString()}
        </CardDescription>
      </CardHeader>
      <CardContent className="h-[300px]">
        <ChartContainer config={chartConfig} className="h-[350px] w-full">
          <BarChart
            width={600}
            height={300}
            data={chartData}
          >
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="brand"
              tickLine={false}
              axisLine={false}
              textAnchor="middle"
              height={100}
            />
            <YAxis tickLine={false} axisLine={false} tickFormatter={(value) => value.toLocaleString()} />

            <ChartTooltip content={<ChartTooltipContent />} />

            <Bar
              dataKey="total_installations"
              name="Total Installations"
              fill="hsl(var(--chart-1))"
              radius={[4, 4, 0, 0]}
              className="cursor-pointer hover:opacity-80"
              onClick={(data) => handleBarClick(data, "total_installations")}
            >
              <LabelList dataKey="total_installations" position="insideTop" fill="white" offset={10} />
            </Bar>

            <Bar
              dataKey="active_installations"
              name="Active Installations"
              fill="hsl(var(--chart-2))"
              radius={[4, 4, 0, 0]}
              className="cursor-pointer hover:opacity-80"
              onClick={(data) => handleBarClick(data, "active_installations")}
            >
              <LabelList dataKey="active_installations" position="insideTop" fill="white" offset={10} />
            </Bar>

            {allStatuses.map((status) => (
              <Bar
                key={status}
                dataKey={status}
                name={ComplaintStatusOptions.find(opt => opt.value === status)?.label || status}
                fill={statusColors[status] || "rgba(180, 180, 180, 0.8)"}
                stackId="brand-stacked"
                className="cursor-pointer hover:opacity-80"
                onClick={(data) => handleBarClick(data, status)}
              />
            ))}

          </BarChart>
        </ChartContainer>

      </CardContent>
      <CardFooter className="flex-col items-start gap-2 text-sm">
        <div className="flex gap-2 font-medium leading-none">
          Installation Distribution Overview <TrendingUp className="h-4 w-4" />
        </div>
        <div className="leading-none text-muted-foreground">
          Showing installations by status across all brands. Click on bars to view brand details.
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