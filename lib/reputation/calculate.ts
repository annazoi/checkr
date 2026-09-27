import { and, desc, eq, inArray } from "drizzle-orm";
import { db } from "@/lib/db";
import { reports } from "@/lib/db/schema";
import { redis } from "@/lib/redis";
import type { ReportType, SignalProfile } from "@/types";

const SIGNAL_CACHE_TTL_SECONDS = 300;

// Only reports that have cleared moderation feed the public signal --
// 'pending' / 'under_review' / 'removed*' / 'hidden' reports stay invisible
// until a moderator has acted on them.
const COUNTED_STATUSES = ["published", "trusted"] as const;

const SECURITY_REPORT_TYPES: ReportType[] = ["malware", "antivirus_warning"];

function volumeFromCount(count: number): SignalProfile["volume"] {
  if (count < 5) return "limited";
  if (count < 20) return "some";
  if (count < 100) return "substantial";
  return "high";
}

function distributionFromPercents(
  noIssuePercent: number,
  concernPercent: number,
): SignalProfile["distribution"] {
  if (noIssuePercent >= 85) return "predominantly_positive";
  if (noIssuePercent >= 60) return "mostly_positive";
  if (concernPercent >= 60) return "strong_concern_pattern";
  if (concernPercent >= 40) return "majority_concerns";
  return "divided";
}

function recencyFromLastReport(lastReportAt: Date | null): SignalProfile["recency"] {
  if (!lastReportAt) return "historical";
  const days = (Date.now() - lastReportAt.getTime()) / (1000 * 60 * 60 * 24);
  if (days < 30) return "active";
  if (days < 90) return "recent";
  if (days < 365) return "older";
  return "historical";
}

function signalLabelFor({
  volumeCount,
  concernPercent,
  distribution,
  hasSecurityConcern,
}: {
  volumeCount: number;
  concernPercent: number;
  distribution: SignalProfile["distribution"];
  hasSecurityConcern: boolean;
}): SignalProfile["signalLabel"] {
  if (volumeCount === 0) return "no_reports";
  if (volumeCount < 5) return "limited_data";
  if (concernPercent >= 40 && hasSecurityConcern) return "security_reports";
  if (concernPercent >= 40) return "concerns_reported";
  if (distribution === "divided") return "mixed_reports";
  return "mostly_clear";
}

function buildExplanation({
  volumeCount,
  contributorCount,
  days,
  evidenceCount,
}: {
  volumeCount: number;
  contributorCount: number;
  days: number;
  evidenceCount: number;
}) {
  return (
    `Based on ${volumeCount} community report${volumeCount === 1 ? "" : "s"} from ` +
    `${contributorCount} contributor${contributorCount === 1 ? "" : "s"} over the last ${days} days. ` +
    `${evidenceCount} report${evidenceCount === 1 ? "" : "s"} include evidence. Reports from contributors ` +
    `with longer track records are weighted slightly higher. This is community opinion -- it does not ` +
    `certify safety or danger.`
  );
}

function emptyProfile(): SignalProfile {
  return {
    volume: "limited",
    volumeCount: 0,
    distribution: "divided",
    noIssuePercent: 0,
    concernPercent: 0,
    recency: "historical",
    lastReportAt: null,
    hasEvidence: false,
    evidenceCount: 0,
    signalLabel: "no_reports",
    explanation: "No community reports have been submitted for this source yet.",
    anomalyDetected: false,
  };
}

function signalCacheKey(gameSourceId: string) {
  return `signal:${gameSourceId}`;
}

export async function invalidateSignalCache(gameSourceId: string) {
  await redis.del(signalCacheKey(gameSourceId));
}

export async function calculateSignalProfile(gameSourceId: string): Promise<SignalProfile> {
  const cacheKey = signalCacheKey(gameSourceId);
  const cached = await redis.get<SignalProfile>(cacheKey);
  if (cached) return cached;

  const rows = await db
    .select({
      reportType: reports.reportType,
      weight: reports.weight,
      userId: reports.userId,
      createdAt: reports.createdAt,
      evidenceId: reports.evidenceId,
      anomalyDetected: reports.anomalyDetected,
    })
    .from(reports)
    .where(and(eq(reports.gameSourceId, gameSourceId), inArray(reports.status, COUNTED_STATUSES)))
    .orderBy(desc(reports.createdAt));

  if (rows.length === 0) {
    const profile = emptyProfile();
    await redis.set(cacheKey, profile, { ex: SIGNAL_CACHE_TTL_SECONDS });
    return profile;
  }

  let noIssueWeight = 0;
  let concernWeight = 0;
  let totalWeight = 0;
  let hasSecurityConcern = false;
  let evidenceCount = 0;
  const contributors = new Set<string>();

  for (const row of rows) {
    const weight = row.weight ?? 1;
    totalWeight += weight;
    contributors.add(row.userId);
    if (row.evidenceId) evidenceCount += 1;

    if (row.reportType === "no_issue") {
      noIssueWeight += weight;
    } else {
      concernWeight += weight;
      if (SECURITY_REPORT_TYPES.includes(row.reportType as ReportType)) {
        hasSecurityConcern = true;
      }
    }
  }

  const noIssuePercent = totalWeight > 0 ? Math.round((noIssueWeight / totalWeight) * 100) : 0;
  const concernPercent = totalWeight > 0 ? Math.round((concernWeight / totalWeight) * 100) : 0;
  const distribution = distributionFromPercents(noIssuePercent, concernPercent);

  const lastReportAt = rows[0]?.createdAt ?? null;
  const oldestReportAt = rows[rows.length - 1]?.createdAt ?? lastReportAt;
  const days = oldestReportAt
    ? Math.max(1, Math.round((Date.now() - oldestReportAt.getTime()) / (1000 * 60 * 60 * 24)))
    : 0;
  const recentAnomalies = rows.slice(0, 20).some((row) => row.anomalyDetected);

  const profile: SignalProfile = {
    volume: volumeFromCount(rows.length),
    volumeCount: rows.length,
    distribution,
    noIssuePercent,
    concernPercent,
    recency: recencyFromLastReport(lastReportAt),
    lastReportAt: lastReportAt ? lastReportAt.toISOString() : null,
    hasEvidence: evidenceCount > 0,
    evidenceCount,
    signalLabel: signalLabelFor({
      volumeCount: rows.length,
      concernPercent,
      distribution,
      hasSecurityConcern,
    }),
    explanation: buildExplanation({
      volumeCount: rows.length,
      contributorCount: contributors.size,
      days,
      evidenceCount,
    }),
    anomalyDetected: recentAnomalies,
  };

  await redis.set(cacheKey, profile, { ex: SIGNAL_CACHE_TTL_SECONDS });
  return profile;
}
