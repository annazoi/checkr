import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeftIcon } from "@heroicons/react/24/outline";
import { getSourceContext, getSourceReports } from "@/lib/sources/queries";
import { calculateSignalProfile } from "@/lib/reputation/calculate";
import { SignalProfile } from "@/components/source/SignalProfile";
import { SourceReportsList } from "@/components/source/SourceReportsList";
import { Disclaimer } from "@/components/ui/Disclaimer";
import { Badge } from "@/components/ui/Badge";

type PageProps = { params: { id: string } };

const SOURCE_TYPE_LABELS: Record<string, string> = {
  official_store: "Official store",
  reseller: "Reseller",
  third_party: "Third-party",
  unknown: "Unknown source",
};

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const context = await getSourceContext(params.id);
  if (!context) return { title: "Source not found — Checkr" };

  return {
    title: `${context.domain} — Checkr`,
    description: `A snapshot of what players have shared about ${context.domain} for ${context.gameTitle}.`,
  };
}

export default async function SourcePage({ params }: PageProps) {
  const context = await getSourceContext(params.id);
  if (!context) notFound();

  const [signal, initialReports] = await Promise.all([
    calculateSignalProfile(context.gameSourceId),
    getSourceReports(context.gameSourceId, "all", 1),
  ]);

  const serializedReports = initialReports.map((report) => ({
    ...report,
    createdAt: report.createdAt ? report.createdAt.toISOString() : new Date().toISOString(),
  }));

  return (
    <div className="mx-auto max-w-page px-6 py-6">
      <Link
        href={`/games/${context.gameSlug}`}
        className="mb-6 flex items-center gap-2 text-sm font-medium text-text-secondary hover:text-text-primary"
      >
        <ArrowLeftIcon className="h-4 w-4" aria-hidden="true" />
        Back to game
      </Link>

      <p className="text-xs font-semibold uppercase tracking-wide text-accent-light">
        Source profile
      </p>
      <div className="mt-1 flex flex-wrap items-center gap-2">
        <h1 className="text-2xl font-bold text-text-primary">{context.domain}</h1>
        <Badge tone="neutral">{SOURCE_TYPE_LABELS[context.sourceType] ?? "Unknown source"}</Badge>
      </div>
      <p className="mt-1 text-sm text-text-secondary">
        A snapshot of what players have shared about this source.
      </p>

      <div className="mt-6">
        <SignalProfile profile={signal} />
      </div>

      <div className="mt-8">
        <p className="mb-3 text-xs font-semibold uppercase tracking-wide text-accent-light">
          From the community
        </p>
        <h2 className="mb-3 text-lg font-semibold text-text-primary">Player experiences</h2>
        <SourceReportsList gameSourceId={context.gameSourceId} initialReports={serializedReports} />
      </div>

      <div className="mt-8">
        <Disclaimer />
      </div>
    </div>
  );
}
