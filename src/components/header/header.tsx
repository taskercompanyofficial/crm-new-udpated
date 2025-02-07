import React from "react";

import { NavUser } from "./navuser";
import { NotificationComponent } from "./notification";
import { Messages } from "./messages";
import BreadcrumbComponent from "./breadcrumb";
import { RevalidateBtn } from "./revalidate-btn";
export default function Header({ userDetails }: { userDetails: any }) {
  return (
    <header className="flex h-16 shrink-0 items-center justify-between gap-2 bg-navbar">
      <BreadcrumbComponent />
      <div className="flex items-center gap-2 px-4">
        <RevalidateBtn />
        <Messages />
        <NotificationComponent />
        <NavUser userDetails={userDetails} />
      </div>
    </header>
  );
}
