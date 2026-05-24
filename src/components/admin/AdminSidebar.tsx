"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import {
  LayoutDashboard, UserCircle, Briefcase, GraduationCap,
  Wrench, FolderKanban, ImageIcon, Mail, Settings,
  MessageSquare, ExternalLink, FileText, Menu, X,
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

function SidebarContent({ pathname, onClose }: { pathname: string; onClose?: () => void }) {
  return (
    <div className="flex flex-col h-full">
      {/* Brand */}
      <div className="flex items-center justify-between px-5 py-5 border-b border-white/[0.06]">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-xl bg-white flex items-center justify-center shrink-0 shadow-sm">
            <span className="text-black text-xs font-black tracking-tight">SD</span>
          </div>
          <div>
            <p className="text-white text-[13px] font-semibold leading-none">Shelvey Dias</p>
            <p className="text-white/30 text-[10px] mt-0.5 font-medium">Portfolio Admin</p>
          </div>
        </div>
        {onClose && (
          <button onClick={onClose} className="text-white/40 hover:text-white/80 transition-colors lg:hidden">
            <X size={18} />
          </button>
        )}
      </div>

      {/* Nav */}
      <nav className="flex-1 py-4 px-3 space-y-0.5 overflow-y-auto admin-sidebar-scroll">
        <p className="text-[10px] font-semibold uppercase tracking-[0.15em] text-white/20 px-2 mb-2">Content</p>
        {nav.slice(0, 7).map((item) => {
          const active = item.exact
            ? pathname === item.href
            : pathname.startsWith(item.href) && item.href !== "/admin";
          return (
            <Link key={item.href} href={item.href} onClick={onClose}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-[13px] font-medium transition-all duration-150 ${
                active
                  ? "bg-white/10 text-white"
                  : "text-white/50 hover:text-white/85 hover:bg-white/5"
              }`}
            >
              <item.icon size={15} strokeWidth={active ? 2.2 : 1.8} className="shrink-0" />
              {item.label}
            </Link>
          );
        })}

        <p className="text-[10px] font-semibold uppercase tracking-[0.15em] text-white/20 px-2 mt-4 mb-2">Manage</p>
        {nav.slice(7).map((item) => {
          const active = pathname.startsWith(item.href);
          return (
            <Link key={item.href} href={item.href} onClick={onClose}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-[13px] font-medium transition-all duration-150 ${
                active
                  ? "bg-white/10 text-white"
                  : "text-white/50 hover:text-white/85 hover:bg-white/5"
              }`}
            >
              <item.icon size={15} strokeWidth={active ? 2.2 : 1.8} className="shrink-0" />
              {item.label}
            </Link>
          );
        })}
      </nav>

      {/* Footer */}
      <div className="p-3 border-t border-white/[0.06]">
        <a href="/" target="_blank" rel="noopener noreferrer"
          className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-[13px] text-white/35 hover:text-white/70 hover:bg-white/5 transition-all">
          <ExternalLink size={14} className="shrink-0" />
          View Website
        </a>
      </div>
    </div>
  );
}

export default function AdminSidebar() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  return (
    <>
      {/* Mobile hamburger button */}
      <button
        onClick={() => setOpen(true)}
        className="lg:hidden fixed top-4 left-4 z-40 w-9 h-9 rounded-xl bg-[#111] text-white flex items-center justify-center shadow-lg"
      >
        <Menu size={16} />
      </button>

      {/* Mobile overlay */}
      {open && (
        <div
          className="lg:hidden fixed inset-0 z-40 bg-black/50 backdrop-blur-sm"
          onClick={() => setOpen(false)}
        />
      )}

      {/* Mobile drawer */}
      <aside
        className={`lg:hidden fixed left-0 top-0 bottom-0 z-50 w-[240px] flex flex-col transition-transform duration-300 ${
          open ? "translate-x-0" : "-translate-x-full"
        }`}
        style={{ background: "#111111" }}
      >
        <SidebarContent pathname={pathname} onClose={() => setOpen(false)} />
      </aside>

      {/* Desktop sidebar */}
      <aside
        className="hidden lg:flex flex-col w-[220px] shrink-0 h-screen sticky top-0"
        style={{ background: "#111111", borderRight: "1px solid rgba(255,255,255,0.05)" }}
      >
        <SidebarContent pathname={pathname} />
      </aside>
    </>
  );
}
