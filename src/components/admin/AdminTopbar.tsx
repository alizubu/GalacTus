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
  "/admin/messages":   "Messages",
  "/admin/contact":    "Contact Info",
  "/admin/settings":   "Settings",
};

export default function AdminTopbar() {
  const pathname = usePathname();
  const title = titles[pathname] ?? "Admin";

  return (
    <header className="h-14 shrink-0 flex items-center justify-between px-6 lg:px-10 bg-white border-b border-gray-100">
      {/* Left — page title (with mobile left offset for hamburger) */}
      <div className="flex items-center gap-3 pl-10 lg:pl-0">
        <span className="text-sm font-semibold text-gray-800 tracking-tight">{title}</span>
      </div>

      {/* Right — actions */}
      <div className="flex items-center gap-1.5">
        <a
          href="/"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-xs font-medium text-gray-600 bg-gray-50 hover:bg-gray-100 border border-gray-200 transition-all"
        >
          <ExternalLink size={12} />
          <span className="hidden sm:inline">Preview</span>
        </a>
        <button
          onClick={() => signOut({ callbackUrl: "/admin/login" })}
          className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-xs font-medium text-gray-600 hover:text-red-600 hover:bg-red-50 border border-transparent hover:border-red-100 transition-all"
        >
          <LogOut size={12} />
          <span className="hidden sm:inline">Sign out</span>
        </button>
      </div>
    </header>
  );
}
