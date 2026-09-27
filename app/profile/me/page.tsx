import { eq } from "drizzle-orm";
import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { users } from "@/lib/db/schema";

export default async function MyProfilePage() {
  const session = await auth();
  if (!session?.user) redirect("/auth/login?callbackUrl=/profile/me");

  const [user] = await db
    .select({ username: users.username })
    .from(users)
    .where(eq(users.id, session.user.id))
    .limit(1);

  if (!user) redirect("/auth/login?callbackUrl=/profile/me");

  redirect(`/profile/${user.username}`);
}
