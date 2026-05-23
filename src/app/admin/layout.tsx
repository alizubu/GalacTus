import AdminSidebar from "@/components/admin/AdminSidebar";
import AdminTopbar from "@/components/admin/AdminTopbar";
import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";

export const metadata = { title: "Admin Panel — Shelvey Dias" };
export const dynamic = "force-dynamic";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();

  // Login page is a child of this layout too — don't redirect it
  // Middleware handles the actual protection; this is just UI shell
  if (!session) {
    // Let middleware handle the redirect, just render children (login page)
    return <>{children}</>;
  }

  return (
    <div className="min-h-screen bg-[#0f0f0f] flex">
      <AdminSidebar />
      <div className="flex-1 flex flex-col min-w-0">
        <AdminTopbar />
        <main className="flex-1 p-6 overflow-auto bg-[#fafafa]">
          {children}
        </main>
      </div>
    </div>
  );
}
