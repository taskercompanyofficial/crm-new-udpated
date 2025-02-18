import {
  Briefcase,
  ClipboardList,
  Clock,
  Handshake,
  Home,
  Layers,
  MapPin,
  Package,
  Settings,
  Users,
  PackageSearch,
  MessagesSquare,
} from "lucide-react";
type Submenu = {
  href: string;
  label: string;
  active: boolean;
};

export type Menu = {
  href: string;
  label: string;
  active: boolean;
  icon: any;
  submenus: Submenu[];
};

export type Group = {
  groupLabel: string;
  menus: Menu[];
};

export function getMenuList(
  pathname: string,
  role: string | undefined,
): Group[] {
  let menuItems: Group[] = [
    {
      groupLabel: "Platform",
      menus: [
        {
          href: "/crm",
          label: "Overview",
          active: pathname === "/crm",
          icon: Home,
          submenus: [
            {
              href: "/crm",
              label: "Dashboard",
              active: pathname === "/crm",
            },
            {
              href: "/crm/overview/analytics",
              label: "Analytics",
              active: pathname === "/crm/overview/analytics",
            },
            {
              href: "/crm/overview/accounts",
              label: "Accounts",
              active: pathname === "/crm/overview/accounts",
            },
            {
              href: "/crm/overview/expenses",
              label: "Expenses",
              active: pathname === "/crm/overview/expenses",
            },
            {
              href: "/crm/overview/billing",
              label: "Billing",
              active: pathname === "/crm/overview/billing",
            },
          ],
        },
        {
          href: "/crm/market-place",
          label: "Market Place",
          active: pathname === "/crm/market-place",
          icon: Package,
          submenus: [],
        },
        {
          href: "/crm/complaints",
          label: "Complaints",
          active: pathname.includes("/crm/complaints"),
          icon: ClipboardList,
          submenus: [],
        },
        {
          href: "/crm/attendance",
          label: "Attendance",
          active: pathname === "/crm/attendance",
          icon: Clock,
          submenus: [],
        },
      ],
    },
  ];

  if (role === "admin" || role === "administrator") {
    menuItems[0].menus.push(
      {
        href: "/crm/staff",
        label: "Staff",
        active: pathname.includes("/crm/staff"),
        icon: Users,
        submenus: [],
      },
      {
        href: "/crm/inventory",
        label: "Inventory",
        active: pathname.includes("/crm/inventory"),
        icon: PackageSearch,
        submenus: [],
      },
      {
        href: "#",
        label: "All Services",
        active:
          pathname === "/crm/services" ||
          pathname === "/crm/categories" ||
          pathname === "/crm/sub-services",
        icon: Layers,
        submenus: [
          {
            href: "/crm/sub-services",
            label: "Sub Services",
            active: pathname === "/crm/sub-services",
          },
          {
            href: "/crm/services",
            label: "Services",
            active: pathname === "/crm/services",
          },
          {
            href: "/crm/categories",
            label: "Categories",
            active: pathname === "/crm/categories",
          },
        ],
      },
      {
        href: "/crm/branches",
        label: "Branches",
        active: pathname === "/crm/branches",
        icon: MapPin,
        submenus: [],
      },
      {
        href: "/crm/authorized-brands",
        label: "Authorized Brands",
        active: pathname === "/crm/authorized-brands",
        icon: Handshake,
        submenus: [],
      },
      {
        href: "/crm/our-projects",
        label: "Our Projects",
        active: pathname === "/crm/our-projects",
        icon: Briefcase,
        submenus: [],
      },
    );
  }

  menuItems.push({
    groupLabel: "Settings",
    menus: [
      {
        href: "/crm/account",
        label: "Account",
        active: pathname === "/crm/account",
        icon: Settings,
        submenus: [],
      },
      {
        href: "/messages",
        label: "Messages",
        active: pathname === "/messages",
        icon: MessagesSquare,
        submenus: [],
      },
    ],
  });

  return menuItems;
}
