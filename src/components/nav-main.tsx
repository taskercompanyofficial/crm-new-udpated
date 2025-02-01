"use client";

import { ChevronRight, Loader } from "lucide-react";

import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuAction,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
} from "@/components/ui/sidebar";
import { getMenuList } from "@/lib/menu-list";
import { usePathname } from "next/navigation";
import Link from "next/link";

export function NavMain({
  role,
  isLoading,
}: {
  role?: string;
  isLoading: boolean;
}) {
  const pathname = usePathname();
  const items = getMenuList(pathname, role);

  if (isLoading) {
    return (
      <div className="flex h-[400px] items-center justify-center p-4">
        <Loader className="h-4 w-4 animate-spin" />
      </div>
    );
  }

  return (
    <>
      {items.map((group) => (
        <SidebarGroup key={group.groupLabel}>
          <SidebarGroupLabel>{group.groupLabel}</SidebarGroupLabel>
          <SidebarMenu>
            {group.menus.map((menu) => (
              <Collapsible
                key={menu.label}
                asChild
                defaultOpen={
                  menu.active || menu.submenus.some((submenu) => submenu.active)
                }
              >
                <SidebarMenuItem>
                  <SidebarMenuButton
                    asChild
                    tooltip={menu.label}
                    isActive={menu.active}
                  >
                    {!menu.active ? (
                      <Link href={menu.href}>
                        <menu.icon />
                        <span>{menu.label}</span>
                      </Link>
                    ) : (
                      <span className="cursor-not-allowed">
                        <menu.icon />
                        <span>{menu.label}</span>
                      </span>
                    )}
                  </SidebarMenuButton>
                  {menu.submenus.length > 0 ? (
                    <>
                      <CollapsibleTrigger asChild>
                        <SidebarMenuAction className="data-[state=open]:rotate-90">
                          <ChevronRight />
                          <span className="sr-only">Toggle</span>
                        </SidebarMenuAction>
                      </CollapsibleTrigger>
                      <CollapsibleContent>
                        <SidebarMenuSub>
                          {menu.submenus.map((submenu) => (
                            <SidebarMenuSubItem key={submenu.label}>
                              <SidebarMenuSubButton
                                asChild
                                isActive={submenu.active}
                              >
                                <Link href={submenu.href}>
                                  <span>{submenu.label}</span>
                                </Link>
                              </SidebarMenuSubButton>
                            </SidebarMenuSubItem>
                          ))}
                        </SidebarMenuSub>
                      </CollapsibleContent>
                    </>
                  ) : null}
                </SidebarMenuItem>
              </Collapsible>
            ))}
          </SidebarMenu>
        </SidebarGroup>
      ))}
    </>
  );
}
