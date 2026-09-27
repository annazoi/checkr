import { auth } from "@/lib/auth";
import { countUnreadNotifications, getRecentNotifications } from "@/lib/notifications/queries";
import { apiError, apiSuccess } from "@/lib/utils/api-response";

export async function GET() {
  const session = await auth();
  if (!session?.user) return apiError(401, "Authentication required.");

  const [items, unreadCount] = await Promise.all([
    getRecentNotifications(session.user.id),
    countUnreadNotifications(session.user.id),
  ]);

  return apiSuccess({ notifications: items, unreadCount });
}
