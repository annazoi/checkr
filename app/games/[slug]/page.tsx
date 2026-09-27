import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { auth } from "@/lib/auth";
import { getGameWithSources, type GameSourceWithSignal } from "@/lib/games/queries";
import { GameHero } from "@/components/game/GameHero";
import { CommunityOverview } from "@/components/game/CommunityOverview";
import { SourceCard } from "@/components/source/SourceCard";
import { SignalLabel } from "@/components/ui/SignalLabel";
import { Disclaimer } from "@/components/ui/Disclaimer";
import { Card } from "@/components/ui/Card";
import { buttonClasses } from "@/components/ui/Button";

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
    <div>
      <GameHero
        title={game.title}
        developer={game.developer}
        releaseYear={game.releaseYear}
        platforms={game.platforms}
        coverUrl={game.coverUrl}
      >
        <SignalLabel label={aggregateSignalLabel(sources)} />
      </GameHero>

      <div className="mx-auto grid max-w-page gap-6 px-6 pb-16 md:grid-cols-[1fr_320px]">
        <div className="space-y-6">
          <CommunityOverview
            sourceCount={sources.length}
            concernSourceCount={concernSourceCount}
            noIssue={avgNoIssue}
            mixed={avgMixed}
            concerns={avgConcerns}
            security={0}
          />

          <div>
            <div className="mb-3 flex items-center justify-between">
              <h2 className="text-lg font-semibold text-text-primary">Sources discussed</h2>
              {session ? (
                <Link
                  href={`/report?game=${game.slug}`}
                  className="text-sm font-medium text-accent-light"
                >
                  + Add a source
                </Link>
              ) : null}
            </div>

            {sources.length === 0 ? (
              <Card className="text-center text-sm text-text-secondary">
                No sources have been discussed for this game yet. Be the first to share your
                experience.
              </Card>
            ) : (
              <div className="space-y-3">
                {sources.map((s) => (
                  <SourceCard
                    key={s.gameSourceId}
                    gameSourceId={s.gameSourceId}
                    domain={s.source.domain}
                    sourceType={s.source.sourceType}
                    signal={s.signal}
                  />
                ))}
              </div>
            )}
          </div>

          <Disclaimer />
        </div>

        <div className="space-y-4">
          <Card>
            <p className="text-xs font-semibold uppercase tracking-wide text-accent-light">
              At a glance
            </p>
            <h2 className="mt-1 text-lg font-semibold text-text-primary">Community overview</h2>
            <p className="mt-1 text-sm text-text-secondary">
              A range of experiences shared by players.
            </p>

            <div className="mt-4 space-y-2">
              {sources.map((s) => (
                <div key={s.gameSourceId} className="flex items-center justify-between text-sm">
                  <span className="truncate text-text-secondary">{s.source.domain}</span>
                  <SignalLabel label={s.signal.signalLabel} />
                </div>
              ))}
            </div>

            {session ? (
              <Link
                href={`/report?game=${game.slug}`}
                className={`${buttonClasses({ variant: "primary" })} mt-5 w-full`}
              >
                Report your experience
              </Link>
            ) : (
              <Link
                href={`/auth/login?callbackUrl=/games/${game.slug}`}
                className={`${buttonClasses({ variant: "primary" })} mt-5 w-full`}
              >
                Log in to report
              </Link>
            )}
          </Card>
        </div>
      </div>
    </div>
  );
}
