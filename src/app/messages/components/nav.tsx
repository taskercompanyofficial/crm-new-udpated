"use client";

import Link from "next/link";
import { MessagesSquare, Inbox, Archive, Trash2 } from "lucide-react";

import { cn } from "@/lib/utils";
import { buttonVariants } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";

export function Nav() {
  return (
    <div className="group flex flex-col gap-4 py-2 max-w-4">
      <nav className="grid gap-1 px-2">
        <Link
          href="/messages"
          className={cn(
            buttonVariants({ variant: "default", size: "sm" }),
            "dark:bg-muted dark:text-white dark:hover:bg-muted dark:hover:text-white",
            "justify-start"
          )}
        >
          <MessagesSquare className="mr-2 h-4 w-4" />
          All Chats
        </Link>

        <Link
          href="/messages/open"
          className={cn(
            buttonVariants({ variant: "ghost", size: "sm" }),
            "justify-start"
          )}
        >
          <Inbox className="mr-2 h-4 w-4" />
          Open
        </Link>

        <Link
          href="/messages/closed" 
          className={cn(
            buttonVariants({ variant: "ghost", size: "sm" }),
            "justify-start"
          )}
        >
          <Archive className="mr-2 h-4 w-4" />
          Closed
        </Link>

        <Link
          href="/messages/trash"
          className={cn(
            buttonVariants({ variant: "ghost", size: "sm" }),
            "justify-start"
          )}
        >
          <Trash2 className="mr-2 h-4 w-4" />
          Trash
        </Link>
      </nav>
    </div>
  );
}
