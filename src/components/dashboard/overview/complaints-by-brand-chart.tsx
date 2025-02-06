"use client";
import React, { Suspense } from "react";
import { TrendingUp, BarChart2 } from "lucide-react";
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
  data: {
    brand: string;
    brand_id: number;
    count: number;
  }[];
  total_complaints: number;
  pending_complaints: number;
}

function ChartContent({ data }: { data: BrandData }) {
  const chartConfig = {
    count: {
      label: "Complaint Volume",
      color: "hsl(var(--chart-1))",
    },
  } satisfies ChartConfig;

  // Generate unique colors for each brand
  const colors = [
    "#FF6B6B", // Coral Red
    "#4ECDC4", // Turquoise
    "#45B7D1", // Sky Blue
    "#96CEB4", // Sage Green
    "#FFEEAD", // Cream Yellow
    "#D4A5A5", // Dusty Rose
    "#9B59B6", // Purple
    "#3498DB", // Blue
    "#E67E22", // Orange
    "#1ABC9C", // Emerald
    "#F39C12", // Sunflower
    "#8E44AD", // Wisteria
    "#2980B9", // Belize Hole
    "#27AE60", // Nephritis
    "#C0392B", // Alizarin
    "#D35400", // Pumpkin
  ];

  const chartData = data.data.map((item, index) => ({
    ...item,
    fill: colors[index % colors.length],
  }));

  const router = useRouter();
  return (
    <Card className="shadow-lg">
      <CardHeader>
        <div className="flex items-center gap-2">
          <BarChart2 className="h-5 w-5" />
          <CardTitle>
            Brand Distribution Analysis (Free Installations)
          </CardTitle>
        </div>
        <CardDescription>
          Overall Volume: {data.total_complaints.toLocaleString()} | In
          Progress: {data.pending_complaints.toLocaleString()}
        </CardDescription>
      </CardHeader>
      <CardContent className="h-[300px]">
        <ChartContainer config={chartConfig} className="h-[300px] w-full">
          <BarChart accessibilityLayer data={chartData} margin={{ left: 2 }}>
            <CartesianGrid vertical={false} strokeDasharray="3 3" />
            <XAxis
              dataKey="brand"
              tickLine={false}
              axisLine={false}
              interval={0}
              angle={-15}
              textAnchor="end"
              height={60}
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
              radius={[4, 4, 0, 0]}
              barSize={24}
              className="mt-4 cursor-pointer hover:opacity-80"
              onClick={(data: any) => {
                if (data && data.brand_id) {
                  router.push(`/crm/complaints?brand_id=${data.brand_id}`);
                }
              }}
            >
              <LabelList
                position="top"
                offset={12}
                className="fill-foreground"
                fontSize={12}
              />
            </Bar>
          </BarChart>
        </ChartContainer>
      </CardContent>
      <CardFooter className="flex-col items-start gap-2 text-sm">
        <div className="flex gap-2 font-medium leading-none">
          Brand Performance Metrics <TrendingUp className="h-4 w-4" />
        </div>
        <div className="leading-none text-muted-foreground">
          Select any brand column to view detailed complaint analytics
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
