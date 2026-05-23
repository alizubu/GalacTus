"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard, UserCircle, Briefcase, GraduationCap,
  Wrench, FolderKanban, ImageIcon, Mail, Settings,
  MessageSquare, ExternalLink, FileText,
} from "lucide-react";

const nav = [
  { href: "/admin",            label: "Dashboard",       icon: LayoutDashboard, exact: true },
  { href: "/admin/hero",       label: "Hero",            icon: UserCircle },
  { href: "/admin/about",      label: "About / Bio",     icon: FileText },
  { href: "/admin/experience", label: "Work Experience", icon: Briefcase },
  { href: "/admin/education",  label: "Education",       icon: GraduationCap },
  { href: "/admin/skills",     label: "Skills",          icon: Wrench },
  { href: "/admin/projects",   label: "Case Studies",    icon: FolderKanban },
  { href: "/admin/gallery",    label: "Gallery",         icon: ImageIcon },
  { href: "/admin/messages",   label: "Messages",        icon: MessageSquare },
  { href: "/admin/contact",    label: "Contact",         icon: Mail },
  { href: "/admin/settings",   label: "Settings",        icon: Settings },
];

export default function AdminSidebar() {
  const pathname = usePathname();

  return (
    <aside
      className="w-52 shrink-0 flex flex-col"
      style={{
        background: "#111111",
        borderRight: "1px solid rgba(255,255,255,0.06)",
        minHeight: "100vh",
      }}
    >
      {/* Brand */}
      <div className="px-5 pt-6 pb-5" style={{ borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
        <div className="flex items-center gap-2.5">
          <div className="w-7 h-7 rounded-lg bg-white flex items-center justify-center shrink-0">
            <span className="text-black text-xs font-black">SD</span>
          </div>
          <div>
            <p className="text-white text-sm font-semibold leading-none">Shelvey Dias</p>
            <p className="text-white/30 text-[10px] mt-0.5">Admin Panel</p>
          </div>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 py-3 px-2 overflow-y-auto space-y-0.5">
        {nav.map((item) => {
          const active = item.exact
            ? pathname === item.href
            : pathname.startsWith(item.href) && item.href !== "/admin";
          return (
            <Link
              key={item.href}
              href={item.href}
              className="flex items-center gap-2.5 px-3 py-2 rounded-lg text-[13px] transition-all duration-150"
              style={{
                background: active ? "rgba(255,255,255,0.1)" : "transparent",
                color: active ? "#ffffff" : "rgba(255,255,255,0.45)",
                fontWeight: active ? 500 : 400,
              }}
              onMouseEnter={(e) => {
                if (!active) (e.currentTarget as HTMLElement).style.color = "rgba(255,255,255,0.8)";
              }}
              onMouseLeave={(e) => {
                if (!active) (e.currentTarget as HTMLElement).style.color = "rgba(255,255,255,0.45)";
              }}
            >
              <item.icon size={14} strokeWidth={active ? 2.2 : 1.8} />
              {item.label}
            </Link>
          );
        })}
      </nav>

      {/* Footer */}
      <div className="p-2" style={{ borderTop: "1px solid rgba(255,255,255,0.06)" }}>
        <a
          href="/"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-2.5 px-3 py-2 rounded-lg text-[13px] transition-all"
          style={{ color: "rgba(255,255,255,0.35)" }}
          onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.color = "rgba(255,255,255,0.7)"; }}
          onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.color = "rgba(255,255,255,0.35)"; }}
        >
          <ExternalLink size={13} />
          View Website
        </a>
      </div>
    </aside>
  );
}
