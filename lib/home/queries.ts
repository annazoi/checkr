import { desc, eq } from "drizzle-orm";
import { db } from "@/lib/db";
import { games, gameSources, sources } from "@/lib/db/schema";
import { calculateSignalProfile } from "@/lib/reputation/calculate";
import type { SignalLabelType } from "@/types";

export async function getRecentGames(limit = 3) {
  const rows = await db
    .select()
    .from(games)
    .where(eq(games.isActive, true))
    .orderBy(desc(games.createdAt))
    .limit(limit);

  return Promise.all(
    rows.map(async (game) => {
      const gsRows = await db
        .select({ id: gameSources.id })
        .from(gameSources)
        .where(eq(gameSources.gameId, game.id));

      let totalReports = 0;
      let worstLabel: SignalLabelType = "no_reports";

      for (const gs of gsRows) {
        const signal = await calculateSignalProfile(gs.id);
        totalReports += signal.volumeCount;

        if (signal.signalLabel === "security_reports" || signal.signalLabel === "concerns_reported") {
          worstLabel = signal.signalLabel;
        } else if (worstLabel === "no_reports" && signal.signalLabel !== "no_reports") {
          worstLabel = signal.signalLabel;
        }
      }

      return {
        slug: game.slug,
        title: game.title,
        coverUrl: game.coverUrl,
        sourceCount: gsRows.length,
        totalReports,
        signalLabel: gsRows.length === 0 ? ("no_reports" as const) : worstLabel,
      };
    }),
  );
}

export async function getSourcesWithConcerns(limit = 2) {
  const rows = await db
    .select({
      gameSourceId: gameSources.id,
      domain: sources.domain,
      sourceType: sources.sourceType,
    })
    .from(gameSources)
    .innerJoin(sources, eq(gameSources.sourceId, sources.id))
    .limit(50);

  const withSignal = await Promise.all(
    rows.map(async (row) => ({ ...row, signal: await calculateSignalProfile(row.gameSourceId) })),
  );

  return withSignal
    .filter((row) =>
      ["concerns_reported", "security_reports", "mixed_reports"].includes(row.signal.signalLabel),
    )
    .sort((a, b) => b.signal.volumeCount - a.signal.volumeCount)
    .slice(0, limit);
}
