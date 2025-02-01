import React from "react";
import { cn } from "@/lib/utils";

export default function TableFacedFilter({
  children,
  className,
}: {
  children?: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "flex w-full flex-col gap-2 md:flex-row md:items-center",
        className,
      )}
    >
      
      {children}
    </div>
  );
}
