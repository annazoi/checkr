import Typesense from "typesense";
import type { CollectionCreateSchema } from "typesense/lib/Typesense/Collections";

export const typesenseClient = new Typesense.Client({
  nodes: [
    {
      host: process.env.TYPESENSE_HOST ?? "localhost",
      port: Number(process.env.TYPESENSE_PORT ?? 443),
      protocol: process.env.TYPESENSE_PROTOCOL ?? "https",
    },
  ],
  apiKey: process.env.TYPESENSE_API_KEY ?? "placeholder",
  connectionTimeoutSeconds: 5,
});

export const GAMES_COLLECTION = "games";

export type GameDocument = {
  id: string;
  slug: string;
  title: string;
  developer?: string;
  releaseYear?: number;
  platforms?: string[];
  coverUrl?: string;
  reportCount: number;
  hasReports: boolean;
};

export const gamesCollectionSchema: CollectionCreateSchema = {
  name: GAMES_COLLECTION,
  fields: [
    { name: "id", type: "string" },
    { name: "slug", type: "string" },
    { name: "title", type: "string" },
    { name: "developer", type: "string", optional: true },
    { name: "releaseYear", type: "int32", optional: true },
    { name: "platforms", type: "string[]", optional: true },
    { name: "coverUrl", type: "string", optional: true },
    { name: "reportCount", type: "int32" },
    { name: "hasReports", type: "bool" },
  ],
  default_sorting_field: "reportCount",
};

export async function ensureGamesCollection() {
  try {
    await typesenseClient.collections(GAMES_COLLECTION).retrieve();
  } catch {
    await typesenseClient.collections().create(gamesCollectionSchema);
  }
}

export async function upsertGameDocument(doc: GameDocument) {
  await typesenseClient.collections<GameDocument>(GAMES_COLLECTION).documents().upsert(doc);
}

export async function deleteGameDocument(id: string) {
  await typesenseClient.collections<GameDocument>(GAMES_COLLECTION).documents(id).delete();
}

export type GameSearchParams = {
  q: string;
  platform?: string;
  page?: number;
  perPage?: number;
};

export async function searchGames({ q, platform, page = 1, perPage = 20 }: GameSearchParams) {
  const filterBy = platform && platform !== "All" ? `platforms:=${platform}` : undefined;

  return typesenseClient
    .collections<GameDocument>(GAMES_COLLECTION)
    .documents()
    .search({
      q: q || "*",
      query_by: "title,developer",
      num_typos: 2,
      page,
      per_page: perPage,
      ...(filterBy ? { filter_by: filterBy } : {}),
    });
}
