import { auth, revokeAllSessions } from "@/lib/auth";
import { apiError, apiSuccess } from "@/lib/utils/api-response";

export async function POST() {
  const session = await auth();
  if (!session?.user) return apiError(401, "Authentication required.");

  await revokeAllSessions(session.user.id);

  return apiSuccess({ message: "You've been logged out of all devices." });
}
