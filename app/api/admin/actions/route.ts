import { z } from "zod";
import { eq } from "drizzle-orm";
import { db } from "@/lib/db";
import { auditLogs, moderationActions, notifications, reports, users } from "@/lib/db/schema";
import { auth } from "@/lib/auth";
import { applyXpDelta } from "@/lib/gamification/events";
import { invalidateSignalCache } from "@/lib/reputation/calculate";
import { sendReportStatusEmail } from "@/lib/resend";
import { apiError, apiSuccess } from "@/lib/utils/api-response";

const actionSchema = z.object({
  reportId: z.string().uuid(),
  action: z.enum(["approve", "reject", "hide", "escalate"]),
  reason: z.string().min(1).max(255),
  notes: z.string().max(1000).optional(),
});

const STATUS_BY_ACTION = {
  approve: "published",
  reject: "removed",
  hide: "hidden",
  escalate: "under_review",
} as const;

const XP_BY_ACTION: Record<string, number> = {
  approve: 5,
  reject: -15,
  hide: -30,
  escalate: 0,
};

export async function POST(request: Request) {
  const session = await auth();
  // Role is already enforced by middleware, but this route mutates data
  // directly, so it re-checks defensively rather than trusting the caller.
  if (!session?.user || (session.user.role !== "moderator" && session.user.role !== "admin")) {
    return apiError(403, "Forbidden.");
  }

  const body = await request.json().catch(() => null);
  const parsed = actionSchema.safeParse(body);
  if (!parsed.success) {
    return apiError(400, "Invalid moderation action.", parsed.error.flatten());
  }

  const { reportId, action, reason, notes } = parsed.data;

  const [report] = await db.select().from(reports).where(eq(reports.id, reportId)).limit(1);
  if (!report) return apiError(404, "Report not found.");

  if (report.userId === session.user.id) {
    return apiError(403, "You can't moderate your own report.");
  }

  const [reporter] = await db
    .select({ email: users.email })
    .from(users)
    .where(eq(users.id, report.userId))
    .limit(1);

  const nextStatus = STATUS_BY_ACTION[action];

  await db
    .update(reports)
    .set({ status: nextStatus, updatedAt: new Date() })
    .where(eq(reports.id, reportId));

  await db.insert(moderationActions).values({
    reportId,
    moderatorId: session.user.id,
    action,
    reason,
    notes,
  });

  const xpDelta = XP_BY_ACTION[action] ?? 0;
  if (xpDelta !== 0) {
    await applyXpDelta(report.userId, xpDelta);
  }

  await db.insert(notifications).values({
    userId: report.userId,
    type: "report_status_change",
    title: `Your report was ${nextStatus}`,
    body: reason,
  });

  if (reporter) {
    await sendReportStatusEmail(reporter.email, nextStatus).catch((error) =>
      console.error("Failed to send moderation email", error),
    );
  }

  await db.insert(auditLogs).values({
    actorId: session.user.id,
    action: `moderation.${action}`,
    targetType: "report",
    targetId: reportId,
    metadata: { reason, notes },
  });

  await invalidateSignalCache(report.gameSourceId);

  return apiSuccess({ reportId, status: nextStatus });
}
