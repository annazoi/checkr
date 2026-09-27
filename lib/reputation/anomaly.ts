import { and, desc, eq, gte, inArray } from "drizzle-orm";
import { db } from "@/lib/db";
import { reports, users } from "@/lib/db/schema";

const RATE_SPIKE_MULTIPLIER = 3;
const NEW_ACCOUNT_WINDOW_DAYS = 14;
const NEW_ACCOUNT_SHARE_THRESHOLD = 0.4;
const SIMILARITY_THRESHOLD = 0.8;
const SIMILAR_COUNT_THRESHOLD = 3;
const RECENT_WINDOW_SIZE = 20;

function tokenSetSimilarity(a: string, b: string) {
  const tokensA = new Set(a.toLowerCase().split(/\W+/).filter(Boolean));
  const tokensB = new Set(b.toLowerCase().split(/\W+/).filter(Boolean));
  if (tokensA.size === 0 || tokensB.size === 0) return 0;

  let intersection = 0;
  for (const token of tokensA) {
    if (tokensB.has(token)) intersection += 1;
  }
  const union = tokensA.size + tokensB.size - intersection;
  return union === 0 ? 0 : intersection / union;
}

async function hasRateSpike(gameSourceId: string) {
  const since = new Date(Date.now() - 8 * 24 * 60 * 60 * 1000);
  const recent = await db
    .select({ createdAt: reports.createdAt })
    .from(reports)
    .where(and(eq(reports.gameSourceId, gameSourceId), gte(reports.createdAt, since)));

  const dayBuckets = new Map<string, number>();
  for (const row of recent) {
    if (!row.createdAt) continue;
    const day = row.createdAt.toISOString().slice(0, 10);
    dayBuckets.set(day, (dayBuckets.get(day) ?? 0) + 1);
  }

  const today = new Date().toISOString().slice(0, 10);
  const todayCount = dayBuckets.get(today) ?? 0;
  const priorDays = [...dayBuckets.entries()].filter(([day]) => day !== today);
  const priorAverage =
    priorDays.length > 0 ? priorDays.reduce((sum, [, count]) => sum + count, 0) / 7 : 0;

  if (priorAverage === 0) return todayCount >= SIMILAR_COUNT_THRESHOLD;
  return todayCount > priorAverage * RATE_SPIKE_MULTIPLIER;
}

async function hasNewAccountConcentration(gameSourceId: string) {
  const recentReports = await db
    .select({ userId: reports.userId })
    .from(reports)
    .where(eq(reports.gameSourceId, gameSourceId))
    .orderBy(desc(reports.createdAt))
    .limit(RECENT_WINDOW_SIZE);

  if (recentReports.length === 0) return false;

  const userIds = [...new Set(recentReports.map((r) => r.userId))];
  const accounts = await db
    .select({ id: users.id, createdAt: users.createdAt })
    .from(users)
    .where(inArray(users.id, userIds));

  const createdAtById = new Map(accounts.map((a) => [a.id, a.createdAt]));
  const cutoff = Date.now() - NEW_ACCOUNT_WINDOW_DAYS * 24 * 60 * 60 * 1000;

  const newAccountReportCount = recentReports.filter((r) => {
    const createdAt = createdAtById.get(r.userId);
    return createdAt ? createdAt.getTime() > cutoff : false;
  }).length;

  return newAccountReportCount / recentReports.length > NEW_ACCOUNT_SHARE_THRESHOLD;
}

async function hasSimilarTextCluster(gameSourceId: string, newDescription: string | undefined) {
  if (!newDescription || newDescription.trim().length < 10) return false;

  const recent = await db
    .select({ description: reports.description })
    .from(reports)
    .where(eq(reports.gameSourceId, gameSourceId))
    .orderBy(desc(reports.createdAt))
    .limit(RECENT_WINDOW_SIZE);

  let similarCount = 0;
  for (const row of recent) {
    if (!row.description) continue;
    if (tokenSetSimilarity(newDescription, row.description) >= SIMILARITY_THRESHOLD) {
      similarCount += 1;
    }
  }

  return similarCount >= SIMILAR_COUNT_THRESHOLD;
}

export async function detectAnomaly(gameSourceId: string, description: string | undefined) {
  const [rateSpike, newAccountConcentration, similarText] = await Promise.all([
    hasRateSpike(gameSourceId),
    hasNewAccountConcentration(gameSourceId),
    hasSimilarTextCluster(gameSourceId, description),
  ]);

  return rateSpike || newAccountConcentration || similarText;
}
