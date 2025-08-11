import React from "react";

import { NavUser } from "./navuser";
import { NotificationComponent } from "./notification";
import { Messages } from "./messages";
import { BreadcrumbNav } from "./breadcrumb";
import { RevalidateBtn } from "./revalidate-btn";
import { DateRangePicker } from "../custom/date-range-picker";
export default function Header({ userDetails }: { userDetails: any }) {
  return (
    <header className="flex h-16 shrink-0 items-center justify-between gap-2 bg-navbar">
      <BreadcrumbNav />
      <div className="flex items-center gap-2 px-4">
        <DateRangePicker />
        <RevalidateBtn />
        <Messages />
        <NotificationComponent />
        <NavUser userDetails={userDetails} />
      </div>
    </header>
  );
}
