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
import { revalidate } from "@/actions/revalidate";
import Link from "next/link";

const pusher = new Pusher("ce68911272e6c689efde", {
  cluster: "ap2",
});

export function NotificationComponent() {
  const [notifications, setNotifications] = useState<any[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    // Check if we're in a browser environment
    if (typeof window !== 'undefined') {
      Notification.requestPermission().then((permission) => {
        if (permission === "granted") {
          const channel = pusher.subscribe("notification-channel");

          channel.bind("notification-event", (data: any) => {
            const type = data.type as keyof typeof toast;
            setNotifications((prev) => [data, ...prev]);
            setUnreadCount((prev) => prev + 1);
            (toast[type] as (message: string) => void)(data.message);
            revalidate({ path: "/" });

            // Play notification sound
            const audio = new Audio("/notification-1.mp3");
            audio.play().catch(err => console.log('Audio playback failed:', err));

            // Show desktop notification
            try {
              if ('Notification' in window && /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)) {
                // For mobile devices, create notification with simpler options
                new Notification(data.title, {
                  body: data.message,
                  icon: '/icon.png'
                });
              } else if ('Notification' in window) {
                // For desktop, use all options
                new Notification(data.title, {
                  body: data.message,
                  icon: '/icon.png',
                  badge: '/icon.png',
                  vibrationPattern: [200, 100, 200]
                } as any);
              }
            } catch (error) {
              console.log('Notification failed:', error);
            }
          });

          return () => {
            pusher.unsubscribe("notification-channel");
          };
        }
      }).catch(err => console.log('Permission request failed:', err));
    }
  }, []);

  const handleNotificationClick = (notification: any) => {
    console.log(notification);
    if (notification.link) {
      window.open(notification.link, '_blank');
    }
    setUnreadCount((prev) => Math.max(0, prev - 1));
  };

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
              <DropdownMenuItem 
                key={index}
                onClick={() => handleNotificationClick(notification)}
                className="cursor-pointer"
              >
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
          <Link href="/notifications" className="w-full">
            View all notifications
          </Link>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
