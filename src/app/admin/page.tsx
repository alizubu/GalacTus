import Link from "next/link";
import { Briefcase, FolderKanban, Wrench, MessageSquare, AlertTriangle, ArrowUpRight } from "lucide-react";

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
      label: "Work Entries", value: expCount, icon: Briefcase,
      href: "/admin/experience", color: "#6366f1", bg: "#eef2ff",
      change: "Career history", highlight: false,
    },
    {
      label: "Case Studies", value: projCount, icon: FolderKanban,
      href: "/admin/projects", color: "#8b5cf6", bg: "#f5f3ff",
      change: "Portfolio projects", highlight: false,
    },
    {
      label: "Skills", value: skillCount, icon: Wrench,
      href: "/admin/skills", color: "#0ea5e9", bg: "#f0f9ff",
      change: "Listed skills", highlight: false,
    },
    {
      label: "Unread Messages", value: unread, icon: MessageSquare,
      href: "/admin/messages",
      color: unread > 0 ? "#f59e0b" : "#9ca3af",
      bg: unread > 0 ? "#fffbeb" : "#f9fafb",
      change: unread > 0 ? "Needs attention" : "All caught up",
      highlight: unread > 0,
    },
  ];

  return (
    <div className="space-y-10 w-full">

      {/* Header */}
      <div className="pb-2 border-b border-gray-100">
        <h1 className="text-3xl font-bold text-gray-900 tracking-tight">Dashboard</h1>
        <p className="text-gray-500 text-[15px] mt-2 leading-relaxed">
          Manage your portfolio content. All changes reflect on your live site in real-time.
        </p>
      </div>

      {/* DB warning */}
      {!dbOk && (
        <div className="flex items-start gap-4 p-5 rounded-2xl bg-amber-50 border border-amber-200">
          <div className="w-8 h-8 rounded-lg bg-amber-100 flex items-center justify-center shrink-0">
            <AlertTriangle size={15} className="text-amber-600" />
          </div>
          <div>
            <p className="text-sm font-semibold text-amber-900">Database not connected</p>
            <p className="text-xs text-amber-700 mt-1 leading-relaxed">
              Add <code className="bg-amber-100 px-1.5 py-0.5 rounded-md font-mono">DATABASE_URL</code> to your Vercel environment variables and redeploy.
            </p>
          </div>
        </div>
      )}

      {/* Stats */}
      <div>
        <h2 className="text-xs font-bold uppercase tracking-[0.15em] text-gray-400 mb-5">Overview</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5">
          {stats.map((s) => (
            <Link
              key={s.label}
              href={s.href}
              className={`group flex flex-col gap-6 p-7 rounded-2xl bg-white border
                         shadow-sm hover:shadow-xl hover:-translate-y-1
                         transition-all duration-300 ${
                           s.highlight ? "border-amber-200 ring-1 ring-amber-100" : "border-gray-100"
                         }`}
            >
              <div className="flex items-start justify-between">
                <div
                  className="w-12 h-12 rounded-2xl flex items-center justify-center transition-transform duration-300 group-hover:scale-110"
                  style={{ background: s.bg }}
                >
                  <s.icon size={22} style={{ color: s.color }} />
                </div>
                {s.highlight && s.value > 0 && (
                  <span className="text-[11px] font-bold px-3 py-1 rounded-full bg-amber-100 text-amber-700">
                    {s.value} new
                  </span>
                )}
              </div>
              <div>
                <p className="text-4xl font-extrabold text-gray-900 tabular-nums leading-none tracking-tight">
                  {s.value}
                </p>
                <p className="text-sm font-semibold text-gray-700 mt-3">{s.label}</p>
                <p className="text-xs text-gray-400 mt-1 flex items-center gap-1.5">
                  {s.change}
                  <ArrowUpRight size={11} className="opacity-0 group-hover:opacity-100 transition-all duration-300" />
                </p>
              </div>
            </Link>
          ))}
        </div>
      </div>

    </div>
  );
}
