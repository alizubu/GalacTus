"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";
import {
  LayoutDashboard, UserCircle, Briefcase, GraduationCap,
  Wrench, FolderKanban, ImageIcon, Mail, Settings,
  MessageSquare, ExternalLink, FileText, Menu, X, Navigation,
  Users, CircleUser, Star,
} from "lucide-react";

// permissionKey = null → always visible; string → requires that key (or master role)
const NAV_ITEMS = [
  { href: "/admin",            label: "Dashboard",       icon: LayoutDashboard, permKey: null,         exact: true },
  { href: "/admin/hero",       label: "Hero",            icon: UserCircle,      permKey: "hero" },
  { href: "/admin/about",      label: "About / Bio",     icon: FileText,        permKey: "about" },
  { href: "/admin/experience", label: "Work Experience", icon: Briefcase,       permKey: "experience" },
  { href: "/admin/education",  label: "Education",       icon: GraduationCap,   permKey: "education" },
  { href: "/admin/skills",     label: "Skills",          icon: Wrench,          permKey: "skills" },
  { href: "/admin/projects",   label: "Case Studies",    icon: FolderKanban,    permKey: "projects" },
  { href: "/admin/gallery",        label: "Gallery",         icon: ImageIcon,       permKey: "gallery" },
  { href: "/admin/navbar",         label: "Navbar",          icon: Navigation,      permKey: "navbar" },
  { href: "/admin/testimonials",   label: "Testimonials",    icon: Star,            permKey: "testimonials" },
  { href: "/admin/messages",       label: "Messages",        icon: MessageSquare,   permKey: "messages" },
  { href: "/admin/contact",        label: "Contact",         icon: Mail,            permKey: "contact" },
  { href: "/admin/settings",       label: "Settings",        icon: Settings,        permKey: "settings" },
  // Master-only
  { href: "/admin/users",      label: "Users",           icon: Users,           permKey: "__master__" },
];

type SessionUser = {
  id: string; name: string; email: string;
  avatarUrl: string; role: string; permissions: string[];
};

function canSee(item: { permKey: string | null }, role: string, permissions: string[]): boolean {
  if (item.permKey === null) return true;                   // always visible
  if (item.permKey === "__master__") return role === "master";
  if (role === "master") return true;                       // master sees everything
  return permissions.includes(item.permKey);
}

