"use client";

import { signOut } from "next-auth/react";
import { LogOut, ExternalLink } from "lucide-react";
import { usePathname } from "next/navigation";

const titles: Record<string, string> = {
  "/admin": "Dashboard",
  "/admin/hero": "Hero Section",
  "/admin/about": "About / Bio",
  "/admin/experience": "Work Experience",
  "/admin/education": "Education",
  "/admin/skills": "Skills",
  "/admin/projects": "Case Studies",
  "/admin/gallery": "Creative Gallery",
  "/admin/messages": "Messages",
  "/admin/contact": "Contact Info",
  "/admin/settings": "Settings",
};

export default function AdminTopbar() {
  const pathname = usePathname();
  const title = titles[pathname] ?? "Admin";

  return (
    <header
      className="h-14 flex items-center justify-between px-6 shrink-0"
      style={{
        background: "#ffffff",
        borderBottom: "1px solid #ebebeb",
      }}
    >
      <h2 className="text-sm font-semibold text-gray-800">{title}</h2>

      <div className="flex items-center gap-2">
        <a
          href="/"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs text-gray-500 hover:text-gray-800 hover:bg-gray-100 transition-all"
        >
          <ExternalLink size={12} />
          Preview
        </a>
        <button
          onClick={() => signOut({ callbackUrl: "/admin/login" })}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs text-gray-500 hover:text-red-600 hover:bg-red-50 transition-all"
        >
          <LogOut size={12} />
          Sign out
        </button>
      </div>
    </header>
  );
}
