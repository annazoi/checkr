import { auth } from "@/lib/auth";
import { markAllNotificationsRead } from "@/lib/notifications/queries";
import { apiError, apiSuccess } from "@/lib/utils/api-response";

export async function POST() {
  const session = await auth();
  if (!session?.user) return apiError(401, "Authentication required.");

  await markAllNotificationsRead(session.user.id);

  return apiSuccess({ message: "Marked as read." });
}
