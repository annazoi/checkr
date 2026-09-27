import { getSourceContext } from "@/lib/sources/queries";
import { calculateSignalProfile } from "@/lib/reputation/calculate";
import { apiError, apiSuccess } from "@/lib/utils/api-response";

export async function GET(_request: Request, { params }: { params: { id: string } }) {
  const context = await getSourceContext(params.id);
  if (!context) return apiError(404, "Source not found.");

  const signal = await calculateSignalProfile(context.gameSourceId);

  return apiSuccess({
    gameSourceId: context.gameSourceId,
    source: { id: context.sourceId, domain: context.domain, sourceType: context.sourceType },
    game: { id: context.gameId, slug: context.gameSlug, title: context.gameTitle },
    signal,
  });
}
