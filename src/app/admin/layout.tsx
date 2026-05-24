import AdminSidebar from "@/components/admin/AdminSidebar";
import AdminTopbar from "@/components/admin/AdminTopbar";
import { redirect } from "next/navigation";

export const metadata = { title: "Admin — Shelvey Dias" };
export const dynamic = "force-dynamic";

async function getSession() {
  try {
    const { auth } = await import("@/lib/auth");
    return await auth();
  } catch {
    return null;
  }
}

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const session = await getSession();
  if (!session) redirect("/admin/login");

  return (
    // Full viewport, light background, isolate from any parent styles
    <div
      style={{ display: "flex", minHeight: "100vh", width: "100%", background: "#f5f6fa", colorScheme: "light" }}
    >
      <AdminSidebar />

      {/* Main: takes all remaining width */}
      <div style={{ flex: 1, display: "flex", flexDirection: "column", minWidth: 0, overflow: "hidden" }}>
        <AdminTopbar />
        <main style={{ flex: 1, overflowY: "auto", padding: "36px 48px" }}>
          {children}
        </main>
      </div>
    </div>
  );
}
