"use client";

import { Bell } from "lucide-react";
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
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import Pusher from "pusher-js";

const pusher = new Pusher("ce68911272e6c689efde", {
  cluster: "ap2",
});

export function NotificationComponent() {
  const [notifications, setNotifications] = useState<any[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    Notification.requestPermission().then((permission) => {
      if (permission === "granted") {
        const channel = pusher.subscribe("notification-channel");

        channel.bind("notification-event", (data: any) => {
          setNotifications((prev) => [data, ...prev]);
          setUnreadCount((prev) => prev + 1);
          toast.info("A New Notification Has Been Received!");
          const audio = new Audio("/notification-1.mp3");
          audio.play();
        });

        return () => {
          pusher.unsubscribe("notification-channel");
        };
      }
    });
  }, []);

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="relative">
          <Bell className="h-5 w-5" />
          {unreadCount > 0 && (
            <span className="absolute -right-1 -top-1 flex h-4 w-4 items-center justify-center rounded-full bg-primary text-[10px] text-primary-foreground">
              {unreadCount}
            </span>
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-80">
        <DropdownMenuLabel>Notifications</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          {notifications.length > 0 ? (
            notifications.map((notification, index) => (
              <DropdownMenuItem key={index}>
                <div className="flex flex-col gap-1">
                  <div className="text-sm font-medium">
                    {notification.title}
                  </div>
                  <div className="text-xs text-muted-foreground">
                    {notification.message}
                  </div>
                  <div className="text-xs text-muted-foreground">
                    {notification.time}
                  </div>
                </div>
              </DropdownMenuItem>
            ))
          ) : (
            <DropdownMenuItem>
              <div className="text-sm text-muted-foreground">
                No new notifications
              </div>
            </DropdownMenuItem>
          )}
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuItem className="text-center font-medium">
          View all notifications
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
