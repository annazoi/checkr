import { getModerationQueue } from "@/lib/admin/queries";
import { apiSuccess } from "@/lib/utils/api-response";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const page = Math.max(1, Number(searchParams.get("page") ?? "1"));

  const result = await getModerationQueue(page);

  return apiSuccess(result);
}
