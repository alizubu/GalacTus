import AdminSidebar from "@/components/admin/AdminSidebar";
import AdminTopbar from "@/components/admin/AdminTopbar";
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

  return (
    <div
      style={{ display: "flex", minHeight: "100vh", width: "100%", background: "#f5f6fa", colorScheme: "light" }}
    >
      {/* [C4] Toast notifications */}
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 4000,
          style: { fontSize: "13px", maxWidth: "380px" },
          success: { iconTheme: { primary: "#22c55e", secondary: "#fff" } },
          error: { iconTheme: { primary: "#ef4444", secondary: "#fff" } },
        }}
      />

      <AdminSidebar />

      <div style={{ flex: 1, display: "flex", flexDirection: "column", minWidth: 0, overflow: "hidden" }}>
        <AdminTopbar />
        <main style={{ flex: 1, overflowY: "auto", padding: "48px 60px" }} className="admin-scroll">
          {children}
        </main>
      </div>
    </div>
  );
}
