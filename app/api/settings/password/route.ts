import bcrypt from "bcrypt";
import { eq } from "drizzle-orm";
import { db } from "@/lib/db";
import { users } from "@/lib/db/schema";
import { auth } from "@/lib/auth";
import { changePasswordSchema } from "@/lib/validation/schemas";
import { apiError, apiSuccess } from "@/lib/utils/api-response";

export async function PATCH(request: Request) {
  const session = await auth();
  if (!session?.user) return apiError(401, "Authentication required.");

  const body = await request.json().catch(() => null);
  const parsed = changePasswordSchema.safeParse(body);
  if (!parsed.success) {
    return apiError(400, "We couldn't validate that submission.", parsed.error.flatten());
  }

  const [user] = await db.select().from(users).where(eq(users.id, session.user.id)).limit(1);
  if (!user) return apiError(401, "Authentication required.");

  // Discord-only accounts have no password on file yet -- treat this as
  // setting one for the first time instead of requiring a "current" one
  // that could never exist.
  if (user.passwordHash) {
    const matches = await bcrypt.compare(parsed.data.currentPassword, user.passwordHash);
    if (!matches) return apiError(403, "Your current password is incorrect.");
  }

  const passwordHash = await bcrypt.hash(parsed.data.newPassword, 12);
  await db.update(users).set({ passwordHash }).where(eq(users.id, user.id));

  return apiSuccess({ message: "Password updated." });
}
