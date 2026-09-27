import { eq } from "drizzle-orm";
import { db } from "@/lib/db";
import { reports, users } from "@/lib/db/schema";
import { auth } from "@/lib/auth";
import { createReportSchema } from "@/lib/validation/schemas";
import { checkReportRateLimit } from "@/lib/rate-limit/reports";
import { accountAgeInDays, computeReportWeight } from "@/lib/reputation/weight";
import { detectAnomaly } from "@/lib/reputation/anomaly";
import { invalidateSignalCache } from "@/lib/reputation/calculate";
import { redis } from "@/lib/redis";
import { apiError, apiSuccess } from "@/lib/utils/api-response";

const MIN_ACCOUNT_AGE_HOURS = 48;
const DUPLICATE_TTL_SECONDS = 30 * 24 * 60 * 60;

export async function POST(request: Request) {
  const session = await auth();
  if (!session?.user) return apiError(401, "Authentication required.");

  const body = await request.json().catch(() => null);
  const parsed = createReportSchema.safeParse(body);
  if (!parsed.success) {
    return apiError(400, "We couldn't validate that report.", parsed.error.flatten());
  }

  const [user] = await db.select().from(users).where(eq(users.id, session.user.id)).limit(1);
  if (!user) return apiError(401, "Authentication required.");

  const ageDays = accountAgeInDays(user.createdAt ?? new Date());
  if (ageDays * 24 < MIN_ACCOUNT_AGE_HOURS) {
    return apiError(403, "Your account needs to be at least 48 hours old to submit a report.");
  }

  const { gameSourceId, reportType, confidenceLevel, description, evidenceId } = parsed.data;

  const rateLimit = await checkReportRateLimit(user.id, gameSourceId, ageDays);
  if (!rateLimit.allowed) {
    return apiError(429, rateLimit.message);
  }

  const duplicateKey = `dup:${user.id}:${gameSourceId}:${reportType}`;
  const alreadyReported = await redis.get(duplicateKey);
  if (alreadyReported) {
    return apiError(409, "You've already reported this recently.");
  }

  const weight = computeReportWeight(ageDays, user.level);

  const [report] = await db
    .insert(reports)
    .values({
      gameSourceId,
      userId: user.id,
      reportType,
      confidenceLevel,
      description,
      evidenceId,
      status: "pending",
      weight,
    })
    .returning();

  await rateLimit.commit();
  await redis.set(duplicateKey, "1", { ex: DUPLICATE_TTL_SECONDS });

  // Fire-and-forget: doesn't block the response. On a serverless platform
  // this needs `waitUntil` (or a real queue) to guarantee it finishes after
  // the response is sent -- flagged as a follow-up for the deploy target.
  detectAnomaly(gameSourceId, description ?? undefined)
    .then((anomalyDetected) => {
      if (!anomalyDetected) return;
      return db.update(reports).set({ anomalyDetected: true }).where(eq(reports.id, report.id));
    })
    .catch((error) => console.error("Anomaly detection failed", error));

  await invalidateSignalCache(gameSourceId);

  return apiSuccess(
    {
      reportId: report.id,
      status: report.status,
      message: "Thanks for sharing. Your report is pending review.",
    },
    201,
  );
}
