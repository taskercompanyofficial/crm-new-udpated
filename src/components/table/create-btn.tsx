import React from "react";
import { buttonVariants } from "@/components/ui/button";
import Link from "next/link";
import { PlusCircle } from "lucide-react";

export default function CreateBtn({Label, href}: {Label: string, href: string}) {
  return (
    <Link
      href={href}
      className={`flex h-8 w-full items-center gap-1 sm:w-fit ${buttonVariants({
        variant: "default",
        size: "sm",
      })}`}
    >
      <PlusCircle />
      {Label}
    </Link>
  );
}
