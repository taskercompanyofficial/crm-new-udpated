import React, { Suspense } from "react";
import { ActiveComplaintsChart } from "./ComplaintsChart";
import { Skeleton } from "@/components/ui/skeleton";

export default async function SecondChart({ data }: { data: any }) {
  return (
    <div className="grid grid-cols-1 gap-2 md:grid-cols-3">
      <Suspense fallback={<Skeleton className="h-[200px] w-full" />}>
        <div className="col-span-2">

          <ActiveComplaintsChart chartData={data?.active_complaints} />
        </div>
      </Suspense>
    </div>
  );
}
