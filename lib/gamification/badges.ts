import { and, eq, isNotNull, sql } from "drizzle-orm";
import { db } from "@/lib/db";
import { reports, userBadges, users } from "@/lib/db/schema";

export type BadgeSlug =
  | "first_report"
  | "evidence_provider"
  | "trusted_signal"
  | "detail_master"
  | "consistent_contributor"
  | "community_veteran";

async function hasBadge(userId: string, slug: BadgeSlug) {
  const [row] = await db
    .select({ id: userBadges.id })
    .from(userBadges)
    .where(and(eq(userBadges.userId, userId), eq(userBadges.badgeSlug, slug)))
    .limit(1);
  return Boolean(row);
}

async function awardBadge(userId: string, slug: BadgeSlug) {
  if (await hasBadge(userId, slug)) return false;
  await db.insert(userBadges).values({ userId, badgeSlug: slug });
  return true;
}

export async function checkAndAwardBadges(userId: string): Promise<BadgeSlug[]> {
  const [user] = await db.select().from(users).where(eq(users.id, userId)).limit(1);
  if (!user) return [];

  const awarded: BadgeSlug[] = [];
  const reportCount = user.reportCount ?? 0;
  const helpfulCount = user.helpfulCount ?? 0;
  const accountAgeDays = user.createdAt
    ? Math.floor((Date.now() - user.createdAt.getTime()) / (1000 * 60 * 60 * 24))
    : 0;

  if (reportCount >= 1 && (await awardBadge(userId, "first_report"))) {
    awarded.push("first_report");
  }
  if (helpfulCount >= 10 && (await awardBadge(userId, "trusted_signal"))) {
    awarded.push("trusted_signal");
  }
  if (accountAgeDays >= 365 && reportCount >= 10 && (await awardBadge(userId, "community_veteran"))) {
    awarded.push("community_veteran");
  }

  const [{ count: evidenceReportCount }] = await db
    .select({ count: sql<number>`count(*)` })
    .from(reports)
    .where(and(eq(reports.userId, userId), isNotNull(reports.evidenceId)));
  if (Number(evidenceReportCount) >= 1 && (await awardBadge(userId, "evidence_provider"))) {
    awarded.push("evidence_provider");
  }

  const [{ count: detailedReportCount }] = await db
    .select({ count: sql<number>`count(*)` })
    .from(reports)
    .where(and(eq(reports.userId, userId), sql`length(${reports.description}) > 0`));
  if (Number(detailedReportCount) >= 25 && (await awardBadge(userId, "detail_master"))) {
    awarded.push("detail_master");
  }

  // "active months >= 3" needs a distinct-calendar-months-with-a-report query;
  // approximated here with account age as a floor until that query exists.
  if (accountAgeDays >= 90 && reportCount >= 20 && (await awardBadge(userId, "consistent_contributor"))) {
    awarded.push("consistent_contributor");
  }

  return awarded;
}
