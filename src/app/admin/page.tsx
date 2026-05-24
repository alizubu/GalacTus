import Link from "next/link";
import {
  Briefcase, FolderKanban, Wrench, MessageSquare,
  AlertTriangle, TrendingUp, Users, ArrowUpRight,
} from "lucide-react";

async function getStats() {
  try {
    const { db } = await import("@/lib/db");
    const [expCount, projCount, skillCount, unread] = await Promise.all([
      db.experience.count(),
      db.project.count(),
      db.skill.count(),
      db.contactMessage.count({ where: { read: false } }),
    ]);
    return { expCount, projCount, skillCount, unread, dbOk: true };
  } catch {
    return { expCount: 0, projCount: 0, skillCount: 0, unread: 0, dbOk: false };
  }
}

export default async function AdminDashboard() {
  const { expCount, projCount, skillCount, unread, dbOk } = await getStats();

  const stats = [
    {
      label: "Work Entries",
      value: expCount,
      icon: Briefcase,
      href: "/admin/experience",
      color: "#6366f1",
      bg: "#eef2ff",
      change: "Career history",
    },
    {
      label: "Case Studies",
      value: projCount,
      icon: FolderKanban,
      href: "/admin/projects",
      color: "#8b5cf6",
      bg: "#f5f3ff",
      change: "Portfolio projects",
    },
    {
      label: "Skills",
      value: skillCount,
      icon: Wrench,
      href: "/admin/skills",
      color: "#0ea5e9",
      bg: "#f0f9ff",
      change: "Listed skills",
    },
    {
      label: "Unread Messages",
      value: unread,
      icon: MessageSquare,
      href: "/admin/messages",
      color: unread > 0 ? "#f59e0b" : "#6b7280",
      bg: unread > 0 ? "#fffbeb" : "#f9fafb",
      change: unread > 0 ? "Needs attention" : "All caught up",
      highlight: unread > 0,
    },
  ];

  const sections = [
    { label: "Hero Section",    href: "/admin/hero",       icon: Users,        desc: "Name, tagline & photo" },
    { label: "About / Bio",     href: "/admin/about",      icon: TrendingUp,   desc: "Your story & background" },
    { label: "Work Experience", href: "/admin/experience", icon: Briefcase,    desc: "Career timeline" },
    { label: "Case Studies",    href: "/admin/projects",   icon: FolderKanban, desc: "Portfolio work" },
    { label: "Skills",          href: "/admin/skills",     desc: "Technical expertise", icon: Wrench },
    { label: "Gallery",         href: "/admin/gallery",    desc: "Visual branding work", icon: FolderKanban },
  ];

  return (
    <div className="space-y-8">

      {/* Page header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900 tracking-tight">Dashboard</h1>
        <p className="text-gray-500 text-sm mt-1">
          Manage your portfolio content. Changes reflect on your live site.
        </p>
      </div>

      {/* DB warning */}
      {!dbOk && (
        <div className="flex items-start gap-3 p-4 rounded-2xl bg-amber-50 border border-amber-200">
          <AlertTriangle size={16} className="text-amber-500 shrink-0 mt-0.5" />
          <div>
            <p className="text-sm font-semibold text-amber-800">Database not connected</p>
            <p className="text-xs text-amber-600 mt-0.5">
              Add <code className="bg-amber-100 px-1 rounded">DATABASE_URL</code> to Vercel environment variables and redeploy.
            </p>
          </div>
        </div>
      )}

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        {stats.map((s) => (
          <Link
            key={s.label}
            href={s.href}
            className={`group relative flex flex-col gap-4 p-5 rounded-2xl bg-white border transition-all duration-200 hover:shadow-md hover:-translate-y-0.5 ${
              s.highlight ? "border-amber-200 shadow-amber-50 shadow-sm" : "border-gray-100 shadow-sm"
            }`}
          >
            {/* Icon + badge */}
            <div className="flex items-start justify-between">
              <div
                className="w-10 h-10 rounded-xl flex items-center justify-center"
                style={{ background: s.bg }}
              >
                <s.icon size={18} style={{ color: s.color }} />
              </div>
              {s.highlight && s.value > 0 && (
                <span className="text-[11px] font-bold px-2.5 py-1 rounded-full bg-amber-100 text-amber-600">
                  {s.value} new
                </span>
              )}
            </div>

            {/* Value */}
            <div>
              <p className="text-3xl font-bold text-gray-900 tabular-nums leading-none">{s.value}</p>
              <p className="text-sm text-gray-500 font-medium mt-1">{s.label}</p>
              <p className="text-[11px] text-gray-400 mt-0.5 flex items-center gap-1">
                {s.change}
                <ArrowUpRight size={10} className="opacity-0 group-hover:opacity-100 transition-opacity" />
              </p>
            </div>
          </Link>
        ))}
      </div>

      {/* Content sections */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-base font-semibold text-gray-900">Content Sections</h2>
          <p className="text-xs text-gray-400">Click any section to edit</p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {sections.map((s) => (
            <Link
              key={s.href}
              href={s.href}
              className="group flex items-center gap-4 p-4 rounded-2xl bg-white border border-gray-100 shadow-sm
                         hover:border-gray-200 hover:shadow-md transition-all duration-200"
            >
              <div className="w-9 h-9 rounded-xl bg-gray-50 flex items-center justify-center shrink-0 border border-gray-100 group-hover:bg-gray-100 transition-colors">
                <s.icon size={15} className="text-gray-500" />
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-sm font-semibold text-gray-800 truncate">{s.label}</p>
                <p className="text-xs text-gray-400 truncate mt-0.5">{s.desc}</p>
              </div>
              <ArrowUpRight size={14} className="text-gray-300 shrink-0 opacity-0 group-hover:opacity-100 transition-opacity" />
            </Link>
          ))}
        </div>
      </div>

    </div>
  );
}
