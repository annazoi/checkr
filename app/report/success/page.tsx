import { getSourceContext } from "@/lib/sources/queries";
import { ReportSuccessContent } from "@/components/report/ReportSuccessContent";

export default async function ReportSuccessPage({
  searchParams,
}: {
  searchParams: { source?: string };
}) {
  const context = searchParams.source
    ? await getSourceContext(searchParams.source).catch(() => null)
    : null;

  return <ReportSuccessContent gameSourceId={context?.gameSourceId ?? null} />;
}
