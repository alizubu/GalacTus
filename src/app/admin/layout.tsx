import AdminSidebar from "@/components/admin/AdminSidebar";
import AdminTopbar from "@/components/admin/AdminTopbar";

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

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getSession();

  // Not authenticated — render login page without admin chrome
  if (!session) return <>{children}</>;

  return (
    <div
      suppressHydrationWarning
      style={{
        minHeight: "100vh",
        display: "flex",
        background: "#f0f0f0",
        colorScheme: "light",
      }}
    >
      <AdminSidebar />
      <div style={{ flex: 1, display: "flex", flexDirection: "column", minWidth: 0, overflow: "hidden" }}>
        <AdminTopbar />
        <main style={{ flex: 1, overflow: "auto", padding: "24px", background: "#f0f0f0" }}>
          {children}
        </main>
      </div>
    </div>
  );
}
