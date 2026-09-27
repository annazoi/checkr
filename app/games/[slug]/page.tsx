import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { auth } from "@/lib/auth";
import { getGameWithSources, type GameSourceWithSignal } from "@/lib/games/queries";
import { GameDetail } from "@/components/game/GameDetail";

export const revalidate = 3600;

type PageProps = { params: { slug: string } };

function aggregateSignalLabel(sources: GameSourceWithSignal[]) {
  if (!sources || sources.length === 0) return "no_reports" as const;
  if (sources.some((s) => s.signal.signalLabel === "security_reports")) return "security_reports" as const;
  if (sources.some((s) => s.signal.signalLabel === "concerns_reported")) return "concerns_reported" as const;
  if (sources.some((s) => s.signal.signalLabel === "mixed_reports")) return "mixed_reports" as const;
  if (sources.every((s) => s.signal.signalLabel === "limited_data" || s.signal.signalLabel === "no_reports"))
    return "limited_data" as const;
  return "mostly_clear" as const;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const result = await getGameWithSources(params.slug);
  if (!result) return { title: "Game not found — Checkr" };

  return {
    title: `${result.game.title} — Checkr`,
    description: `Community-reported safety signals for third-party stores and resellers of ${result.game.title}.`,
  };
}

export default async function GamePage({ params }: PageProps) {
  const result = await getGameWithSources(params.slug);
  if (!result) notFound();

  const { game, sources } = result;
  const session = await auth();

  const concernSourceCount = sources.filter((s) =>
    ["concerns_reported", "security_reports", "mixed_reports"].includes(s.signal.signalLabel),
  ).length;

  const totals = sources.reduce(
    (acc, s) => {
      acc.noIssue += s.signal.noIssuePercent;
      acc.concerns += s.signal.concernPercent;
      acc.count += 1;
      return acc;
    },
    { noIssue: 0, concerns: 0, count: 0 },
  );
  const avgNoIssue = totals.count > 0 ? totals.noIssue / totals.count : 0;
  const avgConcerns = totals.count > 0 ? totals.concerns / totals.count : 0;
  const avgMixed = Math.max(0, 100 - avgNoIssue - avgConcerns);

  return (
    <GameDetail
      game={game}
      sources={sources}
      isAuthenticated={Boolean(session)}
      aggregateSignalLabel={aggregateSignalLabel(sources)}
      concernSourceCount={concernSourceCount}
      avgNoIssue={avgNoIssue}
      avgMixed={avgMixed}
      avgConcerns={avgConcerns}
    />
  );
}
