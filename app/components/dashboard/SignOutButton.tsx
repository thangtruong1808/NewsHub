"use client";

import { PowerIcon } from "@heroicons/react/24/outline";
import { signOutAction } from "@/app/actions/auth";

interface SignOutButtonProps {
  isMobile?: boolean;
}

export default function SignOutButton({
  isMobile = false,
}: SignOutButtonProps) {
  return (
    <form action={signOutAction}>
      <button className="flex h-[48px] grow items-center justify-center gap-2 rounded-md bg-gray-50 p-3 text-sm font-medium hover:bg-sky-100 hover:text-blue-600 md:flex-none md:justify-start md:p-2 md:px-3">
        <PowerIcon className="w-6" />
        <div className="hidden md:block">Sign Out</div>
      </button>
    </form>
  );
}
