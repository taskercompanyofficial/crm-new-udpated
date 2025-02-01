"use client";
import * as React from "react";
import { HardDriveIcon, RefreshCw, ServerCrash } from "lucide-react";
import { cn } from "@/lib/utils";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";

interface ErrorScreenProps {
  error?: string;
  icon?: "alert" | "server";
  className?: string;
}

export function ErrorScreen({
  error = "Something went wrong please try to refresh the page.",
  icon,
  className,
}: ErrorScreenProps) {
  const router = useRouter();
  const Icon = icon === "server" ? ServerCrash : HardDriveIcon;
  const [isRefreshing, setIsRefreshing] = React.useState(false);

  const tryAgain = async () => {
    setIsRefreshing(true);
    router.refresh();
    await new Promise((resolve) => setTimeout(resolve, 1000));
    setIsRefreshing(false);
  };

  return (
    <div
      className={cn(
        "flex min-h-72 w-full flex-col items-center justify-center rounded border border-gray-200 bg-white bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] px-2 py-4 text-gray-100 shadow-sm [background-size:16px_16px] dark:border-gray-700 dark:bg-gray-900 dark:bg-[radial-gradient(#1f2937_1px,transparent_1px)] dark:text-gray-600",
        className,
      )}
    >
      <div>
        <Icon size={70} />
      </div>
      <div>{error}</div>
      <Button onClick={tryAgain} className="gap-2 mt-6" disabled={isRefreshing}>
        <span>{isRefreshing ? "Refreshing..." : "Refresh"}</span>
        <RefreshCw className={cn("h-4 w-4", isRefreshing && "animate-spin")} />
      </Button>
    </div>
  );
}
