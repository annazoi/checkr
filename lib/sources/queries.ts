import { and, desc, eq, inArray } from "drizzle-orm";
import { db } from "@/lib/db";
import { games, gameSources, reports, sources, users } from "@/lib/db/schema";
import type { ReportType } from "@/types";

const COUNTED_STATUSES = ["published", "trusted"] as const;

export async function getSourceContext(gameSourceId: string) {
  const [row] = await db
    .select({
      gameSourceId: gameSources.id,
      sourceId: sources.id,
      domain: sources.domain,
      sourceType: sources.sourceType,
      gameId: games.id,
      gameSlug: games.slug,
      gameTitle: games.title,
    })
    .from(gameSources)
    .innerJoin(sources, eq(gameSources.sourceId, sources.id))
    .innerJoin(games, eq(gameSources.gameId, games.id))
    .where(eq(gameSources.id, gameSourceId))
    .limit(1);

  return row ?? null;
}

export const REPORT_FILTER_TYPES: Record<string, ReportType[]> = {
  no_issues: ["no_issue"],
  concerns: [
    "suspicious",
    "suspicious_installer",
    "fake_content",
    "dangerous_redirect",
    "unexpected_software",
    "other",
  ],
  security: ["malware", "antivirus_warning"],
};

const PER_PAGE = 10;

export async function getSourceReports(gameSourceId: string, filter: string, page: number) {
  const conditions = [
    eq(reports.gameSourceId, gameSourceId),
    inArray(reports.status, COUNTED_STATUSES),
  ];

  const types = REPORT_FILTER_TYPES[filter];
  if (types) conditions.push(inArray(reports.reportType, types));

  const rows = await db
    .select({
      id: reports.id,
      reportType: reports.reportType,
      confidenceLevel: reports.confidenceLevel,
      description: reports.description,
      createdAt: reports.createdAt,
      username: users.username,
      level: users.level,
    })
    .from(reports)
    .innerJoin(users, eq(reports.userId, users.id))
    .where(and(...conditions))
    .orderBy(desc(reports.createdAt))
    .limit(PER_PAGE)
    .offset((page - 1) * PER_PAGE);

  return rows;
}
