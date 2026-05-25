"use client";

import { signOut } from "next-auth/react";
import { LogOut, ExternalLink } from "lucide-react";
import { usePathname } from "next/navigation";

const titles: Record<string, string> = {
  "/admin":            "Dashboard",
  "/admin/hero":       "Hero Section",
  "/admin/about":      "About / Bio",
  "/admin/experience": "Work Experience",
  "/admin/education":  "Education",
  "/admin/skills":     "Skills",
  "/admin/projects":   "Case Studies",
  "/admin/gallery":    "Creative Gallery",
  "/admin/navbar":     "Navbar Editor",
  "/admin/messages":   "Messages",
  "/admin/contact":    "Contact Info",
  "/admin/settings":   "Settings",
};

export default function AdminTopbar() {
  const pathname = usePathname();
  const title = titles[pathname] ?? "Admin";

  return (
    <header className="h-16 shrink-0 flex items-center justify-between px-8 lg:px-10 bg-white border-b border-gray-100/80">
      <div className="flex items-center gap-3 pl-12 lg:pl-0">
        <div className="w-1.5 h-5 rounded-full bg-gray-200" />
        <span className="text-[15px] font-semibold text-gray-900 tracking-tight">{title}</span>
      </div>

      <div className="flex items-center gap-2">
        <a
          href="/"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-[13px] font-medium text-gray-600
                     bg-gray-50 hover:bg-gray-100 border border-gray-200 hover:border-gray-300
                     transition-all duration-300"
        >
          <ExternalLink size={13} />
          <span className="hidden sm:inline">Preview</span>
        </a>
        <button
          onClick={() => signOut({ callbackUrl: "/admin/login" })}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-[13px] font-medium
                     text-gray-600 hover:text-red-600 hover:bg-red-50 border border-transparent
                     hover:border-red-100 transition-all duration-300"
        >
          <LogOut size={13} />
          <span className="hidden sm:inline">Sign out</span>
        </button>
      </div>
    </header>
  );
}
