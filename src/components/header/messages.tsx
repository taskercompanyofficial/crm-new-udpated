"use client";

import { MessageSquare } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";

export function Messages() {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="relative">
          <MessageSquare className="w-5 h-5" />
          <span className="absolute -right-1 -top-1 flex h-4 w-4 items-center justify-center rounded-full bg-primary text-[10px] text-primary-foreground">
            3
          </span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-80">
        <DropdownMenuLabel>Messages</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <DropdownMenuItem>
            <div className="flex flex-col gap-1">
              <div className="text-sm font-medium">John Doe</div>
              <div className="text-xs text-muted-foreground">
                Hey, can you review the latest design changes?
              </div>
              <div className="text-xs text-muted-foreground">5 minutes ago</div>
            </div>
          </DropdownMenuItem>
          <DropdownMenuItem>
            <div className="flex flex-col gap-1">
              <div className="text-sm font-medium">Jane Smith</div>
              <div className="text-xs text-muted-foreground">
                The client meeting is scheduled for tomorrow at 2 PM
              </div>
              <div className="text-xs text-muted-foreground">30 minutes ago</div>
            </div>
          </DropdownMenuItem>
          <DropdownMenuItem>
            <div className="flex flex-col gap-1">
              <div className="text-sm font-medium">Mike Johnson</div>
              <div className="text-xs text-muted-foreground">
                Updated the project timeline
              </div>
              <div className="text-xs text-muted-foreground">2 hours ago</div>
            </div>
          </DropdownMenuItem>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuItem className="font-medium text-center">
          View all messages
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
