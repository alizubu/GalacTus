"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard, User, Briefcase, GraduationCap,
  Wrench, FolderKanban, Image, Mail, Settings,
  MessageSquare, ExternalLink,
} from "lucide-react";

const nav = [
  { href: "/admin", label: "Dashboard", icon: LayoutDashboard, exact: true },
  { href: "/admin/hero", label: "Hero Section", icon: User },
  { href: "/admin/about", label: "About / Bio", icon: User },
  { href: "/admin/experience", label: "Work Experience", icon: Briefcase },
  { href: "/admin/education", label: "Education", icon: GraduationCap },
  { href: "/admin/skills", label: "Skills", icon: Wrench },
  { href: "/admin/projects", label: "Case Studies", icon: FolderKanban },
  { href: "/admin/gallery", label: "Creative Gallery", icon: Image },
  { href: "/admin/messages", label: "Messages", icon: MessageSquare },
  { href: "/admin/contact", label: "Contact Info", icon: Mail },
  { href: "/admin/settings", label: "Settings", icon: Settings },
];

export default function AdminSidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-56 shrink-0 bg-[#0f0f0f] border-r border-white/5 flex flex-col min-h-screen">
      {/* Logo */}
      <div className="px-5 py-5 border-b border-white/5">
        <p className="text-white font-bold text-sm">⚡ Admin Panel</p>
        <p className="text-white/30 text-xs mt-0.5">Shelvey Dias</p>
      </div>

      {/* Nav */}
      <nav className="flex-1 py-3 overflow-y-auto">
        {nav.map((item) => {
          const active = item.exact
            ? pathname === item.href
            : pathname.startsWith(item.href) && item.href !== "/admin";
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 px-4 py-2.5 mx-2 rounded-lg text-sm transition-all ${
                active
                  ? "bg-white text-black font-medium"
                  : "text-white/50 hover:text-white hover:bg-white/5"
              }`}
            >
              <item.icon size={15} />
              {item.label}
            </Link>
          );
        })}
      </nav>

      {/* View site */}
      <div className="p-3 border-t border-white/5">
        <a
          href="/"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm text-white/40 hover:text-white hover:bg-white/5 transition-all"
        >
          <ExternalLink size={14} />
          View Website
        </a>
      </div>
    </aside>
  );
}
