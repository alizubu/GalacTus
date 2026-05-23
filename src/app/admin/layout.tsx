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

  // Not authenticated — render login page as-is (no admin chrome)
  if (!session) return <>{children}</>;

  // Authenticated — render admin shell
  // We use inline styles to override the portfolio's theme variables
  // without nesting html/body tags (which would crash Next.js)
  return (
    <div
      suppressHydrationWarning
      style={{
        minHeight: "100vh",
        display: "flex",
        background: "#f0f0f0",
        colorScheme: "light",
        // Reset any dark-mode CSS variables from the portfolio theme
        "--background": "#f0f0f0",
        "--foreground": "#111111",
        "--card": "#ffffff",
        "--border": "#e5e5e5",
        "--muted": "#f5f5f5",
        "--muted-foreground": "#737373",
      } as React.CSSProperties}
    >
      <AdminSidebar />
      <div style={{ flex: 1, display: "flex", flexDirection: "column", minWidth: 0, overflow: "hidden" }}>
        <AdminTopbar />
        <main
          style={{
            flex: 1,
            overflow: "auto",
            padding: "24px",
            background: "#f0f0f0",
          }}
        >
          {children}
        </main>
      </div>
    </div>
  );
}
