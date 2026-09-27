import { and, desc, eq, ilike, or } from "drizzle-orm";
import { db } from "@/lib/db";
import { gamePlatforms, games, platforms } from "@/lib/db/schema";
import { apiSuccess } from "@/lib/utils/api-response";

// Search runs directly against Postgres (ILIKE) instead of Typesense --
// Typesense Cloud isn't free and can't be self-hosted on Vercel's serverless
// runtime, so this trades away typo-tolerant fuzzy search for zero extra
// infra. Fine at this catalog size; revisit if the games table gets huge.
const PER_PAGE = 20;

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const q = searchParams.get("q")?.trim() ?? "";
  const platform = searchParams.get("platform");
  const page = Math.max(1, Number(searchParams.get("page") ?? "1"));

  const baseConditions = [eq(games.isActive, true)];
  if (q) {
    baseConditions.push(or(ilike(games.title, `%${q}%`), ilike(games.developer, `%${q}%`))!);
  }

  const selection = {
    id: games.id,
    slug: games.slug,
    title: games.title,
    developer: games.developer,
    releaseYear: games.releaseYear,
    coverUrl: games.coverUrl,
  };

  const gameRows =
    platform && platform !== "All"
      ? await db
          .selectDistinct(selection)
          .from(games)
          .innerJoin(gamePlatforms, eq(gamePlatforms.gameId, games.id))
          .innerJoin(platforms, eq(gamePlatforms.platformId, platforms.id))
          .where(and(...baseConditions, eq(platforms.name, platform)))
          .orderBy(desc(games.createdAt))
          .limit(PER_PAGE)
          .offset((page - 1) * PER_PAGE)
      : await db
          .select(selection)
          .from(games)
          .where(and(...baseConditions))
          .orderBy(desc(games.createdAt))
          .limit(PER_PAGE)
          .offset((page - 1) * PER_PAGE);

  const hits = await Promise.all(
    gameRows.map(async (game) => {
      const platformRows = await db
        .select({ name: platforms.name })
        .from(gamePlatforms)
        .innerJoin(platforms, eq(gamePlatforms.platformId, platforms.id))
        .where(eq(gamePlatforms.gameId, game.id));
      return { ...game, platforms: platformRows.map((p) => p.name) };
    }),
  );

  return apiSuccess({ hits, total: hits.length, page });
}
