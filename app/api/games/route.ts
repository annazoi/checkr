import { searchGames } from "@/lib/typesense";
import { apiError, apiSuccess } from "@/lib/utils/api-response";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const q = searchParams.get("q") ?? "";
  const platform = searchParams.get("platform") ?? undefined;
  const page = Number(searchParams.get("page") ?? "1");

  try {
    const result = await searchGames({ q, platform, page });
    const hits = (result.hits ?? []).map((hit) => hit.document);
    return apiSuccess({ hits, total: result.found ?? hits.length, page });
  } catch {
    return apiError(502, "Search is temporarily unavailable.");
  }
}
