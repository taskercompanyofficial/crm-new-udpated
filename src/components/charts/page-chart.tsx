"use client";

import {
  Bar,
  BarChart,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
} from "recharts";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "../ui/chart";

// Chart configuration for styling
const chartConfig = {
  open: {
    label: "Open Complaints",
    color: "hsl(var(--chart-1))",
  },
  closed: {
    label: "Closed Complaints",
    color: "hsl(var(--chart-2))",
  },
  other: {
    label: "Other Complaints",
    color: "hsl(var(--chart-3))",
  },
};

export function PageChart({ chartData }: { chartData: any }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Complaints Overview</CardTitle>
        <CardDescription>
          This chart displays the number of complaints (open, closed, and other)
          for each branch.
        </CardDescription>
      </CardHeader>

      <CardContent>
        <ChartContainer config={chartConfig} className="h-[200px] w-full">
          <BarChart
            data={chartData}
            margin={{
              top: 20,
              left: 12,
              right: 12,
              bottom: 5,
            }}
            width={600}
            height={300}
          >
            <CartesianGrid strokeDasharray="3 3" vertical={false} />
            <XAxis
              dataKey="branch_name" // Display branch names
              tickLine={false}
              axisLine={false}
              tickMargin={8}
            />
            <ChartTooltip
              content={<ChartTooltipContent />}
              cursor={false}
              defaultIndex={1}
            />
            <Legend />

            <Bar
              dataKey="open"
              fill="var(--color-open)" // You can dynamically set this color using chartConfig
              name="Open Complaints"
              barSize={24}
            />
            <Bar
              dataKey="closed"
              fill="var(--color-closed)"
              name="Closed Complaints"
              barSize={24}
            />
            <Bar
              dataKey="other"
              fill="var(--color-other)"
              name="Other Complaints"
              barSize={24}
            />
          </BarChart>
        </ChartContainer>
      </CardContent>

      <CardFooter className="flex-col items-start gap-2 text-sm">
        <div className="leading-none text-muted-foreground">
          Complaints breakdown for the branches.
        </div>
      </CardFooter>
    </Card>
  );
}
