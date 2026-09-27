import { getSourceReports } from "@/lib/sources/queries";
import { apiSuccess } from "@/lib/utils/api-response";

export async function GET(request: Request, { params }: { params: { id: string } }) {
  const { searchParams } = new URL(request.url);
  const filter = searchParams.get("filter") ?? "all";
  const page = Number(searchParams.get("page") ?? "1");

  const rows = await getSourceReports(params.id, filter, page);

  return apiSuccess({ reports: rows, page });
}
