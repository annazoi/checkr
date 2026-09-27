import { asc, desc, eq, inArray, sql } from "drizzle-orm";
import { db } from "@/lib/db";
import { reports, users } from "@/lib/db/schema";

const PER_PAGE = 25;

export async function getModerationQueue(page: number) {
  const rows = await db
    .select({
      id: reports.id,
      gameSourceId: reports.gameSourceId,
      reportType: reports.reportType,
      description: reports.description,
      status: reports.status,
      anomalyDetected: reports.anomalyDetected,
      createdAt: reports.createdAt,
      username: users.username,
      userId: reports.userId,
    })
    .from(reports)
    .innerJoin(users, eq(reports.userId, users.id))
    .where(inArray(reports.status, ["pending", "under_review"]))
    .orderBy(
      desc(reports.anomalyDetected),
      desc(sql`case when ${reports.reportType} in ('malware', 'antivirus_warning') then 1 else 0 end`),
      asc(reports.createdAt),
    )
    .limit(PER_PAGE)
    .offset((page - 1) * PER_PAGE);

  return { reports: rows, page };
}
