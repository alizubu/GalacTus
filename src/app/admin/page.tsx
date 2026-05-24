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
    { label: "Work Entries",    value: expCount,  icon: Briefcase,    href: "/admin/experience", color: "#6366f1", bg: "#eef2ff", change: "Career history" },
    { label: "Case Studies",    value: projCount, icon: FolderKanban, href: "/admin/projects",   color: "#8b5cf6", bg: "#f5f3ff", change: "Portfolio projects" },
    { label: "Skills",          value: skillCount,icon: Wrench,       href: "/admin/skills",     color: "#0ea5e9", bg: "#f0f9ff", change: "Listed skills" },
    { label: "Unread Messages", value: unread,    icon: MessageSquare,href: "/admin/messages",   color: unread > 0 ? "#f59e0b" : "#6b7280", bg: unread > 0 ? "#fffbeb" : "#f9fafb", change: unread > 0 ? "Needs attention" : "All caught up", highlight: unread > 0 },
  ];

  return (
    <div className="space-y-8 w-full">

      {/* Page header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900 tracking-tight">Dashboard</h1>
        <p className="text-gray-500 text-sm mt-1">Manage your portfolio content. Changes reflect on your live site.</p>
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

      {/* Stats grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5">
        {stats.map((s) => (
          <Link
            key={s.label}
            href={s.href}
            className={`group flex flex-col gap-5 p-6 rounded-2xl bg-white border transition-all duration-200 hover:shadow-lg hover:-translate-y-0.5 ${
              (s as { highlight?: boolean }).highlight ? "border-amber-200" : "border-gray-100"
            } shadow-sm`}
          >
            <div className="flex items-start justify-between">
              <div className="w-11 h-11 rounded-xl flex items-center justify-center" style={{ background: s.bg }}>
                <s.icon size={20} style={{ color: s.color }} />
              </div>
              {(s as { highlight?: boolean }).highlight && s.value > 0 && (
                <span className="text-[11px] font-bold px-2.5 py-1 rounded-full bg-amber-100 text-amber-600">
                  {s.value} new
                </span>
              )}
            </div>
            <div>
              <p className="text-4xl font-bold text-gray-900 tabular-nums leading-none">{s.value}</p>
              <p className="text-sm font-semibold text-gray-700 mt-2">{s.label}</p>
              <p className="text-xs text-gray-400 mt-1 flex items-center gap-1">
                {s.change}
                <ArrowUpRight size={10} className="opacity-0 group-hover:opacity-100 transition-opacity" />
              </p>
            </div>
          </Link>
        ))}
      </div>

    </div>
  );
}
