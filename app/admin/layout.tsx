import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { AdminHeader } from "@/components/admin/AdminHeader";

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const session = await auth();
  if (!session?.user) redirect("/auth/login?callbackUrl=/admin/queue");
  if (session.user.role !== "moderator" && session.user.role !== "admin") redirect("/");

  return (
    <div className="min-h-screen bg-background">
      <AdminHeader username={session.user.name ?? "Moderator"} role={session.user.role} />
      <main className="mx-auto max-w-page px-6 py-8">{children}</main>
    </div>
  );
}
