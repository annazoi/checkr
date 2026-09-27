import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getSourceContext, getSourceReports } from "@/lib/sources/queries";
import { calculateSignalProfile } from "@/lib/reputation/calculate";
import { SourceDetail } from "@/components/source/SourceDetail";

type PageProps = { params: { id: string } };

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
    <SourceDetail
      gameSlug={context.gameSlug}
      domain={context.domain}
      sourceType={context.sourceType}
      signal={signal}
      gameSourceId={context.gameSourceId}
      initialReports={serializedReports}
    />
  );
}
