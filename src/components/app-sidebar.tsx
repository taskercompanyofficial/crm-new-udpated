"use client";

import * as React from "react";
import { Laptop, LifeBuoy, Send } from "lucide-react";

import { NavMain } from "@/components/nav-main";
import { NavUser } from "@/components/nav-user";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenuItem,
  SidebarMenu,
  SidebarRail,
  SidebarMenuButton,
} from "@/components/ui/sidebar";
import { NavSecondary } from "@/components/nav-secondary";
import { useSession } from "next-auth/react";
import { User } from "@/types";
import useFetch from "@/hooks/usefetch";
import { API_URL } from "@/lib/apiEndPoints";

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const session = useSession();
  const token = session?.data?.user?.token;
  const {
    data: user,
    isLoading,
  } = useFetch<User>(API_URL + "/user", token);
  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" asChild>
              <a href="#">
                <div className="flex items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground aspect-square size-8">
                  <Laptop className="size-4" />
                </div>
                <div className="grid flex-1 text-sm leading-tight text-left">
                  <span className="font-semibold truncate">Tasker Company</span>
                  <span className="text-xs uppercase truncate">
                    {user?.role}
                  </span>
                </div>
              </a>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <NavMain role={user?.role} isLoading={isLoading} />
        <NavSecondary
          items={[
            {
              title: "Support",
              url: "/support",
              icon: LifeBuoy,
            },
            {
              title: "Feedback",
              url: "#",
              icon: Send,
            },
          ]}
        />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={user} isLoading={isLoading} />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
