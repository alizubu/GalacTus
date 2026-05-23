"use client";

import { signOut } from "next-auth/react";
import { LogOut } from "lucide-react";

export default function AdminTopbar() {
  return (
    <header className="h-14 bg-white border-b border-gray-100 flex items-center justify-between px-6 shrink-0">
      <div />
      <button
        onClick={() => signOut({ callbackUrl: "/admin/login" })}
        className="flex items-center gap-2 text-sm text-gray-500 hover:text-gray-900 transition-colors"
      >
        <LogOut size={15} />
        Sign out
      </button>
    </header>
  );
}
