import AdminSidebar from "@/components/admin/AdminSidebar";
import AdminTopbar from "@/components/admin/AdminTopbar";
import AdminThemeProvider from "@/components/admin/AdminThemeProvider";
import AdminShell from "@/components/admin/AdminShell";
import { redirect } from "next/navigation";
import { Toaster } from "react-hot-toast";

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

  const sessionUser = {
    id:          session.user.id          ?? "",
    name:        session.user.name        ?? "",
    email:       session.user.email       ?? "",
    avatarUrl:   session.user.avatarUrl   ?? "",
    role:        session.user.role        ?? "user",
    permissions: session.user.permissions ?? [],
  };

  return (
    <AdminThemeProvider>
      <AdminShell>
        <Toaster
          position="top-right"
          toastOptions={{
            duration: 4000,
            style: { fontSize: "13px", maxWidth: "380px" },
            success: { iconTheme: { primary: "#22c55e", secondary: "#fff" } },
            error:   { iconTheme: { primary: "#ef4444", secondary: "#fff" } },
          }}
        />
        <AdminSidebar sessionUser={sessionUser} />
        <div style={{ flex: 1, display: "flex", flexDirection: "column", minWidth: 0, overflow: "hidden" }}>
          <AdminTopbar />
          <main style={{ flex: 1, overflowY: "auto", padding: "48px 60px" }} className="admin-scroll admin-main-bg">
            {children}
          </main>
        </div>
      </AdminShell>
    </AdminThemeProvider>
  );
}
