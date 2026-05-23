import Link from "next/link";
import {
  Briefcase, FolderKanban, Wrench, MessageSquare,
  ExternalLink, AlertTriangle, ArrowRight, TrendingUp,
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
    { label: "Work Entries", value: expCount, icon: Briefcase, href: "/admin/experience", color: "#6366f1" },
    { label: "Case Studies", value: projCount, icon: FolderKanban, href: "/admin/projects", color: "#8b5cf6" },
    { label: "Skills", value: skillCount, icon: Wrench, href: "/admin/skills", color: "#06b6d4" },
    { label: "Unread Messages", value: unread, icon: MessageSquare, href: "/admin/messages", color: "#f59e0b", alert: true },
  ];

  const quickLinks = [
    { label: "Edit Hero", href: "/admin/hero", desc: "Name, tagline, avatar" },
    { label: "Edit About", href: "/admin/about", desc: "Bio & rich text" },
    { label: "Work Experience", href: "/admin/experience", desc: "Jobs & roles" },
    { label: "Case Studies", href: "/admin/projects", desc: "Portfolio projects" },
    { label: "Skills", href: "/admin/skills", desc: "Skill tags" },
    { label: "Gallery", href: "/admin/gallery", desc: "Creative work" },
  ];

  return (
    <div className="max-w-5xl space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 tracking-tight">Dashboard</h1>
          <p className="text-gray-400 text-sm mt-0.5">Welcome back, Shelvey</p>
        </div>
        <a
          href="/"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all"
          style={{
            background: "linear-gradient(135deg, #1a1a1a, #2d2d2d)",
            color: "white",
            boxShadow: "0 2px 8px rgba(0,0,0,0.12)",
          }}
        >
          <ExternalLink size={13} />
          Preview Site
        </a>
      </div>

      {/* DB warning */}
      {!dbOk && (
        <div
          className="flex items-start gap-3 rounded-2xl p-4"
          style={{
            background: "rgba(245,158,11,0.08)",
            border: "1px solid rgba(245,158,11,0.2)",
          }}
        >
          <AlertTriangle size={16} className="text-amber-500 shrink-0 mt-0.5" />
          <div>
            <p className="text-sm font-semibold text-amber-700">Database not connected</p>
            <p className="text-xs text-amber-600 mt-0.5">
              Add <code className="bg-amber-100 px-1 rounded text-amber-700">DATABASE_URL</code> to Vercel environment variables and redeploy.
            </p>
          </div>
        </div>
      )}

      {/* Stats grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((s) => (
          <Link
            key={s.label}
            href={s.href}
            className="group rounded-2xl p-5 transition-all duration-200 hover:-translate-y-0.5"
            style={{
              background: "white",
              border: "1px solid #ebebeb",
              boxShadow: "0 1px 4px rgba(0,0,0,0.04)",
            }}
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLElement).style.boxShadow = "0 8px 24px rgba(0,0,0,0.08)";
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLElement).style.boxShadow = "0 1px 4px rgba(0,0,0,0.04)";
            }}
          >
            <div className="flex items-center justify-between mb-4">
              <div
                className="w-9 h-9 rounded-xl flex items-center justify-center"
                style={{ background: `${s.color}15` }}
              >
                <s.icon size={16} style={{ color: s.color }} />
              </div>
              {s.alert && s.value > 0 && (
                <span
                  className="text-[10px] font-bold px-2 py-0.5 rounded-full"
                  style={{ background: "#fef3c7", color: "#d97706" }}
                >
                  {s.value} new
                </span>
              )}
            </div>
            <p className="text-3xl font-bold text-gray-900 tabular-nums">{s.value}</p>
            <p className="text-xs text-gray-400 mt-1 flex items-center gap-1">
              {s.label}
              <ArrowRight size={10} className="opacity-0 group-hover:opacity-100 transition-opacity" />
            </p>
          </Link>
        ))}
      </div>

      {/* Quick edit */}
      <div
        className="rounded-2xl p-6"
        style={{ background: "white", border: "1px solid #ebebeb", boxShadow: "0 1px 4px rgba(0,0,0,0.04)" }}
      >
        <div className="flex items-center gap-2 mb-5">
          <TrendingUp size={15} className="text-gray-400" />
          <h2 className="font-semibold text-gray-800 text-sm">Quick Edit</h2>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          {quickLinks.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className="group flex flex-col gap-0.5 px-4 py-3 rounded-xl transition-all duration-150"
              style={{ border: "1px solid #f0f0f0", background: "#fafafa" }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLElement).style.background = "#f5f5f5";
                (e.currentTarget as HTMLElement).style.borderColor = "#e0e0e0";
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLElement).style.background = "#fafafa";
                (e.currentTarget as HTMLElement).style.borderColor = "#f0f0f0";
              }}
            >
              <span className="text-sm font-medium text-gray-800">{l.label}</span>
              <span className="text-[11px] text-gray-400">{l.desc}</span>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
