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
  if (!session) return <>{children}</>;

  return (
    // Isolate admin from portfolio theme — always light, no hydration mismatch
    <html lang="en" suppressHydrationWarning>
      <body
        suppressHydrationWarning
        style={{
          margin: 0,
          padding: 0,
          fontFamily: "system-ui, -apple-system, sans-serif",
          background: "#f0f0f0",
          colorScheme: "light",
        }}
      >
        <div className="min-h-screen flex" style={{ background: "#f0f0f0" }}>
          <AdminSidebar />
          <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
            <AdminTopbar />
            <main className="flex-1 overflow-auto p-6 lg:p-8">
              {children}
            </main>
          </div>
        </div>
      </body>
    </html>
  );
}
