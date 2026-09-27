/**
 * One-off sync: pulls games from RAWG (rawg.io) into Postgres, covering
 * every platform (PC, PlayStation, Xbox, Switch, mobile) -- not Steam-only.
 * Run with: npx tsx scripts/sync-games.ts
 */
import { config } from "dotenv";
import { eq, sql } from "drizzle-orm";
import type { db as dbType } from "../lib/db";
import type {
  gamePlatforms as gamePlatformsType,
  games as gamesType,
  platforms as platformsType,
} from "../lib/db/schema";

// Plain "dotenv/config" only loads a file literally named ".env" -- .env.local
// is a Next.js-specific convention that dotenv itself doesn't know about, so
// it has to be pointed at explicitly for a standalone script like this one.
// This must run BEFORE lib/db is loaded (it reads DATABASE_URL at import
// time), which is why lib/db/schema are dynamically imported in main()
// below instead of statically imported at the top of this file -- static
// imports would already have run (and grabbed an empty DATABASE_URL) before
// this config() call ever executes.
config({ path: ".env.local" });

let db: typeof dbType;
let gamePlatforms: typeof gamePlatformsType;
let games: typeof gamesType;
let platforms: typeof platformsType;

const RAWG_API_KEY = process.env.RAWG_API_KEY;
const TARGET_GAME_COUNT = 10_000;
const PAGE_SIZE = 40; // RAWG's maximum page_size
const REQUEST_DELAY_MS = 250; // stay comfortably under RAWG's free-tier rate limit

type RawgGame = {
  id: number;
  slug: string;
  name: string;
  released: string | null;
  background_image: string | null;
  platforms?: Array<{ platform: { id: number; name: string } }> | null;
};

function wait(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function fetchGamesPage(page: number): Promise<RawgGame[]> {
  const url = new URL("https://api.rawg.io/api/games");
  url.searchParams.set("key", RAWG_API_KEY!);
  url.searchParams.set("page", String(page));
  url.searchParams.set("page_size", String(PAGE_SIZE));
  url.searchParams.set("ordering", "-added"); // most-added-to-libraries first, a decent popularity proxy

  const res = await fetch(url);
  if (!res.ok) throw new Error(`RAWG request failed: ${res.status} ${await res.text()}`);

  const body = (await res.json()) as { results: RawgGame[] };
  return body.results;
}

function toSlug(name: string, rawgId: number) {
  const base = name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
  return base ? `${base}-${rawgId}` : `game-${rawgId}`;
}

// RAWG's platform names are more granular than our UI's filter chips
// (e.g. "PlayStation 5" vs "PlayStation 4"), so they're bucketed down to the
// 5 canonical platforms the search page actually filters by. Anything that
// doesn't map to one of those (old consoles, "Web", etc.) is just skipped --
// the game still shows up everywhere except that specific platform filter.
function normalizePlatformName(name: string): string | null {
  const lower = name.toLowerCase();
  if (lower === "pc" || lower === "macos" || lower === "linux") return "PC";
  if (lower.startsWith("playstation")) return "PlayStation";
  if (lower.startsWith("xbox")) return "Xbox";
  if (lower.includes("nintendo switch")) return "Switch";
  if (lower === "ios" || lower === "android") return "Mobile";
  return null;
}

const platformIdCache = new Map<string, string>();

async function getOrCreatePlatformId(name: string) {
  const cached = platformIdCache.get(name);
  if (cached) return cached;

  const slug = name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");

  const [existing] = await db
    .select({ id: platforms.id })
    .from(platforms)
    .where(eq(platforms.slug, slug))
    .limit(1);

  const platformId =
    existing?.id ??
    (
      await db
        .insert(platforms)
        .values({ slug, name })
        .onConflictDoUpdate({ target: platforms.slug, set: { name } })
        .returning({ id: platforms.id })
    )[0].id;

  platformIdCache.set(name, platformId);
  return platformId;
}

async function upsertGame(rawgGame: RawgGame) {
  const releaseYear = rawgGame.released ? new Date(rawgGame.released).getFullYear() : null;

  const [row] = await db
    .insert(games)
    .values({
      slug: toSlug(rawgGame.name, rawgGame.id),
      title: rawgGame.name,
      rawgId: rawgGame.id,
      coverUrl: rawgGame.background_image,
      releaseYear,
    })
    .onConflictDoUpdate({
      target: games.rawgId,
      set: {
        title: rawgGame.name,
        coverUrl: rawgGame.background_image,
        releaseYear,
        updatedAt: sql`now()`,
      },
    })
    .returning({ id: games.id, slug: games.slug });

  const platformNames = new Set(
    (rawgGame.platforms ?? [])
      .map((p) => normalizePlatformName(p.platform?.name ?? ""))
      .filter((n): n is string => Boolean(n)),
  );

  for (const name of platformNames) {
    const platformId = await getOrCreatePlatformId(name);
    await db.insert(gamePlatforms).values({ gameId: row.id, platformId }).onConflictDoNothing();
  }
}

async function main() {
  if (!RAWG_API_KEY) throw new Error("RAWG_API_KEY is not set.");

  ({ db } = await import("../lib/db"));
  ({ gamePlatforms, games, platforms } = await import("../lib/db/schema"));

  let synced = 0;
  const totalPages = Math.ceil(TARGET_GAME_COUNT / PAGE_SIZE);

  for (let page = 1; page <= totalPages; page += 1) {
    const results = await fetchGamesPage(page);
    if (results.length === 0) break;

    for (const rawgGame of results) {
      await upsertGame(rawgGame);
      synced += 1;
    }

    console.log(`Synced ${synced} games so far...`);
    await wait(REQUEST_DELAY_MS);
  }

  console.log(`Done. Synced ${synced} games total.`);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
