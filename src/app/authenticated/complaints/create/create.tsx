import React from "react";
import { buttonVariants } from "@/components/ui/button";
import Link from "next/link";
import { Plus } from "lucide-react";

export default function CreateComplaint() {
  return (
    <Link
      href="/authenticated/complaints/create"
      className={`flex h-8 w-full items-center gap-1 sm:w-fit ${buttonVariants({
        variant: "default",
        size: "sm",
      })}`}
    >
      <Plus />
      Add New Complaint
    </Link>
  );
}
