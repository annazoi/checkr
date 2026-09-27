/**
 * One-off sync: pulls the top games from IGDB into Postgres and Typesense.
 * Run with: npx tsx scripts/sync-games.ts
 */
import "dotenv/config";
import { sql } from "drizzle-orm";
import { db } from "../lib/db";
import { games } from "../lib/db/schema";
import {
  ensureGamesCollection,
  upsertGameDocument,
  type GameDocument,
} from "../lib/typesense";

const TARGET_GAME_COUNT = 10_000;
const PAGE_SIZE = 500;

type IgdbGame = {
  id: number;
  name: string;
  slug: string;
  summary?: string;
  first_release_date?: number;
  involved_companies?: Array<{
    company?: { name?: string };
    developer?: boolean;
    publisher?: boolean;
  }>;
  platforms?: Array<{ name?: string }>;
  cover?: { image_id?: string };
};

async function getIgdbAccessToken(): Promise<string> {
  const clientId = process.env.IGDB_CLIENT_ID;
  const clientSecret = process.env.IGDB_CLIENT_SECRET;
  if (!clientId || !clientSecret) {
    throw new Error("IGDB_CLIENT_ID / IGDB_CLIENT_SECRET are not set.");
  }

  const res = await fetch(
    `https://id.twitch.tv/oauth2/token?client_id=${clientId}&client_secret=${clientSecret}&grant_type=client_credentials`,
    { method: "POST" },
  );
  if (!res.ok) throw new Error(`Failed to authenticate with IGDB: ${res.status}`);

  const body = (await res.json()) as { access_token: string };
  return body.access_token;
}

async function fetchGamesPage(
  accessToken: string,
  offset: number,
): Promise<IgdbGame[]> {
  const query = `
    fields name, slug, summary, first_release_date, cover.image_id,
      platforms.name, involved_companies.company.name,
      involved_companies.developer, involved_companies.publisher;
    where category = 0 & version_parent = null;
    sort total_rating_count desc;
    limit ${PAGE_SIZE};
    offset ${offset};
  `;

  const res = await fetch("https://api.igdb.com/v4/games", {
    method: "POST",
    headers: {
      "Client-ID": process.env.IGDB_CLIENT_ID!,
      Authorization: `Bearer ${accessToken}`,
      "Content-Type": "text/plain",
    },
    body: query,
  });

  if (!res.ok) throw new Error(`IGDB request failed: ${res.status} ${await res.text()}`);
  return res.json();
}

function toSlug(name: string, igdbId: number) {
  const base = name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
  return base ? `${base}-${igdbId}` : `game-${igdbId}`;
}

function coverUrl(imageId?: string) {
  return imageId ? `https://images.igdb.com/igdb/image/upload/t_cover_big/${imageId}.jpg` : null;
}

async function upsertGame(igdbGame: IgdbGame) {
  const developer = igdbGame.involved_companies?.find((c) => c.developer)?.company?.name ?? null;
  const publisher = igdbGame.involved_companies?.find((c) => c.publisher)?.company?.name ?? null;
  const releaseYear = igdbGame.first_release_date
    ? new Date(igdbGame.first_release_date * 1000).getFullYear()
    : null;

  const [row] = await db
    .insert(games)
    .values({
      slug: toSlug(igdbGame.name, igdbGame.id),
      title: igdbGame.name,
      igdbId: igdbGame.id,
      coverUrl: coverUrl(igdbGame.cover?.image_id),
      description: igdbGame.summary ?? null,
      developer,
      publisher,
      releaseYear,
    })
    .onConflictDoUpdate({
      target: games.igdbId,
      set: {
        title: igdbGame.name,
        coverUrl: coverUrl(igdbGame.cover?.image_id),
        description: igdbGame.summary ?? null,
        developer,
        publisher,
        releaseYear,
        updatedAt: sql`now()`,
      },
    })
    .returning({ id: games.id, slug: games.slug });

  const document: GameDocument = {
    id: row.id,
    slug: row.slug,
    title: igdbGame.name,
    developer: developer ?? undefined,
    releaseYear: releaseYear ?? undefined,
    platforms: igdbGame.platforms?.map((p) => p.name).filter((n): n is string => Boolean(n)),
    coverUrl: coverUrl(igdbGame.cover?.image_id) ?? undefined,
    reportCount: 0,
    hasReports: false,
  };

  await upsertGameDocument(document);
}

async function main() {
  console.log("Ensuring Typesense collection exists...");
  await ensureGamesCollection();

  console.log("Authenticating with IGDB...");
  const accessToken = await getIgdbAccessToken();

  let synced = 0;
  for (let offset = 0; offset < TARGET_GAME_COUNT; offset += PAGE_SIZE) {
    const page = await fetchGamesPage(accessToken, offset);
    if (page.length === 0) break;

    for (const igdbGame of page) {
      await upsertGame(igdbGame);
      synced += 1;
    }

    console.log(`Synced ${synced} games so far...`);
  }

  console.log(`Done. Synced ${synced} games total.`);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
