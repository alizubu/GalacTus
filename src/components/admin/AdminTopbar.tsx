"use client";

import { signOut } from "next-auth/react";
import { LogOut, ExternalLink } from "lucide-react";
import { usePathname } from "next/navigation";
import AdminThemeToggle from "./AdminThemeToggle";
import { useAdminTheme } from "./AdminThemeProvider";

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
  "/admin/testimonials": "Testimonials",
  "/admin/messages":   "Messages",
  "/admin/contact":    "Contact Info",
  "/admin/settings":   "Settings",
};

export default function AdminTopbar() {
  const pathname = usePathname();
  const title = titles[pathname] ?? "Admin";
  const { dark } = useAdminTheme();

  const headerBg     = dark ? "#16171f" : "#ffffff";
  const headerBorder = dark ? "rgba(255,255,255,0.06)" : "rgba(229,231,235,0.8)";
  const titleColor   = dark ? "rgba(255,255,255,0.88)" : "#111827";
  const accentBg     = dark ? "rgba(255,255,255,0.06)" : "#f3f4f6";
  const accentBorder = dark ? "rgba(255,255,255,0.10)" : "#e5e7eb";
  const accentColor  = dark ? "rgba(255,255,255,0.55)" : "#4b5563";

  return (
    <header
      className="h-16 shrink-0 flex items-center justify-between px-8 lg:px-10 admin-topbar transition-colors duration-300"
      style={{
        background: headerBg,
        borderBottom: `1px solid ${headerBorder}`,
      }}
    >
      <div className="flex items-center gap-3 pl-12 lg:pl-0">
        <div
          className="w-1.5 h-5 rounded-full transition-colors duration-300"
          style={{ background: dark ? "rgba(255,255,255,0.12)" : "#e5e7eb" }}
        />
        <span
          className="text-[15px] font-semibold tracking-tight transition-colors duration-300"
          style={{ color: titleColor }}
        >
          {title}
        </span>
      </div>

      <div className="flex items-center gap-2">
        {/* Theme toggle */}
        <AdminThemeToggle />

        <a
          href="/"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-[13px] font-medium
                     transition-all duration-200 hover:scale-[1.02]"
          style={{
            background: accentBg,
            border: `1px solid ${accentBorder}`,
            color: accentColor,
          }}
        >
          <ExternalLink size={13} />
          <span className="hidden sm:inline">Preview</span>
        </a>
        <button
          onClick={() => signOut({ callbackUrl: "/admin/login" })}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-[13px] font-medium
                     border border-transparent transition-all duration-200 hover:scale-[1.02]"
          style={{
            color: dark ? "rgba(255,255,255,0.45)" : "#6b7280",
          }}
          onMouseEnter={(e) => {
            (e.currentTarget as HTMLButtonElement).style.color = "#ef4444";
            (e.currentTarget as HTMLButtonElement).style.background = "rgba(239,68,68,0.08)";
            (e.currentTarget as HTMLButtonElement).style.borderColor = "rgba(239,68,68,0.18)";
          }}
          onMouseLeave={(e) => {
            (e.currentTarget as HTMLButtonElement).style.color = dark ? "rgba(255,255,255,0.45)" : "#6b7280";
            (e.currentTarget as HTMLButtonElement).style.background = "transparent";
            (e.currentTarget as HTMLButtonElement).style.borderColor = "transparent";
          }}
        >
          <LogOut size={13} />
          <span className="hidden sm:inline">Sign out</span>
        </button>
      </div>
    </header>
  );
}
