import { and, desc, eq } from "drizzle-orm";
import { db } from "@/lib/db";
import { gameSources, reports, sources, userBadges, users } from "@/lib/db/schema";
import { levelFromXp } from "@/lib/gamification/xp";
import type { BadgeSlug } from "@/lib/gamification/badges";

export const ALL_BADGE_SLUGS: BadgeSlug[] = [
  "first_report",
  "evidence_provider",
  "trusted_signal",
  "detail_master",
  "consistent_contributor",
  "community_veteran",
];

export async function getProfileByUsername(username: string, viewerId?: string) {
  const [user] = await db.select().from(users).where(eq(users.username, username)).limit(1);
  if (!user || user.deletedAt) return null;

  const isOwnProfile = viewerId === user.id;

  const earnedBadges = await db
    .select({ badgeSlug: userBadges.badgeSlug, awardedAt: userBadges.awardedAt })
    .from(userBadges)
    .where(eq(userBadges.userId, user.id));
  const earnedSlugs = new Set(earnedBadges.map((b) => b.badgeSlug));

  const historyRows = await db
    .select({
      id: reports.id,
      reportType: reports.reportType,
      status: reports.status,
      createdAt: reports.createdAt,
      gameSourceId: reports.gameSourceId,
      domain: sources.domain,
    })
    .from(reports)
    .innerJoin(gameSources, eq(reports.gameSourceId, gameSources.id))
    .innerJoin(sources, eq(gameSources.sourceId, sources.id))
    .where(
      isOwnProfile
        ? eq(reports.userId, user.id)
        : and(eq(reports.userId, user.id), eq(reports.status, "published")),
    )
    .orderBy(desc(reports.createdAt))
    .limit(20);

  return {
    isOwnProfile,
    user: {
      username: user.username,
      level: user.level ?? 1,
      levelName: levelFromXp(user.xp ?? 0).name,
      xp: user.xp ?? 0,
      reportCount: user.reportCount ?? 0,
      helpfulCount: user.helpfulCount ?? 0,
      createdAt: user.createdAt,
    },
    badges: ALL_BADGE_SLUGS.map((slug) => ({ slug, earned: earnedSlugs.has(slug) })),
    history: historyRows,
  };
}
