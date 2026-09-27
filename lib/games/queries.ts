import { eq } from "drizzle-orm";
import { db } from "@/lib/db";
import { gamePlatforms, games, gameSources, platforms, sources } from "@/lib/db/schema";
import { calculateSignalProfile } from "@/lib/reputation/calculate";
import type { SignalProfile, SourceType } from "@/types";

export type GameSourceWithSignal = {
  gameSourceId: string;
  source: { id: string; domain: string; sourceType: SourceType };
  signal: SignalProfile;
};

export async function getGameWithSources(slug: string) {
  const [game] = await db.select().from(games).where(eq(games.slug, slug)).limit(1);

  if (!game || !game.isActive) {
    return null;
  }

  const platformRows = await db
    .select({ name: platforms.name })
    .from(gamePlatforms)
    .innerJoin(platforms, eq(gamePlatforms.platformId, platforms.id))
    .where(eq(gamePlatforms.gameId, game.id));

  const sourceRows = await db
    .select({
      gameSourceId: gameSources.id,
      sourceId: sources.id,
      domain: sources.domain,
      sourceType: sources.sourceType,
    })
    .from(gameSources)
    .innerJoin(sources, eq(gameSources.sourceId, sources.id))
    .where(eq(gameSources.gameId, game.id));

  const sourcesWithSignal: GameSourceWithSignal[] = await Promise.all(
    sourceRows.map(async (row) => ({
      gameSourceId: row.gameSourceId,
      source: { id: row.sourceId, domain: row.domain, sourceType: row.sourceType },
      signal: await calculateSignalProfile(row.gameSourceId),
    })),
  );

  sourcesWithSignal.sort((a, b) => b.signal.volumeCount - a.signal.volumeCount);

  return {
    game: { ...game, platforms: platformRows.map((p) => p.name) },
    sources: sourcesWithSignal,
  };
}
