import { and, eq } from "drizzle-orm";
import { db } from "@/lib/db";
import { games, gameSources, sources } from "@/lib/db/schema";
import { auth } from "@/lib/auth";
import { createSourceSchema } from "@/lib/validation/schemas";
import { apiError, apiSuccess } from "@/lib/utils/api-response";

export async function POST(request: Request) {
  const session = await auth();
  if (!session?.user) return apiError(401, "Authentication required.");

  const body = await request.json().catch(() => null);
  const parsed = createSourceSchema.safeParse(body);
  if (!parsed.success) {
    return apiError(400, "Enter a valid site or store.", parsed.error.flatten());
  }

  const { gameSlug, domain } = parsed.data;

  const [game] = await db.select().from(games).where(eq(games.slug, gameSlug)).limit(1);
  if (!game) return apiError(404, "Game not found.");

  let [source] = await db.select().from(sources).where(eq(sources.domain, domain)).limit(1);
  if (!source) {
    [source] = await db.insert(sources).values({ domain, sourceType: "third_party" }).returning();
  }

  let [gameSource] = await db
    .select()
    .from(gameSources)
    .where(and(eq(gameSources.gameId, game.id), eq(gameSources.sourceId, source.id)))
    .limit(1);

  if (!gameSource) {
    [gameSource] = await db
      .insert(gameSources)
      .values({ gameId: game.id, sourceId: source.id, addedByUserId: session.user.id })
      .returning();
  }

  return apiSuccess({ gameSourceId: gameSource.id, domain: source.domain }, 201);
}
