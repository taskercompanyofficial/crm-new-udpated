"use client";

import { TrendingUp } from "lucide-react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  XAxis,
  Cell,
  YAxis,
  LabelList,
} from "recharts";
import { useRouter } from "next/navigation";

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

// Define chart configuration with dynamic colors for each status
const chartConfig: ChartConfig = {
  open: {
    label: "Open Complaints",
    color: "hsl(var(--chart-1))",
  },
  "part-demand": {
    label: "Part Demand",
    color: "hsl(var(--chart-2))",
  },
  "service-lifting": {
    label: "Service Lifting",
    color: "hsl(var(--chart-3))",
  },
  "party-lifting": {
    label: "Party Lifting",
    color: "hsl(var(--chart-4))",
  },
  "unit-in-service-center": {
    label: "Unit in Service Center",
    color: "hsl(var(--chart-5))",
  },
  "installation-pending": {
    label: "Installation Pending",
    color: "hsl(var(--chart-6))",
  },
  "in-progress": {
    label: "In Progress",
    color: "hsl(var(--chart-7))",
  },
  delivered: {
    label: "Delivered",
    color: "hsl(var(--chart-8))",
  },
  completed: {
    label: "Completed",
    color: "hsl(var(--chart-9))",
  },
  cancelled: {
    label: "Cancelled",
    color: "hsl(var(--chart-10))",
  },
  closed: {
    label: "Closed",
    color: "hsl(var(--chart-11))",
  },
} satisfies ChartConfig;

export function ActiveComplaintsChart({
  chartData,
}: {
  chartData: { status: string; count: number }[]; // Only status and count
}) {
  const router = useRouter();

  // Function to dynamically get color based on the status
  const getFillColor = (status: string) => {
    // Return the color for the given status, or gray if the status is not defined in chartConfig
    return chartConfig[status as keyof ChartConfig]?.color || "gray";
  };

  // Handle bar click event
  const handleBarClick = (data: any) => {
    if (data) {
      window.open(`/complaints?status=${data.status}`, "_blank");
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Active Complaints</CardTitle>
        <CardDescription>Complaint Status Breakdown</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig} className="h-[200px] w-full">
          <BarChart
            accessibilityLayer
            data={chartData}
            margin={{
              top: 20,
            }}
            width={600}
            height={300}
          >
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="status"
              tickLine={false}
              tickMargin={10}
              radius={4}
              axisLine={false}
              tickFormatter={(value) =>
                chartConfig[value as keyof typeof chartConfig]?.label || value
              }
            />
            <YAxis
              dataKey="count"
              tickLine={false}
              tickMargin={10}
              axisLine={false}
            />
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent hideLabel />}
            />
            <Bar
              dataKey="count"
              barSize={40}
              radius={4}
              onClick={(data) => handleBarClick(data)} // Attach click handler
            >
              <LabelList
                position="top"
                offset={12}
                className="fill-foreground"
                fontSize={12}
              />
              {chartData.map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={getFillColor(entry.status)}
                  fillOpacity={index === 1 ? 0.8 : 1} // Highlight second bar
                />
              ))}
            </Bar>
          </BarChart>
        </ChartContainer>
      </CardContent>
      <CardFooter className="flex-col items-start gap-2 text-sm">
        <div className="flex gap-2 font-medium leading-none">
          Complaints have increased slightly <TrendingUp className="h-4 w-4" />
        </div>
        <div className="leading-none text-muted-foreground">
          Showing active complaints across various statuses.
        </div>
      </CardFooter>
    </Card>
  );
}