function NavLink({ item, pathname, onClose, role, permissions }: {
  item: typeof NAV_ITEMS[0]; pathname: string;
  onClose?: () => void; role: string; permissions: string[];
}) {
  if (!canSee(item, role, permissions)) return null;
  const active = item.exact
    ? pathname === item.href
    : pathname.startsWith(item.href) && item.href !== "/admin";

  return (
    <Link href={item.href} onClick={onClose}
      className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-[13px] font-medium transition-all duration-300 ${
        active
          ? "bg-white/12 text-white shadow-sm"
          : "text-white/45 hover:text-white hover:bg-white/7"
      }`}
    >
      <item.icon size={15} strokeWidth={active ? 2.2 : 1.7} className="shrink-0" />
      {item.label}
    </Link>
  );
}

function SidebarContent({ pathname, sessionUser, onClose }: {
  pathname: string; sessionUser: SessionUser; onClose?: () => void;
}) {
  const { name, avatarUrl, role, permissions } = sessionUser;
  const initials = name.split(" ").filter(Boolean).map((n) => n[0]).join("").slice(0, 2).toUpperCase() || "SD";

  const contentItems = NAV_ITEMS.filter(
    (i) => i.permKey !== "__master__"
        && i.href !== "/admin/settings"
        && i.href !== "/admin/messages"
        && i.href !== "/admin/contact"
  );
  const manageItems = NAV_ITEMS.filter(
    (i) => ["/admin/messages", "/admin/contact", "/admin/settings", "/admin/users"].includes(i.href)
  );

  return (
    <div className="flex flex-col h-full">
      {/* Brand */}
      <div className="flex items-center justify-between px-6 py-6 border-b border-white/[0.06]">
        <div className="flex items-center gap-3.5">
          <div className="w-9 h-9 rounded-xl bg-white flex items-center justify-center shrink-0 shadow-md overflow-hidden">
            {avatarUrl
              ? <img src={avatarUrl} alt={name} className="w-full h-full object-cover" />
              : <span className="text-black text-[11px] font-black tracking-tight">{initials}</span>}
          </div>
          <div>
            <p className="text-white text-sm font-bold leading-none truncate max-w-[140px]">{name || "Admin"}</p>
            <p className="text-white/30 text-[11px] mt-0.5 font-medium capitalize">
              {role === "master" ? "Master" : "User"}
            </p>
          </div>
        </div>
        {onClose && (
          <button onClick={onClose} className="text-white/40 hover:text-white/80 transition-all duration-300 lg:hidden">
            <X size={18} />
          </button>
        )}
      </div>

      {/* Nav */}
      <nav className="flex-1 py-5 px-3.5 space-y-1 overflow-y-auto admin-sidebar-scroll">
        <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-white/20 px-3 pb-2">Content</p>
        {contentItems.map((item) => (
          <NavLink key={item.href} item={item} pathname={pathname}
            onClose={onClose} role={role} permissions={permissions} />
        ))}

        <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-white/20 px-3 pt-4 pb-2">Manage</p>
        {manageItems.map((item) => (
          <NavLink key={item.href} item={item} pathname={pathname}
            onClose={onClose} role={role} permissions={permissions} />
        ))}

        {/* My Profile — always visible */}
        <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-white/20 px-3 pt-4 pb-2">Account</p>
        <Link href="/admin/profile" onClick={onClose}
          className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-[13px] font-medium transition-all duration-300 ${
            pathname === "/admin/profile"
              ? "bg-white/12 text-white shadow-sm"
              : "text-white/45 hover:text-white hover:bg-white/7"
          }`}>
          <CircleUser size={15} className="shrink-0" />
          My Profile
        </Link>
      </nav>

      {/* Footer */}
      <div className="p-3.5 border-t border-white/[0.06]">
        <a href="/" target="_blank" rel="noopener noreferrer"
          className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-[13px] text-white/30 hover:text-white/65 hover:bg-white/5 transition-all duration-300">
          <ExternalLink size={14} className="shrink-0" />
          View Website
        </a>
      </div>
    </div>
  );
}

export default function AdminSidebar({ sessionUser }: { sessionUser: SessionUser }) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  // Fetch fresh profile data client-side so avatar updates immediately after profile save
  const [liveUser, setLiveUser] = useState<SessionUser>(sessionUser);

  useEffect(() => {
    fetch("/api/admin/profile")
      .then((r) => r.json())
      .then((data) => {
        if (data.id) {
          setLiveUser((prev) => ({
            ...prev,
            name:      data.name      ?? prev.name,
            avatarUrl: data.avatarUrl ?? prev.avatarUrl,
            role:      data.role      ?? prev.role,
          }));
        }
      })
      .catch(() => {});
  }, []);

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="lg:hidden fixed top-4 left-4 z-40 w-10 h-10 rounded-xl bg-[#111] text-white flex items-center justify-center shadow-lg transition-all duration-300 hover:bg-[#222]"
      >
        <Menu size={16} />
      </button>

      {open && (
        <div className="lg:hidden fixed inset-0 z-40 bg-black/60 backdrop-blur-sm" onClick={() => setOpen(false)} />
      )}

      <aside
        className={`lg:hidden fixed left-0 top-0 bottom-0 z-50 w-[260px] flex flex-col transition-transform duration-300 ${
          open ? "translate-x-0" : "-translate-x-full"
        }`}
        style={{ background: "#0f0f0f" }}
      >
        <SidebarContent pathname={pathname} sessionUser={liveUser} onClose={() => setOpen(false)} />
      </aside>

      <aside
        className="hidden lg:flex flex-col w-[240px] shrink-0 h-screen sticky top-0"
        style={{ background: "#0f0f0f", borderRight: "1px solid rgba(255,255,255,0.04)" }}
      >
        <SidebarContent pathname={pathname} sessionUser={liveUser} />
      </aside>
    </>
  );
}
