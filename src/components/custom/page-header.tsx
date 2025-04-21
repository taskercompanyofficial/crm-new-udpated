"use client";
import { usePathname } from "next/navigation";
import useFetch from "@/hooks/usefetch";
import { ROUTESMETA } from "@/lib/apiEndPoints";
import { Skeleton } from "../ui/skeleton";
interface Meta {
  key: string;
  value: {
    title: string;
    description: string;
  };
}
export function PageHeader() {
  const pathname = usePathname();
  const lastPath = pathname.split("/").pop();
  const { data, error, isLoading } = useFetch<Meta>(
    ROUTESMETA + "/" + lastPath,
  );
  return (
    <div className="flex items-center justify-between">
      <div className="w-full md:w-[70%]">
        {isLoading ? (
          <div className="space-y-1">
            <Skeleton className="h-4 w-[20%]" />
            <Skeleton className="h-3 w-full" />
            <Skeleton className="h-3 w-[50%]" />
          </div>
        ) : (
          <>
            {!error && (
              <>
                <h1 className="text-lg font-semibold">{data?.value?.title}</h1>
                <p className="text-xs text-gray-500">
                  {data?.value?.description}
                </p>
              </>
            )}
          </>
        )}
      </div>
    </div>
  );
}
