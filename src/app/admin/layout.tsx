import AdminSidebar from "@/components/admin/AdminSidebar";
import AdminTopbar from "@/components/admin/AdminTopbar";
import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";

export const metadata = { title: "Admin — Shelvey Dias" };
export const dynamic = "force-dynamic";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();

  // Unauthenticated — just render children (login page)
  if (!session) return <>{children}</>;

  return (
    // Force light mode for admin panel regardless of site theme
    <div className="light" style={{ colorScheme: "light" }}>
      <div
        className="min-h-screen flex"
        style={{ background: "#f5f5f5", fontFamily: "var(--font-sans)" }}
      >
        <AdminSidebar />
        <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
          <AdminTopbar />
          <main
            className="flex-1 overflow-auto p-6 lg:p-8"
            style={{ background: "#f5f5f5" }}
          >
            {children}
          </main>
        </div>
      </div>
    </div>
  );
}
