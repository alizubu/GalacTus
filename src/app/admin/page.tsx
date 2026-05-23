import Link from "next/link";
import { Briefcase, FolderKanban, Wrench, MessageSquare, ExternalLink, AlertTriangle } from "lucide-react";

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
    { label: "Work Entries", value: expCount, icon: Briefcase, href: "/admin/experience" },
    { label: "Case Studies", value: projCount, icon: FolderKanban, href: "/admin/projects" },
    { label: "Skills", value: skillCount, icon: Wrench, href: "/admin/skills" },
    { label: "Unread Messages", value: unread, icon: MessageSquare, href: "/admin/messages" },
  ];

  const quickLinks = [
    { label: "Edit Hero", href: "/admin/hero" },
    { label: "Edit About", href: "/admin/about" },
    { label: "Work Experience", href: "/admin/experience" },
    { label: "Case Studies", href: "/admin/projects" },
    { label: "Skills", href: "/admin/skills" },
    { label: "Gallery", href: "/admin/gallery" },
  ];

  return (
    <div className="max-w-4xl space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-500 text-sm mt-1">Welcome back, Admin</p>
      </div>

      {/* DB warning */}
      {!dbOk && (
        <div className="flex items-start gap-3 bg-amber-50 border border-amber-200 rounded-xl p-4">
          <AlertTriangle size={18} className="text-amber-500 shrink-0 mt-0.5" />
          <div>
            <p className="text-sm font-semibold text-amber-800">Database not connected</p>
            <p className="text-xs text-amber-600 mt-0.5">
              Add <code className="bg-amber-100 px-1 rounded">DATABASE_URL</code> to your Vercel environment variables, then redeploy.
            </p>
          </div>
        </div>
      )}

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {stats.map((s) => (
          <Link
            key={s.label}
            href={s.href}
            className="bg-white rounded-xl border border-gray-100 p-5 hover:border-gray-300 transition-all group"
          >
            <div className="flex items-center justify-between mb-3">
              <s.icon size={18} className="text-gray-400 group-hover:text-gray-700 transition-colors" />
              {s.label === "Unread Messages" && s.value > 0 && (
                <span className="bg-red-500 text-white text-xs rounded-full px-2 py-0.5">{s.value}</span>
              )}
            </div>
            <p className="text-3xl font-bold text-gray-900">{s.value}</p>
            <p className="text-xs text-gray-400 mt-1">{s.label}</p>
          </Link>
        ))}
      </div>

      {/* Quick links */}
      <div className="bg-white rounded-xl border border-gray-100 p-6">
        <h2 className="font-semibold text-gray-900 mb-4">Quick Edit</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          {quickLinks.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className="flex items-center gap-2 px-4 py-3 rounded-lg border border-gray-100 text-sm text-gray-700 hover:bg-gray-50 hover:border-gray-200 transition-all"
            >
              <ExternalLink size={13} className="text-gray-400" />
              {l.label}
            </Link>
          ))}
        </div>
      </div>

      <a
        href="/"
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex items-center gap-2 bg-gray-900 text-white px-5 py-2.5 rounded-lg text-sm font-medium hover:bg-gray-700 transition-all"
      >
        <ExternalLink size={14} />
        Preview Website
      </a>
    </div>
  );
}
