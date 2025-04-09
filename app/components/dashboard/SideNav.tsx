"use client";

import { PowerIcon } from "@heroicons/react/24/outline";
import MyLogo from "./MyLogo";
import NavLinks from "./NavLinks";
import {
  HomeIcon,
  UserIcon,
  DocumentIcon,
  ChartBarIcon,
  CogIcon,
  BellIcon,
} from "@heroicons/react/24/outline";
import NavLink from "./NavLink";
import SignOutLink from "./SignOutLink";

export default function SideNav() {
  return (
    <div className="flex h-full flex-col px-3 py-4 md:px-2">
      <div className="mb-2 flex h-20 items-center justify-start rounded-md bg-indigo-600 p-4 md:h-40">
        <MyLogo />
      </div>
      <div className="flex grow flex-row justify-between space-x-2 md:flex-col md:space-x-0 md:space-y-2">
        <NavLinks />
        <div className="hidden h-auto w-full grow rounded-md bg-gray-50 md:block"></div>
        <div className="hidden w-full md:block">
          <SignOutLink />
        </div>
      </div>
    </div>
  );
}
