import { getGameWithSources } from "@/lib/games/queries";
import { apiError, apiSuccess } from "@/lib/utils/api-response";

export async function GET(_request: Request, { params }: { params: { slug: string } }) {
  const result = await getGameWithSources(params.slug);

  if (!result) {
    return apiError(404, "Game not found.");
  }

  return apiSuccess(result);
}
